import type { ResetPassword, ResetPasswordCreatePayload, ResetPasswordUpdatePayload } from '../../types/reset-password-dto.js'

export const useResetPassword = () => {
  const config = useRuntimeConfig()

  const fetchAll = async (params?: Record<string, any>) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/reset-passwords`
    return await useFetch<{ dataPayload: { data: ResetPassword[] } }>(url, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/reset-passwords/{id}`.replace('{id}', String(id))
    return await useFetch<{ dataPayload: { data: ResetPassword } }>(url, {
      method: 'GET'
    })
  }

  const create = async (payload: ResetPasswordCreatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/reset-passwords`
    return await $fetch<{ dataPayload: { data: ResetPassword } }>(url, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: ResetPasswordUpdatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/reset-passwords/{id}`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/reset-passwords/{id}`.replace('{id}', String(id))
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
