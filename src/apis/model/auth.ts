export interface SignInPayload {
  email: string
  password: string
}

export interface SignUpPayload {
  name: string
  password: string
  email: string
}

export interface ConfirmPayload {
  email: string
  confirmation_code: string
}

export interface ForgetPasswordPayload {
  email: string
}

export interface SignInResponse {
  access_token: string
  id_token: string
  refresh_token: string
}

export interface RefreshAccessTokenPayload {
  refresh_token: string
}
