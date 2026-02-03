import type { BoroughCode, SortOption } from '../api/nycOpenData'

type FiltersProps = {
  borough: BoroughCode | 'all'
  sort: SortOption
  onBoroughChange: (value: BoroughCode | 'all') => void
  onSortChange: (value: SortOption) => void
}

const Filters = ({ borough, sort, onBoroughChange, onSortChange }: FiltersProps) => {
  return (
    <div className="filters">
      <label className="filter">
        <span className="filter-label">Borough</span>
        <select
          className="select"
          value={borough}
          onChange={(event) =>
            onBoroughChange(event.target.value as BoroughCode | 'all')
          }
        >
          <option value="all">All boroughs</option>
          <option value="M">Manhattan</option>
          <option value="B">Brooklyn</option>
          <option value="Q">Queens</option>
          <option value="X">Bronx</option>
          <option value="R">Staten Island</option>
        </select>
      </label>
      <label className="filter">
        <span className="filter-label">Sort</span>
        <select
          className="select"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
        >
          <option value="relevance">Relevance</option>
          <option value="name">Name A–Z</option>
        </select>
      </label>
    </div>
  )
}

export default Filters
