/**
 * Single source of truth for every piece of copy and structured content on
 * g8deck.com. Sections import from here so the page stays layout-only.
 */

export const site = {
    name: 'G8Deck',
    // Two domains, deliberately: this marketing site is g8deck.com, and
    // g8deck.app is the product itself — the deployed Laravel console, not a
    // page of this site. Keep `url` and `consoleUrl` apart; canonical tags,
    // the sitemap and the Open Graph card all derive from `url`, so pointing
    // it at the console would have this site claim the console's pages.
    domain: 'g8deck.com',
    url: 'https://g8deck.com',
    consoleUrl: 'https://g8deck.app',
    // The tagline is the <title> suffix on every page, so it is written for
    // someone reading a search result, not for someone already sold.
    tagline: 'Deploy on infrastructure you own',
    description:
        'G8Deck deploys and operates your applications on servers you already own — on-premise or in your own cloud. Zero-downtime releases, managed databases, restore-tested backups, security patching and an audit trail, with your applications and data staying on your machines.',
    company: {
        name: 'Developers Hub Sdn Bhd',
        url: 'https://devhub.my',
        country: 'Malaysia',
        /** Printed on the legal pages; the SSM number, old and new format. */
        registration: '202001019928 (1376248-V)',
        city: 'Johor Bahru',
    },
    /** G8Deck is one product in the G8Suite family. */
    suite: {
        name: 'G8Suite',
        url: 'https://g8suite.com',
    },
    social: {
        github: 'https://github.com/developers-hub-my',
    },
    contact: {
        /** One inbox for the whole product family. */
        email: 'hello@devhub.my',
    },
} as const;

/**
 * Build a mailto link with a subject that says which page and which intent it
 * came from — one inbox serves every G8 product, so the subject is what routes
 * it.
 */
export const mailto = (subject: string): string =>
    `mailto:${site.contact.email}?subject=${encodeURIComponent(`[G8Deck] ${subject}`)}`;

/**
 * Fragments are written root-relative (`/#platform`, not `#platform`) because
 * this nav also renders on /docs pages, where a bare fragment would point at
 * an anchor the docs page does not have.
 */
export const nav = [
    { label: 'How it works', href: '/#how' },
    { label: 'Platform', href: '/#operate' },
    { label: 'AI operators', href: '/#ai' },
    { label: 'Compliance', href: '/#compliance' },
    { label: 'Pricing', href: '/#plans' },
    { label: 'Docs', href: '/docs/' },
] as const;

export const hero = {
    eyebrow: 'Servers you own · operated for you',
    title: 'Deploy on servers you own.',
    titleAccent: 'Stop operating them by hand.',
    body: 'G8Deck connects to the machines you already run — in your rack or in your own cloud account — deploys your applications onto them, and keeps doing the operations work afterwards: releases without downtime, databases, restore-tested backups, security patches and an audit trail. Your applications and their data stay on your machines.',
    primaryCta: { label: 'Book a 20-minute demo', href: mailto('Book a 20-minute demo') },
    secondaryCta: { label: 'Read the walkthrough', href: '/docs/first-deployment' },
    /** The hero capture is real console UI with a sample organisation in it. */
    shot: {
        alt: 'Application overview in the G8Deck console: a Laravel app live in production and stopped in staging, its push-to-deploy webhook matching the main branch, two domains with certificate renewal, deploy scripts and its latest releases.',
        caption: 'Console · one application, two environments · sample organisation',
    },
    /* Every figure here is counted from platform/g8deck-app, not estimated:
       DeploymentPipeline::defaultSteps(), SimulatedCapabilities::isAdoptedVm(),
       ComponentTypeSeeder, DatabaseComplianceReporter. The labels are written
       for someone who has not read the docs; the numbers are not rounded. */
    stats: [
        { value: '24', label: 'setup steps, done for you every time' },
        { value: '63', label: 'databases, caches and queues ready to add' },
        { value: '8', label: 'kinds of machine you can use today' },
        { value: '11', label: 'SOC 2 controls, evidence included' },
    ],
} as const;

/**
 * The plain-language answer to "what do I actually do?", placed before the
 * four-noun model so a reader meets the outcome before the vocabulary.
 * `ThreeSteps.astro` draws these; the copy stays here.
 */
export const howItWorks = {
    eyebrow: 'How it works',
    title: 'Three steps, then it looks after itself.',
    lede: 'No migration project. No rewrite. The machine you already run is the machine it deploys to.',
    steps: [
        {
            number: '01',
            title: 'Point it at your machine',
            body: 'A server in your building, or a VM in your own cloud account. G8Deck takes it as it is — nothing is wiped and nothing is moved.',
        },
        {
            number: '02',
            title: 'Describe the architecture',
            body: 'Start from a ready-made setup or draw your own. You describe the shape of the system; you do not write deployment scripts.',
        },
        {
            number: '03',
            title: 'It runs, and keeps running',
            body: 'G8Deck builds it, then stays on it — watching, scaling, fixing what slips, and keeping a record your auditor can read.',
        },
    ],
} as const;

