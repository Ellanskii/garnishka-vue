<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/format'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ add: [product: Product] }>()

const outOfStock = computed(() => props.product.stock <= 0)
</script>

<template>
  <article
    class="flex flex-col overflow-hidden rounded-xl border border-leaf-100 bg-white shadow-sm"
  >
    <img
      :src="product.image"
      :alt="product.name"
      class="aspect-[3/2] w-full object-cover"
      loading="lazy"
    />
    <div class="flex flex-1 flex-col gap-2 p-4">
      <h3 class="font-semibold">
        <RouterLink :to="{ name: 'product', params: { id: product.id } }" class="hover:underline">
          {{ product.name }}
        </RouterLink>
      </h3>
      <p class="text-sm text-gray-500 italic">{{ product.latinName }}</p>
      <div class="mt-auto flex items-center justify-between gap-2">
        <p class="text-lg font-bold">
          {{ formatPrice(product.price) }}
          <s v-if="product.oldPrice" class="text-sm font-normal text-gray-400">{{
            formatPrice(product.oldPrice)
          }}</s>
        </p>
        <button
          type="button"
          :disabled="outOfStock"
          class="rounded-lg bg-leaf-600 px-3 py-1.5 text-sm text-white hover:bg-leaf-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          @click="emit('add', product)"
        >
          {{ outOfStock ? 'Нет в наличии' : 'В корзину' }}
        </button>
      </div>
    </div>
  </article>
</template>
