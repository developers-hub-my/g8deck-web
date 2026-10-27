/**
 * Turns every Markdown screenshot into a captioned, enlargeable figure.
 *
 * A page writes a plain `![alt text](/docs/<slug>/<name>.webp)` on its own
 * line; the rendered `<p><img></p>` is rewritten here into the `.shot` +
 * `.lightbox` markup that global.css styles — a `:target` modal, so the site
 * still ships no JavaScript for it. The alt text doubles as the caption.
 *
 * Width and height are read from the file so the browser reserves the space
 * before the image arrives (no layout shift).
 */
import sharp from 'sharp';
import { join } from 'node:path';

const PUBLIC = join(process.cwd(), 'public');
const PENDING = '/docs/_pending.svg';

const size = new Map<string, { width: number; height: number }>();

async function dimensions(src: string) {
    if (!size.has(src)) {
        try {
            const meta = await sharp(join(PUBLIC, src)).metadata();
            size.set(src, { width: meta.width ?? 1280, height: meta.height ?? 720 });
        } catch {
            throw new Error(
                `Screenshot ${src} does not exist — point it at ${PENDING} until it does.`
            );
        }
    }
    return size.get(src)!;
}

const IMAGE = /<p>\s*<img src="([^"]+)" alt="([^"]*)"\s*\/?>\s*<\/p>/g;

export async function withScreenshots(html: string): Promise<string> {
    const matches = [...html.matchAll(IMAGE)];
    let out = html;
    let index = 0;
    for (const match of matches) {
        const [whole, src, alt] = match;
        if (!src.startsWith('/docs/')) continue;
        index++;
        const { width, height } = await dimensions(src);
        const id = `shot-${index}`;
        const pending = src === PENDING;
        const caption = pending ? `${alt} (screenshot pending)` : alt;
        const figure = `<figure class="shot-figure${pending ? ' is-pending' : ''}">
<a class="shot" id="${id}-thumb" href="#${id}" aria-label="Enlarge: ${caption}"><img src="${src}" alt="${caption}" width="${width}" height="${height}" loading="lazy" decoding="async" /></a>
<figcaption>${caption}</figcaption>
</figure>
<div id="${id}" class="lightbox">
<a class="lightbox-backdrop" href="#${id}-thumb" aria-label="Close"></a>
<figure class="lightbox-figure"><img src="${src}" alt="" width="${width}" height="${height}" loading="lazy" /><figcaption>${caption}</figcaption></figure>
<a class="lightbox-close" href="#${id}-thumb">Close</a>
</div>`;
        out = out.replace(whole, figure);
    }
    return out;
}
