export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Get authorization header from client request
  const authHeader = event.node.req.headers.authorization

  if (!authHeader) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  try {
    const response = await $fetch('/v1/iam/auth/change-password', {
      method: 'POST',
      baseURL: config.public.apiBase,
      body,
      headers: {
        authorization: authHeader,
        cookie: event.node.req.headers.cookie || ''
      }
    })

    return response
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.response?._data?.message || error.message || 'Password change failed'
    })
  }
})
