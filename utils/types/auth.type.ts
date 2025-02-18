export type ErrorResponse = object | string | null

export interface LoginResponse {
    accessToken: string
    user: any
}
