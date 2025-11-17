import { Generator } from '../../core/Generator.js'
import type { Logger } from '../../core/Logger.js'
import type { Validator } from '../../core/Validator.js'
import type { NuxtWarpConfig, EntityDefinition } from '../../types/index.js'
import { FileSystem } from '../../core/FileSystem.js'
import { fetchOpenApiSchema } from '../../parsers/api-client.js'
import { OpenApiParser } from '../../parsers/OpenApiParser.js'
import { SchemaAnalyzer } from '../../parsers/SchemaAnalyzer.js'
import { EndpointExtractor } from '../../parsers/EndpointExtractor.js'
import { TypeGenerator } from '../types/TypeGenerator.js'
import { PageGenerator } from '../pages/PageGenerator.js'
import { ComposableGenerator } from '../composables/ComposableGenerator.js'

export class ModuleGenerator extends Generator {
  private fs: FileSystem
  private rawSchema: any  // Store raw schema for later use

  constructor(
    config: NuxtWarpConfig,
    logger: Logger,
    validator: Validator,
    options: any = {}
  ) {
    super(config, logger, validator, options)
    this.fs = new FileSystem(logger, this.options.dryRun)
  }

  async generate(): Promise<void> {
    // This is called from generateModule
  }

  async generateModule(moduleName: string): Promise<void> {
    this.logger.step(1, 5, `Fetching OpenAPI schema for module: ${moduleName}`)
    
    // Fetch schema from API
    const rawSchema = await fetchOpenApiSchema(moduleName, this.config.API_BASE_URL)
    
    // Store raw schema for later use
    this.rawSchema = rawSchema
    
    // Parse schema
    this.logger.step(2, 5, 'Parsing OpenAPI schema')
    const parser = new OpenApiParser(rawSchema)
    const entities = parser.getEntities()
    
    if (entities.length === 0) {
      throw new Error(`No entities found in module "${moduleName}"`)
    }
    
    this.logger.info(`Found ${entities.length} entities: ${entities.map(e => e.name).join(', ')}`)
    
    // Extract API endpoints from OpenAPI paths
    this.logger.info('Extracting API endpoints from OpenAPI paths')
    const endpointExtractor = new EndpointExtractor(rawSchema, moduleName)
    const allEndpoints = endpointExtractor.extractEndpoints()
    
    // Attach endpoints and route paths to entities
    for (const entity of entities) {
      entity.endpoints = allEndpoints[entity.name] || endpointExtractor.getEntityEndpoints(entity.name)
      entity.routePath = endpointExtractor.getRoutePath(entity.name) || undefined
      
      if (entity.endpoints && Object.keys(entity.endpoints).length > 0) {
        this.logger.info(`  ${entity.name}:`)
        this.logger.info(`    Endpoints: ${JSON.stringify(entity.endpoints)}`)
        this.logger.info(`    Route Path: ${entity.routePath || 'not found, will use convention-based'}`)
      } else {
        this.logger.warn(`  ${entity.name}: No endpoints found, will use convention-based URLs`)
      }
    }
    
    // Analyze schema
    const analyzer = new SchemaAnalyzer()
    const sortedEntities = analyzer.sortByDependencies(entities)
    
    // Create module structure
    this.logger.step(3, 5, 'Creating module structure')
    const modulePath = `${this.config.MODULES_PATH}/${moduleName}`
    
    this.createModuleStructure(modulePath, moduleName)
    
    // Generate for each entity
    this.logger.step(4, 5, 'Generating code for entities')
    
    for (const entity of sortedEntities) {
      await this.generateEntity(modulePath, moduleName, entity)
    }
    
    // Generate module config
    this.logger.step(5, 5, 'Generating module configuration')
    this.generateModuleConfig(modulePath, moduleName, entities)
    
    this.logger.success(`Module "${moduleName}" generated successfully!`)
  }

  private createModuleStructure(modulePath: string, moduleName: string): void {
    const dirs = [
      `${modulePath}/app`,
      `${modulePath}/app/pages`,
      `${modulePath}/app/components`,
      `${modulePath}/app/composables`,
      `${modulePath}/app/composables/api`,
      `${modulePath}/app/composables/stores`,
      `${modulePath}/app/types`,
      `${modulePath}/app/types/entities`,
      `${modulePath}/app/types/enums`,
    ]
    
    dirs.forEach(dir => this.fs.mkdir(dir))
    
    // Create module.ts
    const moduleContent = `// ${moduleName} Module Configuration for Nuxt
export default defineNuxtModule({
  meta: {
    name: '${moduleName}',
    configKey: '${moduleName}'
  },
  setup(options, nuxt) {
    console.log('${moduleName} module loaded')
  }
})
`
    this.fs.write(`${modulePath}/module.ts`, moduleContent, { force: this.options.force })
  }

  private async generateEntity(
    modulePath: string,
    moduleName: string,
    entity: EntityDefinition
  ): Promise<void> {
    this.logger.info(`Generating ${entity.name}...`)
    
    // Generate types
    const typeGen = new TypeGenerator(this.config, this.logger, this.validator, {
      dryRun: this.options.dryRun,
      force: this.options.force
    })
    await typeGen.generateEntityTypes(modulePath, entity)
    
    // Generate pages
    const pageGen = new PageGenerator(this.config, this.logger, this.validator, {
      dryRun: this.options.dryRun,
      force: this.options.force
    })
    await pageGen.generatePages(modulePath, moduleName, entity)
    
    // Generate composables
    const composableGen = new ComposableGenerator(this.config, this.logger, this.validator, {
      dryRun: this.options.dryRun,
      force: this.options.force
    })
    await composableGen.generateComposables(modulePath, moduleName, entity)
  }

  private generateModuleConfig(
    modulePath: string,
    moduleName: string,
    entities: EntityDefinition[]
  ): void {
    // Create endpoint extractor to detect actions
    const endpointExtractor = new EndpointExtractor(
      this.rawSchema as any, // Use the raw schema stored during generation
      moduleName
    )
    
    const config = {
      meta: {
        name: moduleName,
        version: '1.0.0',
        description: `Auto-generated ${moduleName} module`
      },
      features: {
        authentication: false,
        authorization: false,
        audit: false,
        export: true
      },
      ui: {
        useModal: true,  // Set to false to use page navigation instead of modals
        modalSize: 'lg'  // Options: 'sm', 'lg', 'xl'
      },
      entities: entities.reduce((acc, entity) => {
        // Detect available actions from OpenAPI schema
        const availableActions = endpointExtractor.detectAvailableActions(entity.name)
        const bulkActions = endpointExtractor.detectBulkActions(entity.name)
        const customActions = endpointExtractor.getCustomActions(entity.name)
        
        acc[entity.name.toLowerCase()] = {
          pagination: {
            default: 20,
            options: [10, 20, 50, 100]
          },
          filters: entity.properties
            .filter(p => p.type === 'string' || p.type === 'enum')
            .map(p => p.name),
          sort: {
            default: 'created_at',
            allowed: ['id', 'created_at', 'updated_at']
          },
          actions: availableActions,  // ✅ Auto-detected from OpenAPI
          bulkActions: bulkActions,    // ✅ Auto-detected from OpenAPI
          customActions: customActions.length > 0 ? customActions : undefined  // ✅ Custom actions if any
        }
        return acc
      }, {} as Record<string, any>)
    }
    
    const content = `export default ${JSON.stringify(config, null, 2)}\n`
    this.fs.write(`${modulePath}/module.config.ts`, content, { force: this.options.force })
  }
}
