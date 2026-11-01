export class HttpError extends Error {
  readonly status: number
  readonly url: string
  readonly body: unknown

  constructor(message: string, status: number, url: string, body?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.url = url
    this.body = body
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  /** Query-параметры; undefined/null значения пропускаются */
  query?: Record<string, string | number | boolean | undefined | null>
  /** Тело запроса; объекты сериализуются в JSON */
  body?: unknown
  /** Таймаут в мс (по умолчанию 10 000) */
  timeoutMs?: number
}

const BASE_URL: string = import.meta.env.VITE_API_URL ?? ''

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = new URL(path, BASE_URL || window.location.origin)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

async function parseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''
  if (response.status === 204) return undefined
  if (contentType.includes('application/json')) return response.json()
  return response.text()
}

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, body, timeoutMs = 10_000, headers, signal, ...init } = options
  const url = buildUrl(path, query)

  const controller = new AbortController()
  const timer = setTimeout(
    () => controller.abort(new DOMException('Timeout', 'TimeoutError')),
    timeoutMs,
  )
  signal?.addEventListener('abort', () => controller.abort(signal.reason), { once: true })

  const isJsonBody = body !== undefined && !(body instanceof FormData)

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : isJsonBody ? JSON.stringify(body) : (body as FormData),
    })

    const data = await parseBody(response)
    if (!response.ok) {
      throw new HttpError(
        `HTTP ${response.status}: ${response.statusText || 'Request failed'}`,
        response.status,
        url,
        data,
      )
    }
    return data as T
  } catch (error) {
    if (error instanceof HttpError) throw error
    if (
      error instanceof DOMException &&
      (error.name === 'AbortError' || error.name === 'TimeoutError')
    ) {
      throw new HttpError(
        error.name === 'TimeoutError' ? 'Превышено время ожидания' : 'Запрос отменён',
        0,
        url,
      )
    }
    throw new HttpError(error instanceof Error ? error.message : 'Сетевая ошибка', 0, url)
  } finally {
    clearTimeout(timer)
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.status === 404) return 'Не найдено'
    if (error.status >= 500) return 'Ошибка сервера, попробуйте позже'
    return error.message
  }
  return error instanceof Error ? error.message : 'Неизвестная ошибка'
}
