/**
 * Generates the MCP reference pages (src/docs/mcp/<server>.md) from the
 * G8Deck application's own source, so the reference cannot drift from the
 * tools that are actually registered.
 *
 *   node scripts/gen-mcp-reference.mjs [path/to/g8deck-app]
 *
 * The app path defaults to $G8DECK_APP, then to ../g8deck-app (the sibling
 * checkout under platform/). Output is committed, like every other generator
 * here, so the build never needs the app.
 *
 * What it reads, and why that is the authority:
 *   - app/Mcp/Servers/*Server.php  — the `$tools` array is what a client can
 *     reach. A tool class that exists but is not registered is not listed.
 *   - app/Mcp/Tools/**.php         — #[Name], #[Description], ability(),
 *     permission(), requiresOrganizationAdmin() and schema(), following
 *     `extends` so a renamed subclass inherits its parent's parameters.
 *   - app/Enums/**, constants      — to spell out enum parameter values.
 *   - routes/ai.php                — endpoint path and route throttle.
 *
 * It parses PHP with regular expressions, deliberately: the tool files follow
 * one shape, and a parser dependency for that would be heavier than the shape.
 * When a schema expression is not understood the parameter is still listed,
 * just without its enum values — it never invents one.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const app = resolve(process.argv[2] ?? process.env.G8DECK_APP ?? join(root, '..', 'g8deck-app'));
const outDir = join(root, 'src', 'docs', 'mcp');

if (!existsSync(join(app, 'app', 'Mcp', 'Servers'))) {
    console.error(`No G8Deck app at ${app} — pass its path as the first argument.`);
    process.exit(1);
}

/* ---- PHP string helpers ------------------------------------------------ */

