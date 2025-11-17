import type { Login } from './entities/login.js'

export interface LoginCreatePayload {
  username?: string
  password?: string
}

export interface LoginUpdatePayload extends Partial<LoginCreatePayload> {
  id: number
}

export interface LoginFilters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface LoginListResponse {
  data: Login[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
