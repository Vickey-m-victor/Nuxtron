import type { Roles } from './entities/roles.js'

export interface RolesCreatePayload {
  name?: string
  description?: string
  ruleName?: string
}

export interface RolesUpdatePayload extends Partial<RolesCreatePayload> {
  id: number
}

export interface RolesFilters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface RolesListResponse {
  data: Roles[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
