/**
 * The legal documents, derived from `src/legal/*.md` exactly as `docs.ts`
 * derives the guides — and in its own module for the same reason:
 * `getStaticPaths` is hoisted, so a glob declared beside it in the route file
 * is out of scope when Astro calls it.
 *
 * Each document's dates and version live in its frontmatter and nowhere else;
 * the console records the version a customer accepted at checkout.
 */
import type { MarkdownInstance } from 'astro';

export interface LegalFrontmatter {
    title: string;
    description: string;
    /** ISO date the document came into force. */
    effective: string;
    /** ISO date of the last change to the text. */
    updated: string;
    /** Bumped on every change to the text. */
    version: string;
    /** Sidebar order. */
    order: number;
}

const modules = import.meta.glob<MarkdownInstance<LegalFrontmatter>>('../legal/*.md', {
    eager: true,
});

const slugOf = (file: string): string => file.split('/').pop()!.replace(/\.md$/, '');

export interface LegalEntry extends LegalFrontmatter {
    slug: string;
    href: string;
    module: MarkdownInstance<LegalFrontmatter>;
}

export const legal: LegalEntry[] = Object.values(modules)
    .map((module) => ({
        ...module.frontmatter,
        slug: slugOf(module.file),
        href: `/legal/${slugOf(module.file)}`,
        module,
    }))
    .sort((a, b) => a.order - b.order);
