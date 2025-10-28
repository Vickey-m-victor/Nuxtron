import type { MailSettings, MailSettingsCreatePayload, MailSettingsUpdatePayload } from '../../types/mail-settings-dto.js'

export const useMailSettings = () => {
  const config = useRuntimeConfig()
  const baseUrl = `${config.public.apiBaseUrl}/v1/admin/mail-settingses`

  const fetchAll = async (params?: Record<string, any>) => {
    return await useFetch<{ dataPayload: { data: MailSettings[] } }>(baseUrl, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    return await useFetch<{ dataPayload: { data: MailSettings } }>(`${baseUrl}/${id}`, {
      method: 'GET'
    })
  }

  const create = async (payload: MailSettingsCreatePayload) => {
    return await $fetch<{ dataPayload: { data: MailSettings } }>(baseUrl, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: MailSettingsUpdatePayload) => {
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
