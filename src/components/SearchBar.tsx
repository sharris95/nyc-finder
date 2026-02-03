import type { ChangeEvent } from 'react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onShare: () => void
}

const SearchBar = ({ value, onChange, onShare }: SearchBarProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className="search-bar">
      <label className="search-label" htmlFor="search-input">
        Search parks
      </label>
      <div className="search-row">
        <input
          id="search-input"
          className="search-input"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Try Prospect Park, playground, or lake"
          autoComplete="off"
        />
        <button className="button button-secondary" type="button" onClick={onShare}>
          Share
        </button>
      </div>
    </div>
  )
}

export default SearchBar
