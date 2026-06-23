const API_BASE = 'https://graphql.anilist.co'
const SEIYUU_BASE = 'https://seiyuubase.dhikarizky.me'

interface SeiyuuData {
  name: { first: string; last: string | null }
  image: string
  description: string
  url: string
}

const cache = new Map<string, SeiyuuData | null>()

const query = `
  query ($name: String) {
    Staff(search: $name) {
      id
      name { first last }
      image { medium }
      description
    }
  }
`

export async function getSeiyuuSummary(name: string): Promise<SeiyuuData | null> {
  const cached = cache.get(name)
  if (cached !== undefined) return cached

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { name } }),
    })
    if (!res.ok) {
      cache.set(name, null)
      return null
    }
    const json = await res.json()
    const staff = json?.data?.Staff
    if (!staff || !staff.description) {
      cache.set(name, null)
      return null
    }

    const url = `${SEIYUU_BASE}/info/${encodeURIComponent(name)}`
    const data: SeiyuuData = {
      name: staff.name,
      image: staff.image?.medium ?? '',
      description: staff.description,
      url,
    }
    cache.set(name, data)
    return data
  } catch {
    cache.set(name, null)
    return null
  }
}
