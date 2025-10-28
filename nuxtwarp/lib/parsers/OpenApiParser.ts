import type { 
  OpenAPIDocument, 
  SchemaObject, 
  EntityDefinition, 
  PropertyDefinition,
  Relationship,
  ValidationRule,
  EntityMetadata
} from '../types/index.js'

export class OpenApiParser {
  private schema: OpenAPIDocument

  constructor(rawSchema: any) {
    this.validateSchema(rawSchema)
    this.schema = rawSchema
  }

  /**
   * Validate OpenAPI schema structure
   */
  private validateSchema(schema: any): void {
    if (!schema || typeof schema !== 'object') {
      throw new Error('Invalid OpenAPI schema: not an object')
    }

    if (!schema.openapi && !schema.swagger) {
      throw new Error('Invalid OpenAPI schema: missing version field')
    }

    if (!schema.components?.schemas) {
      throw new Error('Invalid OpenAPI schema: no schemas defined in components')
    }
  }

  /**
   * Get all entity definitions from schema
   */
  public getEntities(): EntityDefinition[] {
    const entities: EntityDefinition[] = []
    const schemas = this.schema.components?.schemas || {}

    for (const [name, schema] of Object.entries(schemas)) {
      if (this.isEntitySchema(schema)) {
        entities.push(this.parseEntity(name, schema))
      }
    }

    return entities
  }

  /**
   * Get single entity by name
   */
  public getEntity(name: string): EntityDefinition | null {
    const schemas = this.schema.components?.schemas || {}
    const schema = schemas[name]

    if (!schema || !this.isEntitySchema(schema)) {
      return null
    }

    return this.parseEntity(name, schema)
  }

  /**
   * Check if schema represents an entity (not just a utility type)
   */
  private isEntitySchema(schema: SchemaObject): boolean {
    return schema.type === 'object' && !!schema.properties
  }

  /**
   * Parse entity from schema
   */
  private parseEntity(name: string, schema: SchemaObject): EntityDefinition {
    const properties = this.parseProperties(schema)
    const relationships = this.detectRelationships(name, properties)
    const validations = this.extractValidations(schema)
    const metadata = this.extractMetadata(schema)

    return {
      name,
      properties,
      relationships,
      validations,
      metadata
    }
  }

  /**
   * Parse properties from schema
   */
  private parseProperties(schema: SchemaObject): PropertyDefinition[] {
    const properties: PropertyDefinition[] = []
    const schemaProps = schema.properties || {}
    const required = schema.required || []

    for (const [name, prop] of Object.entries(schemaProps)) {
      properties.push({
        name,
        type: this.mapType(prop),
        format: prop.format,
        required: required.includes(name),
        description: prop.description,
        enum: prop.enum,
        example: (prop as any).example
      })
    }

    return properties
  }

  /**
   * Map OpenAPI type to TypeScript type
   */
  private mapType(property: SchemaObject): string {
    if (property.enum) {
      return 'enum'
    }

    if (property.$ref) {
      // Extract entity name from $ref
      const match = property.$ref.match(/#\/components\/schemas\/(.+)/)
      return match ? match[1] : 'unknown'
    }

    if (property.type === 'array' && property.items) {
      const itemType = this.mapType(property.items)
      return `${itemType}[]`
    }

    const typeMap: Record<string, string> = {
      integer: 'number',
      number: 'number',
      string: 'string',
      boolean: 'boolean',
      object: 'Record<string, any>',
      array: 'any[]'
    }

    return typeMap[property.type || 'string'] || 'any'
  }

  /**
   * Detect relationships from property names
   */
  private detectRelationships(entityName: string, properties: PropertyDefinition[]): Relationship[] {
    const relationships: Relationship[] = []

    for (const prop of properties) {
      // Detect belongs-to relationships (e.g., user_id, role_id)
      const belongsToMatch = prop.name.match(/^(.+)_id$/)
      if (belongsToMatch && prop.type === 'number') {
        const relatedEntity = this.pascalCase(belongsToMatch[1])
        relationships.push({
          type: 'belongs-to',
          entity: relatedEntity,
          foreignKey: prop.name
        })
      }

      // Detect has-many relationships (e.g., posts[])
      if (prop.type.endsWith('[]')) {
        const relatedEntity = prop.type.replace('[]', '')
        relationships.push({
          type: 'has-many',
          entity: relatedEntity,
          foreignKey: `${this.snakeCase(entityName)}_id`
        })
      }
    }

    return relationships
  }

  /**
   * Extract validation rules from schema
   */
  private extractValidations(schema: SchemaObject): ValidationRule[] {
    const validations: ValidationRule[] = []
    const properties = schema.properties || {}
    const required = schema.required || []

    for (const [name, prop] of Object.entries(properties)) {
      const rules: string[] = []

      if (required.includes(name)) {
        rules.push('required')
      }

      if (prop.format === 'email') {
        rules.push('email')
      }

      if (prop.format === 'uri' || prop.format === 'url') {
        rules.push('url')
      }

      if ((prop as any).minLength) {
        rules.push(`minLength:${(prop as any).minLength}`)
      }

      if ((prop as any).maxLength) {
        rules.push(`maxLength:${(prop as any).maxLength}`)
      }

      if ((prop as any).minimum) {
        rules.push(`min:${(prop as any).minimum}`)
      }

      if ((prop as any).maximum) {
        rules.push(`max:${(prop as any).maximum}`)
      }

      if (rules.length > 0) {
        validations.push({ field: name, rules })
      }
    }

    return validations
  }

  /**
   * Extract metadata from schema
   */
  private extractMetadata(schema: SchemaObject): EntityMetadata {
    const properties = schema.properties || {}
    
    return {
      timestamps: 'created_at' in properties && 'updated_at' in properties,
      softDelete: 'deleted_at' in properties || 'is_deleted' in properties,
      searchable: Object.values(properties).some(p => p.type === 'string')
    }
  }

  /**
   * Get all API paths for a module
   */
  public getPaths(): Record<string, any> {
    return this.schema.paths || {}
  }

  /**
   * Helper: Convert to PascalCase
   */
  private pascalCase(str: string): string {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  }

  /**
   * Helper: Convert to snake_case
   */
  private snakeCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/^_/, '')
  }
}
