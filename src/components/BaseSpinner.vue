<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Загрузка…' })
</script>

<template>
  <div role="status" aria-live="polite" class="flex items-center gap-2 py-8 text-leaf-700">
    <span
      class="size-5 animate-spin rounded-full border-2 border-leaf-500 border-t-transparent"
      aria-hidden="true"
    />
    <span>{{ label }}</span>
  </div>
</template>
