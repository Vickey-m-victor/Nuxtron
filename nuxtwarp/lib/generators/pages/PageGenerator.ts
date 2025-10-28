import { Generator } from '../../core/Generator.js'
import type { EntityDefinition } from '../../types/index.js'
import { FileSystem } from '../../core/FileSystem.js'
import { indexPageTemplate, createPageTemplate, viewPageTemplate, editPageTemplate } from '../../templates/pages/index.js'

export class PageGenerator extends Generator {
  private fs!: FileSystem

  async generate(): Promise<void> {
    // Implemented via generatePages
  }

  async generatePages(modulePath: string, moduleName: string, entity: EntityDefinition): Promise<void> {
    this.fs = new FileSystem(this.logger, this.isDryRun())
    
    const entityPath = `${modulePath}/app/pages/${this.pluralize(this.kebabCase(entity.name))}`
    this.fs.mkdir(entityPath)
    
    // Generate index page (list)
    await this.generateIndexPage(entityPath, moduleName, entity)
    
    // Generate create page
    await this.generateCreatePage(entityPath, moduleName, entity)
    
    // Generate view page [id].vue
    await this.generateViewPage(entityPath, moduleName, entity)
    
    // Generate edit page [id]/edit.vue
    await this.generateEditPage(entityPath, moduleName, entity)
  }

  private async generateIndexPage(entityPath: string, moduleName: string, entity: EntityDefinition): Promise<void> {
    const content = indexPageTemplate(moduleName, entity)
    this.fs.write(`${entityPath}/index.vue`, content, { force: this.options.force })
  }

  private async generateCreatePage(entityPath: string, moduleName: string, entity: EntityDefinition): Promise<void> {
    const content = createPageTemplate(moduleName, entity)
    this.fs.write(`${entityPath}/create.vue`, content, { force: this.options.force })
  }

  private async generateViewPage(entityPath: string, moduleName: string, entity: EntityDefinition): Promise<void> {
    const content = viewPageTemplate(moduleName, entity)
    this.fs.write(`${entityPath}/[id].vue`, content, { force: this.options.force })
  }

  private async generateEditPage(entityPath: string, moduleName: string, entity: EntityDefinition): Promise<void> {
    this.fs.mkdir(`${entityPath}/[id]`)
    const content = editPageTemplate(moduleName, entity)
    this.fs.write(`${entityPath}/[id]/edit.vue`, content, { force: this.options.force })
  }

  private kebabCase(str: string): string {
    return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
  }

  private pluralize(str: string): string {
    // Words that are already plural or don't need pluralization
    const alreadyPlural = ['settings', 'data', 'information', 'equipment', 'news', 'series', 'species']
    const lowerStr = str.toLowerCase()
    
    // Check if the word (or the last part after camelCase) is already plural
    if (alreadyPlural.some(plural => lowerStr.endsWith(plural))) {
      return str
    }
    
    // Handle words ending in 'y' (but not 'ay', 'ey', 'oy', 'uy')
    if (str.endsWith('y') && !['ay', 'ey', 'oy', 'uy'].some(end => str.endsWith(end))) {
      return str.slice(0, -1) + 'ies'
    }
    
    // Handle words ending in 's', 'ss', 'sh', 'ch', 'x', 'z'
    if (str.endsWith('ss') || str.endsWith('sh') || str.endsWith('ch') || str.endsWith('x') || str.endsWith('z')) {
      return str + 'es'
    }
    
    // Default: just add 's'
    return str + 's'
  }
}
