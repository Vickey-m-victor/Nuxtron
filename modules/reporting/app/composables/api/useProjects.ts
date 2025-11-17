import type { Projects, ProjectsCreatePayload, ProjectsUpdatePayload } from '../../types/projects-dto.js'

export const useProjects = () => {
  const config = useRuntimeConfig()

  const fetchAll = async (params?: Record<string, any>) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/projects`
    return await useFetch<{ dataPayload: { data: Projects[] } }>(url, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/projects/{id}`.replace('{id}', String(id))
    return await useFetch<{ dataPayload: { data: Projects } }>(url, {
      method: 'GET'
    })
  }

  const create = async (payload: ProjectsCreatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/projects`
    return await $fetch<{ dataPayload: { data: Projects } }>(url, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: ProjectsUpdatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/projects/{id}`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/reporting/projects/{id}`.replace('{id}', String(id))
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
