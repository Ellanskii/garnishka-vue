import type { Product } from '@/types/product'

import { http } from './http'

/**
 * Мок-API: статический JSON из /public/mock.
 * Чтобы переключиться на реальный бэкенд — поменяйте пути и задайте VITE_API_URL.
 */
export const productsApi = {
  list: (signal?: AbortSignal) => http<Product[]>('/mock/products.json', { signal }),

  async getById(id: string, signal?: AbortSignal): Promise<Product | undefined> {
    const products = await productsApi.list(signal)
    return products.find((p) => p.id === id)
  },
}
