<script setup lang="ts">
withDefaults(defineProps<{ title?: string }>(), { title: 'Ничего не найдено' })
</script>

<template>
  <div
    class="rounded-lg border border-dashed border-leaf-100 bg-white p-8 text-center text-gray-600"
  >
    <p class="font-medium">{{ title }}</p>
    <slot />
  </div>
</template>
