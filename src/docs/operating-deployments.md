---
title: Operating what is running
description: Day two in the console — lifecycle actions, environment variables, logs, health, endpoints, drift, promotion and rollback, and what each one really tells you.
order: 30
updated: 2026-09-20
---

Your deployment reports **active**. Everything from here is day two: changing
what runs, reading what it is doing, moving it forward, and putting it back.
All of it lives on the deployment's own pages in the console at
[g8deck.app](https://g8deck.app).

## Lifecycle actions

The deployment overview carries four actions. Each is refused from a state it
cannot apply to, rather than run and left half-done.

| Action      | Allowed from              | What it does                       |
| ----------- | ------------------------- | ---------------------------------- |
| **Start**   | Stopped                   | Brings the existing resources back |
| **Stop**    | Active, Degraded          | Halts them; the resources stay     |
| **Restart** | Active, Degraded          | Stop and start in one step         |
| **Destroy** | Anything but already gone | Releases the resources, confirmed  |

<a class="shot" id="shot-1-thumb" href="#shot-1" aria-label="Enlarge: A deployment: its status and lifecycle actions, the node, managed-service and pipeline tiles, and the settled run reporting how many steps did no work"><img src="/docs/console/deployment-overview.jpg" alt="A deployment: its status and lifecycle actions, the node, managed-service and pipeline tiles, and the settled run reporting how many steps did no work" /></a>

<div id="shot-1" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-1-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/console/deployment-overview.jpg" alt="A deployment: its status and lifecycle actions, the node, managed-service and pipeline tiles, and the settled run reporting how many steps did no work" loading="lazy" />
    <figcaption>A deployment: its status and lifecycle actions, the node, managed-service and pipeline tiles, and the settled run reporting how many steps did no work</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-1-thumb">Close</a>
</div>

Destroy sits behind a confirmation **and** a separate permission from the other
three, so an operator who may restart a deployment is not thereby entitled to
delete one.

> Re-running the pipeline is not a substitute for **Start**. On a stopped
> deployment every step would find its work already done, skip, and flip the
> deployment to active without starting anything. The console refuses it.

Individual machines have their own controls — start, stop, reboot, and a
refresh that only re-reads status. All of them, and the four above, are refused
on the provider that hosts G8Deck's own control plane. Workloads are redeployed
one at a time from the workloads list, without disturbing the rest of the
deployment.

## Environment variables

A workload's variables are edited in place as rows, or as a pasted dotenv
block, and written in **one batch save** — no per-row writes, so a refused
entry leaves nothing partially applied. Two rules are enforced on the way in,
because the runtime fails silently on both:

- A key must be letters, digits and underscores, and must not start with a
  digit. A key systemd cannot parse is dropped outright — absent at runtime,
  with nothing in the journal to say so.
- A value cannot contain a newline. An environment file cannot represent one;
  systemd reads the remainder as further variables, so one pasted multi-line
  secret silently becomes several variables named from the middle of it.

Saved variables **apply on the next deploy**; nothing restarts when you press
save. Variables found in the workload's own `.env.example` appear as a seed you
can promote into the draft — importing them changes only what you are editing,
because the seed keeps applying underneath either way.

> On G8Deck's agent-facing MCP surface the same column is written by
> `set-workload-env`, and there the rules are stricter: it **merges** into what
> is stored rather than replacing it, values travel inbound only, and the
> response names each key and whether it was added, changed, unchanged, removed
> or generated — never the value. A value nobody needs to read, `APP_KEY` above
> all, is generated where it is stored, so it never enters a transcript at all.

## Logs

The log viewer tails one target at a time — a workload, its application log
file, a managed service, or a node — in 100, 500 or 1000 lines. Nothing is
stored: every refresh is a fresh tail from the provider.

**Output is redacted unless you hold `deployments.view.logs-raw`.** The viewer
states which of the two you got, so a masked value is never mistaken for a real
one.

![The log viewer tailing a workload: the target and tail-size selects, and the notice stating that known credentials are masked as [redacted] on screen and in downloads](/docs/console/deployment-logs.jpg)

## Health readings

Health is sampled per provisioned node, including adopted machines that G8Deck
did not create. What is recorded is only what something actually reports:

- CPU and memory come from the node agent.
- The error rate is a **liveness probe**, not an HTTP error rate: full marks
  against a node the provider will not report as running, zero otherwise.
- Requests per second and latency stay at zero. Nothing measures them yet, and
  a plausible guess in a column alert rules threshold on is worse than a zero.

The reading to be careful with is degradation over a window. **A null figure
means insufficient evidence, never a clean bill of health.** Two conditions
have to hold before any number is returned: at least two distinct readings, and
an oldest reading covering at least half the window. A monitor that started
twenty seconds ago has not observed five minutes of anything.

## Endpoints

A workload's ports and domains are edited together, and the distinction is what
catches people out. A **published port binds loopback** unless the workload
declares public exposure — siblings still reach it by network alias, the
outside world does not, and published is not the same as reachable. A
**domain** routes through the reverse proxy, which is what makes a workload
answerable from outside the host. Both apply on the next deploy.

## Scaling

Scaling policies are attached to a blueprint layer: a metric, a scale-up and a
scale-down threshold between 0 and 100, and minimum and maximum replica counts.
The scale-down threshold must be lower than the scale-up one, and the minimum
is at least one replica.

An evaluation cycle can be run now rather than waiting for the scheduler, and
**it is a dry run by default** — pressing evaluate reports what the policies
make of the current load without resizing anything. Applying is a deliberate
second action.

## Drift

Drift is the difference between the blueprint G8Deck holds and what the
provider actually reports. Replica counts are read by asking the provider about
each machine, never by counting rows: a row saying "running" beside a VM that
no longer exists is exactly the drift being looked for.

Recording the baseline and detecting against it are **two separate actions, on
purpose** — recording immediately before detecting makes the desired state
equal to the current state by construction, so nothing can ever be found to
have drifted.

> An empty drift list over a deployment with no baseline certifies nothing.
> The console says whether a baseline exists rather than letting the empty list
> read as "no drift".

Two kinds of drift reconcile themselves — a replica mismatch and a missing
component, both corrected by scaling the layer back to its desired count.
Everything else is reported and waits for you to resolve it.

<a class="shot" id="shot-2-thumb" href="#shot-2" aria-label="Enlarge: The operations page: scaling policies with Evaluate and Apply as separate actions, recent scaling events, drift findings, and auto-rollback armed with its threshold, window and scope"><img src="/docs/console/deployment-operations.jpg" alt="The operations page: scaling policies with Evaluate and Apply as separate actions, recent scaling events, drift findings, and auto-rollback armed with its threshold, window and scope" /></a>

<div id="shot-2" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-2-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/console/deployment-operations.jpg" alt="The operations page: scaling policies with Evaluate and Apply as separate actions, recent scaling events, drift findings, and auto-rollback armed with its threshold, window and scope" loading="lazy" />
    <figcaption>The operations page: scaling policies with Evaluate and Apply as separate actions, recent scaling events, drift findings, and auto-rollback armed with its threshold, window and scope</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-2-thumb">Close</a>
</div>

## Promotion between environments

A promotion moves a deployment to another environment **of the same project**.
The source must be healthy, and the target must not be the environment it is
already in.

Raising the request runs the gates that the platform can actually answer:

| Check         | Passes when                                                           |
| ------------- | --------------------------------------------------------------------- |
| `health`      | The source is active, and the latest reading shows it serving         |
| `drift_clean` | No unresolved drift — drifted infra means promoting a wrong blueprint |
| `test`        | Only created when the pipeline requires one                           |
| `manual`      | The approver signs off; never passed by the engine itself             |

A check is only created when it can genuinely fail, which is why a pipeline
that asks for no test gets no test row: a permanently green gate is worse than
an absent one. G8Deck runs no test suite of its own, so a pipeline that _does_
require one fails with that as the reason.

Approval creates the target deployment pinned to the exact image tags the
source is running, with the target environment's overrides applied — and leaves
it **pending**. It is not provisioned for you, for the same reason a new
deployment is not: standing up infrastructure is an explicit act. The one
exception is an auto-promote pipeline, where "automatic" is precisely the
promise that no human touches it.

## Rollback

Rollback is planned first and executed second, never in one click. Every plan
has a scope:

| Scope                   | Reverts                                        |
| ----------------------- | ---------------------------------------------- |
| **Full**                | Infrastructure and workloads together          |
| **Workload only**       | The previous workload release; infra untouched |
| **Infrastructure only** | Infra configuration; the workload untouched    |

You can also arm automatic rollback on sustained health degradation: a
threshold percentage, a window between one minute and one hour, and the scope
to use. The monitor honours the null rule above — with too little evidence to
judge the window, it does nothing rather than rolling back on the single sample
taken while a node was restarting.

## Where to go next

Set an alert rule against the health readings, or point G8Deck at servers you
already run and adopt them into the fleet.
