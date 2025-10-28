import type { EntityDefinition } from '../../types/index.js'

export function apiComposableTemplate(moduleName: string, entity: EntityDefinition): string {
  const entityLower = entity.name.charAt(0).toLowerCase() + entity.name.slice(1)
  const entityPlural = pluralize(entityLower)
  const route = kebabCase(entityPlural)

  return `import type { ${entity.name}, ${entity.name}CreatePayload, ${entity.name}UpdatePayload } from '../../types/${kebabCase(entity.name)}-dto.js'

export const use${entity.name} = () => {
  const config = useRuntimeConfig()
  const baseUrl = \`\${config.public.apiBaseUrl}/v1/${moduleName}/${route}\`

  const fetchAll = async (params?: Record<string, any>) => {
    return await useFetch<{ dataPayload: { data: ${entity.name}[] } }>(baseUrl, {
      params,
      method: 'GET'
    })
  }

  const fetchOne = async (id: number) => {
    return await useFetch<{ dataPayload: { data: ${entity.name} } }>(\`\${baseUrl}/\${id}\`, {
      method: 'GET'
    })
  }

  const create = async (payload: ${entity.name}CreatePayload) => {
    return await $fetch<{ dataPayload: { data: ${entity.name} } }>(baseUrl, {
      method: 'POST',
      body: payload
    })
  }

  const update = async (id: number, payload: ${entity.name}UpdatePayload) => {
    return await $fetch(\`\${baseUrl}/\${id}\`, {
      method: 'PUT',
      body: payload
    })
  }

  const remove = async (id: number) => {
    return await $fetch(\`\${baseUrl}/\${id}\`, {
      method: 'DELETE'
    })
  }

  return {
    fetchAll,
    fetchOne,
    create,
    update,
    remove
  }
}
`
}

export function storeComposableTemplate(moduleName: string, entity: EntityDefinition): string {
  const entityLower = entity.name.charAt(0).toLowerCase() + entity.name.slice(1)
  const entityPlural = pluralize(entityLower)

  return `import { defineStore } from 'pinia'
import type { ${entity.name} } from '../../types/entities/${kebabCase(entity.name)}.js'

export const use${entity.name}Store = defineStore('${moduleName}-${entityPlural}', {
  state: () => ({
    ${entityPlural}: [] as ${entity.name}[],
    current${entity.name}: null as ${entity.name} | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetch${entity.name}s(params?: Record<string, any>) {
      this.loading = true
      this.error = null
      
      try {
        const { use${entity.name} } = await import('../api/use${entity.name}.js')
        const { fetchAll } = use${entity.name}()
        const { data, error } = await fetchAll(params)
        
        if (error.value) {
          this.error = error.value.message
          return
        }
        
        this.${entityPlural} = data.value?.dataPayload?.data || []
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    setCurrent${entity.name}(${entityLower}: ${entity.name}) {
      this.current${entity.name} = ${entityLower}
    },

    clearCurrent${entity.name}() {
      this.current${entity.name} = null
    }
  },

  getters: {
    get${entity.name}ById: (state) => (id: number) => {
      return state.${entityPlural}.find(item => item.id === id)
    },

    ${entityPlural}Count: (state) => state.${entityPlural}.length
  }
})
`
}

// Helper functions
function kebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
}

function pluralize(str: string): string {
  if (str.endsWith('y')) {
    return str.slice(0, -1) + 'ies'
  }
  if (str.endsWith('s')) {
    return str + 'es'
  }
  return str + 's'
}