/** The four-noun mental model, rendered as the chain in the "Platform" section. */
export const model = [
    {
        term: 'Blueprint',
        summary: 'The desired architecture — layers, components, connections and scaling rules.',
        detail: 'Blueprints hold no provider-specific fields, which is what makes the same blueprint deploy to bare metal, VMware, a Kubernetes cluster or your own cloud account without edits.',
    },
    {
        term: 'Deployment',
        summary:
            'One realisation of a blueprint: nodes, workloads and managed services under one desired state.',
        detail: 'Every deployment records the state it is supposed to be in, so drift is a measurable difference rather than a surprise.',
    },
    {
        term: 'Environment',
        summary: 'Dev, staging, production or DR — each isolated, each promotable into the next.',
        detail: 'Promotion pins the exact image tags the source environment is running, so what passed the checks is what gets deployed.',
    },
    {
        term: 'InfraProvider',
        summary:
            'Where it actually runs. Bare metal, Proxmox, VMware, KVM, Kubernetes, Swarm, Nomad or a public cloud.',
        detail: 'Providers sit behind one contract, talk over SSH and REST, and are swappable without touching the blueprint.',
    },
] as const;

/** Problem section: the heading, the comparison table and the four cards. */
export const problem = {
    eyebrow: 'Why this exists',
    title: 'Your systems. Your servers. Your data.',
    lede: 'Banks, ministries, GLCs and universities cannot put sensitive systems and data on someone else’s cloud. Most PaaS platforms ask you to. G8Deck runs on your own infrastructure — on-premise or private cloud — so your IT team can deploy, manage and monitor applications without giving up control.',
    columns: { theirs: 'Most PaaS platforms', ours: 'G8Deck' },
    assumptions: [
        {
            theirs: 'Your data goes to their cloud, in their region',
            ours: 'Your data stays on your servers, in the country you choose',
        },
        {
            theirs: 'One language and one way of running it',
            ours: 'Your runtime, on your own server, in the layout you already use',
        },
        {
            theirs: 'Setting up the server is the whole job',
            ours: 'Scaling, drift checks, promotion, rollback and audit evidence keep running after setup',
        },
        {
            theirs: 'Compliance is your problem',
            ours: 'The platform enforces the controls and exports the evidence when you need it',
        },
        {
            theirs: 'The internet is always available',
            ours: 'It runs on your own network, even with no internet access',
        },
    ],
} as const;

export const problems = [
    {
        title: 'Platforms that support one language',
        body: 'Many platforms only run one kind of web app. G8Deck installs what your application needs on your own server and runs it as a normal service — PHP and Node today, on any machine you can reach over SSH.',
    },
    {
        title: 'Setting up a server is only the start',
        body: 'Installing a server is the easy part. Scaling, drift checks, promotion, rollback and audit evidence are the hard part, and they never stop.',
    },
    {
        title: 'Kubernetes should not be the only option',
        body: 'You should not need a thousand lines of YAML to describe your servers. A blueprint describes the layout in one place, and you do not have to run a cluster to use it.',
    },
    {
        title: 'Data that cannot leave the country',
        body: 'Regulated industries, government agencies and GLCs cannot run on a control plane hosted abroad. G8Deck runs inside your network, on servers you already own.',
    },
] as const;

