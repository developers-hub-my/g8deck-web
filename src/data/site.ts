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
        'G8Deck deploys and runs your applications on servers you already own — on-premise or in your own cloud. Provisioned, scaled, reconciled and audited, with nothing to rewrite and no data leaving the building.',
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
    { label: 'Platform', href: '/#platform' },
    { label: 'Compliance', href: '/#compliance' },
    { label: 'Pricing', href: '/#plans' },
    { label: 'Docs', href: '/docs' },
] as const;

export const hero = {
    eyebrow: 'Deploy on servers you already own',
    title: 'Your architecture,',
    titleAccent: 'running on your own servers.',
    body: 'Point G8Deck at a machine you already have. It sets the whole system up, keeps it running, and nothing ever leaves your building.',
    primaryCta: { label: 'Book a 20-minute demo', href: mailto('Book a 20-minute demo') },
    secondaryCta: { label: 'See how it works', href: '/#how' },
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

export const problems = [
    {
        title: 'PaaS that only speaks one language',
        body: 'Single-stack platforms cover the web tier and abandon everything else. G8Deck installs the toolchain on your own server and runs the application as an ordinary service — PHP and Node today, on any machine you can reach over SSH.',
    },
    {
        title: 'Server setup mistaken for lifecycle',
        body: 'Provisioning a box is the easy part. Scaling, drift reconciliation, promotion, rollback and evidence are the part that keeps you up at night.',
    },
    {
        title: 'Kubernetes as the only serious option',
        body: 'Topology should be a first-class object, not a thousand lines of YAML. Blueprints give you the abstraction without handing you a cluster to babysit.',
    },
    {
        title: 'Data that cannot leave the country',
        body: 'Regulated industry, government and GLC workloads cannot sit on foreign hosted control planes. G8Deck runs inside your perimeter, on infrastructure you already own.',
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
        a: 'Any machine you can reach over SSH. Machines are adopted, not created — you bring the server and G8Deck bootstraps and drives it, whether it sits on bare metal, VMware, KVM, AWS, GCP, Azure, Hetzner or DigitalOcean. The container backends — Docker, Docker Swarm, Kubernetes and k3s — have working drivers and are held for beta. Proxmox and Nomad are modelled in the registry and their drivers are unfinished. We would rather say so than let you find out during an evaluation.',
    },
    {
        q: 'Can I bring a server that already exists?',
        a: 'That is the only way in today. G8Deck does not create machines — you point it at one you already run, it bootstraps the stack over SSH and takes over the lifecycle from there. Your existing Kubernetes cluster becomes a target the same way once container delivery is released.',
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
            { label: 'How it works', href: '/#platform' },
            { label: 'Provisioning pipeline', href: '/#pipeline' },
            { label: 'Components', href: '/#components' },
            { label: 'Providers', href: '/#components' },
            { label: 'Documentation', href: '/docs' },
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
