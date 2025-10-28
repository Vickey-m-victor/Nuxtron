export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  try {
    const response = await $fetch.raw('/v1/iam/auth/login', {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: {
        username: body.username,
        password: body.password
      },
      // Forward cookies from client to backend
      headers: {
        'Content-Type': 'application/json',
        cookie: event.node.req.headers.cookie || ''
      }
    })

    // Forward Set-Cookie headers from backend response to client
    const setCookieHeaders = response.headers.get('set-cookie')
    if (setCookieHeaders) {
      event.node.res.setHeader('set-cookie', setCookieHeaders)
    }

    return response._data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.response?.statusText || 'Server Error',
      message: error.response?._data?.message || error.message || 'Login failed',
      data: error.response?._data
    })
  }
})
