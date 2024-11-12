import {
  ConfirmPayload,
  ForgetPasswordPayload,
  ResetPasswordPayload,
  SignInPayload,
  SignUpPayload,
  UpdatePasswordPayload
} from '@/apis/model/auth'
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ResendConfirmationCodeCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ChangePasswordCommand
} from '@aws-sdk/client-cognito-identity-provider'

const AWS_REGION = 'us-east-2'
const COGNITO_CLIENT_ID = '5ag39879hllh9h9ah6653n3f9v'

const client = new CognitoIdentityProviderClient({
  region: AWS_REGION
})

const temp_given_name = 'TEMP_GIVEN_NAME'
const temp_family_name = 'TEMP_FAMILY_NAME'

export async function signIn(payload: SignInPayload) {
  const command = new InitiateAuthCommand({
    ClientId: COGNITO_CLIENT_ID,
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: payload.email,
      PASSWORD: payload.password
    }
  })
  const response = await client.send(command)
  return response
}

export async function signUp(payload: SignUpPayload) {
  const command = new SignUpCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: payload.email,
    Password: payload.password,
    UserAttributes: [
      { Name: 'email', Value: payload.email },
      { Name: 'name', Value: payload.name },
      { Name: 'given_name', Value: temp_given_name },
      { Name: 'family_name', Value: temp_family_name }
    ]
  })
  const response = await client.send(command)
  return response
}

export async function resendSignUpVerificationEmail(email: string) {
  const command = new ResendConfirmationCodeCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: email
  })
  const response = await client.send(command)
  return response
}

export async function confirmSignUp(payload: ConfirmPayload) {
  const command = new ConfirmSignUpCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: payload.email,
    ConfirmationCode: payload.confirmation_code
  })
  const response = await client.send(command)
  return response
}

export async function forgetPassword(payload: ForgetPasswordPayload) {
  const command = new ForgotPasswordCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: payload.email
  })
  const response = await client.send(command)
  return response
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const command = new ConfirmForgotPasswordCommand({
    ClientId: COGNITO_CLIENT_ID,
    Username: payload.email,
    ConfirmationCode: payload.confirmation_code,
    Password: payload.new_password
  })
  const response = await client.send(command)
  return response
}

export async function refreshAccessToken(payload: { refresh_token: string }) {
  const command = new InitiateAuthCommand({
    ClientId: COGNITO_CLIENT_ID,
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    AuthParameters: {
      REFRESH_TOKEN: payload.refresh_token
    }
  })
  const response = await client.send(command)
  return response
}

export async function updatePassword(
  payload: UpdatePasswordPayload & { access_token: string }
) {
  const command = new ChangePasswordCommand({
    AccessToken: payload.access_token,
    PreviousPassword: payload.old_password,
    ProposedPassword: payload.new_password
  })
  const response = await client.send(command)
  return response
}
