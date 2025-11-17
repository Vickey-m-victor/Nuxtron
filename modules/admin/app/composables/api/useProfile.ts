import type { Profile, ProfileCreatePayload, ProfileUpdatePayload } from '../../types/profile-dto.js'

export const useProfile = () => {
  const config = useRuntimeConfig()

  const fetchAll = async (params?: Record<string, any>) => {
    const url = `${config.public.apiBaseUrl}/v1/admin/profiles`
    return await useFetch<{ dataPayload: { data: Profile[] } }>(url, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/admin/profile/{id}`.replace('{id}', String(id))
    return await useFetch<{ dataPayload: { data: Profile } }>(url, {
      method: 'GET'
    })
  }

  const create = async (payload: ProfileCreatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/admin/profile`
    return await $fetch<{ dataPayload: { data: Profile } }>(url, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: ProfileUpdatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/admin/profile/{id}`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/admin/profile/{id}`.replace('{id}', String(id))
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
