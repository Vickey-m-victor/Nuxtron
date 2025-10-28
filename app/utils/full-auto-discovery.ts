import { defineNuxtModule, addComponentsDir, addImportsDir, extendPages } from '@nuxt/kit'
import { resolve } from 'pathe'
import { existsSync, readdirSync, statSync } from 'fs'

/**
 * Fully Automatic Module Discovery System


 * Features:
 * - Automatically scans modules/ directory at runtime
 * - Main module gets "/" route, others get "/module-name"
 * - Falls back to default Nuxt app/pages if no modules found
 * - Zero configuration required!
 */

function generateRoutePath(filePath: string, prefix: string): string {
  let path = filePath
    .replace(/\.vue$/, '')
    .replace(/\/index$/, '')
    .replace(/\[\.\.\.(\w+)\]/g, ':$1*')
    .replace(/\[(\w+)\]/g, ':$1')
    .replace(/\\/g, '/')

  if (!path.startsWith('/')) path = '/' + path
  if (path === '/index' || path === '') path = '/'

  if (prefix && prefix !== '/') {
    const cleanPrefix = prefix.startsWith('/') ? prefix : '/' + prefix
    path = path === '/' ? cleanPrefix : cleanPrefix + path
  }

  return path
}

function generateRouteName(filePath: string, prefix: string): string {
  let name = filePath
    .replace(/\.vue$/, '')
    .replace(/\/index$/, '')
    .replace(/\[\.\.\.(\w+)\]/g, '$1-catchall')
    .replace(/\[(\w+)\]/g, '$1')
    .replace(/[\/\\]/g, '-')
    .replace(/^-+|-+$/g, '')

  if (name === 'index' || name === '') name = 'home'

  if (prefix && prefix !== '/') {
    const prefixName = prefix.replace(/[\/\\]/g, '').toLowerCase()
    name = `${prefixName}-${name}`
  }

  return name
}

/**
 * Recursively scan a directory for .vue files
 */
function scanVueFiles(dir: string, basePath: string = ''): string[] {
  const vueFiles: string[] = []
  
  try {
    if (!existsSync(dir)) {
      return vueFiles
    }

    const entries = readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name)
      const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        vueFiles.push(...scanVueFiles(fullPath, relativePath))
      } else if (entry.isFile() && entry.name.endsWith('.vue')) {
        // Add Vue files
        vueFiles.push(relativePath)
      }
    }
  } catch (e) {
    // Directory doesn't exist or can't access - skip silently
  }
  
  return vueFiles
}

/**
 * Automatically discover modules by scanning the filesystem
 */
async function discoverModules(modulesDir: string) {
  const discoveredModules: Array<{ name: string; prefix: string }> = []
  
  try {
    if (!existsSync(modulesDir)) {
      return discoveredModules
    }

    const entries = readdirSync(modulesDir, { withFileTypes: true })
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const moduleName = entry.name
        const moduleDir = resolve(modulesDir, moduleName)
        const pagesDir = resolve(moduleDir, 'app/pages')
        
        // Only include modules that have a pages directory
        if (existsSync(pagesDir)) {
          // Main module gets root path, others get /module-name
          const prefix = moduleName === 'main' ? '/' : `/${moduleName}`
          
          discoveredModules.push({
            name: moduleName,
            prefix
          })
        }
      }
    }
    
    // Sort modules so 'main' comes first
    discoveredModules.sort((a, b) => {
      if (a.name === 'main') return -1
      if (b.name === 'main') return 1
      return a.name.localeCompare(b.name)
    })
    
  } catch (error: any) {
    // Could not scan modules directory - silently continue
  }

  return discoveredModules
}

export default defineNuxtModule({
  meta: {
    name: 'auto-module-discovery',
    version: '2.0.0',
    configKey: 'autoModuleDiscovery'
  },
  
  defaults: {
    enabled: true,
    fallbackToDefaultPages: true
  },

  async setup(options, nuxt) {
    if (!options.enabled) return
    
    const modulesDir = resolve(nuxt.options.rootDir, 'modules')
    
    // Auto-import global composables
    try {
      addImportsDir(resolve(nuxt.options.rootDir, 'app/composables'))
    } catch (e) {
      // Directory doesn't exist - skip silently
    }
    
    // Automatically discover all modules
    const discoveredModules = await discoverModules(modulesDir)
    
    if (discoveredModules.length === 0) {
      if (options.fallbackToDefaultPages) {
        // No modules found - Nuxt will use default app/pages routing
      }
      return
    }
    
    // Process each discovered module
    for (const { name: moduleName, prefix } of discoveredModules) {
      const moduleDir = resolve(modulesDir, moduleName)
      
      // Auto-import components
      try {
        addComponentsDir({
          path: resolve(moduleDir, 'app/components'),
          prefix: moduleName.charAt(0).toUpperCase() + moduleName.slice(1),
          global: true,
          pathPrefix: false
        })
      } catch (e) {
        // Directory doesn't exist - skip silently
      }

      // Auto-import composables
      try {
        addImportsDir(resolve(moduleDir, 'app/composables'))
      } catch (e) {
        // Directory doesn't exist - skip silently
      }

      // Auto-register routes (scan all Vue files in pages directory)
      extendPages(async (pages) => {
        const routes: any[] = []
        const pagesDir = resolve(moduleDir, 'app/pages')
        
        // Scan for all Vue files in the pages directory
        const vueFiles = scanVueFiles(pagesDir)
        
        for (const pagePath of vueFiles) {
          const fullPath = resolve(pagesDir, pagePath)
          
          // Check if file exists (should always be true from scanVueFiles, but safety check)
          try {
            if (existsSync(fullPath)) {
              const routePath = generateRoutePath(pagePath, prefix)
              const routeName = generateRouteName(pagePath, prefix)
              
              routes.push({
                name: routeName,
                path: routePath,
                file: fullPath
              })
            }
          } catch (e) {
            // File doesn't exist or can't access fs - skip silently
          }
        }
        
        pages.push(...routes)
      })
    }
  }
})