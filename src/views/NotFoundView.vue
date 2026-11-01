<script setup lang="ts">
import { RouterLink } from 'vue-router'

import EmptyState from '@/components/EmptyState.vue'
</script>

<template>
  <EmptyState title="Страница не найдена">
    <RouterLink to="/" class="mt-2 inline-block text-leaf-700 hover:underline"
      >На главную</RouterLink
    >
  </EmptyState>
</template>
