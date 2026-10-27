---
title: Patching and upgrades
nav: Patching
description: How security releases reach your servers — the organisation's patch policy, the Patches page, patching the fleet now, restarts that wait, and the servers G8Deck deliberately leaves alone.
section: servers
order: 30
updated: 2026-10-27
---

Two different things keep a server current, and the console keeps them apart:

| Action      | What it changes                                                      | Where       |
| ----------- | -------------------------------------------------------------------- | ----------- |
| **Patch**   | Applies security releases to the runtimes and services on the server | **Patches** |
| **Upgrade** | Brings the G8Deck stack on a server to the current version           | **Servers** |

Both skip servers they must not touch, and say why.

## The patch policy

An organisation owner or administrator sets the policy under **Organization →
Settings → Patching** (the **Patch policy** button on the Patches page goes
there).

| Setting                                          | What it decides                                                                                                                                  |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Mode**                                         | **Automatic** (recommended), **Notify only** or **Manual**. The last two need you to accept the risk in writing — the acknowledgement is audited |
| **What to apply**                                | Security releases only, or all                                                                                                                   |
| **Maintenance window**                           | Days, start, end and timezone. The schedule is checked every 15 minutes                                                                          |
| **Allow disruptive restarts in the window**      | Whether a restart that drops connections may happen inside the window                                                                            |
| **Patch critical advisories outside the window** | For CVSS 9 or actively exploited advisories — graceful reloads only                                                                              |
| **Extra email addresses**                        | Up to 20 more people to tell                                                                                                                     |
| **Webhook URL**                                  | HTTPS only, stored encrypted, every call HMAC-signed                                                                                             |

The same tab lists the **security advisories affecting your servers**, each
with **Patch now** and **Postpone 24h**.

A single server can be given a stricter policy than the organisation's from its
row menu on the Patches page — never a looser one.

## The Patches page

**Patches** lists every server with its policy, what was patched last, and
whether something is waiting for a restart. Status chips filter by mode.

![The Patches page: servers, scheduled, not scheduled and waiting-for-restart counts, the mode filters, and each server with its policy and last patch](/docs/patching/patches.webp)

## Patch the fleet now

**Patch** opens _Patch the fleet_:

1. **What to patch** — PHP, Node.js, Python, nginx, MySQL, MariaDB,
   PostgreSQL, Redis, Valkey, the container runtime, or OS security updates.
2. **Restart now** — clients see the daemon go away for a moment. Leave it off
   and the restart waits for you.
3. **Include the control plane** — off unless you tick it.

The run patches **one canary first, then the rest at once**. It is refused
while a patch of the same target is already running, and when no server is
both reachable and G8Deck-managed.

## Servers that are not patched

A server is left out, with the reason shown beside it, when it is:

| Reason                           | Why                                         |
| -------------------------------- | ------------------------------------------- |
| **Adopted**                      | Another panel owns its packages             |
| **The control plane**            | Patched only when you ask for it explicitly |
| **Protected**                    | The protection lock refuses it              |
| **Unreachable**                  | It cannot be reached to patch               |
| **Policy: notify only / manual** | The policy says not to                      |

## Restarts that wait

A patch that needs a restart you did not allow leaves the server **waiting for
restart**. From the list you can **Restart now**, **Schedule** a restart, or
**Cancel scheduled restart**. G8Deck does not reboot servers: an OS security
update that needs a reboot is yours to schedule. Restarts are refused while a
patch run is active.

## Upgrade the stack

On **Servers**, **Upgrade N servers, one at a time** brings every server that
is behind to the current G8Deck stack; a single server has **Upgrade to
version** in its header. Adopted, protected and unreachable servers are left
out, and the upgrade is refused while another one is running or when nothing is
behind.

## From an AI client

The same operations exist on the [platform MCP server](/docs/mcp/platform):
`get-patch-policy`, `set-patch-policy`, `patch-fleet`, `restart-pending`,
`list-advisories`, `get-advisory-exposure` and `upgrade-fleet`.
