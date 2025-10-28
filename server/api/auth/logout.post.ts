export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    const response = await $fetch.raw('/v1/iam/auth/logout', {
      method: 'POST',
      baseURL: config.public.apiBase,
      headers: {
        cookie: event.node.req.headers.cookie || ''
      }
    })

    // Forward Set-Cookie headers to clear cookies
    const setCookieHeaders = response.headers.get('set-cookie')
    if (setCookieHeaders) {
      event.node.res.setHeader('set-cookie', setCookieHeaders)
    }

    return response._data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?._data?.message || error.message || 'Logout failed'
    })
  }
})
