import type { ResetPasswordRequest, ResetPasswordRequestCreatePayload, ResetPasswordRequestUpdatePayload } from '../../types/reset-password-request-dto.js'

export const useResetPasswordRequest = () => {
  const config = useRuntimeConfig()

  const fetchAll = async (params?: Record<string, any>) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/reset-password-requests`
    return await useFetch<{ dataPayload: { data: ResetPasswordRequest[] } }>(url, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/reset-password-requests/{id}`.replace('{id}', String(id))
    return await useFetch<{ dataPayload: { data: ResetPasswordRequest } }>(url, {
      method: 'GET'
    })
  }

  const create = async (payload: ResetPasswordRequestCreatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/reset-password-requests`
    return await $fetch<{ dataPayload: { data: ResetPasswordRequest } }>(url, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: ResetPasswordRequestUpdatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/reset-password-requests/{id}`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/reset-password-requests/{id}`.replace('{id}', String(id))
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
