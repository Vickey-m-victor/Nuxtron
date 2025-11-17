import type { Invoices, InvoicesCreatePayload, InvoicesUpdatePayload } from '../../types/invoices-dto.js'

export const useInvoices = () => {
  const config = useRuntimeConfig()

  const fetchAll = async (params?: Record<string, any>) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/invoices`
    return await useFetch<{ dataPayload: { data: Invoices[] } }>(url, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/invoice/{id}`.replace('{id}', String(id))
    return await useFetch<{ dataPayload: { data: Invoices } }>(url, {
      method: 'GET'
    })
  }

  const create = async (payload: InvoicesCreatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/invoice`
    return await $fetch<{ dataPayload: { data: Invoices } }>(url, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: InvoicesUpdatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/invoice/{id}`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/invoice/{id}`.replace('{id}', String(id))
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
