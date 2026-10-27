/**
 * The docs index, derived from the files themselves.
 *
 * Pages live in `src/docs/**.md` rather than under `src/pages`, and
 * `src/pages/docs/[...slug].astro` routes them. Keeping them out of the page
 * tree is what makes this glob safe: a Markdown page that resolved its own
 * layout would import this module while this module was still importing it,
 * and the frontmatter would read back undefined at build time.
 *
 * Adding a page is adding a `.md` file with a `section` from SECTIONS below.
 * A file in a subfolder gets a nested URL (`mcp/ops.md` -> /docs/mcp/ops).
 * The MCP reference pages are generated — see scripts/gen-mcp-reference.mjs.
 */
import type { MarkdownInstance } from 'astro';

/** Sidebar groups, in reading order. A page names one by key. */
export const SECTIONS = [
    { key: 'start', label: 'Getting started' },
    { key: 'concepts', label: 'Concepts' },
    { key: 'servers', label: 'Servers' },
    { key: 'apps', label: 'Applications' },
    { key: 'data', label: 'Data' },
    { key: 'people', label: 'Teams and organisations' },
    { key: 'mcp', label: 'MCP and AI automation' },
    { key: 'help', label: 'Troubleshooting and reference' },
] as const;

export type SectionKey = (typeof SECTIONS)[number]['key'];

export interface DocFrontmatter {
    title: string;
    /** Meta description, and the blurb on /docs. */
    description: string;
    /** Reading order inside the section. Ties fall back to title. */
    order: number;
    /** Sidebar group. */
    section: SectionKey;
    /** ISO date, shown on the page so a stale screenshot is dateable. */
    updated: string;
    /** Set by the MCP reference generator; the page says so. */
    generated?: boolean;
    /** Shorter label for the sidebar, when the title is long. */
    nav?: string;
}

const modules = import.meta.glob<MarkdownInstance<DocFrontmatter>>('../docs/**/*.md', {
    eager: true,
});

const slugOf = (file: string): string => file.split('/src/docs/').pop()!.replace(/\.md$/, '');

export interface DocEntry extends DocFrontmatter {
    slug: string;
    href: string;
    module: MarkdownInstance<DocFrontmatter>;
}

const sectionRank = (key: SectionKey): number => SECTIONS.findIndex((s) => s.key === key);

export const docs: DocEntry[] = Object.values(modules)
    .map((module) => {
        const slug = slugOf(module.file);
        return { ...module.frontmatter, slug, href: `/docs/${slug}`, module };
    })
    .sort(
        (a, b) =>
            sectionRank(a.section) - sectionRank(b.section) ||
            a.order - b.order ||
            a.title.localeCompare(b.title)
    );

for (const doc of docs) {
    if (sectionRank(doc.section) < 0) {
        throw new Error(`src/docs/${doc.slug}.md: unknown section "${doc.section}"`);
    }
}

/** The sidebar: every section with its pages, in reading order. */
export const groups = SECTIONS.map((section) => ({
    ...section,
    docs: docs.filter((doc) => doc.section === section.key),
})).filter((group) => group.docs.length > 0);

/** Trailing slashes differ between `dev` and the built output; paths compare
    equal only after they are dropped. */
export const isCurrent = (href: string, pathname: string): boolean =>
    href.replace(/\/$/, '') === pathname.replace(/\/$/, '');
