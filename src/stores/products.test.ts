import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { HttpError } from '@/api/http'
import { productsApi } from '@/api/products'
import type { Product } from '@/types/product'

import { useProductsStore } from './products'

const products: Product[] = [
  {
    id: 'a',
    name: 'A',
    latinName: 'A',
    category: 'roses',
    price: 1,
    stock: 1,
    hardinessZone: '4',
    potVolumeL: 1,
    image: '',
    description: '',
  },
  {
    id: 'b',
    name: 'B',
    latinName: 'B',
    category: 'shrubs',
    price: 2,
    stock: 0,
    hardinessZone: '4',
    potVolumeL: 1,
    image: '',
    description: '',
  },
]

describe('products store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads products and exposes derived state', async () => {
    vi.spyOn(productsApi, 'list').mockResolvedValue(products)
    const store = useProductsStore()

    const pending = store.fetchAll()
    expect(store.loading).toBe(true)
    await pending

    expect(store.loading).toBe(false)
    expect(store.items).toHaveLength(2)
    expect(store.inStock.map((p) => p.id)).toEqual(['a'])
    expect(store.byId.get('b')?.name).toBe('B')
    expect(store.isEmpty).toBe(false)
  })

  it('sets a readable error on failure', async () => {
    vi.spyOn(productsApi, 'list').mockRejectedValue(new HttpError('boom', 500, '/x'))
    const store = useProductsStore()
    await store.fetchAll()

    expect(store.error).toBe('Ошибка сервера, попробуйте позже')
    expect(store.loading).toBe(false)
  })

  it('reports empty state', async () => {
    vi.spyOn(productsApi, 'list').mockResolvedValue([])
    const store = useProductsStore()
    await store.fetchAll()
    expect(store.isEmpty).toBe(true)
  })

  it('does not refetch unless forced', async () => {
    const spy = vi.spyOn(productsApi, 'list').mockResolvedValue(products)
    const store = useProductsStore()
    await store.fetchAll()
    await store.fetchAll()
    await store.fetchAll(true)
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
