---
title: Blueprints, and when you need one
description: The wizard composes a blueprint out of your answers, so this is the advanced path — the shapes the sentence cannot say, editing a composed topology, cloning a catalogue blueprint, and what silently provisions nothing.
order: 20
updated: 2026-09-20
---

**You do not need this page to deploy anything.** The console composes a
blueprint for you out of three steps of the new-application wizard; start with
[your first deployment](/docs/first-deployment) and come back here when the
wizard stops being able to describe what you want.

A **blueprint** is the architecture on its own: layers, the components on each
layer, and the connections between them. It names no provider, no region and no
machine, which is what lets the same blueprint deploy to a container cluster or
an SSH-reachable server without edits.

## What the wizard writes for you

There is no blueprint picker at the start of the application flow. You answer a
sentence on step 2 — five slots, each editable — and the blueprint is derived
from the answers:

| Slot          | Answers                                                  |
| ------------- | -------------------------------------------------------- |
| **Runtime**   | PHP, Python, or Node                                     |
| **Database**  | MySQL, MariaDB, PostgreSQL, or none                      |
| **Cache**     | Redis, or not                                            |
| **Workers**   | A queue-worker and scheduler pair, or not                |
| **Placement** | One server; app + database; entry point + app + database |

Composing happens **when you save**, not while you read. The wizard hands those
answers to a composer which looks for a blueprint in your organisation whose
slug matches the answers — `shape-php-mysql-redis-workers-app-data`, for
example — and creates one only if none exists.

Two consequences are worth knowing before you open the editor:

- **One blueprint per distinct shape per organisation.** Two applications that
  answer the sentence identically share one blueprint row. Re-running the
  wizard reuses it rather than accumulating near-duplicates.
- **Layers are reconciled in place**, never wiped and rebuilt. They have to be:
  `deployment_nodes` holds a restricting foreign key to the layer, so deleting
  and recreating layers would fail on exactly the shapes people actually run.

A composed blueprint is an ordinary blueprint of yours. It is not a system
blueprint, not public, and you can open and edit it — with one caveat, below.

<a class="shot" id="shot-1-thumb" href="#shot-1" aria-label="Enlarge: A blueprint the wizard composed: its shape slug, six layers with their roles and replica ranges, and the five directed connections between them"><img src="/docs/console/blueprint-detail.jpg" alt="A blueprint the wizard composed: its shape slug, six layers with their roles and replica ranges, and the five directed connections between them" /></a>

<div id="shot-1" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-1-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/console/blueprint-detail.jpg" alt="A blueprint the wizard composed: its shape slug, six layers with their roles and replica ranges, and the five directed connections between them" loading="lazy" />
    <figcaption>A blueprint the wizard composed: its shape slug, six layers with their roles and replica ranges, and the five directed connections between them</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-1-thumb">Close</a>
</div>

## When a blueprint is pinned instead

A blueprint is chosen explicitly in exactly two cases:

1. **A one-click recipe pins its own.** The recipe's environment is written
   against tokens like `{{ mysql.* }}` that only its own blueprint's components
   resolve, so offering a different topology would offer a deployment whose
   tokens resolve against nothing.
2. **You opened "Or pick a catalogue template"** — the disclosure at the bottom
   of step 2 — and picked one.

Answering any slot of the sentence clears the pinned blueprint, so the template
and the sentence can never disagree on screen: whatever you last touched is
what you get.

## Where the editor lives

**Advanced → Build → Blueprints** in the console sidebar, next to the component
registry. It is not in the application flow, and it is not a step on the way to
deploying — it is a shelf you reach for deliberately.

Four reasons to reach for it:

| Reason                                    | What you do there                         |
| ----------------------------------------- | ----------------------------------------- |
| A shape the sentence cannot say           | Clone a catalogue blueprint, or build one |
| A composed topology needs an extra layer  | Edit your own composed blueprint          |
| Understanding what will actually be built | Read the layers, roles and components     |
| Checking before provisioning              | Validate over the design MCP server       |

