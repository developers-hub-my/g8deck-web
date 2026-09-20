---
title: When a deployment misbehaves
description: How to read a pipeline, a provider, a health figure and a log honestly, so a green console never convinces you of infrastructure that was never built.
order: 40
updated: 2026-09-20
---

Most of what goes wrong in G8Deck is not a crash — it is a screen that looks
finished. This page works through the readings that are easy to misread, in
the order you meet them in the console at [g8deck.app](https://g8deck.app):
the symptom, what it actually means, and what to do about it.

## The pipeline finished, but nothing was built

Provisioning runs as twenty-four steps. Each one records its own result, and
a step has six possible outcomes — pending, running, success, failed, rolled
back, and **skipped**.

Skipped is the one to learn. A skipped step deliberately did nothing, because
a capability it needed is _simulated_ on that provider. G8Deck declares those
pairs rather than letting them fall through a default branch, so the step
abandons its work and records the reason in the same place a failure records
its error.

The deployment header states this plainly once the run settles — `18 steps
ran in 4m 12s — 6 did no work`, in amber. Progress counts settled steps,
skips included, so the bar does reach 100%; that is why the skip count sits
beside it rather than behind it.

<a class="shot" id="shot-1-thumb" href="#shot-1" aria-label="Enlarge: The pipeline step list: skipped steps in amber, each marked &quot;did no work&quot; with the reason recorded underneath, beside green steps reporting their duration"><img src="/docs/first-deployment/pipeline-skipped-steps.jpg" alt="The pipeline step list: skipped steps in amber, each marked &quot;did no work&quot; with the reason recorded underneath, beside green steps reporting their duration" /></a>

<div id="shot-1" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-1-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/first-deployment/pipeline-skipped-steps.jpg" alt="The pipeline step list: skipped steps in amber, each marked &quot;did no work&quot; with the reason recorded underneath, beside green steps reporting their duration" loading="lazy" />
    <figcaption>The pipeline step list: skipped steps in amber, each marked "did no work" with the reason recorded underneath, beside green steps reporting their duration</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-1-thumb">Close</a>
</div>

Expand the pipeline and read each amber row. Whatever that step would have
configured — a firewall policy, a certificate, a load balancer — is
unconfigured. Nothing will tell you again.

## Nothing is happening at all

If steps sit unclaimed rather than failing, no worker is picking them up.

Provisioning never runs inside the web request. It is queued on a dedicated
`infra` connection and an `infra` queue, separate from the default queue
because these jobs run for minutes and the default connection would hand a
still-running bootstrap to a second worker mid-flight. Horizon's
`supervisor-infra` is what claims that queue, so "is Horizon running" is the
whole worker question.

An admin can check it without leaving the console. The onboarding page
carries a **Platform health** panel — collapsed, admin-only — with the three
checks that decide whether a deployment finishes or silently does nothing:

| Check                   | What it is really asking                                             |
| ----------------------- | -------------------------------------------------------------------- |
| Queue worker            | Is Horizon up? Paused counts as down — jobs queue, nobody works them |
| Scheduler               | Has the scheduler checked in within five minutes?                    |
| Infrastructure provider | Can at least one active provider actually run a workload?            |

The scheduler matters more than it looks. Health readings, alert evaluation
and auto-rollback are all written by scheduled commands that run every
minute. Without a scheduler there are no readings, no incidents and no
automatic rollback — and none of that announces itself.

## The provider is not what its name says

A driver directory on disk is not proof anything deploys. What a provider
resolves to today:

| Provider type                                                                                    | Resolves to                                                          |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Docker                                                                                           | Real Docker driver                                                   |
| Docker Swarm                                                                                     | Real Swarm driver                                                    |
| Kubernetes / K3s                                                                                 | Real Kubernetes driver                                               |
| Bare metal, VMware, KVM, AWS, GCP, Azure, Hetzner, DigitalOcean — **with SSH credentials saved** | Adopt-only SSH driver; workloads run natively under systemd          |
| Proxmox — **with an endpoint and API token**                                                     | Real driver for creating VMs; deploying into them is still simulated |
| Nomad, and any of the above with no credentials                                                  | The fake pair — nothing is contacted                                 |

Two consequences worth holding on to. A half-configured provider of an
otherwise-real type falls back to the fake, so "the type is supported" is not
the same as "this row works". And on an adopted machine only four component
slugs have a native provisioner — `redis`, `postgresql`, `mysql`, `mariadb`.
A blueprint that asks for anything else there schedules a component nothing
installs.

> **Test connection** distinguishes the three answers. A simulated provider
> comes back not as a pass and not as a failure, but as _no real driver for
> this provider type — nothing was contacted_. The provider form lists every
> simulated capability with its reason before you save.

<a class="shot" id="shot-2-thumb" href="#shot-2" aria-label="Enlarge: The server form's &quot;Not yet real on this server&quot; panel, naming the capability that is simulated and the reason recorded against it"><img src="/docs/console/provider-capabilities.jpg" alt="The server form's &quot;Not yet real on this server&quot; panel, naming the capability that is simulated and the reason recorded against it" /></a>

<div id="shot-2" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-2-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/console/provider-capabilities.jpg" alt="The server form's &quot;Not yet real on this server&quot; panel, naming the capability that is simulated and the reason recorded against it" loading="lazy" />
    <figcaption>The server form's "Not yet real on this server" panel, naming the capability that is simulated and the reason recorded against it</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-2-thumb">Close</a>
</div>

## It reports active, but nothing answers

Published is not reachable. A published port binds `127.0.0.1` unless that
port declares `expose: public`, and the bind address comes from the port
mapping itself, not from any firewall rule. A loopback-bound port is
invisible from outside the host whatever `ufw status` claims.

So there are two ways in, and only one of them is a published port:

- **Siblings** reach the workload by its network alias, on the container port.
- **The outside world** goes through the reverse proxy on a domain. TLS
  terminates there and never on a raw published port, which is why published
  URLs are always plain `http://`.

If a published URL times out from your laptop, check the exposure before you
go looking at the network.

## Health says nothing is wrong

It may be saying nothing at all.

The degradation figure is withheld — null, not zero — until two conditions
hold: at least two distinct readings, and the oldest reading covering at
least half the requested window. A monitor that started twenty seconds ago
has not observed five minutes of anything, and a deployment must never be
rolled back on the strength of one sample taken while a node restarted.

Read a missing figure as _insufficient evidence_. It most often means the
health schedule is not running — nothing else writes those rows.

## The logs are missing the line you need

Deployment logs are redacted before they reach the viewer: first the exact
secret values this deployment holds, then shape patterns — credentials in a
URL, bearer tokens, JWTs, AWS keys, PEM blocks. Email addresses and IPs are
deliberately left alone; in an infrastructure log those are the detail you
are debugging with.

Unmasked output requires the `deployments.view.logs-raw` permission. The log
viewer says which of the two you are looking at, and downloads follow the
same rule.

One deliberate exception: if your organisation has connected its own AI
account, the **Explain this failure** button next to a failed step sends the
error for a plain-language read. That prompt is redacted for everyone,
including holders of the raw-log permission — that permission says an
operator may _see_ your secrets, not that they may _send_ them to a third
party. The answer is advice; nothing on that path can change anything.

## Re-run rather than tear down

Every pipeline step is idempotent and the run is resumable. A step already
marked success is not repeated, so once you have fixed the cause,
**Re-run Pipeline** picks up from where it stopped. Tearing the deployment
down and starting again costs time and buys nothing.

Two guards to know about:

- Only one provisioning run per deployment at a time. A second is refused
  outright, because two interleaving runs end with the loser's rollback
  destroying the node rows the winner is standing on.
- A **stopped** deployment already holds its resources. Re-running the
  pipeline there would skip every step and flip it active dishonestly, so the
  console refuses and points you at **Start** instead.

## When you still cannot tell

Work outward from the deployment:

1. **Incidents** — the queue of every alert that fired across the
   organisation, filterable by status and severity, acknowledgeable, with a
   post-mortem field. Remember it is only populated while the scheduler runs.
2. **Drift** — what the infrastructure looks like now versus the desired
   state the last successful run recorded. Detection is scheduled;
   reconciliation is a deliberate action.
3. **Operations** — scaling policies and the auto-rollback trigger, whose
   threshold and window decide whether it ever fires.

<a class="shot" id="shot-3-thumb" href="#shot-3" aria-label="Enlarge: The incident queue: severity down one edge, the lifecycle each incident has reached, and the row actions for acknowledging or resolving one"><img src="/docs/console/incidents.jpg" alt="The incident queue: severity down one edge, the lifecycle each incident has reached, and the row actions for acknowledging or resolving one" /></a>

<div id="shot-3" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-3-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/console/incidents.jpg" alt="The incident queue: severity down one edge, the lifecycle each incident has reached, and the row actions for acknowledging or resolving one" loading="lazy" />
    <figcaption>The incident queue: severity down one edge, the lifecycle each incident has reached, and the row actions for acknowledging or resolving one</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-3-thumb">Close</a>
</div>

If a screen and a reading disagree, trust the one that is harder to fake: the
step's recorded reason, the provider's capability list, the bind address.