export const pipeline = {
    title: 'Twenty-four steps. Resumable. Idempotent.',
    body: 'Provisioning runs as one ordered pipeline. Every step is idempotent, every step has a rollback, and pipeline state is persisted per step — so a failure at step 13 resumes at step 13 instead of starting over or leaving orphaned resources behind.',
    /** The illustration ships mid-run: everything before this is done, this one is in flight. */
    runningStep: 13,
    groups: [
        {
            phase: 'Admit',
            steps: [
                {
                    name: 'Validate blueprint',
                    note: 'Resolve components, reject impossible topologies',
                },
                {
                    name: 'Assign preview domains',
                    note: 'A platform hostname, before anything checks for one',
                },
                {
                    name: 'Preflight workloads',
                    note: 'Warn on what cannot be reached or built, before it is',
                },
                { name: 'Check quota', note: 'Fail fast before anything is created' },
                {
                    name: 'Reserve resources',
                    note: 'Claim CPU, memory and storage against the quota',
                },
            ],
        },
        {
            phase: 'Foundation',
            steps: [
                { name: 'Bootstrap nodes', note: 'Provider driver creates and prepares hosts' },
                { name: 'Provision networks', note: 'Segments, subnets, internal addressing' },
                { name: 'Apply firewall policies', note: 'Default-deny, per-layer allow rules' },
            ],
        },
        {
            phase: 'Services',
            steps: [
                {
                    name: 'Provision managed services',
                    note: 'Databases, caches, queues, object storage',
                },
                { name: 'Provision compute nodes', note: 'Runtime hosts for the workload layers' },
                { name: 'Configure load balancer', note: 'Listeners and backends' },
                { name: 'Configure reverse proxy', note: 'Virtual hosts and upstreams' },
            ],
        },
        {
            phase: 'Trust',
            steps: [
                { name: 'Register service discovery', note: 'Internal names for every component' },
                {
                    name: 'Issue internal certificates',
                    note: 'Internal CA, mTLS everywhere — enforced',
                },
                {
                    name: 'Provision mail sandbox',
                    note: 'Captured mailbox, so a first boot cannot email real people',
                },
                { name: 'Inject secrets', note: 'Vault-backed, resolved at provision time' },
            ],
        },
        {
            phase: 'Workload',
            steps: [
                { name: 'Deploy workloads', note: 'Git repo, registry image or compose' },
                { name: 'Run health checks', note: 'Gate the release on real liveness' },
                {
                    name: 'Install applications',
                    note: 'Ready-made app installers run against the live instance',
                },
                { name: 'Configure observability', note: 'Metrics, logs, traces, alert rules' },
            ],
        },
        {
            phase: 'Publish',
            steps: [
                { name: 'Configure DNS', note: 'Records created through the DNS contract' },
                { name: 'Issue SSL', note: 'ACME HTTP-01, custom PEM or self-signed' },
                { name: 'Record desired state', note: 'The baseline drift is measured against' },
                { name: 'Notify', note: 'Deployment result to the people who care' },
            ],
        },
    ],
} as const;

export const tokenExample = {
    caption: 'No hardcoded addresses. Ever.',
    body: 'Workload environment variables are written as tokens and resolved after provisioning, from the service registry and the secret vault — so the same blueprint is correct on every provider and every environment.',
    lines: [
        { key: 'DB_CONNECTION', value: '{{ postgres.connection_string }}' },
        { key: 'REDIS_HOST', value: '{{ redis.internal_ip }}' },
        { key: 'PROXY_UPSTREAM', value: '{{ haproxy.internal_ip }}' },
        { key: 'APP_KEY', value: '{{ vault.app_key }}' },
    ],
} as const;

export const capabilities = [
    {
        title: 'Autoscaling that watches real telemetry',
        body: 'Node agents report utilisation as a normalised fraction; the scaling engine evaluates each active layer against its thresholds and adds or removes nodes on a schedule you set.',
        tag: 'Scaling',
    },
    {
        title: 'Drift detection and reconciliation',
        body: 'Actual state is compared against the recorded desired state on a cycle. Differences surface as drift you can inspect, then reconcile deliberately.',
        tag: 'Lifecycle',
    },
    {
        title: 'Environment promotion with real gates',
        body: 'Health and drift checks must pass; manual approval and test gates are created only when the pipeline demands them. Promotion carries the image tags forward, not just the config.',
        tag: 'Release',
    },
    {
        title: 'Rollback that picks the right version',
        body: 'The rollback engine excludes every image tag involved in a previous rollback, so "the last good release" never means the version you just abandoned.',
        tag: 'Release',
    },
    {
        title: 'Secrets encrypted end to end',
        body: 'Encrypted at rest in G8Deck’s own vault — no external secret service to stand up first — rotated on schedule, resolved into workloads at deploy time and redacted out of every log line.',
        tag: 'Security',
    },
    {
        title: 'Observability wired in, not bolted on',
        body: 'Prometheus, Grafana, Loki, Tempo and Jaeger provision as components of the deployment itself. The pipeline records scrape targets per deployment, and alert rules are evaluated against health samples collected every minute.',
        tag: 'Operations',
    },
    {
        // Organization::isAdministeredBy() gates every org-infrastructure
        // policy (InfraProvider, DatabaseServer, StorageServer, ManagedCache,
        // Backup*, ResourceQuota); TeamRole is lead / member / viewer.
        title: 'Your organisation decides; teams run the applications',
        body: 'Connecting servers, creating database, storage and cache servers, restoring backups and setting quotas belong to the organisation’s owner and administrators. Inside it, team leads, members and viewers decide who may change which application. Quotas resolve from the tightest of organisation, team and user, so provisioning fails before it starts.',
        tag: 'Governance',
    },
    {
        title: 'Immutable audit trail',
        body: 'Every platform action is written once and never updated or deleted, retained for at least a year, and linked to the compliance evidence it supports.',
        tag: 'Governance',
    },
] as const;

