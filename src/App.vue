<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-leaf-50 text-gray-900">
    <header class="border-b border-leaf-100 bg-white">
      <nav
        class="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3"
        aria-label="Основная навигация"
      >
        <RouterLink to="/" class="text-lg font-bold text-leaf-700">🌿 Garnishka</RouterLink>
        <RouterLink to="/" class="text-sm hover:underline" active-class="font-semibold"
          >Каталог</RouterLink
        >
      </nav>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>
