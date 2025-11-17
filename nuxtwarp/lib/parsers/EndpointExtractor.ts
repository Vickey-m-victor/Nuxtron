import type { OpenAPIDocument, PathItem, Operation } from '../types/index.js'

export interface EntityEndpoints {
  list?: string
  view?: string
  create?: string
  update?: string
  delete?: string
  [key: string]: string | undefined  // Allow custom actions
}

export interface EndpointMap {
  [entityName: string]: EntityEndpoints
}

export interface RoutePathMap {
  [entityName: string]: string
}

export interface CustomAction {
  name: string
  endpoint: string
  method: string
}

export class EndpointExtractor {
  private schema: OpenAPIDocument
  private moduleName: string
  private routePaths: RoutePathMap = {}

  constructor(schema: OpenAPIDocument, moduleName: string) {
    this.schema = schema
    this.moduleName = moduleName
  }

  /**
   * Extract all API endpoints from OpenAPI paths
   * Maps them to entities based on tags or operationId
   */
  public extractEndpoints(): EndpointMap {
    const paths = this.schema.paths || {}
    const schemas = new Set(Object.keys(this.schema.components?.schemas || {}))
    const endpoints: EndpointMap = {}

    // Iterate through all paths
    for (const [path, pathItem] of Object.entries(paths)) {
      // Skip paths that don't belong to this module
      if (!path.includes(`/${this.moduleName}/`)) {
        continue
      }

      // Process each HTTP method
      for (const [method, operation] of Object.entries(pathItem)) {
        if (!this.isOperation(operation)) continue

        // Get entity name from tags, operationId, or path
        const entityName = this.getEntityName(operation, path, schemas)
        if (!entityName) continue

        // Initialize entity endpoints if not exists
        if (!endpoints[entityName]) {
          endpoints[entityName] = {}
        }

        // Store route path (extract once per entity from the first endpoint found)
        if (!this.routePaths[entityName]) {
          this.routePaths[entityName] = this.extractRoutePath(path)
        }

        // Determine CRUD action and store the path
        const action = this.determineAction(method, path)
        if (action) {
          endpoints[entityName][action] = this.normalizePath(path)
        }
      }
    }

    return endpoints
  }

  /**
   * Get route path for a specific entity
   */
  public getRoutePath(entityName: string): string | null {
    return this.routePaths[entityName] || null
  }

  /**
   * Extract route path from OpenAPI path
   * Converts '/iam/rbac/roles' to 'rbac/roles'
   * Converts '/iam/users' to 'users'
   * Removes {id} parameters and trailing segments
   */
  private extractRoutePath(path: string): string {
    // Remove module prefix (e.g., /iam/)
    const modulePrefix = `/${this.moduleName}/`
    let routePath = path

    if (routePath.startsWith(modulePrefix)) {
      routePath = routePath.substring(modulePrefix.length)
    }

    // Remove {id} and everything after it (for detail endpoints)
    routePath = routePath.replace(/\/\{[^}]+\}.*$/, '')

    // Remove trailing slashes
    routePath = routePath.replace(/\/$/, '')

    // Remove /v1 if present
    routePath = routePath.replace(/^v1\//, '')

    return routePath
  }

  /**
   * Get endpoints for a specific entity
   */
  public getEntityEndpoints(entityName: string): EntityEndpoints {
    const allEndpoints = this.extractEndpoints()
    return allEndpoints[entityName] || {}
  }

  /**
   * Check if the object is an Operation
   */
  private isOperation(obj: any): obj is Operation {
    return obj && typeof obj === 'object' && 'responses' in obj
  }

