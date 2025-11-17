import type { Suppliers, SuppliersCreatePayload, SuppliersUpdatePayload } from '../../types/suppliers-dto.js'

export const useSuppliers = () => {
  const config = useRuntimeConfig()

  const fetchAll = async (params?: Record<string, any>) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/suppliers`
    return await useFetch<{ dataPayload: { data: Suppliers[] } }>(url, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/supplier/{id}`.replace('{id}', String(id))
    return await useFetch<{ dataPayload: { data: Suppliers } }>(url, {
      method: 'GET'
    })
  }

  const create = async (payload: SuppliersCreatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/supplier`
    return await $fetch<{ dataPayload: { data: Suppliers } }>(url, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: SuppliersUpdatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/supplier/{id}`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/supplier/{id}`.replace('{id}', String(id))
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
