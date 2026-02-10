import type { ParkRecord } from '../api/nycOpenData'

type SavedPanelProps = {
  saved: ParkRecord[]
  onRemove: (park: ParkRecord) => void
}

const SavedPanel = ({ saved, onRemove }: SavedPanelProps) => {
  return (
    <section className="saved-panel">
      <header className="panel-header">
        <h2>Saved</h2>
        <span className="badge" aria-label={`${saved.length} saved parks`}>
          {saved.length}
        </span>
      </header>
      {saved.length === 0 ? (
        <p className="empty">No favorites yet. Save parks to keep them here.</p>
      ) : (
        <ul className="saved-list">
          {saved.map((park) => (
            <li key={park.id} className="saved-item">
              <div className="saved-content">
                {park.imageUrl ? (
                  <div className="saved-thumb">
                    <img src={park.imageUrl} alt={park.name} loading="lazy" />
                  </div>
                ) : null}
                <div>
                <h4>{park.name}</h4>
                <p className="meta">{park.borough}</p>
                <p className="address">{park.address}</p>
                </div>
              </div>
              <button
                className="button button-link"
                type="button"
                onClick={() => onRemove(park)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default SavedPanel
