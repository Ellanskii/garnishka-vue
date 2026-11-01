<script setup lang="ts">
import { onMounted } from 'vue'

import BaseSpinner from '@/components/BaseSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import ProductCard from '@/components/ProductCard.vue'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { formatPrice } from '@/utils/format'

const products = useProductsStore()
const cart = useCartStore()

onMounted(() => products.fetchAll())
</script>

<template>
  <section aria-labelledby="catalog-title">
    <div class="mb-4 flex items-end justify-between gap-4">
      <h1 id="catalog-title" class="text-2xl font-bold">Каталог растений</h1>
      <p class="text-sm text-gray-600" aria-live="polite">
        В корзине: {{ cart.count }} шт. на {{ formatPrice(cart.total) }}
      </p>
    </div>

    <BaseSpinner v-if="products.loading" />
    <ErrorState
      v-else-if="products.error"
      :message="products.error"
      @retry="products.fetchAll(true)"
    />
    <EmptyState v-else-if="products.isEmpty" title="Каталог пуст" />
    <ul v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="product in products.items" :key="product.id">
        <ProductCard :product="product" @add="cart.add" />
      </li>
    </ul>
  </section>
</template>
