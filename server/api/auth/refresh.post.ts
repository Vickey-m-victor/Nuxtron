export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const response = await $fetch.raw('/v1/iam/auth/refresh', {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: {
        cookie: event.node.req.headers.cookie || ''
      }
    })

    // Forward Set-Cookie headers for new refresh token
    const setCookieHeaders = response.headers.get('set-cookie')
    if (setCookieHeaders) {
      event.node.res.setHeader('set-cookie', setCookieHeaders)
    }

    return response._data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 401,
      message: error.response?._data?.message || error.message || 'Token refresh failed'
    })
  }
})
