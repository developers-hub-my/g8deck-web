# Landing page brief — October 2026 revamp

The narrative and information architecture for `g8deck.com`, written before the
code, from the product as it ships in `platform/g8deck-app` (main at `1abfe2d8`).
Method: `product-blueprint` (positioning → audience → value story → honest
roadmap) for the story, `ui-ux-pro-max` for the visual direction.

## Positioning

**G8Deck runs your applications on servers you already own — and keeps
operating them after the first deploy.** Not a PaaS that hosts your code, not
a server panel that stops at "nginx is installed". The control plane drives
machines you hold; the data never moves to us.

## Audience, in order

| Reader                                                                           | What they need to see first                                                  |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Engineering lead at an agency or SME running PHP/Node on VMs (often on RunCloud) | That their existing servers come with them, and what they stop doing by hand |
| Platform / infra owner at a regulated org (bank, GLC, ministry, university)      | Data stays in-country, evidence exists, on-premise is real                   |
| An engineer evaluating with an AI client                                         | That agents get a governed tool surface, not a shell                         |

## Value story (the page reads top to bottom as this)

1. **Hero** — outcome first, a real console screenshot (sample organisation, labelled).
2. **Problem** — hosted PaaS assumes data can leave; for this region it cannot.
3. **How it works** — three steps: connect a machine, describe the shape, it keeps running.
4. **What it operates for you** — the work that used to be runbooks, each card
   backed by shipped code: adopt from RunCloud, managed data services, releases
   without a 502, backups proven by restore drills, security patching, organisations.
5. **Product tour** — three real console screens.
6. **Model / Pipeline / Lifecycle** — the depth sections for the technical reader (kept).
7. **AI operators** — five MCP servers, the safety rules that make them usable.
8. **Components, deployment modes, compliance, plans, FAQ, CTA** — kept, refreshed.

## Claims and where each was verified

| Claim on the page                                                                                                                                   | Source in g8deck-app                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 24 pipeline steps                                                                                                                                   | `DeploymentPipeline::defaultSteps()`                                                           |
| 63 component types                                                                                                                                  | `ComponentTypeSeeder::components()` (63 literal slugs)                                         |
| 8 machine types today                                                                                                                               | `SimulatedCapabilities::isAdoptedVm()`                                                         |
| 11 SOC 2 controls                                                                                                                                   | `DatabaseComplianceReporter` (CC6.1 … C1.1)                                                    |
| Adopt from RunCloud or plain nginx; discovery writes nothing                                                                                        | `Migration/Sources/{RunCloudSource,PlainNginxSource}`, #502                                    |
| Data migration: MySQL/MariaDB + shared dirs, row/file counts verified, dry run default                                                              | `MigrateAdoptionDataTool` description (#760)                                                   |
| Database servers: PostgreSQL, MySQL, MariaDB, MongoDB, ClickHouse; PostgreSQL replicas with manual promotion                                        | `DatabaseEngine`, `DatabaseServer/Dialects/*`, `DatabaseClusterMode::Replicated` (#517)        |
| Caches: Redis, Valkey                                                                                                                               | `CacheEngine`                                                                                  |
| Object storage: Garage, multi-node replication factor 3                                                                                             | `StorageEngine::Garage`, G311                                                                  |
| Zero-downtime native releases (blue/green systemd)                                                                                                  | `docs/04-deployment/06-zero-downtime-releases.md`, #462                                        |
| Runtime version detected from the repository                                                                                                        | #755                                                                                           |
| Backups: database/application/storage/server; verify integrity → readability → restorability; restore drills; platform/S3/Google Drive destinations | `BackupSubject`, `BackupVerifyLevel`, `BackupPolicy::next_drill_at`, `BackupDestinationDriver` |
| Patching: patch policy automatic/notify/manual, canary then fleet, advisories                                                                       | `PatchPolicyMode`, `docs/04-deployment/07-fleet-patching.md`, #728/#729                        |
| Move a project + its infra to another organisation, dry run by default                                                                              | `move-project-to-organization` (#757, #769)                                                    |
| Team server allocation                                                                                                                              | #715, G298                                                                                     |
| 5 MCP servers: customer 21, design 21, ops 78, platform 62, compliance 12 tools                                                                     | `app/Mcp/Servers/*` `$tools` arrays; `routes/ai.php`                                           |
| OAuth 2.1 for MCP                                                                                                                                   | #746                                                                                           |
| PDPA residency enforced at deploy time; unrecorded location is a violation                                                                          | `Compliance/DataResidency`                                                                     |
| Plan prices $5 / $15 / $49 / negotiated                                                                                                             | `config/plans.php` (overlaid by `PlanSettings`)                                                |

## Roadmap honesty

Kept exactly as before: container backends (Docker, Swarm, Kubernetes, k3s)
are "held for beta"; Proxmox and Nomad are "modelled"; Python/Go/static
"have not completed a live deployment". PostgreSQL sources are refused by data
migration, and the page says MySQL/MariaDB.

## Left out on purpose

- **Social proof.** There are no public customers to name, so there are no
  logos, testimonials or user counts. The proof offered instead is the
  product's own: G8Deck's control plane is deployed by G8Deck.
- **Tool total.** 194 tool registrations across five servers (some tools are
  on more than one); the page gives per-server counts rather than a total
  that needs a footnote.
- **Cost estimates, autoscaling numbers, uptime figures** — no source.

## Visual direction

Dark drafting sheet stays; colour still means state. Additions: real console
screenshots in a thin "sheet" frame with a mono caption that says the data is
sample data; four licensed Unsplash photographs (credits in
`src/assets/photos/CREDITS.md`), always duotoned toward the ink background so
they read as part of the drawing, never as stock decoration, and never showing
a face that could be read as an endorsement.