export const componentMatrix = [
    {
        group: 'Networking',
        items: [
            'HAProxy',
            'Nginx',
            'Caddy',
            'Traefik',
            'Kong',
            'Envoy',
            'Keepalived',
            'Cloudflare',
            'WireGuard',
        ],
    },
    {
        group: 'Compute',
        items: ['PHP-FPM', 'Gunicorn', 'uWSGI', 'Puma', 'Soketi', 'Reverb'],
    },
    {
        group: 'Database',
        items: [
            'MySQL',
            'PostgreSQL',
            'MariaDB',
            'MongoDB',
            'InfluxDB',
            'Elasticsearch',
            'OpenSearch',
            'Meilisearch',
            'ClickHouse',
            'Neo4j',
        ],
    },
    {
        group: 'Cache',
        items: ['Redis', 'Redis Cluster', 'Redis Sentinel', 'Memcached', 'Varnish'],
    },
    {
        group: 'Queue & stream',
        items: ['RabbitMQ', 'Kafka', 'NATS', 'ActiveMQ'],
    },
    {
        group: 'Storage',
        items: ['MinIO', 'Ceph RGW', 'NFS', 'GlusterFS', 'iSCSI'],
    },
    {
        group: 'Observability',
        items: ['Prometheus', 'Grafana', 'Loki', 'ELK', 'Tempo', 'Jaeger', 'Uptime Kuma', 'Nadi'],
    },
    {
        group: 'Identity & secrets',
        items: ['Keycloak', 'Authentik', 'LDAP / AD', 'Infisical', 'HashiCorp Vault'],
    },
    {
        group: 'Registry',
        items: ['Harbor', 'Gitea', 'GitLab Runner', 'Nexus'],
    },
    {
        group: 'Orchestration',
        items: ['Kubernetes', 'k3s', 'Docker Swarm', 'Nomad', 'Proxmox', 'VMware', 'KVM'],
    },
] as const;

/**
 * Three states, because two could not tell the truth any more.
 *
 * `shipped` is what a customer can deploy onto today: a machine somebody
 * already created, reached over SSH. `SimulatedCapabilities::isAdoptedVm()`
 * is the list, and `DriverResolver` hands every one of them the real
 * SshProviderDriver once it has credentials.
 *
 * `unreleased` is the container side — Docker, Docker Swarm and K8s/K3s,
 * which share drivers that work. They are finished code held behind a
 * release decision, which is a different thing from unfinished code and is
 * labelled differently.
 *
 * `modelled` is what is genuinely not there. Proxmox has a 356-line driver
 * on disk and `driverClass()` still resolves it to the Fake pair, so nothing
 * deploys onto it; Nomad has no driver at all. Never move a name up before
 * `driverClass()` names its driver AND the release ships.
 */
export const providers = {
    shipped: ['Bare metal', 'VMware', 'KVM', 'AWS', 'GCP', 'Azure', 'Hetzner', 'DigitalOcean'],
    unreleased: ['Docker', 'Docker Swarm', 'Kubernetes', 'k3s'],
    modelled: ['Proxmox', 'Nomad'],
} as const;

/**
 * The two deployment modes, compared property by property. Rows read across:
 * `values` is index-aligned with `columns`. Several rows are deliberately
 * identical in both columns — what does *not* change is the point.
 */
export const deployment: {
    columns: readonly { name: string; featured?: boolean }[];
    rows: readonly { label: string; values: readonly string[] }[];
    commercial: { label: string; values: readonly string[] };
    note: string;
} = {
    columns: [{ name: 'SaaS' }, { name: 'On-Premise', featured: true }],
    rows: [
        {
            label: 'Control plane',
            values: ['Hosted by Developers Hub', 'Yours — Docker Compose'],
        },
        {
            label: 'Workloads and data',
            values: ['Yours', 'Yours'],
        },
        {
            label: 'Providers',
            values: ['Your providers, your accounts', 'Your providers, your accounts'],
        },
        {
            label: 'Database',
            values: ['Managed for you', 'MySQL, MariaDB, PostgreSQL or MSSQL'],
        },
        {
            label: 'Identity',
            values: ['Built-in accounts, or SSO', 'Built-in accounts, or SSO'],
        },
        {
            label: 'Upgrades',
            values: ['Managed, on our schedule', 'Yours, on your schedule'],
        },
        {
            label: 'Network posture',
            values: [
                'Control plane reached over the internet',
                'Control plane never leaves your network',
            ],
        },
    ],
    commercial: {
        label: 'Commercial',
        values: ['Subscription + usage', 'Licence + support, per installation'],
    },
    note: 'Both modes run the same build. On-premise adds nothing to operate that the platform does not already carry — the internal CA, the certificate issuer and the secret vault are all part of it, not services you stand up alongside it.',
};