  /**
   * Extract entity name from operation tags, operationId, or path
   */
  private getEntityName(operation: Operation, path: string, schemas: Set<string>): string | null {
    // Try to get from tags first (most reliable)
    if (operation.tags && operation.tags.length > 0) {
      const tag = operation.tags[0]
      
      // Check if tag matches a schema name (case-insensitive)
      for (const schemaName of schemas) {
        if (schemaName.toLowerCase() === tag.toLowerCase()) {
          return schemaName
        }
      }
    }

    // Try to extract from operationId
    if (operation.operationId) {
      const match = operation.operationId.match(/^(list|view|create|update|delete)(.+)$/)
      if (match) {
        const entityName = match[2]
        
        // Check if it matches a schema
        for (const schemaName of schemas) {
          if (schemaName.toLowerCase() === entityName.toLowerCase()) {
            return schemaName
          }
        }
      }
    }

    // Try to extract from path (last segment of the base resource path)
    // Examples:
    // /iam/rbac/roles -> roles -> Roles
    // /iam/rbac/role -> role -> Roles (try pluralizing)
    // /iam/users -> users -> Users
    // /iam/rbac/permissions -> permissions -> Permissions
    const routePath = this.extractRoutePath(path)
    const segments = routePath.split('/').filter(Boolean)
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1]
      
