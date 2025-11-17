import type { Roles, RolesCreatePayload, RolesUpdatePayload } from '../../types/roles-dto.js'

export const useRoles = () => {
  const config = useRuntimeConfig()

  const fetchAll = async (params?: Record<string, any>) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/roles`
    return await useFetch<{ dataPayload: { data: Roles[] } }>(url, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/role/{id}`.replace('{id}', String(id))
    return await useFetch<{ dataPayload: { data: Roles } }>(url, {
      method: 'GET'
    })
  }

  const create = async (payload: RolesCreatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/role`
    return await $fetch<{ dataPayload: { data: Roles } }>(url, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: RolesUpdatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/role`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/role/{id}`.replace('{id}', String(id))
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
