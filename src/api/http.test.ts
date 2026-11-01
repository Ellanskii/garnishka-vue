import { afterEach, describe, expect, it, vi } from 'vitest'

import { getErrorMessage, http, HttpError } from './http'

const jsonResponse = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })

describe('http', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns parsed JSON and builds query string', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)

    const data = await http<{ ok: boolean }>('/api/test', { query: { page: 2, q: undefined } })

    expect(data).toEqual({ ok: true })
    expect(String(fetchMock.mock.calls[0]?.[0])).toMatch(/\/api\/test\?page=2$/)
  })

  it('throws HttpError on non-2xx', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ message: 'nope' }, 404)))

    const error = await http('/api/missing').catch((e: unknown) => e)
    expect(error).toBeInstanceOf(HttpError)
    expect((error as HttpError).status).toBe(404)
    expect(getErrorMessage(error)).toBe('Не найдено')
  })

  it('wraps network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(http('/api/x')).rejects.toMatchObject({ name: 'HttpError', status: 0 })
  })
})
