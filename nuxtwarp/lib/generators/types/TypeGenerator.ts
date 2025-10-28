import { Generator } from '../../core/Generator.js'
import type { EntityDefinition, PropertyDefinition } from '../../types/index.js'
import { FileSystem } from '../../core/FileSystem.js'

export class TypeGenerator extends Generator {
  private fs!: FileSystem

  async generate(): Promise<void> {
    // Implemented via generateEntityTypes
  }

  async generateEntityTypes(modulePath: string, entity: EntityDefinition): Promise<void> {
    this.fs = new FileSystem(this.logger, this.isDryRun())
    
    // Generate main entity interface
    await this.generateEntityInterface(modulePath, entity)
    
    // Generate enums if needed
    for (const prop of entity.properties) {
      if (prop.enum) {
        await this.generateEnum(modulePath, prop.name, prop.enum)
      }
    }
    
    // Generate DTOs
    await this.generateDTOs(modulePath, entity)
  }

  private async generateEntityInterface(modulePath: string, entity: EntityDefinition): Promise<void> {
    const imports: string[] = []
    
    // Check for enum imports
    const enumProps = entity.properties.filter(p => p.enum)
    enumProps.forEach(prop => {
      const enumName = this.pascalCase(prop.name)
      imports.push(`import { ${enumName} } from '../enums/${this.kebabCase(prop.name)}.js'`)
    })
    
    const properties = entity.properties.map(prop => {
      const optional = prop.required ? '' : '?'
      const type = prop.enum ? this.pascalCase(prop.name) : this.mapType(prop)
      const comment = prop.description ? `  /** ${prop.description} */\n` : ''
      
      return `${comment}  ${prop.name}${optional}: ${type}`
    }).join('\n')
    
    const content = `${imports.length > 0 ? imports.join('\n') + '\n\n' : ''}export interface ${entity.name} {
${properties}
}
`
    
    const filePath = `${modulePath}/app/types/entities/${this.kebabCase(entity.name)}.ts`
    this.fs.write(filePath, content, { force: this.options.force })
  }

  private async generateEnum(modulePath: string, propName: string, values: any[]): Promise<void> {
    const enumName = this.pascalCase(propName)
    
    const enumValues = values.map(val => {
      const key = String(val).toUpperCase().replace(/[^A-Z0-9]/g, '_')
      return `  ${key} = '${val}'`
    }).join(',\n')
    
    const labels = values.map(val => {
      const key = String(val).toUpperCase().replace(/[^A-Z0-9]/g, '_')
      const label = this.titleCase(String(val))
      return `  [${enumName}.${key}]: '${label}'`
    }).join(',\n')
    
    const content = `export enum ${enumName} {
${enumValues}
}

export const ${enumName.toUpperCase()}_LABELS: Record<${enumName}, string> = {
${labels}
}
`
    
    const filePath = `${modulePath}/app/types/enums/${this.kebabCase(propName)}.ts`
    this.fs.write(filePath, content, { force: this.options.force })
  }

  private async generateDTOs(modulePath: string, entity: EntityDefinition): Promise<void> {
    const createProps = entity.properties
      .filter(p => !['id', 'created_at', 'updated_at', 'deleted_at'].includes(p.name))
      .map(p => `  ${p.name}${p.required ? '' : '?'}: ${this.mapType(p)}`)
      .join('\n')
    
    const content = `import type { ${entity.name} } from './entities/${this.kebabCase(entity.name)}.js'

export interface ${entity.name}CreatePayload {
${createProps}
}

export interface ${entity.name}UpdatePayload extends Partial<${entity.name}CreatePayload> {
  id: number
}

export interface ${entity.name}Filters {
  search?: string
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
}

export interface ${entity.name}ListResponse {
  data: ${entity.name}[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
`
    
    const filePath = `${modulePath}/app/types/${this.kebabCase(entity.name)}-dto.ts`
    this.fs.write(filePath, content, { force: this.options.force })
  }

  private mapType(prop: PropertyDefinition): string {
    if (prop.type.endsWith('[]')) {
      return prop.type
    }
    
    return prop.type
  }

  private pascalCase(str: string): string {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  }

  private kebabCase(str: string): string {
    return str
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
  }

  private titleCase(str: string): string {
    return str
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }
}
