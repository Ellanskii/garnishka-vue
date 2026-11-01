import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed } from 'vue'

import type { Product } from '@/types/product'

export interface CartLine {
  productId: string
  name: string
  price: number
  qty: number
  maxQty: number
}

export const useCartStore = defineStore('cart', () => {
  const lines = useLocalStorage<CartLine[]>('garnishka:cart', [])

  const count = computed(() => lines.value.reduce((sum, l) => sum + l.qty, 0))
  const total = computed(() => lines.value.reduce((sum, l) => sum + l.qty * l.price, 0))

  function add(product: Product, qty = 1): void {
    if (product.stock <= 0 || qty <= 0) return
    const line = lines.value.find((l) => l.productId === product.id)
    if (line) {
      line.qty = Math.min(line.qty + qty, product.stock)
      line.maxQty = product.stock
    } else {
      lines.value.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        qty: Math.min(qty, product.stock),
        maxQty: product.stock,
      })
    }
  }

  function setQty(productId: string, qty: number): void {
    const line = lines.value.find((l) => l.productId === productId)
    if (!line) return
    if (qty <= 0) return remove(productId)
    line.qty = Math.min(Math.floor(qty), line.maxQty)
  }

  function remove(productId: string): void {
    lines.value = lines.value.filter((l) => l.productId !== productId)
  }

  function clear(): void {
    lines.value = []
  }

  return { lines, count, total, add, setQty, remove, clear }
})
