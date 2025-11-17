import type { Suppliers } from './entities/suppliers.js'

export interface SuppliersCreatePayload {
  name?: string
  is_deleted?: number
  status?: number
}

export interface SuppliersUpdatePayload extends Partial<SuppliersCreatePayload> {
  id: number
}

export interface SuppliersFilters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface SuppliersListResponse {
  data: Suppliers[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
