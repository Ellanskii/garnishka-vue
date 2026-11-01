<script setup lang="ts">
defineProps<{ message: string }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div role="alert" class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
    <p class="font-medium">Что-то пошло не так</p>
    <p class="text-sm">{{ message }}</p>
    <button
      type="button"
      class="mt-3 rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      @click="emit('retry')"
    >
      Повторить
    </button>
  </div>
</template>
