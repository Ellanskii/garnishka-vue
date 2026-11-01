export type ProductCategory = 'roses' | 'conifers' | 'perennials' | 'fruit-trees' | 'shrubs'

export interface Product {
  id: string
  name: string
  latinName: string
  category: ProductCategory
  price: number
  oldPrice?: number
  /** Количество на складе, 0 — нет в наличии */
  stock: number
  /** Зона зимостойкости USDA */
  hardinessZone: string
  potVolumeL: number
  image: string
  description: string
}
