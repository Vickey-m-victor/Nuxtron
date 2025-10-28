import type { Profile, ProfileCreatePayload, ProfileUpdatePayload } from '../../types/profile-dto.js'

export const useProfile = () => {
  const config = useRuntimeConfig()
  const baseUrl = `${config.public.apiBaseUrl}/v1/admin/profiles`

  const fetchAll = async (params?: Record<string, any>) => {
    return await useFetch<{ dataPayload: { data: Profile[] } }>(baseUrl, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    return await useFetch<{ dataPayload: { data: Profile } }>(`${baseUrl}/${id}`, {
      method: 'GET'
    })
  }

  const create = async (payload: ProfileCreatePayload) => {
    return await $fetch<{ dataPayload: { data: Profile } }>(baseUrl, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: ProfileUpdatePayload) => {
    return await $fetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    return await $fetch(`${baseUrl}/${id}`, {
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
