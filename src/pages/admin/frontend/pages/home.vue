<template>
  <Nav></Nav>
  <div class="max-w-7xl mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Products</h1>
      <div class="flex items-center space-x-2">
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="searchQuery" placeholder="Search..." @input="debounceSearch" />
        </span>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center h-64">
      <ProgressSpinner style="width: 50px; height: 50px" />
    </div>

    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card
          v-for="product in users.records"
          :key="product.spuCode"
          class="shadow-md hover:shadow-lg transition-shadow"
          :class="{ 'bg-blue-100': selectedProducts.includes(product.spuCode) }"
        >
          <template #header>
            <div class="flex justify-between p-4">
              <Checkbox
                v-model="selectedProducts"
                :value="product.spuCode"
                @change="handleSelectionChange(product.spuCode)"
              />
              <img :src="product.picUrl" :alt="product.productName" class="h-40 object-contain" />
            </div>
          </template>
          <template #title>
            <div class="text-lg font-semibold line-clamp-2" :title="product.productName">
              {{ product.productName }}
            </div>
          </template>
          <template #content>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Price:</span>
                <span class="font-bold text-primary">¥{{ product.price.price }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Platform:</span>
                <Tag :value="product.platform" :severity="product.platform === 'TB' ? 'info' : 'warning'" />
              </div>
            </div>
          </template>
          <template #footer>
            <div class="flex justify-between">
              <Button
                icon="pi pi-external-link"
                label="View"
                class="p-button-sm"
                @click="openProductLink(product.spuCode)"
              />
            </div>
          </template>
        </Card>
      </div>

      <div class="flex justify-between items-center mt-6">
        <div class="text-sm text-gray-500">
          Showing {{ from }} to {{ to }} of {{ totalRecords }} entries
        </div>
        <div class="flex items-center space-x-2">
          <Dropdown
            v-model="rowsPerPage"
            :options="[10, 20, 50, 100, 300]"
            @change="changeRowsPerPage"
          />
          <Button
            icon="pi pi-angle-left"
            class="p-button-text"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          />
          <span class="px-2">Page {{ currentPage }} of {{ totalPages }}</span>
          <Button
            icon="pi pi-angle-right"
            class="p-button-text"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Nav from '../components/nav.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import Checkbox from 'primevue/checkbox'

const router = useRouter()
const toast = useToast()
const loading = ref(true)
const users = ref({ records: [] })
const searchQuery = ref('')
const currentPage = ref(1)
const totalRecords = ref(0)
const rowsPerPage = ref(20)
const totalPages = ref(0)
const from = ref(0)
const to = ref(0)
const selectedProducts = ref([])

let debounceTimeout = null

const fetchData = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/products/search', {
      params: {
        keyword: searchQuery.value || 'peanut butter',
        page: currentPage.value,
        size: rowsPerPage.value
      }
    })
    users.value = response.data.data
    totalRecords.value = response.data.data.total
    totalPages.value = response.data.data.pages
    from.value = (currentPage.value - 1) * rowsPerPage.value + 1
    to.value = Math.min(currentPage.value * rowsPerPage.value, totalRecords.value)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load products',
      life: 3000
    })
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const fetchSelectedProducts = async () => {
  try {
    const response = await axios.get('/api/products/selections', {
      params: {
        page: 1,
        size: 20
      }
    })
    selectedProducts.value = response.data.data.records.map(product => product.spuCode)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load selected products',
      life: 3000
    })
    console.error('Error fetching selected products:', error)
  }
}

const handleSelectionChange = async (spuCode) => {
  try {
    await axios.post('/api/products/selections', {
      product_codes: [spuCode]
    })
    toast.add({
      severity: 'success',
      summary: 'Selection Updated',
      detail: `Product ${spuCode} selection updated`,
      life: 3000
    })
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to update selection',
      life: 3000
    })
    console.error('Error updating selection:', error)
  }
}

const debounceSearch = () => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchData()
  }, 500)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchData()
  }
}

const changeRowsPerPage = (event) => {
  rowsPerPage.value = event.value
  currentPage.value = 1
  fetchData()
}

const openProductLink = (url) => {
  router.push({ name: 'product-details', params: { id: url } })
}

const addToCart = (product) => {
  toast.add({
    severity: 'success',
    summary: 'Added to cart',
    detail: `${product.productName} has been added to cart`,
    life: 3000
  })
}

onMounted(() => {
  fetchData()
  fetchSelectedProducts()
})
</script>

<style scoped>
.card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.p-card-content) {
  flex-grow: 1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bg-blue-100 {
  background-color: #dbeafe;
}
</style>
