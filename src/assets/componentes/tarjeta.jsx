import { obtenerEstado } from './tarjeta.js'

function TarjetaPersonaje({ personaje }) {
  const estado = obtenerEstado(personaje.about)
  const animes = [...new Map(
    personaje.animes.map((anime) => [anime.id, anime]),
  ).values()].slice(0, 3)

  return (
    <article className="character-card">
      <div className="character-image-wrap">
        <img
          className="character-image"
          src={personaje.imageUrl}
          alt={`Imagen de ${personaje.name}`}
          loading="lazy"
        />
        <span className="image-label">PERSONAJE</span>
      </div>
      <div className="character-info">
        <p className="eyebrow"><span className="eyebrow-line" /> FICHA DEL PERSONAJE</p>
        <h2>{personaje.name}</h2>
        {personaje.name_kanji && (
          <p className="character-kanji">{personaje.name_kanji}</p>
        )}
        <div className="character-status">
          <span className={`status-dot ${estado === 'Vivo' ? 'is-alive' : ''}`} />
          <span>Estado:</span>
          <strong>{estado}</strong>
        </div>

        <div className="anime-section">
          <h3>APARECE EN</h3>
          {animes.length > 0 ? (
            <ul className="anime-list">
              {animes.map((anime) => (
                <li key={anime.id}>
                  <span className="anime-bullet" aria-hidden="true">✦</span>
                  {anime.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted-copy">La API no tiene animes asociados a este personaje.</p>
          )}
        </div>

        {personaje.about && <p className="character-about">{personaje.about}</p>}

        <a
          className="profile-link"
          href={personaje.url}
          target="_blank"
          rel="noreferrer"
        >
          Ver ficha completa en AniList <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  )
}

export default TarjetaPersonaje