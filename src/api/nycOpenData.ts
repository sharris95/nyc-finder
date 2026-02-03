export type BoroughCode = 'M' | 'B' | 'Q' | 'X' | 'R'
export type SortOption = 'relevance' | 'name'

export type ParkRecord = {
  id: string
  name: string
  borough: string
  address: string
  mapQuery: string
}

type FetchParams = {
  search: string
  borough: BoroughCode | 'all'
  sort: SortOption
  signal?: AbortSignal
}

const BASE_URL = 'https://data.cityofnewyork.us/resource/enfh-gkve.json'

const fieldValue = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

const buildMapQuery = (name: string, address: string, borough: string) =>
  [name, address, borough, 'NYC'].filter(Boolean).join(', ')

export const fetchParks = async ({
  search,
  borough,
  sort,
  signal,
}: FetchParams): Promise<ParkRecord[]> => {
  const params = new URLSearchParams()
  params.set(
    '$select',
    'objectid,signname,name311,borough,address,location',
  )
  params.set('$limit', '50')

  const trimmedSearch = search.trim()
  if (trimmedSearch.length > 0) {
    params.set('$q', trimmedSearch)
  }

  if (borough !== 'all') {
    params.set('$where', `borough='${borough}'`)
  }

  if (sort === 'name') {
    params.set('$order', 'signname ASC')
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`, { signal })
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`)
  }

  const data = (await response.json()) as Array<Record<string, unknown>>

  return data.map((item, index) => {
    const signName = fieldValue(item.signname)
    const altName = fieldValue(item.name311)
    const name = signName || altName || 'Unnamed park'
    const boroughValue = fieldValue(item.borough)
    const addressValue = fieldValue(item.address)
    const locationValue = fieldValue(item.location)
    const address = addressValue || locationValue || 'Address unavailable'
    const idValue = fieldValue(item.objectid) || `${name}-${index}`

    return {
      id: idValue,
      name,
      borough: boroughValue || 'Unknown borough',
      address,
      mapQuery: buildMapQuery(name, address, boroughValue),
    }
  })
}
