<template>
  <Nav></Nav>
  <div class="max-w-7xl mx-auto p-6 bg-gray-900 min-h-screen text-gray-100">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <ProgressSpinner style="width: 50px; height: 50px" />
    </div>
    <div v-else-if="error" class="text-center text-red-400">
      <p class="text-xl font-semibold">{{ error }}</p>
    </div>
    <div v-else class="bg-gray-800 rounded-xl shadow-2xl p-8">
      <!-- Product Header -->
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Image Gallery -->
        <div class="md:w-1/2">
          <div class="relative">
            <img :src="mainImage" :alt="product.productName" class="w-full h-96 object-contain rounded-xl shadow-lg" />
            <div class="absolute top-3 right-3">
              <Tag :value="product.platform" :severity="product.platform === 'TB' ? 'info' : 'warning'" class="text-sm px-3 py-1" />
            </div>
          </div>
          <div class="flex gap-3 mt-6 overflow-x-auto pb-2">
            <img
              v-for="(img, index) in product.productImageList"
              :key="index"
              :src="img"
              :alt="`Thumbnail ${index + 1}`"
              class="w-24 h-24 object-contain cursor-pointer rounded-md hover:opacity-90 transition-all duration-300"
              :class="{ 'ring-2 ring-blue-500': mainImage === img }"
              @click="mainImage = img"
            />
          </div>
        </div>
        <!-- Product Info -->
        <div class="md:w-1/2">
          <h1 class="text-4xl font-extrabold text-white mb-5">{{ product.productName }}</h1>
          <div class="flex items-center gap-6 mb-5">
            <div>
              <span class="text-sm text-gray-400">Price:</span>
              <span class="text-3xl font-bold text-blue-400">¥{{ product.price.price }}</span>
              <span v-if="product.proPrice.price < product.price.price" class="text-sm text-gray-500 line-through ml-3">
                ¥{{ product.proPrice.price }}
              </span>
            </div>
            <div>
              <span class="text-sm text-gray-400">Freight:</span>
              <span class="text-lg font-medium text-gray-300">¥{{ product.freight.price }}</span>
            </div>
          </div>
          <div class="mb-6">
            <span class="text-sm text-gray-400">Shop:</span>
            <a :href="`https://shop${product.shop.shopId}.taobao.com`" target="_blank" class="text-blue-400 hover:text-blue-300 transition-colors">
              {{ product.shop.shopName }}
            </a>
          </div>
          <!-- Purchase Specifications -->
          <div class="mb-6">
            <h3 class="text-xl font-semibold text-white mb-3">Purchase Specifications</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                v-for="sku in product.skuList"
                :key="sku.skuCode"
                :label="sku.props[0].valueName"
                class="p-button-outlined text-left border-gray-600 hover:bg-gray-700"
                :class="{ 'bg-blue-600 border-blue-600 text-white': selectedSku === sku.skuCode }"
                @click="selectedSku = sku.skuCode"
              >
                <template #default>
                  <div class="flex justify-between w-full">
                    <span>{{ sku.props[0].valueName }}</span>
                    <span class="font-bold text-blue-400">¥{{ sku.price.price }}</span>
                  </div>
                </template>
              </Button>
            </div>
          </div>
          <!-- Actions -->
          <div class="flex gap-4">
            <Button
              icon="pi pi-shopping-cart"
              label="Add to Cart"
              class="p-button-success bg-green-600 hover:bg-green-700 border-green-600"
              :disabled="!selectedSku"
              @click="addToCart"
            />
            <Button
              icon="pi pi-external-link"
              label="View on Taobao"
              class="p-button-outlined border-gray-600 hover:bg-gray-700"
              @click="openProductLink(product.productLink)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Nav from '../components/nav.vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const loading = ref(true)
const error = ref(null)
const product = ref(null)
const mainImage = ref('')
const selectedSku = ref(null)

const fetchProduct = async () => {
  try {
    loading.value = true
    const response = await axios.post(`/api/products/${route.params.id}`)
    if (response.data.success) {
      product.value = response.data.data
      mainImage.value = product.value.productImageList[0]
      selectedSku.value = product.value.skuList[0]?.skuCode
    } else {
      throw new Error('Failed to load product data')
    }
  } catch (err) {
    error.value = 'Error loading product details. Please try again later.'
    console.error('Error fetching product:', err)
  } finally {
    loading.value = false
  }
}

const addToCart = () => {
  if (!selectedSku.value) return
  const sku = product.value.skuList.find(s => s.skuCode === selectedSku.value)
  toast.add({
    severity: 'success',
    summary: 'Added to cart',
    detail: `${product.value.productName} (${sku.props[0].valueName}) has been added to cart`,
    life: 3000
  })
}

const openProductLink = (url) => {
  window.open(url, '_blank')
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
body {
  background-color: #111827;
}

.prose img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.prose img:hover {
  transform: scale(1.02);
}

:deep(.p-button) {
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
}

:deep(.p-button-primary) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

:deep(.p-button-primary:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

:deep(.p-button-outlined) {
  border-color: #4b5563;
  color: #d1d5db;
}

:deep(.p-button-outlined:hover) {
  background-color: #374151;
  border-color: #4b5563;
}

:deep(.p-button-success) {
  background-color: #10b981;
  border-color: #10b981;
}

:deep(.p-button-success:hover) {
  background-color: #059669;
  border-color: #059669;
}

:deep(.p-button-secondary) {
  color: #d1d5db;
  border-color: #4b5563;
}

:deep(.p-button-secondary:hover) {
  background-color: #374151;
  border-color: #4b5563;
}

.text-primary {
  color: #3b82f6;
}

.text-blue-400 {
  color: #60a5fa;
}

.text-blue-400:hover {
  color: #93c5fd;
}
</style>
