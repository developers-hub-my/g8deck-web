/**
 * The docs index, derived from the files themselves.
 *
 * Pages live in `src/docs/*.md` rather than under `src/pages`, and
 * `src/pages/docs/[...slug].astro` routes them. Keeping them out of the page
 * tree is what makes this glob safe: a Markdown page that resolved its own
 * layout would import this module while this module was still importing it,
 * and the frontmatter would read back undefined at build time.
 *
 * Adding a page is adding a `.md` file. There is nothing else to register.
 */
import type { MarkdownInstance } from 'astro';

export interface DocFrontmatter {
    title: string;
    /** Meta description, and the blurb on /docs. */
    description: string;
    /** Reading order of the set. Ties fall back to title. */
    order: number;
    /** ISO date, shown on the page so a stale screenshot is dateable. */
    updated: string;
}

const modules = import.meta.glob<MarkdownInstance<DocFrontmatter>>('../docs/*.md', {
    eager: true,
});

const slugOf = (file: string): string => file.split('/').pop()!.replace(/\.md$/, '');

export interface DocEntry extends DocFrontmatter {
    slug: string;
    href: string;
    module: MarkdownInstance<DocFrontmatter>;
}

export const docs: DocEntry[] = Object.values(modules)
    .map((module) => ({
        ...module.frontmatter,
        slug: slugOf(module.file),
        href: `/docs/${slugOf(module.file)}`,
        module,
    }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

/** Trailing slashes differ between `dev` and the built output; paths compare
    equal only after they are dropped. */
export const isCurrent = (href: string, pathname: string): boolean =>
    href.replace(/\/$/, '') === pathname.replace(/\/$/, '');
