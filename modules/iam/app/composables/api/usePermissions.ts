import type { Permissions, PermissionsCreatePayload, PermissionsUpdatePayload } from '../../types/permissions-dto.js'

export const usePermissions = () => {
  const config = useRuntimeConfig()

  const fetchAll = async (params?: Record<string, any>) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/permissions`
    return await useFetch<{ dataPayload: { data: Permissions[] } }>(url, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/permission/{id}`.replace('{id}', String(id))
    return await useFetch<{ dataPayload: { data: Permissions } }>(url, {
      method: 'GET'
    })
  }

  const create = async (payload: PermissionsCreatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/permissionses`
    return await $fetch<{ dataPayload: { data: Permissions } }>(url, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: PermissionsUpdatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/rbac/permission`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/iam/permissionses/{id}`.replace('{id}', String(id))
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