      // Capitalize first letter and check against schemas
      const capitalizedSegment = lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1)
      
      for (const schemaName of schemas) {
        // Match case-insensitively
        if (schemaName.toLowerCase() === capitalizedSegment.toLowerCase()) {
          return schemaName
        }
        
        // Try matching singular form (e.g., "role" -> "Roles")
        // Simple pluralization: add 's' or remove 's' to check both forms
        const pluralForm = capitalizedSegment + 's'
        const singularForm = capitalizedSegment.endsWith('s') 
          ? capitalizedSegment.slice(0, -1) 
          : capitalizedSegment
          
        if (schemaName.toLowerCase() === pluralForm.toLowerCase() ||
            schemaName.toLowerCase() === singularForm.toLowerCase()) {
          return schemaName
        }
      }
      
      // If no exact match, return the capitalized segment
      return capitalizedSegment
    }

    return null
  }

  /**
   * Determine CRUD action from HTTP method and path
   */
  private determineAction(method: string, path: string): keyof EntityEndpoints | null {
    const httpMethod = method.toLowerCase()
    const hasIdParam = path.includes('{id}') || path.includes('{ID}')

    switch (httpMethod) {
      case 'get':
        return hasIdParam ? 'view' : 'list'
      case 'post':
        return 'create'
      case 'put':
      case 'patch':
        return 'update'
      case 'delete':
        return 'delete'
      default:
        return null
    }
  }

  /**
   * Normalize path to remove /v1 prefix and replace {id} with proper format
   */
  private normalizePath(path: string): string {
    // Remove leading /v1 if present (we'll add it back in templates)
    let normalized = path.replace(/^\/v1\//, '/')
    
    // Ensure it starts with /
    if (!normalized.startsWith('/')) {
      normalized = '/' + normalized
    }

    return normalized
  }

  /**
   * Get base URL for an entity (for list/create operations)
   */
  public getBaseUrl(entityName: string): string | null {
    const endpoints = this.getEntityEndpoints(entityName)
    
    // Prefer list endpoint, fallback to create
    if (endpoints.list) {
      return endpoints.list
    }
    
    if (endpoints.create) {
      return endpoints.create
    }

    // If we have view/update/delete, derive base from them
    if (endpoints.view) {
      return endpoints.view.replace(/\/\{id\}.*$/, '')
    }
    
    if (endpoints.update) {
      return endpoints.update.replace(/\/\{id\}.*$/, '')
    }

    if (endpoints.delete) {
      return endpoints.delete.replace(/\/\{id\}.*$/, '')
    }

    return null
  }

  /**
   * Get detail URL pattern for an entity (for view/update/delete operations)
   */
  public getDetailUrl(entityName: string): string | null {
    const endpoints = this.getEntityEndpoints(entityName)
    
    // Prefer view endpoint, fallback to update or delete
    if (endpoints.view) {
      return endpoints.view
    }
    
    if (endpoints.update) {
      return endpoints.update
    }

    if (endpoints.delete) {
      return endpoints.delete
    }

    return null
  }

  /**
   * Detect available CRUD actions for an entity based on API endpoints
   * Returns array of action names: ['view', 'edit', 'delete', 'create']
   */
  public detectAvailableActions(entityName: string): string[] {
    const actions: string[] = []
    const endpoints = this.getEntityEndpoints(entityName)
    
    if (!endpoints || Object.keys(endpoints).length === 0) {
      // Default fallback: only view
      return ['view']
    }
    
    // Check for standard CRUD operations
    // List endpoint means we can view items in the list
    if (endpoints.list) {
      actions.push('view')
    }
    
    // Create endpoint
    if (endpoints.create) {
      actions.push('create')
    }
    
    // Update endpoint (PUT or PATCH)
    if (endpoints.update) {
      actions.push('edit')
    }
    
    // Delete endpoint
    if (endpoints.delete) {
      actions.push('delete')
    }
    
    // Detect custom actions (assign, revoke, approve, etc.)
    const customActions = this.detectCustomActions(entityName)
    actions.push(...customActions)
    
    return actions
  }

  /**
   * Detect custom action endpoints (assign, revoke, approve, etc.)
   */
  private detectCustomActions(entityName: string): string[] {
    const actions: string[] = []
    const paths = this.schema.paths || {}
    const routePath = this.getRoutePath(entityName)
    
    if (!routePath) return actions
    
    // Custom action patterns to look for
    const customPatterns = [
      { pattern: /\/assign\//, action: 'assign' },
      { pattern: /\/revoke\//, action: 'revoke' },
      { pattern: /\/remove\//, action: 'remove' },
      { pattern: /\/approve\//, action: 'approve' },
      { pattern: /\/reject\//, action: 'reject' },
      { pattern: /\/archive\//, action: 'archive' },
      { pattern: /\/restore\//, action: 'restore' },
      { pattern: /\/activate\//, action: 'activate' },
      { pattern: /\/deactivate\//, action: 'deactivate' },
      { pattern: /\/publish\//, action: 'publish' },
      { pattern: /\/unpublish\//, action: 'unpublish' }
    ]
    
    // Check all paths for custom actions
    for (const [path, pathItem] of Object.entries(paths)) {
      // Skip if not for this module
      if (!path.includes(`/${this.moduleName}/`)) continue
      
      // Check if path relates to this entity
      const pathRoutePath = this.extractRoutePath(path)
      if (!pathRoutePath.includes(routePath)) continue
      
      // Check against custom patterns
      for (const { pattern, action } of customPatterns) {
        if (pattern.test(path) && !actions.includes(action)) {
          actions.push(action)
        }
      }
    }
    
    return actions
  }

  /**
   * Get bulk actions (actions that can be performed on multiple items)
   */
  public detectBulkActions(entityName: string): string[] {
    const bulkActions: string[] = []
    const actions = this.detectAvailableActions(entityName)
    
    // Only delete is commonly available as bulk action
    if (actions.includes('delete')) {
      bulkActions.push('delete')
    }
    
    // Custom bulk actions (if endpoints support bulk operations)
    // Check for endpoints with array parameters or batch operations
    const customActions = ['assign', 'revoke', 'archive', 'activate']
    for (const action of customActions) {
      if (actions.includes(action)) {
        // Could be enhanced to check if endpoint accepts array input
        bulkActions.push(action)
      }
    }
    
    return bulkActions
  }

  /**
   * Get custom action endpoints with full details
   */
  public getCustomActions(entityName: string): CustomAction[] {
    const customActions: CustomAction[] = []
    const paths = this.schema.paths || {}
    const routePath = this.getRoutePath(entityName)
    
    if (!routePath) return customActions
    
    for (const [path, pathItem] of Object.entries(paths)) {
      if (!path.includes(`/${this.moduleName}/`)) continue
      
      const pathRoutePath = this.extractRoutePath(path)
      if (!pathRoutePath.includes(routePath)) continue
      
      // Check for custom action patterns
      const customActionMatch = path.match(/\/(assign|revoke|remove|approve|reject|archive|restore|activate|deactivate|publish|unpublish)\//)
      
      if (customActionMatch) {
        const actionName = customActionMatch[1]
        
        // Get the HTTP method for this action
        for (const [method, operation] of Object.entries(pathItem)) {
          if (this.isOperation(operation)) {
            customActions.push({
              name: actionName,
              endpoint: this.normalizePath(path),
              method: method.toUpperCase()
            })
            break // Only add once per path
          }
        }
      }
    }
    
    return customActions
  }
}