/** Decode one PHP string literal body. */
const unquote = (body, quote) =>
    quote === "'"
        ? body.replace(/\\(['\\])/g, '$1')
        : body.replace(/\\(["\\$])/g, '$1').replace(/\\n/g, '\n');

/** Every string literal in `src`, concatenated in order (handles `'a'.'b'`). */
const STRING = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g;
const strings = (src) =>
    [...src.matchAll(STRING)].map((m) =>
        m[1] !== undefined ? unquote(m[1], "'") : unquote(m[2], '"')
    );

/** Body of the first balanced (...) or [...] starting at `open` index. */
function balanced(src, open) {
    const pairs = { '(': ')', '[': ']', '{': '}' };
    const stack = [];
    let quote = null;
    for (let i = open; i < src.length; i++) {
        const c = src[i];
        if (quote) {
            if (c === '\\') i++;
            else if (c === quote) quote = null;
            continue;
        }
        if (c === '/' && src[i + 1] === '/') i = src.indexOf('\n', i);
        else if (c === '/' && src[i + 1] === '*') i = src.indexOf('*/', i) + 1;
        else if (c === '#' && src[i + 1] !== '[') i = src.indexOf('\n', i);
        else if (c === "'" || c === '"') quote = c;
        else if (pairs[c]) stack.push(pairs[c]);
        else if (c === stack[stack.length - 1]) {
            stack.pop();
            if (stack.length === 0) return src.slice(open + 1, i);
        }
    }
    return '';
}

/** Body of `function name(...)` — the braces after the signature. */
function methodBody(src, name) {
    const m = new RegExp(`function\\s+${name}\\s*\\(`).exec(src);
    if (!m) return null;
    const brace = src.indexOf('{', m.index);
    return balanced(src, brace);
}

/** Text of an attribute like #[Description('...')], or null. */
function attribute(src, name) {
    const m = new RegExp(`#\\[${name}\\(`).exec(src);
    if (!m) return null;
    return balanced(src, m.index + m[0].length - 1);
}

/* ---- Class index ------------------------------------------------------- */

function walk(dir) {
    return readdirSync(dir).flatMap((entry) => {
        const path = join(dir, entry);
        return statSync(path).isDirectory() ? walk(path) : path.endsWith('.php') ? [path] : [];
    });
}

/** FQCN -> file path, for everything under app/. */
const classFile = (fqcn) => {
    const path = join(app, fqcn.replace(/^App\\/, 'app\\').replace(/\\/g, '/') + '.php');
    return existsSync(path) ? path : null;
};

function parseClass(file) {
    const src = readFileSync(file, 'utf8');
    const namespace = /namespace\s+([^;]+);/.exec(src)?.[1] ?? '';
    const uses = Object.fromEntries(
        [...src.matchAll(/^use\s+([^;\s]+)(?:\s+as\s+(\w+))?;/gm)].map((m) => [
            m[2] ?? m[1].split('\\').pop(),
            m[1],
        ])
    );
    const resolveName = (short) => uses[short] ?? `${namespace}\\${short}`;
    const decl = /^(?:abstract\s+|final\s+)*class\s+(\w+)(?:\s+extends\s+(\w+))?/m.exec(src);
    return {
        file,
        src,
        uses,
        resolveName,
        short: decl?.[1],
        parent: decl?.[2] ? resolveName(decl[2]) : null,
    };
}

const cache = new Map();
const load = (fqcn) => {
    if (!cache.has(fqcn)) {
        const file = classFile(fqcn);
        cache.set(fqcn, file ? parseClass(file) : null);
    }
    return cache.get(fqcn);
};

/** Walk up `extends` until `pick` returns something. */
function inherited(fqcn, pick) {
    for (let cls = load(fqcn); cls; cls = cls.parent ? load(cls.parent) : null) {
        const value = pick(cls);
        if (value !== null && value !== undefined) return value;
    }
    return null;
}

/* ---- Enum values ------------------------------------------------------- */

function enumCases(cls) {
    return [...cls.src.matchAll(/^\s*case\s+(\w+)\s*=\s*'([^']*)'/gm)].map((m) => ({
        name: m[1],
        value: m[2],
    }));
}

function constStrings(cls, name) {
    const m = new RegExp(`const\\s+(?:array\\s+)?${name}\\s*=\\s*\\[`).exec(cls.src);
    if (!m) return null;
    return strings(balanced(cls.src, m.index + m[0].length - 1));
}

/** Best-effort literal values of an ->enum(...) argument. */
function enumValues(expr, owner) {
    const out = [];
    let understood = true;
    // Spreads and dynamic calls we cannot evaluate statically.
    if (/\$\w+|app\(/.test(expr.replace(/fn\s*\(\w+\s+\$\w+\)[^,)]*/g, ''))) understood = false;

    const refs = [...expr.matchAll(/\b([A-Z]\w+)::(cases|values)\(\)/g)];
    for (const [, short] of refs) {
        const cls = load(owner.resolveName(short));
        if (cls) out.push(...enumCases(cls).map((c) => c.value));
        else understood = false;
    }
    for (const [, short, kase] of expr.matchAll(/\b([A-Z]\w+)::([A-Z_]+)->value/g)) {
        const cls = load(owner.resolveName(short));
        const found = cls && enumCases(cls).find((c) => c.name === kase);
        if (found) out.push(found.value);
        else understood = false;
    }
    for (const [, short, name] of expr.matchAll(/\b([A-Z]\w+)::([A-Z][A-Z_]+)\b(?!->|\()/g)) {
        const cls = load(owner.resolveName(short));
        const list = cls && constStrings(cls, name);
        if (list) out.push(...list);
        else understood = false;
    }
    if (refs.length === 0 && !/::/.test(expr)) out.push(...strings(expr));
    return { values: [...new Set(out)], complete: understood };
}

/* ---- Tool parsing ------------------------------------------------------ */

function parseSchema(fqcn) {
    return (
        inherited(fqcn, (cls) => {
            const body = methodBody(cls.src, 'schema');
            if (body === null) return null;
            const params = [];
            const keys = [...body.matchAll(/'(\w+)'\s*=>\s*\$schema->(\w+)\(/g)];
            keys.forEach((m, i) => {
                const end = i + 1 < keys.length ? keys[i + 1].index : body.length;
                const chunk = body.slice(m.index, end);
                const descAt = /->description\(/.exec(chunk);
                const description = descAt
                    ? strings(balanced(chunk, descAt.index + descAt[0].length - 1)).join('')
                    : '';
                const enumAt = /->enum\(/.exec(chunk);
                let values = null;
                if (enumAt)
                    values = enumValues(balanced(chunk, enumAt.index + enumAt[0].length - 1), cls);
                let type = m[2];
                const items = /->items\(\$schema->(\w+)\(/.exec(chunk);
                if (type === 'array' && items) type = `array of ${items[1]}`;
                params.push({
                    name: m[1],
                    type,
                    required: /->required\(\)/.test(chunk),
                    description: description.replace(/\s+/g, ' ').trim(),
                    values,
                });
            });
            return params;
        }) ?? []
    );
}

const firstReturn = (cls, method) => {
    const body = methodBody(cls.src, method);
    if (body === null) return null;
    const found = [...body.matchAll(/return\s+([^;]+);/g)].map((m) => m[1].trim());
    return found.length ? found : null;
};

function parseTool(fqcn) {
    const name = inherited(fqcn, (cls) => strings(attribute(cls.src, 'Name') ?? '')[0] ?? null);
    const description = inherited(fqcn, (cls) => {
        const raw = attribute(cls.src, 'Description');
        return raw === null ? null : strings(raw).join('');
    });
    const ability =
        inherited(fqcn, (cls) => {
            const r = firstReturn(cls, 'ability');
            return r ? (strings(r.join(' '))[0] ?? null) : null;
        }) ?? 'mcp:read';
    const permissions =
        inherited(fqcn, (cls) => {
            const r = firstReturn(cls, 'permission');
            if (!r) return null;
            const list = r.flatMap((expr) => (expr === 'null' ? [] : strings(expr)));
            return list;
        }) ?? [];
    const admin =
        inherited(fqcn, (cls) => {
            const r = firstReturn(cls, 'requiresOrganizationAdmin');
            return r ? r.includes('true') : null;
        }) ?? false;
    const server = inherited(fqcn, (cls) => {
        const r = firstReturn(cls, 'serverPermission');
        return r ? (strings(r.join(' '))[0] ?? null) : null;
    });
    if (!name) throw new Error(`No #[Name] on ${fqcn}`);
    return {
        name,
        description: (description ?? '').replace(/\s+/g, ' ').trim(),
        ability,
        permissions: [...new Set(permissions)],
        admin,
        server,
        params: parseSchema(fqcn),
    };
}

/* ---- Servers ----------------------------------------------------------- */

const routes = readFileSync(join(app, 'routes', 'ai.php'), 'utf8');
const route = (serverShort) => {
    const m = new RegExp(
        `Mcp::web\\('([^']+)',\\s*${serverShort}::class\\)[\\s\\S]*?throttle:(\\d+),(\\d+)`
    ).exec(routes);
    return m
        ? {
              path: m[1],
              throttle: `${m[2]} requests per ${m[3] === '1' ? 'minute' : `${m[3]} minutes`}`,
          }
        : null;
};

function parseServer(short) {
    const cls = parseClass(join(app, 'app', 'Mcp', 'Servers', `${short}.php`));
    const name = strings(attribute(cls.src, 'Name') ?? '')[0];
    let instructions = '';
    const heredoc = /<<<'INSTRUCTIONS'\n([\s\S]*?)\nINSTRUCTIONS/.exec(cls.src);
    if (heredoc) instructions = heredoc[1];
    const toolsAt = /protected\s+array\s+\$tools\s*=\s*\[/.exec(cls.src);
    const toolClasses = [
        ...balanced(cls.src, toolsAt.index + toolsAt[0].length - 1).matchAll(/(\w+)::class/g),
    ].map((m) => cls.resolveName(m[1]));
    return { short, name, instructions, route: route(short), tools: toolClasses.map(parseTool) };
}

/* ---- Page copy (hand-kept, verified against the app) -------------------- */

/**
 * Who reaches each server. Verified against config/access-control.php and the
 * server classes; re-check here when roles change.
 */
const SERVERS = [
    {
        short: 'CustomerServer',
        slug: 'customer',
        title: 'Customer server — /mcp',
        order: 610,
        purpose:
            'The one URL a customer adds to an AI client. A curated set of ops tools plus three intent tools — plan, execute, follow progress — that deploy a repository in two or three calls. Nothing ops-only, cross-tenant, patching or infrastructure-destroying is registered here.',
        audience:
            'Anyone whose role holds `mcp.access.ops` — the `user` and `member` roles both do. Every tool here is an ops tool or a thin wrapper over one, so it is gated by the ops server permission.',
    },
    {
        short: 'DesignServer',
        slug: 'design',
        title: 'Design server — /mcp/design',
        order: 620,
        purpose:
            'Organisations, teams, projects, environments and blueprints — everything that is decided before anything is provisioned. Nothing on this server provisions anything; its two destructive tools remove records, never infrastructure.',
        audience:
            'Roles holding `mcp.access.design`. Of the customer roles, `user` holds it; `member` does not.',
    },
    {
        short: 'OpsServer',
        slug: 'ops',
        title: 'Ops server — /mcp/ops',
        order: 630,
        purpose:
            'Run and troubleshoot deployments: applications, pipelines, domains, environment variables, logs, health, incidents, promotions, rollbacks, scheduled tasks, caches, backups and object storage attachments.',
        audience: 'Roles holding `mcp.access.ops` — the `user` and `member` roles both do.',
    },
    {
        short: 'PlatformServer',
        slug: 'platform',
        title: 'Platform server — /mcp/platform',
        order: 640,
        purpose:
            'Infrastructure: servers and providers, node bootstrap, cloud servers, the fleet, database and storage servers and what is inside them, adoption from other panels, patching, quotas and billing status.',
        audience:
            'Ops only. Reaching it needs `mcp.access.platform`, which no customer role holds.',
    },
    {
        short: 'ComplianceServer',
        slug: 'compliance',
        title: 'Compliance server — /mcp/compliance',
        order: 650,
        purpose: 'Evidence, access reviews, vulnerabilities, secret rotations and certificates.',
        audience:
            'Ops only. Reaching it needs `mcp.access.compliance`, which no customer role holds.',
    },
];

const ABILITY = {
    'mcp:read': 'read',
    'mcp:write': 'write',
    'mcp:destroy': 'destroy',
};

const esc = (s) => s.replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const firstSentence = (s) => {
    const m = /^(.+?[.!?])(\s|$)/.exec(s);
    return m ? m[1] : s;
};

function render(meta, server, updated) {
    const tiers = ['mcp:read', 'mcp:write', 'mcp:destroy'];
    const counts = Object.fromEntries(
        tiers.map((t) => [t, server.tools.filter((x) => x.ability === t).length])
    );
    const lines = [];
    lines.push('---');
    lines.push(`title: '${meta.title}'`);
    lines.push(
        `description: '${`The ${server.name} MCP server: ${server.tools.length} tools, its endpoint, who can reach it, and every tool with its parameters and token tier.`.replace(/'/g, "''")}'`
    );
    lines.push(`order: ${meta.order}`);
    lines.push(`section: mcp`);
    lines.push(`updated: ${updated}`);
    lines.push(`generated: true`);
    lines.push('---');
    lines.push('');
    lines.push(
        '<!-- GENERATED by scripts/gen-mcp-reference.mjs from the G8Deck application source. Do not edit by hand: re-run `node scripts/gen-mcp-reference.mjs`. -->'
    );
    lines.push('');
    lines.push(meta.purpose);
    lines.push('');
    lines.push('| At a glance | |');
    lines.push('| --- | --- |');
    lines.push(`| **Endpoint** | \`https://g8deck.app${server.route.path}\` |`);
    lines.push(`| **Server name** | \`${server.name}\` |`);
    lines.push(`| **Who can reach it** | ${meta.audience} |`);
    lines.push(
        `| **Authentication** | A personal access token (\`Authorization: Bearer …\`) or OAuth 2.1 sign-in — see [Connect an AI client](/docs/mcp/connect) |`
    );
    lines.push(`| **Route limit** | ${server.route.throttle} |`);
    lines.push(
        `| **Tools** | ${server.tools.length} — ${counts['mcp:read']} read, ${counts['mcp:write']} write, ${counts['mcp:destroy']} destroy |`
    );
    lines.push('');
    lines.push(
        'Every tool needs a token carrying its tier: `mcp:read`, `mcp:write` or `mcp:destroy`, each tier including the ones before it. On top of the route limit, each caller gets 60 read, 20 write and 5 destroy calls a minute. Your role decides which tools answer at all; a tool you can see but lack the permission for answers `permission_denied` and names the permission. Secret and credential values never cross this boundary — tools take them inbound and report key names only.'
    );
    lines.push('');
    lines.push('## All tools');
    lines.push('');
    lines.push('| Tool | Tier | What it does |');
    lines.push('| --- | --- | --- |');
    for (const tool of server.tools) {
        lines.push(
            `| [\`${tool.name}\`](#${tool.name}) | ${ABILITY[tool.ability]} | ${esc(firstSentence(tool.description))} |`
        );
    }
    lines.push('');
    if (server.instructions) {
        lines.push('## What the client is told');
        lines.push('');
        lines.push(
            'The server sends these instructions to every AI client that connects, before any tool is called. They are reproduced verbatim because they carry the reading rules that change what an answer means.'
        );
        lines.push('');
        lines.push('<details class="instructions">');
        lines.push('<summary>Server instructions</summary>');
        lines.push('');
        lines.push('```text');
        lines.push(server.instructions.trim());
        lines.push('```');
        lines.push('');
        lines.push('</details>');
        lines.push('');
    }
    for (const tier of tiers) {
        const tools = server.tools.filter((t) => t.ability === tier);
        if (!tools.length) continue;
        lines.push(
            `## ${{ 'mcp:read': 'Read tools', 'mcp:write': 'Write tools', 'mcp:destroy': 'Destructive tools' }[tier]}`
        );
        lines.push('');
        if (tier === 'mcp:destroy')
            lines.push(
                'Each needs a token carrying `mcp:destroy`, and most also need an identifying value retyped into a confirmation argument. A mismatch is refused and audited.'
            );
        if (tier === 'mcp:destroy') lines.push('');
        for (const tool of tools) {
            lines.push(`### \`${tool.name}\``);
            lines.push('');
            const facts = [`Tier \`${tool.ability}\``];
            if (tool.permissions.length)
                facts.push(`permission ${tool.permissions.map((p) => `\`${p}\``).join(' or ')}`);
            if (tool.admin) facts.push('organisation owner or administrator only');
            lines.push(
                `<p class="tool-meta">${facts.join(' · ').replace(/`([^`]+)`/g, '<code>$1</code>')}</p>`
            );
            lines.push('');
            lines.push(tool.description);
            lines.push('');
            if (tool.params.length) {
                lines.push('| Parameter | Type | Description |');
                lines.push('| --- | --- | --- |');
                for (const p of tool.params) {
                    let desc = p.description;
                    if (p.values?.values.length)
                        desc += `${desc ? ' ' : ''}One of: ${p.values.values.map((v) => `\`${v}\``).join(', ')}${p.values.complete ? '' : ', or another value the server accepts'}.`;
                    lines.push(
                        `| \`${p.name}\`${p.required ? ' <span class="req">required</span>' : ''} | ${esc(p.type)} | ${esc(desc) || '—'} |`
                    );
                }
            } else {
                lines.push('Takes no parameters.');
            }
            lines.push('');
        }
    }
    return lines.join('\n');
}

/* ---- Run --------------------------------------------------------------- */

let updated;
try {
    updated = execFileSync(
        'git',
        ['-C', app, 'log', '-1', '--format=%cs', '--', 'app/Mcp', 'routes/ai.php'],
        {
            encoding: 'utf8',
        }
    ).trim();
} catch {
    updated = new Date().toISOString().slice(0, 10);
}

mkdirSync(outDir, { recursive: true });
const summary = [];
for (const meta of SERVERS) {
    const server = parseServer(meta.short);
    writeFileSync(join(outDir, `${meta.slug}.md`), render(meta, server, updated) + '\n');
    summary.push(
        `${server.route.path.padEnd(16)} ${String(server.tools.length).padStart(3)} tools`
    );
}
// Format like every other page, so `npm run format` never rewrites the output.
execFileSync(
    join(root, 'node_modules', '.bin', 'prettier'),
    ['--write', ...SERVERS.map((meta) => join(outDir, `${meta.slug}.md`))],
    { stdio: 'ignore' }
);

const total = summary.reduce((n, line) => n + Number(/(\d+) tools/.exec(line)[1]), 0);
console.log(summary.join('\n'));
console.log(`${total} tool registrations across ${SERVERS.length} servers → src/docs/mcp/`);
