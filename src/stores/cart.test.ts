import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import type { Product } from '@/types/product'

import { useCartStore } from './cart'

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'rose',
  name: 'Роза',
  latinName: 'Rosa',
  category: 'roses',
  price: 500,
  stock: 3,
  hardinessZone: '5',
  potVolumeL: 3,
  image: '',
  description: '',
  ...overrides,
})

describe('cart store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds products and computes count/total', () => {
    const cart = useCartStore()
    cart.add(makeProduct())
    cart.add(makeProduct({ id: 'thuja', price: 1000 }), 2)

    expect(cart.count).toBe(3)
    expect(cart.total).toBe(2500)
  })

  it('merges the same product and caps qty by stock', () => {
    const cart = useCartStore()
    cart.add(makeProduct(), 2)
    cart.add(makeProduct(), 5)

    expect(cart.lines).toHaveLength(1)
    expect(cart.lines[0]?.qty).toBe(3)
  })

  it('ignores out-of-stock products', () => {
    const cart = useCartStore()
    cart.add(makeProduct({ stock: 0 }))
    expect(cart.count).toBe(0)
  })

  it('setQty removes line when qty <= 0', () => {
    const cart = useCartStore()
    cart.add(makeProduct())
    cart.setQty('rose', 0)
    expect(cart.lines).toHaveLength(0)
  })
})
