export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    const response = await $fetch('/v1/iam/auth/reset-password', {
      method: 'POST',
      baseURL: config.public.apiBase,
      body
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?._data?.message || error.message || 'Password reset failed'
    })
  }
})
