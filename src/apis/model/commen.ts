export interface ErrorResponse {
  response: { data: Data }
}

export interface Data {
  detail: { msg: string }[] | string
}
