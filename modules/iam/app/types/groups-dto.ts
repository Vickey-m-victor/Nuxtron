import type { Groups } from './entities/groups.js'

export interface GroupsCreatePayload {
  name?: string
  description?: string
  ruleName?: string
}

export interface GroupsUpdatePayload extends Partial<GroupsCreatePayload> {
  id: number
}

export interface GroupsFilters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface GroupsListResponse {
  data: Groups[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
