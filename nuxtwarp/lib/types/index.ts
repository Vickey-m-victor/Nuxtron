// Core types
export interface NuxtWarpConfig {
  API_BASE_URL: string
  CLI_NAME: string
  VERSION: string
  ENABLE_INQUIRY: boolean
  MODULES_PATH: string
  GENERATE_TYPESCRIPT: boolean
  GENERATE_STORES: boolean
  GENERATE_COMPOSABLES: boolean
}

// OpenAPI types
export interface OpenAPIDocument {
  openapi: string
  info: {
    title: string
    version: string
  }
  paths: Record<string, PathItem>
  components?: {
    schemas?: Record<string, SchemaObject>
  }
}

export interface PathItem {
  get?: Operation
  post?: Operation
  put?: Operation
  delete?: Operation
  patch?: Operation
}

export interface Operation {
  tags?: string[]
  summary?: string
  description?: string
  operationId?: string
  parameters?: Parameter[]
  requestBody?: RequestBody
  responses: Record<string, Response>
}

export interface Parameter {
  name: string
  in: 'query' | 'header' | 'path' | 'cookie'
  required?: boolean
  schema: SchemaObject
}

export interface RequestBody {
  required?: boolean
  content: Record<string, MediaType>
}

export interface MediaType {
  schema: SchemaObject
}

export interface Response {
  description: string
  content?: Record<string, MediaType>
}

export interface SchemaObject {
  type?: string
  format?: string
  properties?: Record<string, SchemaObject>
  required?: string[]
  items?: SchemaObject
  enum?: any[]
  description?: string
  title?: string
  $ref?: string
}

// Entity definitions
export interface EntityDefinition {
  name: string
  properties: PropertyDefinition[]
  relationships: Relationship[]
  validations: ValidationRule[]
  metadata: EntityMetadata
  endpoints?: EntityEndpoints
  routePath?: string // The actual resource path from OpenAPI (e.g., 'rbac/roles')
}

export interface EntityEndpoints {
  list?: string
  view?: string
  create?: string
  update?: string
  delete?: string
}

export interface PropertyDefinition {
  name: string
  type: string
  format?: string
  required: boolean
  description?: string
  enum?: any[]
  example?: any
}

export interface Relationship {
  type: 'belongs-to' | 'has-many' | 'has-one' | 'many-to-many'
  entity: string
  foreignKey?: string
  relatedKey?: string
}

export interface ValidationRule {
  field: string
  rules: string[]
  message?: string
}

export interface EntityMetadata {
  tableName?: string
  timestamps?: boolean
  softDelete?: boolean
  searchable?: boolean
}

// Module configuration
export interface ModuleConfig {
  meta: {
    name: string
    version: string
    description?: string
  }
  features: {
    authentication?: boolean
    authorization?: boolean
    audit?: boolean
    export?: boolean
  }
  entities: Record<string, EntityConfig>
  ui?: {
    theme?: string
    tableVariant?: 'simple' | 'advanced' | 'cards'
    dateFormat?: string
  }
}

export interface EntityConfig {
  pagination?: {
    default: number
    options: number[]
  }
  filters?: string[]
  sort?: {
    default: string
    allowed: string[]
  }
  actions?: string[]
  bulkActions?: string[]
}

// Generation context
export interface GenerationContext {
  moduleName: string
  entities: EntityDefinition[]
  config: NuxtWarpConfig
  moduleConfig: ModuleConfig
  timestamp: Date
}
