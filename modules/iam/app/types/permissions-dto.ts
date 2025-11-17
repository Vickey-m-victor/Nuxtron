import type { Permissions } from './entities/permissions.js'

export interface PermissionsCreatePayload {
  name?: string
  description?: string
  ruleName?: string
}

export interface PermissionsUpdatePayload extends Partial<PermissionsCreatePayload> {
  id: number
}

export interface PermissionsFilters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PermissionsListResponse {
  data: Permissions[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
