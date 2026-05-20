/* eslint-disable prettier/prettier */
# Museum Skanderborg

Project for my thesis Business Academy Aarhus - Multimedia Design

Website for [Museum Skanderborg](https://museumskanderborg.vercel.app/), built with Nuxt and Prismic CMS.

## Tech stack

- **[Nuxt 4](https://nuxt.com)** — Vue-based full-stack framework
- **[Prismic](https://prismic.io)** — headless CMS for all content
- **[Slice Machine](https://prismic.io/docs/slice-machine)** — component-driven content modelling
- **[UnoCSS](https://unocss.dev)**
- **[Gsap](https://gsap.com/)** - for animations that could not be done with css only

## Getting started

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev
```

This starts the Nuxt dev server and the Slice Machine UI simultaneously.

## Available scripts

| Script             | Description                         |
| ------------------ | ----------------------------------- |
| `npm run dev`      | Start Nuxt + Slice Machine together |
| `npm run build`    | Build for production                |
| `npm run generate` | Generate a static site              |
| `npm run preview`  | Preview the production build        |
| `npm run lint`     | Lint the codebase                   |

## Content management

Pages are composed from **slices** — reusable content sections managed through Slice Machine:

To edit slice schemas, use the Slice Machine UI at `http://localhost:9999` while the dev server is running. After making changes, the TypeScript types in `prismicio-types.d.ts` are regenerated automatically.

## Project structure

```
app/
├── assets/            # CSS, fonts, icon components
│   └── main.css       # this is where the grids, colors, rich text styles are defined
├── components/        # Shared Vue components
│   └── Base***.vue    # This are base components used throughout the app. Be very carefull when changing them
├── pages/             # File-based routes
├── slices/            # Prismic slice components (Slice Machine)
│   └── index.ts       # Auto-generated slice registry — do not edit
│   └──SliceName
│      └── index.vue   # The slice layout - this is what has to be edited to modify the slice
└── layouts/
    └── default.vue    # Root layout
customtypes/           # Prismic document type schemas
nuxt.config.ts         # Nuxt + Prismic route configuration
uno.config.ts          # UnoCSS design tokens, grid utilities, typography
```

##

,---,---,---,---,---,---,---,---,---,---,---,---,---,-------,
| ~ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 | [ | ] | <-    |
|---'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-----|
| ->| | " | , | . | P | Y | F | G |`C`|`R`| L | / | = |  \  |
|-----',--',--',--',--',--',--',--',--',--',--',--',--'-----|
| Caps | A |`O`| E | U |`I`| D | H |`T`| N | S | - |  Enter |
|------'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'--------|
|        | ; | Q | J | K | X | B | M | W |`V`| Z |          |
|------,-',--'--,'---'---'---'---'---'---'-,-'---',--,------|
| ctrl |  | alt |                          | alt  |  | ctrl |
'------'  '-----'--------------------------'------'  '------'
