import type { Profile } from './entities/profile.js'

export interface ProfileCreatePayload {
  first_name?: string
  middle_name?: string
  last_name?: string
  email_address?: string
  phone_number?: string
  profile_picture?: string
  status?: Record<string, any>
}

export interface ProfileUpdatePayload extends Partial<ProfileCreatePayload> {
  id: number
}

export interface ProfileFilters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface ProfileListResponse {
  data: Profile[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
