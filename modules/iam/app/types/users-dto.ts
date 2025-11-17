export interface UsersDto {
  username: string
  email?: string
  password?: string
  status?: string
}

export interface UsersCreatePayload extends UsersDto {}

export interface UsersUpdatePayload extends Partial<UsersDto> {}
