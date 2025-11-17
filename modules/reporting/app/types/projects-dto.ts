import type { Projects } from './entities/projects.js'

export interface ProjectsCreatePayload {
  name?: string
  is_deleted?: any
  status?: number
}

export interface ProjectsUpdatePayload extends Partial<ProjectsCreatePayload> {
  id: number
}

export interface ProjectsFilters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface ProjectsListResponse {
  data: Projects[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
