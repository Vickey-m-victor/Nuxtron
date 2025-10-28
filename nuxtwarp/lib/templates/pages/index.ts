import type { EntityDefinition } from '../../types/index.js'

export function indexPageTemplate(moduleName: string, entity: EntityDefinition): string {
  const entityLower = entity.name.charAt(0).toLowerCase() + entity.name.slice(1)
  const entityPlural = pluralize(entityLower)
  const entityRoutePlural = kebabCase(entityPlural)
  const entityRouteSingular = kebabCase(entityLower)

  return `<script setup lang="ts">
import type { ${entity.name} } from '../../types/entities/${kebabCase(entity.name)}.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()

const { data, pending, error, refresh} = await useFetch<{
  dataPayload: {
    data: ${entity.name}[]
    totalCount: number
    currentPage: number
  }
}>(\`/api/v1/${moduleName}/${entityRoutePlural}\`, {
  query: route.query,
  watch: [() => route.query],
  $fetch: $api
})

const ${entityPlural} = computed(() => data.value?.dataPayload?.data || [])

const handleView = (id: number) => {
  router.push(\`/${moduleName}/${entityRoutePlural}/\${id}\`)
}

const handleEdit = (id: number) => {
  router.push(\`/${moduleName}/${entityRoutePlural}/\${id}/edit\`)
}

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this item?')) {
    try {
      await $api(\`/api/v1/${moduleName}/${entityRouteSingular}/\${id}\`, {
        method: 'DELETE'
      })
      await refresh()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
}
</script>

<template>
  <div>
    <BasePageHeading :title="'${entity.name} List'">
      <template #extra>
        <NuxtLink 
          :to="\`/${moduleName}/${entityRoutePlural}/create\`"
          class="btn btn-primary"
        >
          <i class="fa fa-plus me-1"></i>
          Create New
        </NuxtLink>
      </template>
    </BasePageHeading>

    <BaseBlock>
      <div v-if="pending" class="text-center py-4">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        Error loading data: {{ error.message }}
      </div>

      <div v-else-if="${entityPlural}.length === 0" class="text-center py-4">
        <p class="text-muted">No items found</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
${entity.properties.slice(0, 5).map(p => `              <th>${titleCase(p.name)}</th>`).join('\n')}
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ${entityPlural}" :key="item.id">
${entity.properties.slice(0, 5).map(p => `              <td>{{ item.${p.name} }}</td>`).join('\n')}
              <td class="text-end">
                <button
                  @click="handleView(item.id)"
                  class="btn btn-sm btn-info me-1"
                  title="View"
                >
                  <i class="fa fa-eye"></i>
                </button>
                <button
                  @click="handleEdit(item.id)"
                  class="btn btn-sm btn-warning me-1"
                  title="Edit"
                >
                  <i class="fa fa-pencil"></i>
                </button>
                <button
                  @click="handleDelete(item.id)"
                  class="btn btn-sm btn-danger"
                  title="Delete"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseBlock>
  </div>
</template>
`
}

export function createPageTemplate(moduleName: string, entity: EntityDefinition): string {
  const entityLower = entity.name.charAt(0).toLowerCase() + entity.name.slice(1)
  const entityPlural = pluralize(entityLower)
  const entityRoutePlural = kebabCase(entityPlural)
  const entityRouteSingular = kebabCase(entityLower)

  return `<script setup lang="ts">
import type { ${entity.name}CreatePayload } from '../../types/${kebabCase(entity.name)}-dto.js'

definePageMeta({
  layout: 'default'
})

const router = useRouter()
const { $api } = useNuxtApp()
const loading = ref(false)
const formData = ref<${entity.name}CreatePayload>({
${entity.properties
  .filter(p => !['id', 'created_at', 'updated_at'].includes(p.name))
  .map(p => `  ${p.name}: ${getDefaultValue(p)}`)
  .join(',\n')}
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await $api(\`/api/v1/${moduleName}/${entityRouteSingular}\`, {
      method: 'POST',
      body: formData.value
    })
    
    router.push(\`/${moduleName}/${entityRoutePlural}\`)
  } catch (error) {
    console.error('Create failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <BasePageHeading :title="'Create ${entity.name}'" />

    <BaseBlock>
      <form @submit.prevent="handleSubmit">
${entity.properties
  .filter(p => !['id', 'created_at', 'updated_at'].includes(p.name))
  .map(p => generateFormField(p))
  .join('\n\n')}

        <div class="mb-3">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Creating...' : 'Create' }}
          </button>
          <NuxtLink 
            :to="\`/${moduleName}/${entityRoutePlural}\`"
            class="btn btn-secondary ms-2"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
    </BaseBlock>
  </div>
</template>
`
}

