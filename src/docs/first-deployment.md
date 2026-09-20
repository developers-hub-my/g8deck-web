---
title: Your first deployment
description: Connect a machine you already own, then answer three questions in the new-application wizard and watch the provisioning pipeline take it from empty host to running system.
order: 10
updated: 2026-09-20
---

This walkthrough goes end to end in the console at
[g8deck.app](https://g8deck.app). There are two things to do, and the console
says so: its **Get started** checklist lists those two and nothing else,
because everything else is derived rather than asked.

1. Add an infrastructure provider.
2. Deploy your first application.

If supplying infrastructure is someone else's job in your organisation, you
will only be shown the second — the checklist never hands you an item you have
no permission to finish.

Your organisation and team were created when you registered. The project, the
environment and the blueprint are created by the deployment wizard itself —
you are never sent off to make one first. Budget about fifteen minutes, most
of it waiting on the pipeline.

You need a Linux host you can reach over SSH, and the credentials for it. It
does not need to be empty, and nothing has to be containerised first.

## 1. Sign in to the console

The console is a separate property from this site — `g8deck.app`, not
`g8deck.com`. Sign in there with the account your organisation invited you to.

Everything below happens inside one **organisation**. If you belong to more
than one, check the switcher before you start: a deployment lands in the
organisation that was active when you created it.

## 2. Connect a server

An **infrastructure provider** is the credential G8Deck uses to reach your
hardware. Adding one stores the credential; it does not touch the machine yet.

Open **Add provider** and give it a name, a type, optionally a location, and
the two flags: **Active** (an inactive provider is not offered when you
deploy) and
**Protected** (refuses every teardown, bootstrap, upgrade and deployment aimed
at it — and if you tick it, the console makes you say why, because the refusal
quotes your reason back).

Twelve types are creatable today:

| Family       | Types                                  |
| ------------ | -------------------------------------- |
| Containers   | `docker`, `docker_swarm`, `k8s`, `k3s` |
| VM and metal | `bare_metal`, `vmware`, `kvm`          |
| Cloud        | `aws`, `gcp`, `azure`, `hetzner`, `do` |

`proxmox` and `nomad` appear in the type list so you can see where the product
is going, but saving one is refused: they have no driver yet, and a provider
that silently ran on a fake would be worse than a refusal.

Credentials vary by type. Every VM, metal and cloud type carries the same SSH
block, because G8Deck reaches those nodes over SSH whether or not the provider
also exposes an API:

| Field           | What to put in it                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| SSH host / port | The address of the machine, port 22 unless you moved it                                                 |
| SSH username    | `root`, or a user with **passwordless** sudo — G8Deck opens no TTY, so a sudo prompt cannot be answered |
| SSH private key | PEM-encoded. Leave empty to bootstrap with a password instead                                           |
| SSH password    | Bootstrap only — G8Deck replaces it with a generated key, and can then disable password login           |

Press **Test Connection** before you save. It probes the host over SSH and
reports back the operating system it found and the host key's fingerprint —
which is trust state you can compare against what you expect, not a secret.

<a class="shot" id="shot-1-thumb" href="#shot-1" aria-label="Enlarge: The New Server form: name, the twelve ready provider types with Bare Metal / VM (SSH) selected, Proxmox and Nomad greyed out under Coming soon, and the panel naming what is not yet real on this server"><img src="/docs/first-deployment/connect-a-server.jpg" alt="The New Server form: name, the twelve ready provider types with Bare Metal / VM (SSH) selected, Proxmox and Nomad greyed out under Coming soon, and the panel naming what is not yet real on this server" /></a>

<div id="shot-1" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-1-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/first-deployment/connect-a-server.jpg" alt="The New Server form: name, the twelve ready provider types with Bare Metal / VM (SSH) selected, Proxmox and Nomad greyed out under Coming soon, and the panel naming what is not yet real on this server&quot; loading=&quot;lazy" />
    <figcaption>The New Server form: name, the twelve ready provider types with Bare Metal / VM (SSH) selected, Proxmox and Nomad greyed out under Coming soon, and the panel naming what is not yet real on this server</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-1-thumb">Close</a>
</div>

> Providers declare which capabilities they can really perform, and the form
> shows a **Not yet real on this server** panel naming each one that is not,
> with the reason. Pipeline steps that depend on a capability listed there
> record **Skipped** with that reason rather than reporting success. Read that
> panel before you trust a green pipeline.

## 3. Create the application

This is three questions, and a fourth only when SSH needs it. An earlier
version of the console asked ten — pick a blueprint, a provider, a project, an
environment, a size, name it, create it, find the workload modal, choose a
layer, find the deploy button — and none of them was a question you have to
answer to get your code running.

### Step 1 — What are you deploying?

A name you will recognise, then where the code comes from:

| Source              |                      | What it means                                                                                                           |
| ------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Ready-made app**  | Installed for you    | A catalogue recipe — WordPress, Drupal, Nextcloud. It pins its own blueprint, image, port, health path, volumes and env |
| **Git repository**  | We build it          | G8Deck clones and builds it                                                                                             |
| **Upload a folder** | No repository needed | A `.zip` or `.tar` up to 100 MB, inspected the moment it lands                                                          |
| **Container image** | Already built        | You give a tag; G8Deck runs it                                                                                          |
| **Not yet**         | Decide later         | The application is created with nothing to run; attach a source from its page                                           |

<a class="shot" id="shot-2-thumb" href="#shot-2" aria-label="Enlarge: Step one of the wizard: the application name, the five source cards with Git repository selected, and the repository, branch, build, domain and health-path fields beneath it"><img src="/docs/first-deployment/choose-a-source.jpg" alt="Step one of the wizard: the application name, the five source cards with Git repository selected, and the repository, branch, build, domain and health-path fields beneath it" /></a>

<div id="shot-2" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-2-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/first-deployment/choose-a-source.jpg" alt="Step one of the wizard: the application name, the five source cards with Git repository selected, and the repository, branch, build, domain and health-path fields beneath it&quot; loading=&quot;lazy" />
    <figcaption>Step one of the wizard: the application name, the five source cards with Git repository selected, and the repository, branch, build, domain and health-path fields beneath it</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-2-thumb">Close</a>
</div>

A **git** source also asks for the repository URL, a branch, and a **Build**
preset: `dockerfile` when the repo ships its own, otherwise `static`,
`laravel`, `node`, `nextjs`, `astro`, `python`, `django`, `symfony` or `go`.

An **upload** asks for none of that. The archive is read the moment it lands,
while you are still on the page, and the console tells you what it found — the
build preset is _detected_, not asked, along with the file count and a digest.
If your files were inside a folder in the archive, it says so and uses that
folder as the site root. Nothing it refuses is unfixable: the reason is always
something you can correct by re-zipping.

> A **static site** is not a separate path. It is the `static` build preset,
> reached either by choosing Build → Static on a git source, or by uploading
> an archive whose contents are an `index.html` and nothing more specific.

**Domain** and **Health path** are optional and come last. Type a domain and
the console checks DNS coverage there and then, rather than leaving you to
discover it at pipeline step 19: it says whether the record will be created
automatically, whether you must create it yourself, or whether it cannot tell.
When it is manual, it also tells you to create the record with Cloudflare's
proxy turned **off** — an orange cloud terminates TLS at Cloudflare and the
HTTP-01 challenge never reaches the node.

### Step 2 — What does it need?

The distinctive screen. Instead of a list of templates, the shape is a
sentence you read back to yourself:

> Run **PHP-FPM** behind Nginx, with **MySQL** and **Redis**, plus
> **background workers**. Run it on **one server**.

Every bold word is a button. Pressing one opens a picker:

| Slot               | Choices                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| What runs your app | PHP-FPM · Node.js · Python (gunicorn)                                                                  |
| Database           | MySQL 8 · MariaDB 11 · PostgreSQL 16 · no database                                                     |
| Cache              | Redis · no cache                                                                                       |
| Background work    | Background workers · web requests only                                                                 |
| How it is spread   | One server · an app server and a database server · an entry point, an app server and a database server |

Each placement carries its real trade-off rather than a label: one server is
cheapest and one reboot takes it all down; the app-and-database split puts
Nginx, the runtime and Redis together and only the database on its own, which
is the usual production shape; the three-way split gives Nginx its own layer
in front so app servers can be added behind it.

Four presets fill the sentence in — **Small app, one box**, **Standard web
app**, **API + cache**, **Room to scale** — and every word stays editable
afterwards. They are starting points, not templates.

<a class="shot" id="shot-3-thumb" href="#shot-3" aria-label="Enlarge: Step two of the wizard: four starting points above the editable sentence, and the placement picker open below it showing its three options and their trade-offs"><img src="/docs/first-deployment/shape-sentence.jpg" alt="Step two of the wizard: four starting points above the editable sentence, and the placement picker open below it showing its three options and their trade-offs" /></a>

<div id="shot-3" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-3-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/first-deployment/shape-sentence.jpg" alt="Step two of the wizard: four starting points above the editable sentence, and the placement picker open below it showing its three options and their trade-offs&quot; loading=&quot;lazy" />
    <figcaption>Step two of the wizard: four starting points above the editable sentence, and the placement picker open below it showing its three options and their trade-offs</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-3-thumb">Close</a>
</div>

Below the sentence, **What that provisions** counts the result the way an
operator counts servers, not the way the pipeline counts layers. Underneath
that, a disclosure still reaches the catalogue templates — Kong, Keycloak and
the rest are shapes this sentence cannot say, so they stay one click away.
They are just no longer what the step opens with.

### Step 3 — Where should it run?

Sensible defaults; change them only if you need to.

| Field               | Note                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Provider**        | Preselected when you have only one — picking your only server is not a choice                               |
| **Database server** | Optional. Use one of the organisation's managed database servers instead of the one your shape would create |
| **Object storage**  | Optional. A Garage storage server set up under Storage                                                      |
| **Environment**     | `local`, `development`, `staging`, `production`, `dr`, `preview`                                            |
| **Size**            | Small, medium, large, or custom                                                                             |

Then a review of everything decided so far, in one place, before the button
that spends money.

Two guards fire on this step rather than mid-pipeline:

- A **Laravel, Symfony or Django preset with no database anywhere** — no
  database layer in the shape, and no managed server picked — is called out
  loudly. It would fail at startup, and this is where it is still cheap to fix.
- A **container workload on a native-systemd provider** is refused before
  anything is created. A plain droplet has no container daemon to pull an
  image with, so a ready-made app cannot land there; before this check
  existed, that refusal arrived from the runtime after the nodes had already
  been provisioned.

Finish with **Save only** — the application and its deployment exist, nothing
runs — or **Save & deploy**.

<a class="shot" id="shot-5-thumb" href="#shot-5" aria-label="Enlarge: Step three of the wizard: the provider, database and object-storage selects above a review of everything the application is about to be created with"><img src="/docs/first-deployment/where-it-runs.jpg" alt="Step three of the wizard: the provider, database and object-storage selects above a review of everything the application is about to be created with" /></a>

<div id="shot-5" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-5-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/first-deployment/where-it-runs.jpg" alt="Step three of the wizard: the provider, database and object-storage selects above a review of everything the application is about to be created with" loading="lazy" />
    <figcaption>Step three of the wizard: the provider, database and object-storage selects above a review of everything the application is about to be created with</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-5-thumb">Close</a>
</div>

### Step 4 — Connect (only when SSH needs it)

An SSH repository gets its own **Ed25519** deploy key, minted at save time.
On **Save & deploy** the wizard runs `git ls-remote` _before dispatching
anything_, because a key minted seconds ago cannot possibly be registered on
the repository yet.

If the clone is refused, nothing is dispatched and you land on a fourth step
carrying the public key, its fingerprint, and the one instruction that matters:

> Repository → Settings → Deploy keys → Add deploy key. Read-only access is
> enough.

Paste it, press **Test connection**, and **Deploy** unlocks. The Deploy button
re-probes the repository server-side rather than trusting the earlier test —
the key could have been removed between the two presses. You can also leave
and finish from the application page later; the key panel there does the same
thing.

<a class="shot" id="shot-6-thumb" href="#shot-6" aria-label="Enlarge: The Connect step: the public deploy key with its Copy button, a connection test that has succeeded, and the Deploy button it unlocks"><img src="/docs/first-deployment/connect-repository.jpg" alt="The Connect step: the public deploy key with its Copy button, a connection test that has succeeded, and the Deploy button it unlocks" /></a>

<div id="shot-6" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-6-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/first-deployment/connect-repository.jpg" alt="The Connect step: the public deploy key with its Copy button, a connection test that has succeeded, and the Deploy button it unlocks" loading="lazy" />
    <figcaption>The Connect step: the public deploy key with its Copy button, a connection test that has succeeded, and the Deploy button it unlocks</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-6-thumb">Close</a>
</div>

## 4. About the blueprint

A **blueprint** is the architecture — layers, the components on each layer,
and the connections between them. You did not pick one, and that is deliberate:
the sentence on step 2 is composed into a blueprint at save time.

One blueprint per distinct shape per organisation. Two applications with the
same shape share the one row rather than minting a near-duplicate each, so
running the wizard repeatedly reuses rather than accumulates.

The blueprint pages still exist for the advanced path, under **Advanced →
Build → Blueprints**, where you can lay out layers by hand, attach components
from the registry and validate the result before provisioning. That is
[designing a blueprint](/docs/blueprints); it is not something a first
deployment needs.

## 5. Watch the pipeline

On **Save & deploy** the deployment is flipped to _provisioning_ before the
job is dispatched — the page only live-polls in that state, so a deployment
left pending until a worker claims it would look stalled — and you land on the
deployment page.

Provisioning runs as twenty-four idempotent steps, in order, each recording
its own result.

<a class="shot" id="shot-4-thumb" href="#shot-4" aria-label="Enlarge: The pipeline step list, where skipped steps are amber and marked &quot;did no work&quot; with the recorded reason underneath, beside green steps showing their duration"><img src="/docs/first-deployment/pipeline-skipped-steps.jpg" alt="The pipeline step list, where skipped steps are amber and marked &quot;did no work&quot; with the recorded reason underneath, beside green steps showing their duration" /></a>

<div id="shot-4" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-4-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/first-deployment/pipeline-skipped-steps.jpg" alt="The pipeline step list, where skipped steps are amber and marked &quot;did no work&quot; with the recorded reason underneath, beside green steps showing their duration" loading="lazy" />
    <figcaption>The pipeline step list, where skipped steps are amber and marked "did no work" with the recorded reason underneath, beside green steps showing their duration</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-4-thumb">Close</a>
</div>

Two things to read carefully on this screen:

- **Skipped is not success.** A skipped step did no work, so whatever it would
  have configured is unconfigured — and the reason is recorded next to it. The
  counter above counts _settled_ steps (done plus skipped) against the total,
  because a run where six steps were skipped is finished, not stuck at 70%;
  the skip count is reported separately, as its own outcome.
- **A stalled pipeline usually means no worker.** Provisioning is queued on a
  dedicated infrastructure queue. If steps sit unclaimed rather than failing,
  the queue worker is not running.

Because every step is idempotent, a failed run is resumable: fix the cause and
re-run, rather than tearing the deployment down and starting again.

## 6. Verify what is running

When the deployment reports **active**, check it from the deployment's own
pages rather than from the pipeline:

1. **Health** — a null degradation figure means too few readings, not a clean
   bill of health.
2. **Ports and domains**, on the application — a published port binds
   loopback unless the workload declares public exposure. Published is not the
   same as reachable.
3. **Logs** — redacted by default; raw logs need an explicit permission.

## Databases and caches: two different things

The page you just walked through touches both, so it is worth separating them:

| Level                                         | What it is                                                                              |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| The **database or cache layer in your shape** | Part of that one deployment, provisioned by its pipeline, and it lives and dies with it |
| **Databases** and **Cache** in the sidebar    | An organisation-wide fleet, set up on their own and outside any deployment pipeline     |

Step 3 is where the two meet: that is where you point an application at a
managed server from the fleet instead of the one its shape would have created.

## Where to go next

Set the workload's environment variables, add a second environment and promote
between them, or point G8Deck at servers you already run and adopt them into
the fleet.
