---
title: Applications, deployments and releases
nav: Applications and deployments
description: Your code is an application; where it runs is a deployment; each time it ships is a release. How the three relate, and why the console says application where the API says workload.
section: concepts
order: 20
updated: 2026-10-27
---

Three words carry most of the console, and they are not synonyms.

| Word            | What it is                                                                    | Lives in                     |
| --------------- | ----------------------------------------------------------------------------- | ---------------------------- |
| **Application** | Your code and how to build it: a repository, an upload or an image            | A project                    |
| **Deployment**  | The place it runs: servers, managed services and settings for one environment | A project and an environment |
| **Release**     | One shipped version of an application inside a deployment, with its image     | A deployment                 |

An application belongs to a **project**, not to a deployment, which is what
lets one application run in several environments — production and staging are
two deployments of the same application, each with its own environment
variables, domains and releases.

![An application's page: its source and build on the left, push-to-deploy and domains on the right, the environments it runs in, and its latest release](/docs/launch-from-git/application.webp)

## The application page

Open **Applications** and pick one. Its tabs are the day-to-day surface:

| Tab                | What it is for                                                                        |
| ------------------ | ------------------------------------------------------------------------------------- |
| **Overview**       | Source, build, where it runs, latest releases, push-to-deploy, deploy scripts         |
| **Releases**       | Every release, its details, and **Roll back to this**                                 |
| **Domains & TLS**  | Domains, ports and certificates — see [Domains and TLS](/docs/domains-and-ssl)        |
| **Web server**     | Upload size, timeouts, compression, password protection                               |
| **Environment**    | Environment variables per environment                                                 |
| **Storage**        | Object storage attached to it                                                         |
| **Cache**          | A cache instance attached to it                                                       |
| **Console**        | Run one of a fixed list of commands for the build preset — never a free shell         |
| **Tasks**          | Scheduled tasks                                                                       |
| **Logs**           | Recent log lines                                                                      |
| **Backups**        | Backup policies covering it                                                           |
| **Push-to-deploy** | The last 50 webhook deliveries and what each one did                                  |
| **Settings**       | Name, repository, branch, build preset, deploy key, upload a new version, danger zone |

Each tab is a link — `?tab=environment`, `?tab=tasks` — so a narrowed view can
be pasted into a chat.

## Releases

Every deploy that builds something creates a release, and the **Releases** tab
keeps them. **Roll back to this** reruns that release's exact image with
freshly resolved environment tokens, without rebuilding — and a release with
no image cannot be rolled back to.

![The Releases tab: a successful release with its environment and time, and the note that a rollback reruns the exact image](/docs/launch-from-git/releases.webp)

To redeploy the current code, use **Re-run Pipeline** on the deployment page —
there is no separate redeploy button on the application.

## Application and workload

The console says **application** everywhere a person reads it. The API, the
MCP tools and the database say **workload** — `list-workloads`,
`set-workload-env`, `redeploy-workload`. They are the same thing; the tool
names were published before the label changed, and renaming a published tool
would break every client that calls it. When an MCP tool asks for a
`workload`, it wants the uuid of an application attached to a deployment,
which `list-workloads` returns.

## How an application runs

On a server connected over SSH, applications run **natively** as systemd units
— no container daemon is needed. On a Docker, Docker Swarm or Kubernetes
provider they run as containers. The build preset decides how the code is
built either way, and a few features depend on the runtime: [scheduled
tasks](/docs/scheduled-tasks) exist only on native servers, and the **Web
server** tab is not available on Kubernetes, where those settings belong to the
cluster's ingress.
