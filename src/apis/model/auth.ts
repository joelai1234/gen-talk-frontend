export interface SignInPayload {
  username: string
  password: string
}

export interface SignUpPayload {
  username: string
  password: string
  email: string
}

export interface ForgetPasswordPayload {
  email: string
}
