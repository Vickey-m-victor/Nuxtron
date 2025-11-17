import type { ResetPasswordRequest } from './entities/reset-password-request.js'

export interface ResetPasswordRequestCreatePayload {
  username?: string
}

export interface ResetPasswordRequestUpdatePayload extends Partial<ResetPasswordRequestCreatePayload> {
  id: number
}

export interface ResetPasswordRequestFilters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface ResetPasswordRequestListResponse {
  data: ResetPasswordRequest[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
