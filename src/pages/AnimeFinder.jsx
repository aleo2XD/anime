import { useEffect, useRef, useState } from 'react'
import TarjetaPersonaje from '../assets/componentes/tarjeta.jsx'
import { buscarPersonaje } from '../services/anilist.js'
import '../App.css'

const RECOMENDACIONES = ['Monkey D. Luffy', 'Naruto Uzumaki', 'Goku']

export default function AnimeFinder() {
  const [nombre, setNombre] = useState('')
  const [personaje, setPersonaje] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [solicitud, setSolicitud] = useState(0)
  const ultimaSolicitud = useRef(0)
  const idPeticion = useRef(0)

  useEffect(() => {
    const consulta = nombre.trim()
    if (!consulta) return undefined

    const controller = new AbortController()
    const inmediata = solicitud !== ultimaSolicitud.current
    ultimaSolicitud.current = solicitud
    const idActual = idPeticion.current

    const timer = setTimeout(async () => {
      try {
        const resultado = await buscarPersonaje(consulta, { signal: controller.signal })
        if (idPeticion.current === idActual) setPersonaje(resultado)
      } catch (error) {
        if (!controller.signal.aborted && idPeticion.current === idActual) {
          setError(`No se pudo consultar AniList: ${error.message}`)
        }
      } finally {
        if (!controller.signal.aborted && idPeticion.current === idActual) {
          setCargando(false)
        }
      }
    }, inmediata ? 0 : 500)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [nombre, solicitud])

  function cambiarNombre(valor) {
    const consulta = valor.trim()
    const mismaConsulta = consulta && consulta === nombre.trim()
    idPeticion.current += 1
    setNombre(valor)
    setBusqueda(consulta)
    setPersonaje(null)
    setError('')
    setCargando(Boolean(consulta))
    if (mismaConsulta) setSolicitud((actual) => actual + 1)
  }

  function buscar(event) {
    event.preventDefault()
    if (!nombre.trim()) return
    idPeticion.current += 1
    setBusqueda(nombre.trim())
    setPersonaje(null)
    setError('')
    setCargando(true)
    setSolicitud((actual) => actual + 1)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="AnimeFinder, inicio">
          <span className="brand-mark" aria-hidden="true">ア</span>
          <span>ANIME<span className="brand-accent">FINDER</span></span>
        </a>
      </header>

      <section className="hero">
        <h1>¿Quién es tu<br /><span>personaje favorito?</span></h1>

        <form className="search-form" onSubmit={buscar}>
          <label className="visually-hidden" htmlFor="character-name">
            Nombre del personaje
          </label>
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            id="character-name"
            type="search"
            placeholder="Ej. Tanjiro Kamado..."
            value={nombre}
            onChange={(event) => cambiarNombre(event.target.value)}
          />
          <button type="submit" disabled={!nombre.trim()}>
            {cargando ? 'Buscando...' : 'Buscar personaje'}
            {!cargando && <span aria-hidden="true">↗</span>}
          </button>
        </form>

      </section>

      <section className="results" aria-live="polite">
        {cargando && (
          <div className="status-message">
            <span className="loader" aria-hidden="true" />
            <p>Buscando a <strong>{busqueda}</strong> en el universo anime...</p>
          </div>
        )}

        {!cargando && error && (
          <div className="feedback error-message" role="alert">
            <span aria-hidden="true">!</span>
            <div><h2>Algo salió mal</h2><p>{error}</p></div>
          </div>
        )}

        {!cargando && personaje && <TarjetaPersonaje personaje={personaje} />}

        {!cargando && !error && !personaje && busqueda && (
          <div className="feedback empty-state">
            <span className="empty-icon" aria-hidden="true">?</span>
            <div>
              <p className="eyebrow">NO ENCONTRAMOS RESULTADOS</p>
              <h2>No encontramos a “{busqueda}”</h2>
              <p>Prueba con uno de estos personajes:</p>
              <div className="recommendations">
                {RECOMENDACIONES.map((sugerencia) => (
                  <button
                    className="recommendation"
                    key={sugerencia}
                    onClick={() => cambiarNombre(sugerencia)}
                    type="button"
                  >
                    {sugerencia}<span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="footer">
        <span>Datos de personajes por <a href="https://anilist.co/" target="_blank" rel="noreferrer">AniList</a></span>
      </footer>
    </main>
  )
}
