import type { MailSettings, MailSettingsCreatePayload, MailSettingsUpdatePayload } from '../../types/mail-settings-dto.js'

export const useMailSettings = () => {
  const config = useRuntimeConfig()

  const fetchAll = async (params?: Record<string, any>) => {
    const url = `${config.public.apiBaseUrl}/v1/admin/mail-settingses`
    return await useFetch<{ dataPayload: { data: MailSettings[] } }>(url, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/admin/mail-settingses/{id}`.replace('{id}', String(id))
    return await useFetch<{ dataPayload: { data: MailSettings } }>(url, {
      method: 'GET'
    })
  }

  const create = async (payload: MailSettingsCreatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/admin/mail-settingses`
    return await $fetch<{ dataPayload: { data: MailSettings } }>(url, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: MailSettingsUpdatePayload) => {
    const url = `${config.public.apiBaseUrl}/v1/admin/mail-settingses/{id}`.replace('{id}', String(id))
    return await $fetch(url, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    const url = `${config.public.apiBaseUrl}/v1/admin/mail-settingses/{id}`.replace('{id}', String(id))
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