### A shape the sentence cannot say

The sentence covers runtime, database, cache, workers and placement. Twenty-five
blueprints ship with G8Deck as system blueprints, and several of them describe
topologies with no equivalent in those five slots — Kong as an API gateway in
front of its own store, Keycloak or OpenLDAP as a directory server, Moodle,
Nextcloud, Drupal and WordPress as off-the-shelf applications, plus static
sites, an HA web tier fronted by a load balancer, a worker-queue stack, and
language starters for Node, Next.js, Astro, Python, Django, Go and Symfony.

They belong to no organisation and they are read-only. That is enforced in the
policy **before** the permission check: update and delete are refused for a
system blueprint no matter which permission you hold. Cloning is what makes one
editable.

1. Open **Blueprints** and filter the list to **System**.
2. Open the one closest to what you want.
3. Choose **Clone**, which copies it into your active organisation.
4. Edit the copy.

> The clone is built field by field — name, slug, topology, description and
> icon, then every layer, every attached component with its config overrides,
> and every connection remapped onto the new layer ids. Anything the copy step
> does not name is not carried over, and the clone is never a system blueprint
> and never public.

### Editing a composed blueprint

> **The blueprint the wizard composed is shared by every application with that
> same shape.** Adding a layer to it adds that layer to all of them, and the
> next deployment of any of them provisions it. This is the trap: the row looks
> like it belongs to the application you created it from, and it does not.

There is a second edge to the same trap. The composer reconciles the shape
every time somebody saves an application with those answers — it forces the
layer's attributes back, removes any component on a composed layer other than
the one the shape names, and prunes layers the shape does not contain. A layer
you added by hand to a composed blueprint is not a layer the shape knows about.

If what you want is one application's topology diverging from the others,
**clone the composed blueprint first** and point the new application at the
copy from the catalogue disclosure. A copy is nobody's shape, so nothing
reconciles it.

## The shape of a blueprint

Three nested records and one that sits across them:

| Record         | What it carries                                                                   |
| -------------- | --------------------------------------------------------------------------------- |
| **Blueprint**  | Name, description, icon, and a topology label — one of six                        |
| **Layer**      | A role (one of fourteen), an order, min and max replicas, and a `required` flag   |
| **Component**  | One catalogue entry attached to a layer; the first one attached becomes _primary_ |
| **Connection** | From one layer to another, with a protocol and an optional port                   |

The topology label is not decoration — it is what the blueprint index filters
on. Leaving everything as **Custom** makes that filter useless, so pick the case
that describes the shape the layers actually form. Composed blueprints are
labelled for you from the answers.

### Layers and their roles

Add a layer with a name, a role, and replica bounds. The maximum must be greater
than or equal to the minimum, and the minimum is at least one. Layers carry an
explicit order you can drag or nudge up and down.

The role is the important field, because it is what decides which pipeline step
picks the layer up during provisioning:

| Layer roles                                              | Provisioned by                                   |
| -------------------------------------------------------- | ------------------------------------------------ |
| Edge, Proxy                                              | The reverse-proxy step, matched by routing rules |
| Load Balancer, Gateway                                   | The load-balancer step                           |
| Application, Worker, Scheduler, WebSocket                | The compute-nodes step                           |
| Database, Cache, Queue, Storage, Observability, Identity | The managed-services step                        |

A layer marked **required** must have at least one component attached or
provisioning refuses to start. Layers added in the editor are required; the flag
is cleared by the seeded language starters and by the wizard when it composes a
Node application, because the runtime arrives with the build preset at deploy
time and the layer is deliberately empty.

### Attaching components

The catalogue holds sixty-three component types across ten categories —
networking, compute, database, cache, queue, storage, observability, identity,
registry and orchestration. The picker searches name, slug, vendor and
description, and the category chips narrow it.

A component can be attached to a layer only once. The first one attached becomes
the layer's primary component.

