import type { ParkRecord } from '../api/nycOpenData'

type ResultCardProps = {
  park: ParkRecord
  isSaved: boolean
  onToggleSave: (park: ParkRecord) => void
}

const ResultCard = ({ park, isSaved, onToggleSave }: ResultCardProps) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    park.mapQuery,
  )}`

  return (
    <article className="card">
      {park.imageUrl ? (
        <div className="card-media">
          <img src={park.imageUrl} alt={park.name} loading="lazy" />
        </div>
      ) : null}
      <div className="card-content">
        <h3>{park.name}</h3>
        <p className="meta">{park.borough}</p>
        <p className="address">{park.address}</p>
      </div>
      <div className="card-actions">
        <a className="button button-tertiary" href={mapUrl} target="_blank" rel="noreferrer">
          Open in Google Maps
        </a>
        <button
          className={`button ${isSaved ? 'button-primary' : 'button-secondary'}`}
          type="button"
          onClick={() => onToggleSave(park)}
        >
          {isSaved ? 'Saved' : 'Save'}
        </button>
      </div>
    </article>
  )
}

export default ResultCard