export const compliance = {
    title: 'Compliance is a schema, not a slide',
    body: 'Controls map to concrete audit and configuration evidence, exportable on demand. The platform enforces the parts that cannot be left to policy.',
    controls: [
        {
            code: 'CC6',
            name: 'Logical access',
            detail: 'Organisation owners and administrators hold the infrastructure; team leads, members and viewers hold the applications. Two-factor authentication, scheduled access reviews',
        },
        {
            code: 'CC7',
            name: 'System monitoring',
            detail: 'Alert rules and incident records over an audited access trail',
        },
        {
            code: 'CC8',
            name: 'Change management',
            detail: 'Drift detection plus a fully audited deployment pipeline',
        },
        {
            code: 'A1',
            name: 'Availability',
            detail: 'Health checks, autoscaling and automatic rollback on degradation',
        },
        {
            code: 'C1',
            name: 'Confidentiality',
            detail: 'AES-256-CBC at rest, mTLS in transit from an internal CA the platform issues itself',
        },
    ],
    guarantees: [
        'Evidence maps to SOC 2, ISO 27001, PDPA and GDPR from the same audit trail',
        'Every pipeline step and drift detection is recorded as change-management evidence',
        'Audit and activity records are retained for at least a year',
        'Secrets and PII scrubbed from logs before they are written',
        // Compliance/DataResidency — enforced at deployment time against the
        // provider's recorded location.
        'PDPA data residency: set the regions an organisation allows and every deployment is checked against them — a server with no recorded location counts as a violation, not a pass',
    ],
} as const;

interface PlanTier {
    name: string;
    /** Who the tier is for — shown under the name. */
    for: string;
    /** List price exactly as it renders; `period` carries the unit. */
    price: string;
    period: string;
    points: readonly string[];
    featured?: boolean;
}

/**
 * Prices and capacity are the live figures from the console's own plan
 * settings (Admin > Settings > Plans), which overlay `config/plans.php` — the
 * settings row is the authority, not the file. Change one and change the
 * other, or the site quotes a number no customer is ever charged.
 *
 * Tiers differ by capacity alone: the entitlement schema holds servers,
 * members (stored as `seats`: every active person in the organisation),
 * deployments (labelled "app environments": one application in one
 * environment — deploys and releases never count) and cores-per-server, and
 * no feature flag. How many organisations one person may own is a platform
 * setting (3) that a plan may raise; no plan does today, so the Starter card
 * states the default and the others say nothing. MFA, the audit trail, mTLS
 * and encryption at rest are never tier-gated — selling compliance as an
 * upsell is what disqualifies a tender.
 */
export const plans: {
    title: string;
    body: string;
    note: string;
    tiers: readonly PlanTier[];
} = {
    title: 'Plans that scale with the estate, not the head count',
    body: 'Every tier gets the full pipeline, every provider driver and the complete audit trail. What changes is capacity — servers, members and app environments — never whether the platform will let you prove a control.',
    note: 'A server is one machine, not one container — fifty containers on one Docker host count as one. An app environment is one application in one environment (e.g. production); deploys and releases are unlimited on every tier. Priced tiers are hosted and billed monthly; running the control plane on your own network is Enterprise.',
    tiers: [
        {
            name: 'Starter',
            for: 'A first production deployment',
            price: '$5',
            period: 'USD / month',
            points: [
                '2 servers',
                '1 member — the owner; invite people on Growth',
                '10 app environments (≈ 5 apps with dev + production)',
                'Unlimited deploys and releases',
                'Up to 3 organisations per account',
            ],
        },
        {
            name: 'Growth',
            for: 'Teams running several environments',
            price: '$15',
            period: 'USD / month',
            points: [
                '50 servers',
                '10 members',
                'Unlimited app environments',
                'Unlimited deploys and releases',
            ],
        },
        {
            name: 'Business',
            featured: true,
            for: 'Multi-project engineering organisations',
            price: '$49',
            period: 'USD / month',
            points: [
                '100 servers',
                '30 members',
                'Unlimited app environments',
                'Unlimited deploys and releases',
            ],
        },
        {
            // The only tier that can be bought two ways, which is why the
            // on-premise ladder is not a section of its own: a customer who
            // needs the control plane inside their perimeter is already in
            // this conversation, and the licence figures belong in the quote
            // rather than on the page.
            name: 'Enterprise',
            for: 'Regulated, government and GLC estates',
            price: 'Negotiated',
            period: 'Hosted or on-premise',
            points: [
                'Unlimited servers, members and app environments',
                'Unlimited deploys and releases',
                'No cap on cores per server',
                'On-premise licence — the control plane runs on your own network, air-gapped if it has to',
                'SOC 2, ISO 27001, PDPA and GDPR evidence export',
            ],
        },
    ],
};

/**
 * Two rules this list is written under.
 *
 * It never names the stack G8Deck itself is built in. A prospect asking what
 * they may deploy is asking about their code, and answering with ours only
 * invites the conclusion that the platform is opinionated about a framework
 * it is not opinionated about.
 *
 * And "shipped" means released and proven on a live deployment, not present
 * in the code. Today that is one path: a machine somebody already created,
 * adopted over SSH, running the application natively. PHP and Node are proven
 * on it; Python, Go and static builds have recipes and presets and have not
 * completed a live deployment. Container delivery has working drivers and is
 * held for beta. Naming each gap here is cheaper than having it found during
 * an evaluation.
 */
