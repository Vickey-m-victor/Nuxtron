import type { MailSettings } from './entities/mail-settings.js'

export interface MailSettingsCreatePayload {
  smtp_server?: string
  smtp_port?: number
  smtp_username?: string
  smtp_password?: string
  email_encryption?: string
}

export interface MailSettingsUpdatePayload extends Partial<MailSettingsCreatePayload> {
  id: number
}

export interface MailSettingsFilters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface MailSettingsListResponse {
  data: MailSettings[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
