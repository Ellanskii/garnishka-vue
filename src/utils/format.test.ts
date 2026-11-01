import { describe, expect, it } from 'vitest'

import { formatPrice } from './format'

describe('formatPrice', () => {
  it('formats rubles without kopecks', () => {
    expect(formatPrice(1490).replace(/\s/g, ' ')).toBe('1 490 ₽')
  })
})
