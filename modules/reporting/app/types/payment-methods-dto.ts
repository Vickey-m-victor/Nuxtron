import type { PaymentMethods } from './entities/payment-methods.js'

export interface PaymentMethodsCreatePayload {
  name?: string
  is_deleted?: number
  status?: number
}

export interface PaymentMethodsUpdatePayload extends Partial<PaymentMethodsCreatePayload> {
  id: number
}

export interface PaymentMethodsFilters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface PaymentMethodsListResponse {
  data: PaymentMethods[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