export const faqs = [
    {
        q: 'Which languages and frameworks can I deploy?',
        a: 'G8Deck installs the toolchain on the server itself and runs your application as an ordinary service. PHP and Node.js are proven end to end today, with presets for Laravel, Symfony, Next.js, Astro and plain Node. Python, Go and static sites are built and have not yet completed a live deployment; we will keep saying so until they have. Container delivery, where the image is the only contract and the language stops mattering, has working drivers and is held for beta.',
    },
    {
        q: 'Do I have to containerise anything?',
        a: 'No — and today there is nothing to opt into. Your application runs as a systemd service behind nginx: a git push, a build on the node, a release directory and an atomic switch into it. Container delivery will be an option when it is released, never a requirement.',
    },
    {
        q: 'Does the same blueprint really run on different infrastructure?',
        a: 'Yes, by construction. Blueprints carry no provider-specific fields, and every provider sits behind one driver contract. Moving a deployment from a machine in your rack to one at a cloud host is a change of provider, not a change of blueprint.',
    },
    {
        q: 'What happens when provisioning fails halfway?',
        a: 'Pipeline state is persisted per step. Every step is idempotent and has a rollback, so you resume from the failed step rather than restarting — and a partial failure does not leave orphaned resources behind.',
    },
    {
        q: 'Which infrastructure can it actually run on today?',
        a: 'Any machine you can reach over SSH. You bring the server and G8Deck bootstraps and drives it, whether it sits on bare metal, VMware, KVM, AWS, GCP, Azure, Hetzner or DigitalOcean. The container backends — Docker, Docker Swarm, Kubernetes and k3s — have working drivers and are held for beta. Proxmox and Nomad are modelled in the registry and their drivers are unfinished. We would rather say so than let you find out during an evaluation.',
    },
    {
        q: 'Can I bring a server that already exists?',
        a: 'Yes — that is the main way in. You point G8Deck at a machine you already run, it bootstraps the stack over SSH and takes over the lifecycle from there. With a DigitalOcean account connected it can also create the server for you, in your account and on your bill. Your existing Kubernetes cluster becomes a target the same way once container delivery is released.',
    },
    {
        // RunCloudSource + PlainNginxSource; MigrateAdoptionDataTool (#760)
        // refuses PostgreSQL sources and remote databases.
        q: 'We run our sites on RunCloud today. What does moving look like?',
        a: 'Connect the server and G8Deck reads what is on it — sites, PHP versions, cron jobs, certificates — without changing anything. You decide what to adopt. For each application it copies a MySQL or MariaDB database and the directories the app writes to onto the G8Deck application that replaces it, checking row counts and file counts on both sides, and the final sync can put the old site into maintenance first. PostgreSQL sources are not migrated yet.',
    },
    {
        q: 'Can an AI agent break production through the MCP servers?',
        a: 'Not by being clever. A token carries a ceiling — read, write or destroy — and can never exceed the role of the person who made it. Destructive tools need the target retyped, data-moving writes default to a dry run, and the same policies that gate the console gate every tool call. Secrets go in and never come back out.',
    },
    {
        q: 'Which database does the platform itself need?',
        a: 'Whichever you already run. G8Deck supports MySQL, MariaDB, PostgreSQL and MSSQL, and behaves identically on all four. The secret vault is part of the platform, so there is no external secret service to stand up alongside it.',
    },
    {
        q: 'Can a team deploy onto our servers without being handed the servers?',
        a: 'Yes. Servers, database, storage and cache servers, backups and the credentials behind them belong to the organisation, and only its owner and administrators can connect, change or reveal them. A team member deploys onto those servers and manages the applications they created; a team lead manages every application in the team and approves promotions — never their own request. The console and the MCP servers enforce the same rules.',
    },
    {
        q: 'Is there a read-only role for auditors or examiners?',
        a: 'Yes — viewer. A viewer on a team sees its projects, applications and deployments and can change none of them: no deploy, no restart, no revealed credential, whether they try from the console or through the API. People only see the teams they belong to; organisation owners and administrators see all of them.',
    },
    {
        q: 'Can people still use their own servers?',
        a: 'Yes. Every account gets a personal organisation at sign-up, which they own and can connect their own servers to. Being invited into yours adds to that rather than replacing it. An invitation is sent to an email address, carries the role it grants and expires after seven days; the person accepts it signed in with that address.',
    },
    {
        q: 'Do pushes count against my plan?',
        a: 'No. A plan counts app environments — one application in one environment, such as production — and deploys and releases are unlimited on every tier. A launch that failed without ever holding a server does not count either.',
    },
    {
        q: 'How does billing work, and can I cancel?',
        a: 'Self-serve plans are billed monthly in USD, paid by card through Stripe, and start with a free trial that needs no card. Cancel whenever you like: you keep access to the end of the period you have paid for, and there is no refund for the unused part of a month. A charge made in error is refunded in full.',
        more: { label: 'Refund and cancellation policy', href: '/legal/refund-policy' },
    },
] as const;

