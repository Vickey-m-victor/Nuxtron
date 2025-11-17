import type { Invoices } from './entities/invoices.js'

export interface InvoicesCreatePayload {
  date?: string
  supplier_id?: number
  invoice_amount?: number
  payment_method_id?: number
  is_deleted?: number
  status?: number
}

export interface InvoicesUpdatePayload extends Partial<InvoicesCreatePayload> {
  id: number
}

export interface InvoicesFilters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface InvoicesListResponse {
  data: Invoices[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
