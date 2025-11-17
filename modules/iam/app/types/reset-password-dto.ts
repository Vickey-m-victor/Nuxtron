import type { ResetPassword } from './entities/reset-password.js'

export interface ResetPasswordCreatePayload {
  password?: string
  confirmPassword?: string
}

export interface ResetPasswordUpdatePayload extends Partial<ResetPasswordCreatePayload> {
  id: number
}

export interface ResetPasswordFilters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface ResetPasswordListResponse {
  data: ResetPassword[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
