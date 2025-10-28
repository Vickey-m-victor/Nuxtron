/**
 * Catch-all API proxy
 * Forwards all /api/** requests to the backend API
 * This avoids CORS issues by making requests from the server side
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const path = event.path.replace(/^\/api/, '') // Remove /api prefix
  const method = event.method
  
  // Build the target URL
  const targetUrl = `${config.public.apiBase}${path}`
  
  // Get query parameters
  const query = getQuery(event)
  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl
  
  // Get headers from the incoming request
  const headers = getHeaders(event)
  
  // Forward important headers (excluding host-related headers)
  const forwardHeaders: Record<string, string> = {}
  const headersToForward = ['authorization', 'content-type', 'accept', 'cookie']
  
  headersToForward.forEach(header => {
    if (headers[header]) {
      forwardHeaders[header] = headers[header]
    }
  })
  
  try {
    let body = undefined
    
    // Get body for POST, PUT, PATCH requests
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      body = await readBody(event)
    }
    
    // Make the request to the backend
    const response = await $fetch(fullUrl, {
      method: method as any,
      headers: forwardHeaders,
      body,
      // Don't throw on error status codes, let the client handle them
      ignoreResponseError: true,
    })
    
    return response
  } catch (error: any) {
    console.error('Proxy error:', error)
    
    // Return the error in a format the client can handle
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Proxy request failed',
      data: error.data
    })
  }
})
