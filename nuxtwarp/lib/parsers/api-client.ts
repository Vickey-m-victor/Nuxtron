export async function fetchOpenApiSchema(
  moduleName: string,
  baseUrl: string
): Promise<any> {
  const url = `${baseUrl}/v1/docs/openapi-json-resource.json?mod=${moduleName}`
  
  try {
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(
        `Failed to fetch OpenAPI schema: HTTP ${response.status} ${response.statusText}`
      )
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch OpenAPI schema: ${error.message}`)
    }
    throw error
  }
}

export function validateModuleName(name: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(name)
}

export function validateEntityName(name: string): boolean {
  return /^[A-Z][a-zA-Z0-9]*$|^[a-z][a-z0-9_]*$/.test(name)
}
