/**
 * Single source of truth for every piece of copy and structured content on
 * g8deck.app. Sections import from here so the page stays layout-only.
 */

export const site = {
    name: 'G8Deck',
    domain: 'g8deck.app',
    url: 'https://g8deck.app',
    consoleUrl: 'https://console.g8deck.app',
    tagline: 'Architecture-first infrastructure deployment',
    description:
        'G8Deck turns an architecture blueprint into running infrastructure — provisioned, scaled, reconciled and audited on your own hardware, your cloud, or fully air-gapped.',
    company: {
        name: 'Developers Hub Sdn Bhd',
        url: 'https://devhub.my',
        country: 'Malaysia',
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
    body: 'G8Deck takes an architecture blueprint — three-tier, HA cluster, microservices — and provisions, operates, scales and reconciles the whole system on infrastructure you control. On-premise, cloud, or fully air-gapped. Any containerised workload, in any language.',
    primaryCta: { label: 'Open the console', href: site.consoleUrl },
    secondaryCta: { label: 'See how it works', href: '#platform' },
    stats: [
        { value: '20', label: 'pipeline steps, each idempotent' },
        { value: '13', label: 'infrastructure provider drivers' },
        { value: '63', label: 'provisionable component types' },
        { value: '0', label: 'external egress in air-gapped mode' },
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
        body: 'Single-stack platforms cover the web tier and abandon everything else. G8Deck deploys any container — PHP, Python, Node, Go, Java, Ruby, Rust, .NET.',
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
        body: 'Regulated industry, government and GLC workloads cannot sit on foreign hosted control planes. G8Deck runs inside your perimeter — or with no perimeter exit at all.',
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
        body: 'AES-256-GCM at rest in an Infisical or HashiCorp Vault backend, rotated on schedule, resolved into workloads at deploy time and redacted out of every log line.',
        tag: 'Security',
    },
    {
        title: 'Observability wired in, not bolted on',
        body: 'Prometheus, Grafana, Loki, Tempo and Jaeger are provisioned as part of the deployment, with alert rules evaluated against health samples collected every minute.',
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
        items: ['HAProxy', 'Nginx', 'Caddy', 'Traefik', 'Kong', 'Envoy', 'Cloudflare', 'WireGuard'],
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
        items: ['Redis Queue', 'RabbitMQ', 'Kafka', 'NATS', 'ActiveMQ'],
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

export const providers = [
    'Bare metal',
    'Proxmox',
    'VMware',
    'KVM',
    'Kubernetes',
    'k3s',
    'Docker Swarm',
    'Nomad',
    'AWS',
    'GCP',
    'Azure',
    'Hetzner',
    'DigitalOcean',
] as const;

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
            values: ['Hosted by Developers Hub', 'Yours — Docker Compose or Helm'],
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
            values: ['Managed for you', 'MySQL, MariaDB, PostgreSQL, MSSQL or Oracle'],
        },
        {
            label: 'Identity',
            values: ['G8ID or your own IdP', 'LDAP / AD, Keycloak or G8ID'],
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
        {
            label: 'Air-gapped',
            values: ['—', 'Supported'],
        },
    ],
    commercial: {
        label: 'Commercial',
        values: ['Subscription + usage', 'Licence + support, per installation'],
    },
    note: 'Air-gapped is not a third product — it is on-premise with the perimeter closed: internal registry, internal PKI, internal DNS, and no external egress. Whether you need it is a property of your environment, not of the platform.',
};

export const compliance = {
    title: 'Compliance is a schema, not a slide',
    body: 'Controls map to concrete audit and configuration evidence, exportable on demand. The platform enforces the parts that cannot be left to policy.',
    controls: [
        {
            code: 'CC6',
            name: 'Logical access',
            detail: 'RBAC across four scopes, MFA required for every user, scheduled access reviews',
        },
        {
            code: 'CC7',
            name: 'System monitoring',
            detail: 'Anomalous access alerting on an immutable audit log',
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
            detail: 'AES-256-GCM at rest, enforced mTLS in transit',
        },
    ],
    guarantees: [
        'PDPA-aligned: data residency enforced per deployment, no cross-region leakage',
        'CVE scanning with Trivy or Grype on every component image before it deploys',
        'Audit records are append-only — no updates, no deletes, one year minimum retention',
        'Secrets and PII scrubbed from logs before they are written',
    ],
} as const;

export const ecosystem = [
    {
        name: 'G8Stack',
        role: 'Kong API gateway — deployed app routes registered and removed automatically.',
    },
    { name: 'G8ID', role: 'Keycloak — SSO for the console and OIDC for the apps you deploy.' },
    {
        name: 'Nadi',
        role: 'Error monitoring — the agent is injected per workload when you want it.',
    },
] as const;

interface PlanTier {
    name: string;
    /** Who the tier is for — shown under the name. */
    for: string;
    points: readonly string[];
    featured?: boolean;
}

export const plans: {
    title: string;
    body: string;
    note: string;
    tiers: readonly PlanTier[];
} = {
    title: 'Plans that scale with the estate, not the seat count',
    body: 'Every tier gets the full pipeline, every provider driver and the complete audit trail. What changes is quota, governance depth and the support you can call on.',
    note: 'Pricing is being finalised and will be published in USD. On-premise deployments, air-gapped or not, are licensed per installation — talk to us for a quote in the meantime.',
    tiers: [
        {
            name: 'Starter',
            for: 'A first production deployment',
            points: [
                'Single organisation, single team',
                'Core provider drivers',
                'Full 20-step provisioning pipeline',
                'Community support',
            ],
        },
        {
            name: 'Growth',
            for: 'Teams running several environments',
            points: [
                'Multiple teams and projects',
                'Environment promotion and rollback',
                'Autoscaling and drift reconciliation',
                'Business-hours support',
            ],
        },
        {
            name: 'Business',
            featured: true,
            for: 'Multi-project engineering organisations',
            points: [
                'Per-team and per-user resource quotas',
                'Observability stack provisioning',
                'SSO via G8ID or your own IdP',
                'Priority support with an SLA',
            ],
        },
        {
            name: 'Enterprise',
            for: 'Regulated, government and GLC estates',
            points: [
                'On-premise licensing, air-gapped on request',
                'SOC 2 evidence export and access reviews',
                'HashiCorp Vault, LDAP / AD integration',
                'Named support engineer',
            ],
        },
    ],
};

export const faqs = [
    {
        q: 'Do I have to write my applications in a particular language?',
        a: 'No. G8Deck deploys any containerised workload — PHP, Python, Node, Go, Java, Ruby, Rust, .NET or anything else that produces an image. Laravel is what G8Deck itself is built in; it is not a constraint on what you deploy.',
    },
    {
        q: 'Does the same blueprint really run on different infrastructure?',
        a: 'Yes, by construction. Blueprints carry no provider-specific fields, and every provider sits behind a single driver contract. Moving from Proxmox to a public cloud is a change of provider, not a change of blueprint.',
    },
    {
        q: 'What happens when provisioning fails halfway?',
        a: 'Pipeline state is persisted per step. Every step is idempotent and has a rollback, so you resume from the failed step rather than restarting — and a partial failure does not leave orphaned resources behind.',
    },
    {
        q: 'Which database does the platform itself need?',
        a: 'Whichever you already run. G8Deck supports MySQL, MariaDB, PostgreSQL, MSSQL and Oracle, and behaves identically on all five. It also needs Redis, a secret vault, queue workers and a scheduler.',
    },
    {
        q: 'How does air-gapped mode actually work?',
        a: 'The control plane makes zero outbound external calls by default, the licence is activated offline, and DNS, PKI and the container registry are all internal. Nothing about the platform assumes it can reach the internet.',
    },
    {
        q: 'Can I keep my existing Kubernetes cluster?',
        a: 'Yes. Kubernetes and k3s are provider drivers like any other, so an existing cluster becomes a target for deployments rather than something G8Deck replaces.',
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
            { label: 'GitHub', href: site.social.github },
            { label: 'Sales enquiry', href: mailto('Sales enquiry') },
            { label: 'Support', href: mailto('Support request') },
        ],
    },
] as const;
