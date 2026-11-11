import axios from 'axios'

const ANILIST_API_URL = 'https://graphql.anilist.co'

const PERSONAJE_QUERY = `
  query ($search: String!) {
    Character(search: $search) {
      id
      name {
        full
        native
      }
      image {
        large
      }
      description(asHtml: false)
      siteUrl
      media(perPage: 10, sort: POPULARITY_DESC) {
        edges {
          node {
            id
            type
            title {
              romaji
              english
              native
            }
          }
        }
      }
    }
  }
`

export async function buscarPersonaje(nombre, { signal } = {}) {
  const respuesta = await axios.post(
    ANILIST_API_URL,
    {
      query: PERSONAJE_QUERY,
      variables: { search: nombre },
    },
    { signal },
  )

  if (respuesta.data.errors?.length) {
    throw new Error(respuesta.data.errors.map(({ message }) => message).join('; '))
  }

  const personaje = respuesta.data.data?.Character
  if (!personaje) return null

  const animes = [...new Map(
    (personaje.media?.edges ?? [])
      .filter(({ node }) => node?.type === 'ANIME')
      .map(({ node }) => [
        node.id,
        {
          id: node.id,
          title: node.title.english || node.title.romaji || node.title.native,
        },
      ])
      .filter(([, anime]) => anime.title),
  ).values()]

  return {
    id: personaje.id,
    name: personaje.name.full,
    name_kanji: personaje.name.native,
    imageUrl: personaje.image.large,
    about: personaje.description,
    url: personaje.siteUrl,
    animes,
  }
}
