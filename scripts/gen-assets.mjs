/**
 * One-off: render the favicon and the Open Graph card.
 *
 *   node scripts/gen-assets.mjs
 *
 * Output is committed (public/favicon.svg, public/og.png) so a build never
 * depends on this script or on sharp being installed on the build machine.
 *
 * Note on type: the OG card is rasterised by librsvg, which only sees fonts
 * installed on the machine — not the self-hosted woff2 files the site uses. It
 * therefore renders in a macOS system stack rather than Archivo. Since the
 * result is committed as a PNG, that difference is baked in once here rather
 * than showing up at runtime.
 */
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const INK = '#080C10';
const SURFACE = '#0E141A';
const LINE = '#1F2A33';
const LINE_STRONG = '#2E3D49';
const FG = '#E6EDF3';
const MUTED = '#8FA3B0';
const ACCENT = '#10B981';

/**
 * The deck-seam mark — see src/assets/brand/. Drawn on a 48x48 grid with 36x36
 * of ink, a constant 6u bar weight, and counter corners concentric to the shell
 * so no wall thins at a corner. Keep in sync with src/components/Logo.astro.
 */
const MARK_PATH =
    'M16 6 h16 a10 10 0 0 1 10 10 v4 h-4 v6 h4 v6 a10 10 0 0 1 -10 10 h-16 a10 10 0 0 1 -10 -10 v-6 h4 v-6 h-4 v-4 a10 10 0 0 1 10 -10 z ' +
    'M16 12 H32 A4 4 0 0 1 36 16 V18 A2 2 0 0 1 34 20 H14 A2 2 0 0 1 12 18 V16 A4 4 0 0 1 16 12 Z ' +
    'M14 26 H34 A2 2 0 0 1 36 28 V32 A4 4 0 0 1 32 36 H16 A4 4 0 0 1 12 32 V28 A2 2 0 0 1 14 26 Z';

const mark = (x, y, size, fill) => `
  <g transform="translate(${x} ${y}) scale(${size / 48})">
    <path d="${MARK_PATH}" fill="${fill}" fill-rule="evenodd"/>
  </g>`;

// ---- favicon --------------------------------------------------------------
// Emerald tile with the mark knocked out in the page ink. The tile is what
// makes it findable in a row of tabs, and ink-on-emerald runs ~6.5:1 where
// white would run ~2.4:1 — the counters and the seam survive at 16px.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <rect width="48" height="48" rx="11" fill="${ACCENT}"/>
  <path d="${MARK_PATH}" fill="${INK}" fill-rule="evenodd"/>
</svg>
`;

await writeFile(resolve(ROOT, 'public/favicon.svg'), favicon);
console.log('  ✓ public/favicon.svg');

// ---- Open Graph card ------------------------------------------------------
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const MONO = 'Menlo, Monaco, monospace';

const gridLines = () => {
    const out = [];
    for (let x = 0; x <= 1200; x += 40) {
        out.push(`<line x1="${x}" y1="0" x2="${x}" y2="630" stroke="#111A21" stroke-width="1"/>`);
    }
    for (let y = 0; y <= 630; y += 40) {
        out.push(`<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="#111A21" stroke-width="1"/>`);
    }
    return out.join('\n    ');
};

/** The pipeline profile from the site, reduced to its silhouette. */
const ladder = () => {
    const out = [];
    const x0 = 72;
    const w = 22;
    const gap = 8;
    for (let i = 0; i < 20; i++) {
        const done = i < 12;
        const running = i === 12;
        const h = done ? 26 : running ? 38 : 14;
        const fill = done ? ACCENT : running ? '#38BDF8' : LINE_STRONG;
        out.push(
            `<rect x="${x0 + i * (w + gap)}" y="${520 - h}" width="${w}" height="${h}" rx="1" fill="${fill}"/>`
        );
    }
    return out.join('\n    ');
};

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${INK}"/>
  <g opacity="0.55">
    ${gridLines()}
  </g>

  <!-- Rail -->
  <line x1="40" y1="0" x2="40" y2="630" stroke="${LINE}" stroke-width="1"/>
  <circle cx="40" cy="96" r="4.5" fill="${ACCENT}"/>

  <!-- Lockup -->
  ${mark(72, 74, 40, ACCENT)}
  <text x="126" y="104" font-family="${SANS}" font-size="29" font-weight="700" fill="${FG}" letter-spacing="-0.6">G8Deck</text>

  <!-- Headline -->
  <text x="72" y="228" font-family="${SANS}" font-size="66" font-weight="700" fill="${FG}" letter-spacing="-2.4">Describe the architecture.</text>
  <text x="72" y="300" font-family="${SANS}" font-size="66" font-weight="700" fill="${ACCENT}" letter-spacing="-2.4">Ship the infrastructure.</text>

  <text x="72" y="358" font-family="${SANS}" font-size="24" fill="${MUTED}">Architecture-first infrastructure deployment — on-premise, cloud, or air-gapped.</text>

  <!-- Pipeline silhouette -->
  ${ladder()}
  <line x1="72" y1="520" x2="672" y2="520" stroke="${LINE_STRONG}" stroke-width="1"/>
  <text x="72" y="548" font-family="${MONO}" font-size="15" fill="${MUTED}" letter-spacing="2">20 STEPS · RESUMABLE · IDEMPOTENT</text>

  <!-- Footer strip -->
  <line x1="72" y1="576" x2="1128" y2="576" stroke="${LINE}" stroke-width="1"/>
  <text x="72" y="604" font-family="${MONO}" font-size="15" fill="${MUTED}" letter-spacing="2">G8DECK.APP</text>
  <text x="1128" y="604" text-anchor="end" font-family="${MONO}" font-size="15" fill="${ACCENT}" letter-spacing="2">DEVELOPERS HUB SDN BHD</text>

  <!-- Corner block -->
  <rect x="880" y="78" width="248" height="188" rx="3" fill="${SURFACE}" stroke="${LINE}" stroke-width="1"/>
  <text x="904" y="112" font-family="${MONO}" font-size="13" fill="${MUTED}" letter-spacing="2">BLUEPRINT</text>
  <rect x="904" y="126" width="200" height="30" rx="2" fill="${INK}" stroke="${LINE_STRONG}"/>
  <circle cx="920" cy="141" r="3.5" fill="${ACCENT}"/>
  <text x="934" y="146" font-family="${MONO}" font-size="13" fill="${FG}">edge · 2 nodes</text>
  <rect x="904" y="164" width="200" height="30" rx="2" fill="${INK}" stroke="${LINE_STRONG}"/>
  <circle cx="920" cy="179" r="3.5" fill="${ACCENT}"/>
  <text x="934" y="184" font-family="${MONO}" font-size="13" fill="${FG}">app · 3 nodes</text>
  <rect x="904" y="202" width="200" height="30" rx="2" fill="${INK}" stroke="${LINE_STRONG}"/>
  <circle cx="920" cy="217" r="3.5" fill="#38BDF8"/>
  <text x="934" y="222" font-family="${MONO}" font-size="13" fill="${FG}">data · primary+rep</text>
  <text x="904" y="252" font-family="${MONO}" font-size="12" fill="${ACCENT}" letter-spacing="1.6">PROVIDER-AGNOSTIC</text>
</svg>
`;

await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(resolve(ROOT, 'public/og.png'));
console.log('  ✓ public/og.png');
