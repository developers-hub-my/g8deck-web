# G8Deck brand marks

Hand-authored SVG. No rasters, no embedded fonts, no `<text>` — the wordmark is
drawn as stroked geometry, so it renders identically on every machine and in
every PDF, with nothing to install.

## The concept: the deck seam

G8Deck stacks layers into a deployment. The mark is that literally: **two
deployment plates, stacked and registered against each other**, with the joint
between them notched into both flanks.

That notch is the whole idea. It reads as the seam where two layers seat
together — and because it pinches the waist, the same silhouette resolves into
the **"8"** of the G8 family. One form, two true readings; no metaphor bolted
onto a generic container.

It was chosen over the alternatives explored — an isometric deck of layers, a
blueprint grid glyph, a control-deck aperture, separated stacked plates — for
one hard reason: those all fail at 16px. Isometric planes turn to mush, grids
fill in, and separated plates lose the "8" entirely and read as a list icon. A
closed figure with two large counters and a 6u wall survives the tab bar. An
infrastructure product is recognised in a favicon and a status page far more
often than on a billboard, so 16px was treated as the design constraint rather
than an afterthought.

## Construction

Everything sits on a **48×48 grid, 36×36 of ink inset 6u**.

- **Bar weight is 6u everywhere.** Counter corners are drawn _concentric_ to the
  shell (r4 inside the r10 shell, r2 elsewhere) so the wall never thins at a
  corner — the common failure when a rounded rectangle is naively inset.
- **Seam: 4u deep × 6u tall**, cut into both flanks at the deck line.
- **Wordmark:** 4.5u monoline, cap height 26.5u, baseline centred on the mark's
  own centreline. Every bowl radius is a constant ~45% of that form's height, so
  `G`, `8`, `D`, `e` and `c` agree with each other rather than drifting.
- The wordmark's `8` repeats the mark's logic at text scale: stacked bowls,
  narrower on top.

## Files

| File               | Use                                                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `mark.svg`         | Icon mark, `currentColor`. **Prefer this in-app** — it inherits the accent token, so it can never drift from the theme.                   |
| `mark-emerald.svg` | Same mark, fixed `#059669`, for contexts where `currentColor` cannot resolve (og:image composition, e-mail signatures, partner listings). |
| `logo-dark.svg`    | Full lockup for dark backgrounds.                                                                                                         |
| `logo-light.svg`   | Full lockup for light backgrounds — print, PDF proposals, tender and procurement documents, slides on white.                              |
| `favicon.svg`      | Emerald tile, mark knocked out in page ink.                                                                                               |

Lockups carry a `viewBox` and no `width`/`height`, so they scale from CSS
(`height: 32px`) without editing the file.

### Why the favicon is a tile

Browser tabs sit on unpredictable chrome — light, dark, high-contrast, pinned
strips — so an outline mark cannot be trusted to hold contrast there. The tile
fixes the contrast ratio on any background and puts the emerald itself on
screen, which is the only thing anyone actually recognises at 16px.

The mark is knocked out in **page ink `#080C10`, not white**: against emerald-500
the ink knockout runs ~6.5:1 where white runs only ~2.4:1, so the counters and
the seam survive. Geometry is identical to `mark.svg`, so the tab icon and the
app icon are the same drawing, not two lookalikes.

## Colour

Emerald is a **two-step pair**, not one value. Emerald-600 is too dim on the
dark drafting sheet; emerald-500 is too pale on white. Use the step that matches
the surface.

| Token       | Hex       | Use                                                               |
| ----------- | --------- | ----------------------------------------------------------------- |
| Emerald 500 | `#10B981` | Mark **on dark** surfaces. Matches the site/console accent token. |
| Emerald 600 | `#059669` | Mark **on light** surfaces and in print.                          |
| Foreground  | `#E6EDF3` | Wordmark on dark. Pure white glares against `#080C10`.            |
| Slate 900   | `#0F172A` | Wordmark on light.                                                |
| Ink         | `#080C10` | Favicon knockout.                                                 |

**Single-colour fallback** (engraving, embroidery, one-colour print, fax): set
the entire lockup in one colour — `#0F172A` on light, `#E6EDF3` on dark. The
mark is a closed figure with open counters, so it holds without the accent.

## Clear space

**X = one bar weight = ⅙ of the mark's height.** For a 48px mark, X = 8px.

Keep at least **X** clear on all four sides of the mark or the lockup; **2X** is
preferred. Nothing enters that box — no rules, type, screenshot edges, or
photographic detail.

## Minimum sizes

| Asset   | Screen                            | Print |
| ------- | --------------------------------- | ----- |
| Mark    | 16px                              | 5mm   |
| Favicon | 16px                              | —     |
| Lockup  | **140px wide** (cap height ≈17px) | 36mm  |

Below 140px the wordmark's counters start to close. **Use the mark alone rather
than shrinking the lockup further** — that is what `mark.svg` is for.

## Do

- Use `mark.svg` with `currentColor` wherever a theme token is available.
- Scale by setting height and letting width follow.
- Keep the mark and wordmark in the lockup's original relationship.
- Place the mark on flat, calm ground with sufficient contrast.

## Don't

- **Don't re-space the lockup.** The 16u mark-to-wordmark gap and the letter
  fitting are optically corrected, not mechanical.
- **Don't recolour individual letters** — including the `8`. The restraint is
  the institutional signal; a two-tone wordmark reads as a consumer app.
- **Don't add gradients, bevels, glows or drop shadows.** The mark is flat by
  design and must stay reproducible in one ink.
- **Don't rebuild the wordmark in a live font.** It is drawn geometry; setting it
  in Archivo or anything else produces a different, unlicensed lockup.
- **Don't fill the seam notches or round them off** — they are the concept and
  what keeps the silhouette from reading as a plain rounded square.
- **Don't stretch, shear, rotate or outline-stroke** the mark.
- **Don't place the lockup on photographs or busy diagrams**, and don't put the
  emerald mark on a mid-emerald ground.

## Integration note

`src/components/Logo.astro` and `scripts/gen-assets.mjs` still carry an earlier,
different mark — three stacked bands with a connector running through them, and
`public/favicon.svg` is generated from it. Those files were **not** modified
here. Adopting this mark means updating both, plus re-running `npm run assets`.

Worth knowing before that decision: the incumbent mark's 1.5px strokes on a 32u
grid land at 0.75px at 16px, which is why it softens in the tab bar. That was the
main driver for the closed, 6u-walled form here.
