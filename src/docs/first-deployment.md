---
title: Your first deployment
description: Connect a machine you already own, answer three questions in the new-application wizard, and watch the provisioning pipeline take it from an empty host to a running application.
section: start
order: 10
updated: 2026-10-27
---

This walkthrough goes end to end in the console at
[g8deck.app](https://g8deck.app). The console's **Get started** page lists two
things to do, and only two, because everything else is derived rather than
asked:

1. Add an infrastructure provider — a server G8Deck can reach.
2. Deploy your first application.

If supplying servers is someone else's job in your organisation, you only see
the second item: the checklist never hands you a step you have no permission to
finish.

Your organisation and its first team were created when you signed up. The
project, the environment and the blueprint are created by the application
wizard itself — you are never sent off to make one first. Budget about fifteen
minutes, most of it waiting on the pipeline.

You need a Linux host you can reach over SSH — Ubuntu, Debian, AlmaLinux or
Rocky — and either `root` or a user with **passwordless** sudo on it. It does
not need to be empty.

## 1. Sign in to the console

The console is a separate site from this one — `g8deck.app`, not `g8deck.com`.
Sign in there.

Everything happens inside one **organisation**. If you belong to more than one,
check the switcher at the top of the sidebar before you start: an application
lands in the organisation that was active when you created it.

## 2. Connect a server

Open **Servers** and choose **Connect a Server**. The wizard has three steps,
and nothing is queued until the machine has answered a pre-flight probe.

![The Connect a Server wizard: server name, where the machine is hosted, its address and port, and how G8Deck should authenticate](/docs/connect-a-server/connect-wizard.webp)

1. **Connection** — a name, where the machine is hosted (DigitalOcean, AWS,
   Google Cloud, Azure, Hetzner or Other — every one of them is reached over
   SSH), its address and port, and a credential: an SSH key or a password.
   A password is used once — setup installs a per-server key and disables
   password login.
2. **Reach it** — **Test connection** logs in and reads the operating system.
3. **Pre-flight & start** — shows the host key fingerprint that will be pinned
   and the setup template, then **Start setup**.

Setup runs sixteen steps on the machine — a management user, rotated SSH
credentials, base packages, the container runtime, the G8Deck agent, a firewall
baseline, a metrics collector — and you can watch each one in the setup log.
The full walk-through is in [Connect a server](/docs/connect-a-server).

## 3. Create the application

Open **Applications** and choose **New application**. Three questions, and a
fourth only when your repository needs a deploy key.

### Step 1 — What are you deploying?

A name you will recognise, then where the code comes from:

| Source              | Card says            | What it means                                                                 |
| ------------------- | -------------------- | ----------------------------------------------------------------------------- |
| **Ready-made app**  | Installed for you    | A catalogue recipe that pins its own blueprint, image, port and environment   |
| **Git repository**  | We build it          | G8Deck clones and builds it                                                   |
| **Upload a folder** | No repository needed | A `.zip` or `.tar.gz` up to 100 MB, read the moment it lands                  |
| **Container image** | Already built        | You give an image; G8Deck runs it                                             |
| **Not yet**         | Decide later         | The application is created with nothing to run; attach a source from its page |

![Step one of the wizard: the application name, the five source cards with Git repository selected, and the repository, branch and build fields](/docs/launch-from-git/new-application.webp)

A **git** source asks for the repository URL, a branch and a **Build**:
`Dockerfile` when the repository ships its own, otherwise one of nine presets —
`static`, `laravel`, `node`, `nextjs`, `astro`, `python`, `django`, `symfony`
or `go`. If GitHub is connected under **Integrations**, a **Pick a repository
from GitHub** button fills the URL and branch for you.

**Domain** and **Health path** are optional. Type a domain and the console
checks DNS there and then: whether G8Deck will create the record, whether you
must create it yourself, or whether it cannot tell. When it is yours to create,
create it with Cloudflare's proxy turned **off** — a proxied record terminates
TLS at Cloudflare and the certificate challenge never reaches your server.

### Step 2 — What does it need?

Instead of a list of templates, the shape is a sentence you read back to
yourself, and every underlined word is a choice:

> Run **PHP-FPM** behind Nginx, with **MySQL** and **Redis**, plus
> **no workers**. Run it on **one server**.

| Slot            | Choices                                                                                                |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| Runtime         | PHP-FPM · Node.js · Python                                                                             |
| Database        | MySQL 8 · MariaDB 11 · PostgreSQL 16 · no database                                                     |
| Cache           | Redis · no cache                                                                                       |
| Background work | background workers · no workers                                                                        |
| Placement       | one server · an app server and a database server · an entry point, an app server and a database server |

Four starting points fill the sentence in — **Small app, one box**, **Standard
web app**, **API + cache** and **Room to scale** — and every word stays editable
afterwards. **What that provisions** underneath counts the result the way you
count servers. A ready-made app skips this step: it brings its own shape.

![Step two of the wizard: the four starting points above the editable sentence, and what that shape provisions](/docs/launch-from-git/shape-sentence.webp)

### Step 3 — Where should it run?

Pick the server (preselected when you have one), optionally a managed database
server or object storage instead of what the shape would create, the
environment (`production` by default) and a size, then read the review.

Two guards fire here rather than halfway through the pipeline:

- An application that needs a database — a Laravel, Symfony or Django build —
  with no database anywhere in the shape and no managed server picked.
- A container workload aimed at a server that runs applications natively under
  systemd, which has no container daemon to pull an image with.

![Step three of the wizard: the server, database and object-storage selects above a review of everything the application is about to be created with](/docs/first-deployment/where-it-runs.jpg)

Finish with **Save only** — the application exists, nothing runs — or **Save &
deploy**.

### Step 4 — Connect (only when the repository refuses)

An SSH repository gets its own deploy key. **Save & deploy** tests the clone
before anything is queued; if the repository refuses, you land on a fourth step
with the public key and one instruction:

> Repository → Settings → Deploy keys → Add deploy key. Read-only access is
> enough.

Paste it, press **Test connection**, and **Deploy** unlocks.

![The Connect step: the public deploy key with its Copy button, a connection test that has succeeded, and the Deploy button it unlocks](/docs/first-deployment/connect-repository.jpg)

## 4. Watch the pipeline

On **Save & deploy** you land on the deployment page. Provisioning runs as
twenty-four steps in order, each recording its own result — the list is in the
[reference](/docs/reference#the-provisioning-pipeline).

![A settled deployment: its lifecycle actions, the node, managed-service, application and pipeline tiles, and the pipeline reporting how many steps did no work](/docs/operating-deployments/deployment.webp)

Read two things carefully:

- **Skipped is not success.** A skipped step did no work, and the reason is
  recorded beside it. The header says so in amber — for example `18 steps ran
in 1s — 2 did no work`.
- **A pipeline that does not move usually means no worker.** Steps that sit
  unclaimed rather than failing are waiting for the queue worker.

Every step is idempotent, so a failed run is resumable: fix the cause and press
**Re-run Pipeline** instead of starting again.

## 5. Check what is running

When the deployment reports **active**, check it from the application rather
than from the pipeline:

1. **Domains & TLS** — a domain routes through the reverse proxy; a published
   port on its own binds loopback and is not reachable from outside.
2. **Logs** — redacted unless you hold the raw-logs permission.
3. **Health** — a missing degradation figure means too few readings, never a
   clean bill of health.

## Where to go next

| You want to                                 | Read                                                             |
| ------------------------------------------- | ---------------------------------------------------------------- |
| Add a domain and a certificate              | [Domains and TLS](/docs/domains-and-ssl)                         |
| Set environment variables                   | [Environment variables and secrets](/docs/environment-variables) |
| Give it a database the whole team can share | [Databases](/docs/databases)                                     |
| Back it up                                  | [Backups and restore](/docs/backups)                             |
| Drive all of this from an AI client         | [Connect an AI client](/docs/mcp/connect)                        |