export const footerLinks = [
    {
        heading: 'Platform',
        links: [
            { label: 'How it works', href: '/#how' },
            { label: 'What it operates', href: '/#operate' },
            { label: 'Provisioning pipeline', href: '/#pipeline' },
            { label: 'AI operators', href: '/#ai' },
            { label: 'Components and providers', href: '/#components' },
            { label: 'Docs', href: '/docs/' },
        ],
    },
    {
        heading: 'Deployment',
        links: [
            { label: 'SaaS', href: '/#deployment' },
            { label: 'On-premise', href: '/#deployment' },
            { label: 'Plans', href: '/#plans' },
        ],
    },
    {
        heading: 'Trust',
        links: [
            { label: 'Compliance', href: '/#compliance' },
            { label: 'Security model', href: '/#compliance' },
            { label: 'FAQ', href: '/#faq' },
            { label: 'Terms of Service', href: '/legal/terms' },
            { label: 'Privacy Notice', href: '/legal/privacy' },
            { label: 'Refund policy', href: '/legal/refund-policy' },
        ],
    },
    {
        heading: 'Company',
        links: [
            { label: 'Developers Hub', href: site.company.url },
            { label: 'G8Suite', href: site.suite.url },
            { label: 'GitHub', href: site.social.github },
            { label: 'Sales enquiry', href: mailto('Sales enquiry') },
            { label: 'Support', href: mailto('Support request') },
        ],
    },
] as const;

/**
 * "What it operates for you" — the work that used to be runbooks. Each card is
 * a shipped surface in g8deck-app, not a roadmap item; the comment above each
 * names where it was checked. A card that cannot point at code does not belong
 * here — it belongs under a roadmap heading.
 */
export const operate = {
    eyebrow: 'What it operates',
    title: 'The operations work, done by the platform.',
    lede: 'Most tools stop once nginx is installed. These are the jobs that start after that — each one shipped, each one on the machines you already run.',
    items: [
        {
            // Migration/Sources/{RunCloudSource,PlainNginxSource}; discovery
            // writes nothing (#502); MigrateAdoptionDataTool refuses PostgreSQL.
            tag: 'Adopt',
            title: 'Bring the servers you already run',
            body: 'Point it at a RunCloud or plain-nginx server and it inventories the sites, PHP versions, cron jobs and certificates without writing to the machine. Adopt what you choose; a MySQL or MariaDB database and the upload directories copy across with row and file counts checked on both sides.',
        },
        {
            // DatabaseEngine + DatabaseServer/Dialects; DatabaseClusterMode::Replicated;
            // CacheEngine (Redis, Valkey); StorageEngine::Garage, G311.
            tag: 'Data',
            title: 'Databases, caches and buckets on your own machines',
            body: 'Install PostgreSQL, MySQL, MariaDB, MongoDB or ClickHouse and manage databases, users and grants from the console. PostgreSQL adds read replicas with lag and manual promotion. Redis or Valkey for caching; Garage for S3-compatible storage, up to a three-way replicated cluster.',
        },
        {
            // SystemdWorkloadRuntime implements BlueGreenRuntimeContract (#462);
            // push-to-deploy webhooks; runtime version detected from the repo (#755).
            tag: 'Release',
            title: 'Releases that never close the port',
            body: 'Push to the branch and the new release builds and starts beside the one serving. Traffic moves only once it is up, and requests in flight finish where they started — no containers required. The runtime version is read from your repository.',
        },
        {
            // BackupSubject, BackupVerifyLevel, BackupDestinationDriver,
            // BackupPolicy::next_drill_at (#444).
            tag: 'Backup',
            title: 'Backups you have actually restored',
            body: 'Databases, applications, buckets and whole servers, on a schedule, to G8Deck storage, your own S3 bucket or Google Drive. Every run is verified — integrity, readability or a full restore — and scheduled restore drills prove a backup comes back before the day you need it.',
        },
        {
            // PatchPolicyMode (automatic, notify_only, manual), patch-fleet,
            // advisories (#728, #729), docs/04-deployment/07-fleet-patching.md.
            tag: 'Patch',
            title: 'Security patches, canary first',
            body: 'A patch policy decides: automatic, notify only, or manual. PHP, nginx, Node.js, databases and OS security updates go to one canary server, then the rest — with a record of what moved and which servers still need a restart.',
        },
        {
            // Team server allocation (#715, G298); move-project-to-organization
            // (#757, #769) — dry_run defaults to true.
            tag: 'Govern',
            title: 'Teams get servers, not root passwords',
            body: 'Administrators decide which servers each team may deploy to; members deploy without ever seeing a credential. A project — and the infrastructure only it uses — moves to another organisation in one step, after a dry run that lists every row.',
        },
    ],
} as const;

