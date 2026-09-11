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
    tagline: 'Architecture-first infrastructure deployment',
    description:
        'G8Deck turns an architecture blueprint into running infrastructure — provisioned, scaled, reconciled and audited on your own hardware or your own cloud.',
    company: {
        name: 'Developers Hub Sdn Bhd',
        url: 'https://devhub.my',
        country: 'Malaysia',
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

export const nav = [
    { label: 'Platform', href: '#platform' },
    { label: 'Pipeline', href: '#pipeline' },
    { label: 'Components', href: '#components' },
    { label: 'Deployment', href: '#deployment' },
    { label: 'Compliance', href: '#compliance' },
    { label: 'Plans', href: '#plans' },
] as const;

export const hero = {
    eyebrow: 'Architecture-first infrastructure platform',
    title: 'Describe the architecture.',
    titleAccent: 'Ship the infrastructure.',
    body: 'G8Deck takes an architecture blueprint — three-tier, HA cluster, microservices — and provisions, operates, scales and reconciles the whole system on infrastructure you control. On-premise or in your own cloud. Point it at a server you already have and your application runs there natively — nothing to containerise.',
    primaryCta: { label: 'Open the console', href: site.consoleUrl },
    secondaryCta: { label: 'See how it works', href: '#platform' },
    /* Every figure here is counted from platform/g8deck-app, not estimated:
       DeploymentPipeline::defaultSteps(), DriverResolver::driverClass(),
       ComponentTypeSeeder, DatabaseComplianceReporter. */
    stats: [
        { value: '20', label: 'pipeline steps, each idempotent' },
        { value: '63', label: 'component types in the catalogue' },
        { value: '8', label: 'server platforms you can adopt today' },
        { value: '11', label: 'SOC 2 controls mapped to evidence' },
    ],
} as const;

/** The four-noun mental model, rendered as the chain in the "Platform" section. */
export const model = [
    {
        term: 'Blueprint',
        summary: 'The desired architecture — layers, components, connections and scaling rules.',
        detail: 'Blueprints hold no provider-specific fields, which is what makes the same blueprint deploy to Proxmox, VMware, bare metal or a public cloud without edits.',
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
    title: 'Twenty steps. Resumable. Idempotent.',
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
                { name: 'Inject secrets', note: 'Vault-backed, resolved at provision time' },
            ],
        },
        {
            phase: 'Workload',
            steps: [
                { name: 'Deploy workloads', note: 'Git repo, registry image or compose' },
                { name: 'Run health checks', note: 'Gate the release on real liveness' },
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
        title: 'Quotas across organisation, team and user',
        body: 'CPU, memory, storage, deployment and node counts resolve from the tightest scope that declares them. Provisioning fails before it starts, not halfway through.',
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
            detail: 'Role-based access across organisation, team and user scopes, two-factor authentication, scheduled access reviews',
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
 * Tiers differ by capacity alone: the entitlement schema holds servers, seats,
 * deployments, cores-per-server and organisations, and no feature flag. MFA,
 * the audit trail, mTLS and encryption at rest are never tier-gated — selling
 * compliance as an upsell is what disqualifies a tender.
 */
export const plans: {
    title: string;
    body: string;
    note: string;
    tiers: readonly PlanTier[];
} = {
    title: 'Plans that scale with the estate, not the seat count',
    body: 'Every tier gets the full pipeline, every provider driver and the complete audit trail. What changes is capacity — servers, seats and deployments — never whether the platform will let you prove a control.',
    note: 'A server is one machine, not one container — fifty containers on one Docker host count as one. Priced tiers are hosted and billed monthly; running the control plane on your own network is Enterprise.',
    tiers: [
        {
            name: 'Starter',
            for: 'A first production deployment',
            price: '$5',
            period: 'USD / month',
            points: ['2 servers', '1 seat', '10 deployments', '2 organisations'],
        },
        {
            name: 'Growth',
            for: 'Teams running several environments',
            price: '$15',
            period: 'USD / month',
            points: ['50 servers', '10 seats', 'Unlimited deployments', 'Unlimited organisations'],
        },
        {
            name: 'Business',
            featured: true,
            for: 'Multi-project engineering organisations',
            price: '$49',
            period: 'USD / month',
            points: ['100 servers', '30 seats', 'Unlimited deployments', 'Unlimited organisations'],
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
                'Unlimited servers, seats and deployments',
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
] as const;

export const footerLinks = [
    {
        heading: 'Platform',
        links: [
            { label: 'How it works', href: '#platform' },
            { label: 'Provisioning pipeline', href: '#pipeline' },
            { label: 'Components', href: '#components' },
            { label: 'Providers', href: '#components' },
        ],
    },
    {
        heading: 'Deployment',
        links: [
            { label: 'SaaS', href: '#deployment' },
            { label: 'On-premise', href: '#deployment' },
            { label: 'Plans', href: '#plans' },
        ],
    },
    {
        heading: 'Trust',
        links: [
            { label: 'Compliance', href: '#compliance' },
            { label: 'Security model', href: '#compliance' },
            { label: 'FAQ', href: '#faq' },
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
