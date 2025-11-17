import type { PaymentMethods, PaymentMethodsCreatePayload, PaymentMethodsUpdatePayload } from '../../types/payment-methods-dto.js'

export const usePaymentMethods = () => {
  const config = useRuntimeConfig()

  const fetchAll = async (params?: Record<string, any>) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/payment-methods`
    return await useFetch<{ dataPayload: { data: PaymentMethods[] } }>(url, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/payment-method/{id}`.replace('{id}', String(id))
    return await useFetch<{ dataPayload: { data: PaymentMethods } }>(url, {
      method: 'GET'
    })
  }

  const create = async (payload: PaymentMethodsCreatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/payment-method`
    return await $fetch<{ dataPayload: { data: PaymentMethods } }>(url, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: PaymentMethodsUpdatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/payment-method/{id}`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/payment-method/{id}`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'DELETE'
    })
  }

  return {
    fetchAll,
    fetchOne,
    create,
    update,
    remove
  }
}
