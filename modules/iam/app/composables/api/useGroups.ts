import type { Groups, GroupsCreatePayload, GroupsUpdatePayload } from '../../types/groups-dto.js'

export const useGroups = () => {
  const config = useRuntimeConfig()

  const fetchAll = async (params?: Record<string, any>) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/groups`
    return await useFetch<{ dataPayload: { data: Groups[] } }>(url, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/group/{id}`.replace('{id}', String(id))
    return await useFetch<{ dataPayload: { data: Groups } }>(url, {
      method: 'GET'
    })
  }

  const create = async (payload: GroupsCreatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/group`
    return await $fetch<{ dataPayload: { data: Groups } }>(url, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: GroupsUpdatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/group`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/group/{id}`.replace('{id}', String(id))
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
