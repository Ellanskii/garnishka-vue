import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { Product } from '@/types/product'

import ProductCard from './ProductCard.vue'

const product: Product = {
  id: 'thuja',
  name: 'Туя «Смарагд»',
  latinName: 'Thuja occidentalis',
  category: 'conifers',
  price: 1490,
  stock: 2,
  hardinessZone: '4',
  potVolumeL: 5,
  image: '/x.jpg',
  description: '',
}

const mountCard = (p: Product) =>
  mount(ProductCard, { props: { product: p }, global: { stubs: { RouterLink: RouterLinkStub } } })

describe('ProductCard', () => {
  it('emits add on click', async () => {
    const wrapper = mountCard(product)
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('add')?.[0]).toEqual([product])
  })

  it('disables button when out of stock', () => {
    const wrapper = mountCard({ ...product, stock: 0 })
    const button = wrapper.get('button')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.text()).toBe('Нет в наличии')
  })
})