export function viewPageTemplate(moduleName: string, entity: EntityDefinition): string {
  const entityLower = entity.name.charAt(0).toLowerCase() + entity.name.slice(1)
  const entityPlural = pluralize(entityLower)
  const entityRoutePlural = kebabCase(entityPlural)
  const entityRouteSingular = kebabCase(entityLower)

  return `<script setup lang="ts">
import type { ${entity.name} } from '../../types/entities/${kebabCase(entity.name)}.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const id = route.params.id as string

const { data, pending, error } = await useFetch<{
  dataPayload: { data: ${entity.name} }
}>(\`/api/v1/${moduleName}/${entityRouteSingular}/\${id}\`, {
  $fetch: $api
})

const item = computed(() => data.value?.dataPayload?.data)
</script>

<template>
  <div>
    <BasePageHeading :title="'View ${entity.name}'">
      <template #extra>
        <NuxtLink 
          :to="\`/${moduleName}/${entityRoutePlural}/\${id}/edit\`"
          class="btn btn-warning me-2"
        >
          <i class="fa fa-pencil me-1"></i>
          Edit
        </NuxtLink>
        <NuxtLink 
          :to="\`/${moduleName}/${entityRoutePlural}\`"
          class="btn btn-secondary"
        >
          <i class="fa fa-arrow-left me-1"></i>
          Back
        </NuxtLink>
      </template>
    </BasePageHeading>

    <BaseBlock>
      <div v-if="pending">Loading...</div>
      <div v-else-if="error">Error: {{ error.message }}</div>
      <div v-else-if="item">
${entity.properties.map(p => `        <div class="mb-3">
          <label class="form-label fw-bold">${titleCase(p.name)}</label>
          <div>{{ item.${p.name} }}</div>
        </div>`).join('\n')}
      </div>
    </BaseBlock>
  </div>
</template>
`
}

export function editPageTemplate(moduleName: string, entity: EntityDefinition): string {
  const entityLower = entity.name.charAt(0).toLowerCase() + entity.name.slice(1)
  const entityPlural = pluralize(entityLower)
  const entityRoutePlural = kebabCase(entityPlural)
  const entityRouteSingular = kebabCase(entityLower)

  return `<script setup lang="ts">
import type { ${entity.name}, ${entity.name}UpdatePayload } from '../../types/${kebabCase(entity.name)}-dto.js'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const id = route.params.id as string

const { data } = await useFetch<{
  dataPayload: { data: ${entity.name} }
}>(\`/api/v1/${moduleName}/${entityRouteSingular}/\${id}\`, {
  $fetch: $api
})

const formData = ref<${entity.name}UpdatePayload>({
  id: Number(id),
  ...(data.value?.dataPayload?.data || {})
})

const loading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  try {
    await $api(\`/api/v1/${moduleName}/${entityRouteSingular}/\${id}\`, {
      method: 'PUT',
      body: formData.value
    })
    
    router.push(\`/${moduleName}/${entityRoutePlural}\`)
  } catch (error) {
    console.error('Update failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <BasePageHeading :title="'Edit ${entity.name}'" />

    <BaseBlock>
      <form @submit.prevent="handleSubmit">
${entity.properties
  .filter(p => !['id', 'created_at', 'updated_at'].includes(p.name))
  .map(p => generateFormField(p))
  .join('\n\n')}

        <div class="mb-3">
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Updating...' : 'Update' }}
          </button>
          <NuxtLink 
            :to="\`/${moduleName}/${entityRoutePlural}\`"
            class="btn btn-secondary ms-2"
          >
            Cancel
          </NuxtLink>
        </div>
      </form>
    </BaseBlock>
  </div>
</template>
`
}

// Helper functions
function kebabCase(str: string): string {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
}

function pluralize(str: string): string {
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

function titleCase(str: string): string {
  return str.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

function getDefaultValue(prop: any): string {
  if (prop.type === 'string') return "''"
  if (prop.type === 'number') return '0'
  if (prop.type === 'boolean') return 'false'
  if (prop.type.endsWith('[]')) return '[]'
  return 'undefined'
}

function generateFormField(prop: any): string {
  const label = titleCase(prop.name)
  const inputType = prop.type === 'number' ? 'number' : 'text'
  
  return `        <div class="mb-3">
          <label class="form-label">${label}</label>
          <input
            v-model="formData.${prop.name}"
            type="${inputType}"
            class="form-control"
            ${prop.required ? 'required' : ''}
          />
        </div>`
}
