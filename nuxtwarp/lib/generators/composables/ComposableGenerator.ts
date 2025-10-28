import { Generator } from '../../core/Generator.js'
import type { EntityDefinition } from '../../types/index.js'
import { FileSystem } from '../../core/FileSystem.js'
import { apiComposableTemplate, storeComposableTemplate } from '../../templates/composables/index.js'

export class ComposableGenerator extends Generator {
  private fs!: FileSystem

  async generate(): Promise<void> {
    // Implemented via generateComposables
  }

  async generateComposables(modulePath: string, moduleName: string, entity: EntityDefinition): Promise<void> {
    this.fs = new FileSystem(this.logger, this.isDryRun())
    
    // Generate API composable
    await this.generateApiComposable(modulePath, moduleName, entity)
    
    // Generate store composable
    await this.generateStoreComposable(modulePath, moduleName, entity)
  }

  private async generateApiComposable(modulePath: string, moduleName: string, entity: EntityDefinition): Promise<void> {
    const content = apiComposableTemplate(moduleName, entity)
    const fileName = `use${entity.name}.ts`
    this.fs.write(`${modulePath}/app/composables/api/${fileName}`, content, { force: this.options.force })
  }

  private async generateStoreComposable(modulePath: string, moduleName: string, entity: EntityDefinition): Promise<void> {
    const content = storeComposableTemplate(moduleName, entity)
    const fileName = `use${entity.name}Store.ts`
    this.fs.write(`${modulePath}/app/composables/stores/${fileName}`, content, { force: this.options.force })
  }
}
