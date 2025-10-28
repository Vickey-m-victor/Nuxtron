import { readFileSync, existsSync } from 'fs'
import { resolve } from 'pathe'
import type { NuxtWarpConfig } from '../types/index.js'

export function loadConfig(): NuxtWarpConfig {
  const configPath = resolve(process.cwd(), 'omninuxt.cfg')
  
  if (!existsSync(configPath)) {
    throw new Error('Configuration file omninuxt.cfg not found')
  }
  
  const configFile = readFileSync(configPath, 'utf-8')
  const config: Record<string, string> = {}
  
  // Parse .env style config
  const lines = configFile.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }
    
    const match = trimmed.match(/^([^=]+)=(.*)$/)
    if (match) {
      const [, key, value] = match
      config[key.trim()] = value.trim().replace(/^["']|["']$/g, '')
    }
  }
  
  return {
    API_BASE_URL: config.API_BASE_URL || 'http://localhost:8080',
    CLI_NAME: config.CLI_NAME || 'NuxtWarp CLI',
    VERSION: config.VERSION || '1.0.0',
    ENABLE_INQUIRY: config.ENABLE_INQUIRY?.toLowerCase() === 'true',
    MODULES_PATH: resolve(process.cwd(), 'modules'),
    GENERATE_TYPESCRIPT: true,
    GENERATE_STORES: true,
    GENERATE_COMPOSABLES: true
  }
}
