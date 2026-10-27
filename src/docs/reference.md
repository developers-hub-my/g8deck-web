---
title: Reference
description: The fixed lists the console is built on — deployment and step statuses, the twenty-four provisioning steps, environment types, build presets, engines, roles and limits — in one place.
section: help
order: 20
updated: 2026-10-27
---

The lists below are the ones other pages refer to. Each is taken from the
application's code, not from a description of it.

## Deployment statuses

The console shows the label; the MCP tools return the value.

| Label            | Value          | Means                                                              |
| ---------------- | -------------- | ------------------------------------------------------------------ |
| **Pending**      | `pending`      | Created, waiting for the pipeline to pick it up                    |
| **Provisioning** | `provisioning` | The pipeline is provisioning resources                             |
| **Active**       | `active`       | All components healthy and serving traffic                         |
| **Degraded**     | `degraded`     | One or more components unhealthy                                   |
| **Scaling**      | `scaling`      | A scale-up or scale-down is in progress                            |
| **Maintenance**  | `maintenance`  | An operator-initiated maintenance window                           |
| **Stopped**      | `stopped`      | Stopped; resources kept for a later **Start**                      |
| **Deleting**     | `destroying`   | Being torn down                                                    |
| **Deleted**      | `destroyed`    | All resources released; the record is kept until it is deleted too |
| **Failed**       | `failed`       | The pipeline stopped at a step; the reason is on the page          |

## Pipeline step outcomes

| Outcome       | Means                                                                         |
| ------------- | ----------------------------------------------------------------------------- |
| `pending`     | Not reached yet                                                               |
| `running`     | In progress                                                                   |
| `success`     | Did its work                                                                  |
| `failed`      | Stopped the run; the error is recorded                                        |
| `rolled_back` | Had succeeded, and was undone after a later step failed                       |
| `skipped`     | **Did no work** — a capability it needed is simulated; the reason is recorded |

## The provisioning pipeline

Every deployment runs these twenty-four steps, in this order. Each is
idempotent, so a re-run repeats nothing that already succeeded.

| #   | Step                       | #   | Step                        |
| --- | -------------------------- | --- | --------------------------- |
| 1   | Validate blueprint         | 13  | Register service discovery  |
| 2   | Assign preview domains     | 14  | Issue internal certificates |
| 3   | Preflight workloads        | 15  | Provision mail sandbox      |
| 4   | Check resource quota       | 16  | Inject secrets              |
| 5   | Reserve resources          | 17  | Deploy workloads            |
| 6   | Bootstrap nodes            | 18  | Run health checks           |
| 7   | Provision networks         | 19  | Run post-install            |
| 8   | Apply firewall policies    | 20  | Configure observability     |
| 9   | Provision managed services | 21  | Configure DNS               |
| 10  | Provision compute nodes    | 22  | Issue SSL                   |
| 11  | Configure load balancer    | 23  | Record desired state        |
| 12  | Configure reverse proxy    | 24  | Notify                      |

## Server setup steps

Connecting or creating a server runs sixteen steps on the machine — listed in
[Connect a server](/docs/connect-a-server#what-setup-does-to-the-machine).

## Environment types

`local`, `development`, `staging`, `production`, `dr` (disaster recovery) and
`preview`. `production` and `dr` are treated as production-like.

## Build presets

`Dockerfile` when the repository ships its own, otherwise one of nine:
`static`, `laravel`, `node`, `nextjs`, `astro`, `python`, `django`, `symfony`
and `go`.

## Engines

| Service               | Engines                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Database servers      | PostgreSQL, MySQL, MariaDB, MongoDB, ClickHouse                                              |
| PostgreSQL extensions | `vector`, `postgis`                                                                          |
| File databases        | SQLite                                                                                       |
| Cache instances       | Valkey, Redis                                                                                |
| Storage servers       | Garage                                                                                       |
| Connected buckets     | Amazon S3, Cloudflare R2, Wasabi, DigitalOcean Spaces, Garage, Ceph RGW, other S3-compatible |
| Cloud servers         | DigitalOcean                                                                                 |

## Roles

| Scope        | Roles                                  | Detail                                                   |
| ------------ | -------------------------------------- | -------------------------------------------------------- |
| Organisation | owner, administrator, member           | [Teams, roles and server access](/docs/teams-and-access) |
| Team         | lead, member, viewer                   | [Teams, roles and server access](/docs/teams-and-access) |
| MCP token    | `mcp:read`, `mcp:write`, `mcp:destroy` | [MCP and AI automation](/docs/api-and-automation)        |

## Limits worth knowing

| Limit                           | Value                                        |
| ------------------------------- | -------------------------------------------- |
| Uploaded application archive    | 100 MB, `.zip` or `.tar.gz`                  |
| Application name                | 2–120 characters                             |
| Invitation lifetime             | 7 days; resending starts a new 7 days        |
| Scheduled task timeout          | 5 – 86,400 seconds                           |
| Waiting for a new cloud server  | Up to 10 minutes for an address and SSH      |
| Push-to-deploy deliveries kept  | The last 50                                  |
| Certificate renewal             | Twice a day; renews within 30 days of expiry |
| MCP calls per person per minute | 60 read, 20 write, 5 destroy                 |
| MCP personal access token       | Does not expire; revoke it                   |
| MCP OAuth access                | 1 hour, refreshed for up to 30 days          |
