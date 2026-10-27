---
title: Operating what is running
nav: Operating deployments
description: Day two on a deployment — start, stop, restart and delete, logs, health, scaling, drift, promotion and rollback, and what each one really tells you.
section: apps
order: 50
updated: 2026-10-27
---

Your deployment reports **active**. Everything from here is day two: reading
what it is doing, changing what runs, moving it forward and putting it back.
Open **Advanced → Build → Deployments**, or follow **Open** from an
application's **Runs in** list.

![The Deployments list: each deployment with its environment, blueprint and status, with search and filters above](/docs/operating-deployments/deployments.webp)

A deployment page has its own sub-navigation — **Overview**, **Metrics**,
**Resources**, **Logs**, **Services**, **Secrets** and **Certificates** — and
the lifecycle actions in its header.

## Lifecycle actions

Each action is refused from a state it cannot apply to, and the refusal says
why, rather than running and being left half-done.

| Action      | Allowed from                 | What it does                                                                                      |
| ----------- | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| **Start**   | Stopped                      | Brings a stopped deployment back up on its existing resources                                     |
| **Stop**    | Active, Degraded             | Stops everything but keeps the resources for a later start                                        |
| **Restart** | Active, Degraded             | Stops and starts in place                                                                         |
| **Delete**  | Anything not already deleted | Releases every resource. It cannot be undone, and it is the only one of these that stops the bill |

![A deployment's overview: Promote, Stop, Restart and Re-run Pipeline in the header, and the node, service, application and pipeline tiles](/docs/operating-deployments/deployment.webp)

**Delete** sits behind a confirmation and its own permission, so someone who
may restart a deployment is not thereby allowed to delete one. The deployment
list offers two more acts, and the words after Delete say which:

| Control                 | What happens                                                                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Delete**              | Containers, nodes and networks are released and billing stops; blueprints and applications stay                                                                                   |
| **Force delete record** | Failed deployments only. Nothing is contacted — you are stating the infrastructure is already gone, and you are asked why. Anything still running keeps running and keeps billing |

> Re-running the pipeline is not a substitute for **Start**. On a stopped
> deployment every step would find its work already done, skip, and flip the
> deployment to active without starting anything. The console refuses it and
> points you at Start.

All lifecycle actions are refused on the server that hosts G8Deck's own
control plane.

## Re-run Pipeline

**Re-run Pipeline** is how you redeploy. It picks up where the last run
stopped: a step already marked success is not repeated, so a fixed cause plus a
re-run is cheaper than starting over. Only one run per deployment can be in
flight at a time. Saving domains also re-queues the DNS and certificate steps,
which is why the console asks you to re-run after adding one.

## Environment variables and secrets

Variables are edited per environment on the application's **Environment** tab
and apply on the next deploy; secrets declared for token references live on
the deployment's **Secrets** page. Both are covered in [Environment variables
and secrets](/docs/environment-variables).

## Logs

The log viewer tails one target at a time — an application, its log file, a
managed service, or a server — in 100, 500 or 1000 lines. Nothing is stored:
every refresh is a fresh tail, and **Download** saves what you see.

**Output is redacted unless you hold `deployments.view.logs-raw`.** The viewer
states which of the two you got, so a masked value is never mistaken for a real
one, and downloads follow the same rule.

![The log viewer: the target and tail selects, Refresh and Download, the notice saying whether output is redacted, and the latest lines](/docs/operating-deployments/logs.webp)

## Health readings

Health is sampled per server, including adopted machines G8Deck did not create.
What is recorded is only what something actually reports:

- CPU and memory come from the node agent.
- The error rate is a **liveness probe**, not an HTTP error rate.
- Requests per second and latency stay at zero. Nothing measures them yet, and
  a plausible guess in a column alert rules threshold on is worse than a zero.

**A missing degradation figure means insufficient evidence, never a clean bill
of health.** A figure is returned only once there are at least two distinct
readings and the oldest covers at least half the window.

## Scaling

The **Operations** page holds scaling policies, drift detection, rollback and
a cost estimate. A scaling policy is attached to a blueprint layer: a metric,
a scale-up and a scale-down threshold between 0 and 100, and minimum and
maximum replica counts. The scale-down threshold must be lower than the
scale-up one.

Evaluating the policies now **is a dry run by default** — it reports what the
policies make of the current load without resizing anything. Applying is a
second, deliberate action.

![The Operations page: estimated monthly cost, scaling policies and recent scaling events, drift detection and rollback](/docs/operating-deployments/operations.webp)

## Drift

Drift is the difference between the desired state G8Deck recorded and what the
provider actually reports. Replica counts are read by asking the provider about
each machine, never by counting rows.

Recording the baseline and detecting against it are **two separate actions, on
purpose** — recording immediately before detecting makes the desired state
equal to the current state, so nothing could ever be found to have drifted.

> An empty drift list over a deployment with no baseline certifies nothing.
> The drift page says so in amber rather than letting the empty list read as
> "no drift".

![The drift history page with no baseline recorded: the warning that nothing can be found to have drifted until one is](/docs/operating-deployments/drift.webp)

Two kinds of drift reconcile themselves — a replica mismatch and a missing
component, both corrected by scaling the layer back to its desired count.
Everything else is reported and waits for you.

## Promotion between environments

**Promote** moves a deployment to another environment **of the same project**.
The source must be healthy, and the target must differ from where it is.
Raising the request runs only the gates the platform can actually answer:

| Check         | Passes when                                                           |
| ------------- | --------------------------------------------------------------------- |
| `health`      | The source is active, and the latest reading shows it serving         |
| `drift_clean` | No unresolved drift — drifted infra means promoting a wrong blueprint |
| `test`        | Only created when the pipeline requires one                           |
| `manual`      | The approver signs off; never passed by the engine itself             |

Approval creates the target deployment pinned to the exact image tags the
source is running and leaves it **pending** — standing up infrastructure is an
explicit act. The person who asked cannot approve their own request.

## Rollback

Two kinds, for two questions:

- **Roll back to this**, on an application's **Releases** tab, reruns one
  earlier release's exact image without rebuilding.
- A **rollback plan**, on the Operations page, is planned first and executed
  second, with a scope: **Full** (infrastructure and applications),
  **Workload only**, or **Infrastructure only**.

You can also arm automatic rollback on sustained health degradation: a
threshold, a window between one minute and one hour, and the scope to use.
With too little evidence to judge the window, it does nothing rather than
rolling back on a single sample taken while a server restarted.
