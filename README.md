# AnimeFinder

Buscador de personajes de anime creado con React y Vite. Consulta la API GraphQL
pública de AniList para mostrar la imagen, descripción, animes relacionados y el
enlace a la ficha del personaje.

## Requisitos

- Node.js
- npm

## Desarrollo

```sh
npm install
npm run dev
```

La búsqueda espera 500 ms después de que dejas de escribir antes de enviar la
consulta a `https://graphql.anilist.co`. También puedes enviar el formulario para
buscar inmediatamente. No se requiere una clave de API.

## Validación

```sh
npm run lint
npm run build
```

El estado de vida no es un campo estructurado de AniList. La ficha solo lo
presenta como vivo o fallecido cuando la descripción del personaje incluye un
estado explícito; en los demás casos indica que no está especificado.
