// https://nuxt.com/docs/api/configuration/nuxt-config
import fs from 'fs'
import path from 'path'

// Load configuration from omninuxt.cfg
function loadConfig() {
  const configPath = path.resolve(__dirname, 'omninuxt.cfg')
  const config: Record<string, any> = {}
  
  try {
    const configFile = fs.readFileSync(configPath, 'utf-8')
    const lines = configFile.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key) {
          const value = valueParts.join('=').trim()
          config[key.trim()] = value
        }
      }
    }
  } catch (error) {
    console.warn('Could not load omninuxt.cfg, using defaults')
  }
  
  return config
}

const cfg = loadConfig()

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Disable SSR for all routes except auth pages
  // This prevents flash of unauthenticated/authenticated content
  ssr: false,
  
  // Auth pages can use SSR since they're public
  routeRules: {
    '/iam/auth/**': { ssr: true }
  },
  
  // Fully automatic module discovery - scans filesystem at runtime!
  modules: [
    './app/utils/full-auto-discovery',
    '@pinia/nuxt',
  ],
  
  // Configure components to use simple names without path prefix
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],
    
  // Load OneUI CSS and Bootstrap Icons
  css: [
    '~/assets/css/main.scss',
    'bootstrap-icons/font/bootstrap-icons.css'
  ],

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ['bootstrap']
    }
  },

  // Auto-import Bootstrap in all components
  app: {
    head: {
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
          integrity: 'sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL',
          crossorigin: 'anonymous'
        }
      ]
    }
  },

  // Runtime configuration for modules
  runtimeConfig: {
    // Private (server-side only)
    
    // Public (client-side)
    public: {
      appName: cfg.APP_NAME || 'OmniNuxt',
      environment: cfg.ENVIRONMENT || 'development',
      apiBase: cfg.API_BASE_URL || 'http://localhost:8080',
      encryptionKey: cfg.ENCRYPTION_KEY || 'Gk$e3lbvXi!n7kpiLamr@i9eZ@q220T4'
    }
  }
})
