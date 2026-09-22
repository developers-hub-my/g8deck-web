---
title: Teams and access
description: Who can do what — your account, your role in the organisation, and your role in a team — how people get in, and how quotas and plan limits relate.
order: 15
updated: 2026-09-22
---

Access in G8Deck is decided in three layers, each narrower than the one above
it. The organisation decides who holds the infrastructure. Teams decide who may
change which application. Your account is simply who you are.

| Layer            | Roles                        | What it decides                                             |
| ---------------- | ---------------------------- | ----------------------------------------------------------- |
| **Account**      | —                            | Who you are; the sign-in email everything else is keyed on  |
| **Organisation** | Owner, administrator, member | Servers, managed data services, backups, quotas and people  |
| **Team**         | Lead, member, viewer         | Projects and applications, and who may change which of them |

Every check is made on the action itself, the same way in the console and in
the [MCP servers](/docs/api-and-automation). A tool that can _see_ a deployment
is not thereby allowed to change it: the write tools ask exactly the question
the console's buttons ask.

## The organisation holds the infrastructure

An organisation's **owner** and its active **administrators** are the only
people who can:

- connect or provision servers, and manage node pools;
- create and manage database, storage and cache servers, reveal their
  credentials, and browse the objects in a bucket;
- manage backups — restore, transfer, download, and the destinations they are
  sent to;
- set quotas;
- invite, remove and change the role of members, and create or delete teams.

Administrators manage members. Only the **owner** can change or remove another
administrator, so no administrator can quietly demote the rest and take the
organisation over. Ownership itself moves only by a transfer the new owner
accepts.

Owners and administrators see and manage every team in the organisation. A
plain organisation member sees only the teams they belong to — in lists, in
filters and in every picker.

## Teams hold the applications

Inside a team, three roles:

- **Lead** — manages every application in the team, adds existing organisation
  members to it, creates projects, and approves or rejects promotions.
- **Member** — creates applications and manages the ones they created. Nobody
  else's.
- **Viewer** — reads everything the team holds and changes none of it.

Only an **active** membership counts. Someone deactivated in the team, or in
the organisation, holds no team role even though the record of their membership
is kept.

A promotion is never decided by the person who asked for it. A lead cannot
approve their own request — not in the console, not through MCP, and not in the
promotion engine underneath both.

## Who can do what

| Action                                           | Org owner / admin |  Team lead   | Team member | Team viewer |
| ------------------------------------------------ | :---------------: | :----------: | :---------: | :---------: |
| Connect servers, manage node pools               |        Yes        |      —       |      —      |      —      |
| Database, storage and cache servers; credentials |        Yes        |      —       |      —      |      —      |
| Restore, transfer or download backups            |        Yes        |      —       |      —      |      —      |
| Set quotas                                       |        Yes        |      —       |      —      |      —      |
| Invite people, change organisation roles         |        Yes        |      —       |      —      |      —      |
| Create or delete teams                           |        Yes        |      —       |      —      |      —      |
| Add organisation members to a team               |        Yes        |     Yes      |      —      |      —      |
| Create projects                                  |        Yes        |     Yes      |      —      |      —      |
| Deploy an application into the team              |        Yes        |     Yes      |     Yes     |      —      |
| Change, restart or tear down a deployment        |        Any        |     Any      |  Their own  |      —      |
| Approve or reject a promotion                    |   Yes, not own    | Yes, not own |      —      |      —      |
| See the team's projects and deployments          |        Yes        |     Yes      |     Yes     |     Yes     |

A team member deploys onto the organisation's servers without being able to
change them. That is the point of the split: handing a team somewhere to run
its applications does not hand it the machines, the databases or the backups.

## Getting people in

**Everyone starts with their own organisation.** Signing up creates a personal
organisation that the new account owns, so anyone can connect a server of their
own and deploy to it on day one. Joining your organisation adds to that; it
does not take it away.

**Invitations bring them into yours.** An owner or administrator invites by
email address, as an administrator or a member:

- the invitation is bound to that address — the person accepts it signed in
  with the same email, on a verified account;
- it carries the role it grants, so there is no second step to set one;
- it expires after seven days. Resending issues a fresh link and a fresh seven
  days, and the old link stops working.

The sign-in email is the join key. Someone who signs up with a different
address than the one you invited cannot accept the invitation.

**Then put them in a team.** Once someone is an active member of the
organisation, an administrator or a team lead adds them to a team by email and
picks lead, member or viewer.

## Quotas and plan limits

These are two different things.

- **Quotas** are yours to set. CPU, memory, storage, deployment and node counts
  can be limited per organisation, per team or per user. For each limit, the
  most specific level that sets one applies — the user's own, then their
  team's, then the organisation's — so a user limit replaces the team and
  organisation limits rather than adding to them. A deployment over quota is
  refused before provisioning starts, not halfway through.
- **Plan limits** are what the subscription includes. The one that counts
  applications is **app environments**: one application in one environment,
  such as production. Deploys and releases are unlimited on every plan, and a
  launch that failed without ever holding a server does not use a slot.
