import { ref, shallowRef, watch, type Ref, type WatchSource } from 'vue'

import { getErrorMessage } from '@/api/http'

/**
 * Простой аналог Nuxt useAsyncData: data/loading/error + перезапуск при изменении источника.
 * Отменяет предыдущий запрос через AbortSignal.
 */
export function useAsyncData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  source?: WatchSource,
) {
  const data = shallowRef<T | null>(null) as Ref<T | null>
  const loading = ref(false)
  const error = ref<string | null>(null)
  let controller: AbortController | null = null

  async function execute(): Promise<void> {
    controller?.abort()
    const current = new AbortController()
    controller = current
    loading.value = true
    error.value = null
    try {
      data.value = await fetcher(current.signal)
    } catch (e) {
      if (!current.signal.aborted) error.value = getErrorMessage(e)
    } finally {
      if (controller === current) loading.value = false
    }
  }

  if (source) watch(source, execute, { immediate: true })
  else void execute()

  return { data, loading, error, refresh: execute }
}
