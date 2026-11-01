import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { getErrorMessage } from '@/api/http'
import { productsApi } from '@/api/products'
import type { Product } from '@/types/product'

export const useProductsStore = defineStore('products', () => {
  const items = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const loaded = ref(false)

  const isEmpty = computed(() => loaded.value && !error.value && items.value.length === 0)
  const inStock = computed(() => items.value.filter((p) => p.stock > 0))
  const byId = computed(() => new Map(items.value.map((p) => [p.id, p])))

  async function fetchAll(force = false): Promise<void> {
    if (loading.value || (loaded.value && !force)) return
    loading.value = true
    error.value = null
    try {
      items.value = await productsApi.list()
      loaded.value = true
    } catch (e) {
      error.value = getErrorMessage(e)
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, loaded, isEmpty, inStock, byId, fetchAll }
})
