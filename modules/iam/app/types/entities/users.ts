export interface Users {
  user_id: number
  username: string
  email?: string
  status: string | { label: string; theme: string }
  auth_key?: string
  password_hash?: string
  password_reset_token?: string
  verification_token?: string
  created_at?: string
  updated_at?: string
  profile?: any
}

export interface UsersCreatePayload {
  username: string
  email?: string
  password?: string
  status?: string
}
