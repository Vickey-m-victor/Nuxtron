import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs'
import { resolve, dirname, join } from 'pathe'
import type { Logger } from './Logger.js'

export class FileSystem {
  constructor(private logger: Logger, private dryRun: boolean = false) {}

  /**
   * Read file content
   */
  read(filePath: string): string {
    const absolutePath = resolve(filePath)
    
    if (!existsSync(absolutePath)) {
      throw new Error(`File not found: ${filePath}`)
    }
    
    return readFileSync(absolutePath, 'utf-8')
  }

  /**
   * Write file content
   */
  write(filePath: string, content: string, options: { force?: boolean } = {}): void {
    const absolutePath = resolve(filePath)
    
    // Check if file exists
    if (existsSync(absolutePath) && !options.force) {
      throw new Error(`File already exists: ${filePath}. Use --force to overwrite.`)
    }
    
    if (this.dryRun) {
      this.logger.info(`[DRY RUN] Would write file: ${filePath}`)
      return
    }
    
    // Ensure directory exists
    const dir = dirname(absolutePath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    
    writeFileSync(absolutePath, content, 'utf-8')
    this.logger.success(`Created: ${filePath}`)
  }

  /**
   * Create directory
   */
  mkdir(dirPath: string): void {
    const absolutePath = resolve(dirPath)
    
    if (this.dryRun) {
      this.logger.info(`[DRY RUN] Would create directory: ${dirPath}`)
      return
    }
    
    if (!existsSync(absolutePath)) {
      mkdirSync(absolutePath, { recursive: true })
      this.logger.success(`Created directory: ${dirPath}`)
    }
  }

  /**
   * Check if file or directory exists
   */
  exists(path: string): boolean {
    return existsSync(resolve(path))
  }

  /**
   * List files in directory
   */
  list(dirPath: string, options: { recursive?: boolean } = {}): string[] {
    const absolutePath = resolve(dirPath)
    
    if (!existsSync(absolutePath)) {
      return []
    }
    
    if (!options.recursive) {
      return readdirSync(absolutePath)
    }
    
    // Recursive listing
    const files: string[] = []
    const scan = (dir: string) => {
      const entries = readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = join(dir, entry.name)
        if (entry.isDirectory()) {
          scan(fullPath)
        } else {
          files.push(fullPath)
        }
      }
    }
    
    scan(absolutePath)
    return files
  }

  /**
   * Check if path is directory
   */
  isDirectory(path: string): boolean {
    const absolutePath = resolve(path)
    return existsSync(absolutePath) && statSync(absolutePath).isDirectory()
  }

  /**
   * Get file extension
   */
  extension(filePath: string): string {
    const parts = filePath.split('.')
    return parts.length > 1 ? parts[parts.length - 1] : ''
  }
}