/**
 * Real console captures. They show a SAMPLE organisation ("Northwind Bhd")
 * seeded for the docs, and the captions say so, so nobody reads them as a
 * customer. The files are the docs captures from public/docs/console, copied
 * into src/assets/screens so Astro serves them as responsive WebP.
 */
export const tour = {
    eyebrow: 'The console',
    title: 'The rollout, the architecture and the alarms, in one place.',
    lede: 'Real screens from the console. The organisation in them is sample data.',
    shots: [
        {
            file: 'deployment-overview',
            title: 'A deployment, step by step',
            caption:
                'Every pipeline step with its duration. A step that did no work says so, and says why — in amber, never as a green tick.',
            alt: 'Deployment overview in the G8Deck console: two of two nodes running, two managed services, and the 24-step pipeline with completed steps ticked and two steps marked "did no work" with the reason printed beneath each.',
        },
        {
            file: 'blueprint-detail',
            title: 'A blueprint',
            caption:
                'The architecture as layers and connections — edge, app, workers, database, cache — with replica bounds.',
            alt: 'Blueprint detail in the G8Deck console: six layers from Edge to Cache, each with its components and replica range, and the directed connections between them.',
        },
        {
            file: 'incidents',
            title: 'Incidents',
            caption:
                'Alert rules fire into one queue, each moved through detected, acknowledged, contained and resolved.',
            alt: 'Incidents list in the G8Deck console: alerts ranked P1 to P3 with the deployment each belongs to and its lifecycle state.',
        },
    ],
} as const;

/**
 * The MCP surface. Tool counts are the `$tools` arrays in app/Mcp/Servers/*
 * on g8deck-app main; paths from routes/ai.php. Platform and Compliance need
 * `mcp.access.platform` / `mcp.access.compliance`, which no customer role
 * holds — the page says so rather than let a reader add the counts up.
 */
export const ai = {
    eyebrow: 'AI operators',
    title: 'Let an AI client do the routine — inside the same rules.',
    lede: 'Five MCP servers give an AI client the console’s own actions, over OAuth 2.1 or a personal access token. A token can be narrower than the person who made it, never wider, and every call meets the same policies a click does.',
    servers: [
        {
            path: '/mcp',
            tools: 21,
            name: 'Customer',
            body: 'Plan, launch and watch your own applications.',
            restricted: false,
        },
        {
            path: '/mcp/design',
            tools: 21,
            name: 'Design',
            body: 'Blueprints, projects, environments and members.',
            restricted: false,
        },
        {
            path: '/mcp/ops',
            tools: 78,
            name: 'Operations',
            body: 'Deployments, releases, domains, backups and incidents.',
            restricted: false,
        },
        {
            path: '/mcp/platform',
            tools: 62,
            name: 'Platform',
            body: 'Servers, database and storage clusters, adoption, patching.',
            restricted: true,
        },
        {
            path: '/mcp/compliance',
            tools: 12,
            name: 'Compliance',
            body: 'Evidence, access reviews, vulnerabilities, certificates.',
            restricted: true,
        },
    ],
    restrictedNote: 'Operator-only — no customer role is granted these two servers.',
    rules: [
        'Destructive tools need the target retyped and a token allowed to destroy.',
        'Writes that move data default to a dry run that lists every change first.',
        'Secrets travel inbound only — tools name the keys and never return a value.',
        'A skipped step is reported as skipped, never as a success.',
    ],
    shot: {
        alt: 'MCP Tokens page in the G8Deck console: a newly created token shown once, the claude mcp add commands for the design and operations servers, and a form to generate a read-only token.',
        caption: 'Console · MCP tokens, shown once · sample organisation',
    },
} as const;

/** Photography — every credit and licence is in src/assets/photos/CREDITS.md. */
export const photos = {
    serverBays: {
        alt: 'Close-up of a rack server’s front panel: a row of hot-swap drive bays, each with a lit status light.',
        credit: 'Photo · Domaintechnik / Unsplash',
    },
    dataCentre: {
        alt: 'A data centre floor with rows of server cabinets under blue cable trays.',
        credit: 'Photo · Taylor Vick / Unsplash',
    },
    engineer: {
        alt: 'An engineer seen from behind, working in a terminal on a laptop at night.',
        credit: 'Photo · Chirayu Trivedi / Unsplash',
    },
    /** Decorative backdrop behind the closing CTA, so it carries no alt. */
    network: {
        credit: 'Photo · Albert Stoynov / Unsplash',
    },
} as const;
