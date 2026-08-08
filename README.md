# g8deck-web

Marketing site for **G8Deck** — https://g8deck.app

Static Astro site. The product console is a separate application (Laravel) served
from **console.g8deck.app**; this repository contains only the public-facing
marketing page and never talks to the product.

## Stack

| Piece     | Choice                                                                    |
| --------- | ------------------------------------------------------------------------- |
| Framework | [Astro](https://astro.build) 7 (static output, zero client JS by default) |
| Styling   | Tailwind CSS v4 via `@tailwindcss/vite`, CSS-first `@theme` tokens        |
| Sitemap   | `@astrojs/sitemap`                                                        |
| Hosting   | Netlify — https://g8deck-web.netlify.app                                  |

## Commands

```bash
npm install       # install dependencies
npm run dev       # dev server on http://localhost:4321
npm run build     # static build into ./dist
npm run preview   # preview the built site
```

## Layout

```
src/
├── assets/brand/     # logo mark, wordmark lockups, favicon (SVG)
├── components/       # section + primitive components (.astro)
├── data/site.ts      # ALL copy and structured content lives here
├── layouts/Base.astro
├── styles/global.css # design tokens + base styles
└── pages/            # index.astro, 404.astro
public/               # robots.txt, static assets served as-is
```

**Copy lives in `src/data/site.ts`, not in markup.** Components read from it so a
wording change never means editing layout. Add a new section by adding its data
there first.

## Conventions

- Static by default. No client-side framework, no runtime JS unless a section
  genuinely cannot work without it.
- Dark-first design tokens in `src/styles/global.css`; light mode is a token
  override, never a second stylesheet.
- All motion is wrapped in `prefers-reduced-motion` guards.
- Links into the product always point at `site.consoleUrl`
  (`https://console.g8deck.app`) — never a relative path.

## Deployment

Netlify builds `npm run build` and publishes `dist/`. Headers, caching and the
`/console`, `/login`, `/register` redirects to the product console are declared
in `netlify.toml`.

---

© Developers Hub Sdn Bhd
