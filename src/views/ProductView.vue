<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { productsApi } from '@/api/products'
import BaseSpinner from '@/components/BaseSpinner.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import { useAsyncData } from '@/composables/useAsyncData'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/format'

const props = defineProps<{ id: string }>()
const cart = useCartStore()

const {
  data: product,
  loading,
  error,
  refresh,
} = useAsyncData(
  (signal) => productsApi.getById(props.id, signal),
  () => props.id,
)
</script>

<template>
  <div>
    <RouterLink to="/" class="mb-4 inline-block text-sm text-leaf-700 hover:underline"
      >← Назад в каталог</RouterLink
    >

    <BaseSpinner v-if="loading" />
    <ErrorState v-else-if="error" :message="error" @retry="refresh" />
    <EmptyState v-else-if="!product" title="Растение не найдено">
      <p class="mt-2 text-sm">Возможно, товар снят с продажи.</p>
    </EmptyState>
    <article v-else class="grid gap-6 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2">
      <img :src="product.image" :alt="product.name" class="w-full rounded-lg object-cover" />
      <div class="flex flex-col gap-3">
        <h1 class="text-2xl font-bold">{{ product.name }}</h1>
        <p class="text-gray-500 italic">{{ product.latinName }}</p>
        <p>{{ product.description }}</p>
        <dl class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt class="text-gray-500">Зона зимостойкости</dt>
          <dd>{{ product.hardinessZone }}</dd>
          <dt class="text-gray-500">Объём горшка</dt>
          <dd>{{ product.potVolumeL }} л</dd>
          <dt class="text-gray-500">Наличие</dt>
          <dd>{{ product.stock > 0 ? `${product.stock} шт.` : 'нет в наличии' }}</dd>
        </dl>
        <p class="text-2xl font-bold">{{ formatPrice(product.price) }}</p>
        <button
          type="button"
          :disabled="product.stock <= 0"
          class="self-start rounded-lg bg-leaf-600 px-4 py-2 text-white hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          @click="cart.add(product)"
        >
          В корзину
        </button>
      </div>
    </article>
  </div>
</template>
