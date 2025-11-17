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
    // Wrap the body in ChangePassword object as expected by Yii API
    const requestBody = {
      ChangePassword: {
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
        confirmNewPassword: body.confirmNewPassword
      }
    }

    const response = await $fetch('/v1/iam/auth/change-password', {
      method: 'PUT',
      baseURL: config.public.apiBase,
      body: requestBody,
      headers: {
        authorization: authHeader,
        cookie: event.node.req.headers.cookie || ''
      }
    })

    return response
  } catch (error: any) {
    console.error('Change password API error:', error)
    
    // Extract error details from the backend response
    const statusCode = error.response?.status || error.statusCode || 500
    const errorData = error.response?._data || error.data || {}
    
    throw createError({
      statusCode,
      statusMessage: error.response?.statusText || 'Server Error',
      data: errorData,
      message: errorData.message || error.message || 'Password change failed'
    })
  }
})
