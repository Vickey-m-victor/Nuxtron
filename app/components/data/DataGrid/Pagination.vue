<template>
  <div class="datagrid-pagination d-flex justify-content-between align-items-center">
    <div class="datatable-info">
      <span class="text-muted">
        Showing {{ firstItem }} to {{ lastItem }} of {{ total }} entries
      </span>
    </div>
    
    <div class="d-flex align-items-center gap-2">
      <!-- Pagination buttons -->
      <nav>
        <ul class="pagination pagination-sm mb-0">
          <!-- First -->
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(1)">
              <i class="fa fa-angle-double-left"></i>
            </a>
          </li>
          
          <!-- Previous -->
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">
              <i class="fa fa-angle-left"></i>
            </a>
          </li>
          
          <!-- Page numbers -->
          <li 
            v-for="page in pageNumbers" 
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage }"
          >
            <a class="page-link" href="#" @click.prevent="goToPage(page)">
              {{ page }}
            </a>
          </li>
          
          <!-- Next -->
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">
              <i class="fa fa-angle-right"></i>
            </a>
          </li>
          
          <!-- Last -->
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="goToPage(totalPages)">
              <i class="fa fa-angle-double-right"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number
  perPage: number
  total: number
  totalPages?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const totalPages = computed(() => props.totalPages || Math.ceil(props.total / props.perPage))
const firstItem = computed(() => (props.currentPage - 1) * props.perPage + 1)
const lastItem = computed(() => Math.min(props.currentPage * props.perPage, props.total))

const pageNumbers = computed(() => {
  const pages: number[] = []
  const maxPages = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)
  
  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('update:currentPage', page)
  }
}
</script>
