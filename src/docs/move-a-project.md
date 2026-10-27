---
title: Move a project to another organisation
nav: Move a project
description: Re-home one or more projects — with the servers, data services and integrations only they use — into another organisation you administer. What moves, what is cloned, what stays, and what refuses the move.
section: people
order: 20
updated: 2026-10-27
---

A project can move to another organisation together with the infrastructure
**only it uses**. The move is bookkeeping: no machine is touched, nothing is
copied between servers, and moving back reverses it.

## Who can move a project

You need to administer **both** organisations — owner or administrator of the
one the project is in and of the one it is going to. The target list only offers
organisations you administer. A **locked** project cannot be moved.

## Move it

On **Organization → Projects**, open a project's row menu and choose **Move to
organisation…** — or select several projects and use the bulk action. Projects
that share infrastructure should move together.

![The Projects page, where each row's menu offers Move to organisation](/docs/organisations-and-projects/projects.webp)

Before you confirm, the dialog works out the whole move and shows it:

| The preview lists | Meaning                                                                              |
| ----------------- | ------------------------------------------------------------------------------------ |
| **Moves**         | Everything that changes organisation                                                 |
| **Refusals**      | Why the move cannot happen yet — the confirm button appears only when there are none |
| **Clones**        | Blueprints copied into the target because something staying behind also uses them    |
| **Re-points**     | Integrations and backup policies that will use the target's own                      |
| **Left behind**   | Servers that look related but are not used by anything moving                        |
| **Notes**         | Anything worth knowing that does not block the move                                  |

The move is **all or nothing**, in one transaction.

## What moves

The projects, their environments, applications, deployments, scheduled tasks
and backup policies — and every server, database server, storage server, cache,
SQLite file, object storage connection, backup destination, integration and
blueprint that **only these projects** use.

What is shared is never taken away from the projects that stay:

- A **blueprint** a staying deployment also uses is **cloned** into the target,
  and the moving deployments point at the copy.
- An **integration** something staying uses stays. Moving servers are re-pointed
  to the target's own integration of the same provider, so the target needs one.
- **History stays with the source**: the audit trail, invoices and receipts,
  usage records, patch runs and fleet-upgrade runs.

## What refuses a move

The preview names each one:

- you do not administer the source or the target;
- the projects already belong to the target, or come from different
  organisations;
- a project is locked;
- a deployment is provisioning, being deleted, or scaling;
- shared infrastructure is still used by something staying behind;
- a backup destination is the platform's own, or a policy that stays still
  points at a destination that would move;
- the target has no backup destination to take the moving policies;
- the target lacks a matching git credential, GitHub App installation or
  integration;
- a cloud server is not visible to the target's integration — another account,
  or gone;
- the target's plan has no room for the servers or app environments arriving.

## From an AI client

`move-project-to-organization` on the [design server](/docs/mcp/design) is the
same action. Its `dry_run` defaults to **true**, so the first call only shows
you the plan; pass `dry_run: false` to apply it.
