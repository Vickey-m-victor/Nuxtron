import type { Login, LoginCreatePayload, LoginUpdatePayload } from '../../types/login-dto.js'

export const useLogin = () => {
  const config = useRuntimeConfig()

  const fetchAll = async (params?: Record<string, any>) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/logins`
    return await useFetch<{ dataPayload: { data: Login[] } }>(url, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/logins/{id}`.replace('{id}', String(id))
    return await useFetch<{ dataPayload: { data: Login } }>(url, {
      method: 'GET'
    })
  }

  const create = async (payload: LoginCreatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/auth/login`
    return await $fetch<{ dataPayload: { data: Login } }>(url, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: LoginUpdatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/logins/{id}`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/logins/{id}`.replace('{id}', String(id))
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
