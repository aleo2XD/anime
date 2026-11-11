export function obtenerEstado(about = '') {
  const descripcion = typeof about === 'string' ? about : ''
  const estado = descripcion.match(
    /^\s*(?:status|estado)\s*[:：-]\s*(alive|deceased|dead|vivo|viva|fallecido|fallecida)\b/im,
  )?.[1]?.toLowerCase()

  if (['alive', 'vivo', 'viva'].includes(estado)) return 'Vivo'
  if (['deceased', 'dead', 'fallecido', 'fallecida'].includes(estado)) {
    return 'Fallecido'
  }

  return 'No especificado por la API'
}
