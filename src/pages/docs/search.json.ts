/**
 * The static search index: one entry per page section (h2/h3), built from the
 * Markdown at build time and fetched by the search box on first use. No
 * search service and no runtime framework — the whole index is one JSON file.
 */
import type { APIRoute } from 'astro';
import { docs, SECTIONS } from '../../data/docs';

interface Entry {
    /** Page title. */
    p: string;
    /** Heading inside the page, or '' for the page itself. */
    h: string;
    /** Link. */
    u: string;
    /** Section label. */
    s: string;
    /** Plain text, trimmed. */
    t: string;
}

const plain = (md: string): string =>
    md
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/[`*_>#|]/g, ' ')
        .replace(/-{3,}/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

export const GET: APIRoute = () => {
    const entries: Entry[] = [];
    for (const doc of docs) {
        const section = SECTIONS.find((s) => s.key === doc.section)!.label;
        // Code blocks out first: a `## ` line inside one is not a heading.
        const body = doc.module.rawContent().replace(/```[\s\S]*?```/g, ' ');
        const parts = body.split(/^(?=#{2,3} )/m);
        // Astro's own heading slugs, in document order, so links always land.
        const headings = doc.module.getHeadings().filter((h) => h.depth === 2 || h.depth === 3);
        let next = 0;
        entries.push({ p: doc.title, h: '', u: doc.href, s: section, t: doc.description });
        for (const part of parts) {
            const m = /^#{2,3} (.+)\n/.exec(part);
            if (!m) continue;
            const heading = headings[next++];
            if (!heading) continue;
            entries.push({
                p: doc.title,
                h: heading.text,
                u: `${doc.href}#${heading.slug}`,
                s: section,
                t: plain(part.slice(m[0].length)).slice(0, 320),
            });
        }
    }
    return new Response(JSON.stringify(entries), {
        headers: { 'Content-Type': 'application/json' },
    });
};
