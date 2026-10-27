---
title: Teams, roles and server access
nav: Teams and roles
description: Who can do what — organisation roles, team roles, which servers a team may deploy to, how people are invited, and how quotas differ from plan limits.
section: people
order: 10
updated: 2026-10-27
---

Access in G8Deck is decided in three layers, each narrower than the one above
it. The organisation decides who holds the infrastructure. Teams decide who may
change which application, and on which servers. Your account is simply who you
are.

| Layer            | Roles                        | What it decides                                              |
| ---------------- | ---------------------------- | ------------------------------------------------------------ |
| **Account**      | —                            | Who you are; the sign-in email everything else is keyed on   |
| **Organisation** | Owner, administrator, member | Servers, data services, backups, quotas, people and the plan |
| **Team**         | Lead, member, viewer         | Projects and applications, and which servers they may use    |

Every check is made on the action itself, the same way in the console and on
the [MCP servers](/docs/api-and-automation). A tool that can _see_ a deployment
is not thereby allowed to change it: the write tools ask exactly the question
the console's buttons ask.

## The organisation holds the infrastructure

An organisation's **owner** and its active **administrators** are the only
people who can:

- connect, create, upgrade, patch and delete servers;
- create and manage database, storage and cache servers, reveal their
  credentials, and browse the objects in a bucket;
- manage backups — restore, transfer, download, and the destinations they are
  sent to;
- set quotas;
- invite, remove and change the role of members, create or delete teams, and
  allocate servers to teams;
- move projects to another organisation they also administer.

Administrators manage members. Only the **owner** can change or remove another
administrator, so no administrator can quietly demote the rest. Ownership
itself moves only by a transfer the new owner accepts.

## Teams hold the applications

![A team's page: its projects, the servers it can deploy to with the Allocate button, and its members](/docs/teams-and-access/team.webp)

Inside a team, three roles:

- **Lead** — manages the team's members, creates projects and environments,
  manages every application in the team, and approves or rejects promotions.
- **Member** — deploys into the team's projects and manages the deployments
  they created. Nobody else's.
- **Viewer** — reads everything the team holds and changes none of it.

Only an **active** membership counts. Someone deactivated in the team, or in
the organisation, holds no team role even though the record is kept.

A promotion is never decided by the person who asked for it — not in the
console, not over MCP, and not in the engine underneath both.

## Server allocation

A team may deploy only to the servers **allocated** to it. On the team's page,
**Allocate** opens _Servers this team can deploy to_: tick the servers and
save — the list you save replaces the old one. Organisation owners and
administrators are not limited by it.

![The allocation dialog: each of the organisation's servers with a checkbox, and Save](/docs/teams-and-access/allocate-servers.webp)

| Effect                     | What happens                                                                                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A team with no servers** | Its members cannot deploy until an administrator allocates one — the wizard says so                                                                            |
| **Deploying elsewhere**    | Refused, naming the team and the server: _an organisation administrator can allocate it from the team page_                                                    |
| **Removing a server**      | Nothing already deployed is touched, and the server itself is not changed                                                                                      |
| **What members see**       | **Servers**, **Databases**, **Cache**, **Storage** and the rest list only what is on servers allocated to a team they belong to. A member of no team sees none |

Allocation is audited. Over MCP it is `set-team-servers` on the [design
server](/docs/mcp/design).

## Who can do what

| Action                                           | Org owner / admin |  Team lead   | Team member | Team viewer |
| ------------------------------------------------ | :---------------: | :----------: | :---------: | :---------: |
| Connect, create or delete servers                |        Yes        |      —       |      —      |      —      |
| Database, storage and cache servers; credentials |        Yes        |      —       |      —      |      —      |
| Restore, transfer or download backups            |        Yes        |      —       |      —      |      —      |
| Set quotas                                       |        Yes        |      —       |      —      |      —      |
| Invite people, change organisation roles         |        Yes        |      —       |      —      |      —      |
| Create or delete teams; allocate servers         |        Yes        |      —       |      —      |      —      |
| Add organisation members to a team               |        Yes        |     Yes      |      —      |      —      |
| Create projects and environments                 |        Yes        |     Yes      |      —      |      —      |
| Deploy an application into the team              |        Yes        |     Yes      |     Yes     |      —      |
| Change, restart or re-run a deployment           |        Any        |     Any      |  Their own  |      —      |
| Approve or reject a promotion                    |   Yes, not own    | Yes, not own |      —      |      —      |
| See the team's projects and deployments          |        Yes        |     Yes      |     Yes     |     Yes     |

## Getting people in

**Everyone starts with their own organisation.** Signing up creates one the new
account owns. Joining yours adds to that; it does not take it away.

**Invitations bring them into yours.** An owner or administrator invites by
email address, as an administrator or a member, from the organisation's
**Members** settings — one address or many at once:

- the invitation is bound to that address — the person accepts it signed in
  with the same email;
- it carries the role it grants;
- it expires after seven days. **Resend** issues a fresh link and a fresh seven
  days, and the old link stops working;
- your plan's seat limit is checked when you invite and again when they accept.

**Then put them in a team.** Once someone is an active member of the
organisation, an administrator or a team lead adds them on the team's page with
**Add members** and picks lead, member or viewer.

## Quotas and plan limits

These are two different things.

- **Quotas** are yours to set, under **Quotas**. CPU, memory, storage, backup
  storage, bandwidth, app environments and nodes can be capped per organisation, per
  team or per user, with per-deployment caps too. For each field, the nearest
  scope wins — a user's own quota, then their team's, then the organisation's —
  and a field left at **0** does not constrain at that scope. A deployment over
  quota is refused before provisioning starts, not halfway through.
- **Plan limits** are what the subscription includes: servers, seats and **app
  environments** — one application in one environment. Deploys and releases are
  unlimited on every plan.

![The Resource Quotas page: how scopes override each other, and the empty state when no quota is set](/docs/teams-and-access/quotas.webp)