<a class="shot" id="shot-2-thumb" href="#shot-2" aria-label="Enlarge: The component picker over a layer: search across all 63 components, category chips with their counts, and the already-attached component marked as such"><img src="/docs/console/component-picker.jpg" alt="The component picker over a layer: search across all 63 components, category chips with their counts, and the already-attached component marked as such" /></a>

<div id="shot-2" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-2-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/console/component-picker.jpg" alt="The component picker over a layer: search across all 63 components, category chips with their counts, and the already-attached component marked as such" loading="lazy" />
    <figcaption>The component picker over a layer: search across all 63 components, category chips with their counts, and the already-attached component marked as such</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-2-thumb">Close</a>
</div>

> **The catalogue and the provisioner registry are not the same list.** The
> picker offers all sixty-three types. The registry — the set of components
> G8Deck actually knows how to stand up — is smaller: twenty-two definitions,
> each rendered by whichever backend the provider uses. On a provider whose
> workloads run natively under systemd rather than in containers, only four of
> them are real: Redis, PostgreSQL, MySQL and MariaDB.

Eighteen catalogue slugs are refusals on purpose, each with a reason recorded
against it rather than being left quietly absent — Nginx and HAProxy have their
own contracts, host-level storage belongs to node provisioning, Kafka and the
ELK stack need more containers than one definition can express, and MinIO is
unmaintained upstream. Attaching one is a design-time decision the picker will
not stop you making; provisioning refuses it, by name and with the reason.

Object storage is not on this list at all, and not because it is unsupported: a
managed storage server owns its own configuration and cluster layout, which a
blueprint layer cannot express. It is attached to an application from the
storage page, not drawn on a topology.

### Drawing connections

A connection points from one layer to another. Both ends must be layers of this
blueprint, the two must differ, and the protocol is one of HTTP, HTTPS, TCP,
UDP, gRPC, AMQP or Kafka, with an optional port between 1 and 65535.

Connections provision nothing by themselves. They describe the topology, and
network-policy generation reads them — which is why an edge that points at
another organisation's layer is rejected at the form rather than stored.

## Checking a blueprint before it provisions

The same check exists in two places, and neither of them is a button on the
blueprint page.

**As the first of the twenty-four provisioning steps**, where it refuses the run
outright. **And as a read-only tool on the design MCP server**, where an agent
or a script can ask before anything is created. Running it early turns failures
that are otherwise invisible until provisioning into a list you can read in a
few seconds.

| Reported                               | Severity | Why it matters                                |
| -------------------------------------- | -------- | --------------------------------------------- |
| No layers at all                       | Error    | Provisioning refuses outright                 |
| A required layer with nothing attached | Error    | Provisioning refuses outright                 |
| A component with no provisioner        | Error    | Refused at provision time, not at design time |
| A layer role no pipeline step consumes | Warning  | Provisions nothing **and** reports no error   |

The last row is the dangerous one, and it is the reason the check exists. A
layer whose role nothing handles is drawn on the topology, counted in the
estimate, and then silently skipped — the failure mode is silence, not a
message. Every one of the fourteen roles is consumed by a step today, and a test
fails the build if a new role ever arrives unclaimed.

> Edge and Proxy are the subtle pair. They are consumed by the reverse-proxy
> step through routing rules rather than by their role, so a blueprint that
> depends on them depends on something keyed differently from every other layer.

The same server estimates a blueprint against quota before a deployment exists.
The estimate sums the replica bounds across every layer — minimum nodes from the
minimums, maximum from the maximums — prices them against a requested size, and
reports the remaining headroom for a project. Two things it will not let you
misread:

- **A node is not one thing.** The count is blueprint replicas. What each one
  costs depends on the provider type — container runtimes bill per cluster host,
  not per container.
- **A quota field of `0` does not constrain at that scope.** It is not a limit
  of zero. A field nobody has set is unlimited.

## Where to go next

If you have not deployed anything yet, do that first — the wizard writes the
blueprint and you never touch this page:
[your first deployment](/docs/first-deployment). Both the validation check and
the estimate live on
[the design MCP server](/docs/api-and-automation), so an agent can check a
blueprint before it asks for anything to be built.
