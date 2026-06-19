const REST_BASE = 'https://en.wikipedia.org/api/rest_v1'
const ACTION_BASE = 'https://en.wikipedia.org/w/api.php'

interface PageSummary {
  title: string
  extract?: string
  thumbnail?: { source: string }
  content_urls?: { desktop: { page: string } }
}

const cache = new Map<string, PageSummary | null>()

async function fetchSummary(title: string): Promise<PageSummary | null> {
  const res = await fetch(
    `${REST_BASE}/page/summary/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    { headers: { 'Accept': 'application/json' } },
  )
  if (!res.ok) return null
  return res.json()
}

export async function getWikipediaSummary(name: string): Promise<PageSummary | null> {
  const cached = cache.get(name)
  if (cached !== undefined) return cached

  let result: PageSummary | null = null

  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: `${name} voice actor`,
    format: 'json',
    origin: '*',
    srlimit: '5',
  })

  try {
    const searchRes = await fetch(`${ACTION_BASE}?${params}`)
    if (searchRes.ok) {
      const data = await searchRes.json()
      const pages: string[] = (data?.query?.search ?? []).map((r: { title: string }) => r.title)

      for (const page of pages) {
        const summary = await fetchSummary(page)
        if (summary && (summary.extract || '').toLowerCase().includes('voice actor')) {
          result = summary
          break
        }
      }
    }
  } catch {
    // search failed, fall through
  }

  if (!result) {
    result = await fetchSummary(name)
  }

  cache.set(name, result)
  return result
}
