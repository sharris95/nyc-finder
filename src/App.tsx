import { useEffect, useMemo, useState } from 'react'
import { fetchParks, type BoroughCode, type ParkRecord, type SortOption } from './api/nycOpenData'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import ResultCard from './components/ResultCard'
import SavedPanel from './components/SavedPanel'
import Toast from './components/Toast'
import useDebounce from './hooks/useDebounce'
import useLocalStorage from './hooks/useLocalStorage'

const BOROUGH_LABELS: Record<string, string> = {
  M: 'Manhattan',
  B: 'Brooklyn',
  Q: 'Queens',
  X: 'Bronx',
  R: 'Staten Island',
}

const normalizeBorough = (value: string) => BOROUGH_LABELS[value] || value

const BOROUGH_IMAGES: Record<string, string[]> = {
  Manhattan: [
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1496560544814-23451c93d1d2?auto=format&fit=crop&w=900&q=80',
  ],
  Brooklyn: [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1454412685993-0f47fa10ecc2?auto=format&fit=crop&w=900&q=80',
  ],
  Queens: [
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80',
  ],
  Bronx: [
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1504610926078-a1611febcad3?auto=format&fit=crop&w=900&q=80',
  ],
  'Staten Island': [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
  ],
  Unknown: [
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80',
  ],
}

const hashString = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const pickImage = (borough: string, id: string) => {
  const list = BOROUGH_IMAGES[borough] ?? BOROUGH_IMAGES.Unknown
  const index = hashString(id) % list.length
  return list[index]
}

const getInitialFilters = () => {
  const params = new URLSearchParams(window.location.search)
  const search = params.get('q') ?? ''
  const boroughParam = params.get('borough') ?? 'all'
  const sortParam = params.get('sort') ?? 'relevance'

  const borough: BoroughCode | 'all' =
    boroughParam === 'M' ||
    boroughParam === 'B' ||
    boroughParam === 'Q' ||
    boroughParam === 'X' ||
    boroughParam === 'R'
      ? (boroughParam as BoroughCode)
      : 'all'

  const sort: SortOption = sortParam === 'name' ? 'name' : 'relevance'

  return { search, borough, sort }
}

function App() {
  const initial = useMemo(() => getInitialFilters(), [])
  const [search, setSearch] = useState(initial.search)
  const [borough, setBorough] = useState<BoroughCode | 'all'>(initial.borough)
  const [sort, setSort] = useState<SortOption>(initial.sort)
  const [results, setResults] = useState<ParkRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [saved, setSaved] = useLocalStorage<ParkRecord[]>(
    'nyc-finder-saved',
    [],
  )

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    document.title = 'NYC Finder'
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('q', search)
    params.set('borough', borough)
    params.set('sort', sort)
    const nextUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', nextUrl)
  }, [search, borough, sort])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetchParks({ search: debouncedSearch, borough, sort, signal: controller.signal })
      .then((data) => {
        const normalized = data.map((park) => {
          const normalizedBorough = normalizeBorough(park.borough)
          return {
            ...park,
            borough: normalizedBorough,
            mapQuery: [park.name, park.address, normalizedBorough, 'NYC']
              .filter(Boolean)
              .join(', '),
            imageUrl: pickImage(normalizedBorough, park.id),
          }
        })
        setResults(normalized)
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') {
          return
        }
        setError('We could not load parks right now. Please try again.')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => {
      controller.abort()
    }
  }, [debouncedSearch, borough, sort])

  const savedIds = useMemo(() => new Set(saved.map((park) => park.id)), [saved])

  const handleToggleSave = (park: ParkRecord) => {
    if (savedIds.has(park.id)) {
      setSaved(saved.filter((item) => item.id !== park.id))
    } else {
      setSaved([park, ...saved])
    }
  }

  const handleRemoveSaved = (park: ParkRecord) => {
    setSaved(saved.filter((item) => item.id !== park.id))
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setToast('Link copied')
    } catch {
      setToast('Unable to copy link')
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">NYC Finder</p>
          <h1>Find parks across New York City.</h1>
          <p className="subhead">
            Explore the NYC Open Data Parks Properties dataset. Save your
            favorites and share a search.
          </p>
        </div>
      </header>

      <section className="controls">
        <SearchBar value={search} onChange={setSearch} onShare={handleShare} />
        <Filters
          borough={borough}
          sort={sort}
          onBoroughChange={setBorough}
          onSortChange={setSort}
        />
      </section>

      <main className="grid">
        <section>
          <div className="section-header">
            <h2>Results</h2>
            <span className="meta">{results.length} spots</span>
          </div>
          {loading ? (
            <div className="skeleton-list">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="card skeleton" key={`skeleton-${index}`}>
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="state state-error">
              <p>{error}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="state state-empty">
              <p>No parks matched that search. Try a different keyword.</p>
            </div>
          ) : (
            <div className="results-list">
              {results.map((park) => (
                <ResultCard
                  key={park.id}
                  park={park}
                  isSaved={savedIds.has(park.id)}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}
        </section>
        <SavedPanel saved={saved} onRemove={handleRemoveSaved} />
      </main>

      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  )
}

export default App
