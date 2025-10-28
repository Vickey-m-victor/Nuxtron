import type { Logger } from './Logger.js'
import type { Validator } from './Validator.js'
import type { NuxtWarpConfig } from '../types/index.js'

export interface GeneratorOptions {
  dryRun?: boolean
  force?: boolean
  verbose?: boolean
}

export abstract class Generator {
  protected options: GeneratorOptions

  constructor(
    protected config: NuxtWarpConfig,
    protected logger: Logger,
    protected validator: Validator,
    options: GeneratorOptions = {}
  ) {
    this.options = {
      dryRun: false,
      force: false,
      verbose: false,
      ...options
    }
  }

  /**
   * Main generation method to be implemented by child classes
   */
  abstract generate(): Promise<void>

  /**
   * Validate inputs before generation
   */
  protected async validateInput(): Promise<void> {
    this.logger.info('Validating input...')
    // To be overridden by child classes
  }

  /**
   * Hook executed before generation
   */
  protected async beforeGenerate(): Promise<void> {
    this.logger.info('Preparing generation...')
    await this.validateInput()
  }

  /**
   * Hook executed after generation
   */
  protected async afterGenerate(): Promise<void> {
    this.logger.success('Generation completed!')
  }

  /**
   * Full generation lifecycle
   */
  async run(): Promise<void> {
    try {
      await this.beforeGenerate()
      await this.generate()
      await this.afterGenerate()
    } catch (error) {
      this.logger.error('Generation failed:')
      if (error instanceof Error) {
        this.logger.error(error.message)
        if (this.options.verbose) {
          console.error(error.stack)
        }
      }
      throw error
    }
  }

  /**
   * Check if running in dry-run mode
   */
  protected isDryRun(): boolean {
    return this.options.dryRun || false
  }

  /**
   * Log dry-run action
   */
  protected logDryRun(action: string): void {
    if (this.isDryRun()) {
      this.logger.info(`[DRY RUN] ${action}`)
    }
  }
}
