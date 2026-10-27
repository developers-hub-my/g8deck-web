---
title: Organisations, teams, projects and environments
nav: Organisations and projects
description: The containers everything in G8Deck lives in — what each one holds, who creates it, and how they nest from the organisation down to a single deployment.
section: concepts
order: 10
updated: 2026-10-27
---

Everything in G8Deck sits inside five nested containers. Each one answers a
different question, and knowing which is which tells you where a setting lives
and who may change it.

```text
Organisation      who holds the servers, the data services and the bill
  └─ Team         who may change which applications
       └─ Project a product or a piece of work
            └─ Environment   production, staging, development …
                 └─ Deployment   one application running in one environment
```

| Container        | Holds                                                                           | Created by                                          |
| ---------------- | ------------------------------------------------------------------------------- | --------------------------------------------------- |
| **Organisation** | Servers, database / cache / storage servers, backups, quotas, members, the plan | You, at sign-up; more from **Organizations**        |
| **Team**         | Projects, members with a team role, and the servers the team may deploy to      | An organisation owner or administrator              |
| **Project**      | Applications and their environments                                             | A team lead, or an organisation owner/administrator |
| **Environment**  | The deployments of a project in one stage                                       | A team lead, or an organisation owner/administrator |
| **Deployment**   | The servers, services and applications provisioned for one environment          | The application wizard, or **Deployments**          |

## Organisations

Signing up creates an organisation you own, with a first team led by you, so
you can connect a server and deploy on day one. Joining someone else's
organisation adds to that; it does not take it away. The switcher at the top of
the sidebar decides which organisation every page shows — and which one a new
application lands in.

![The Organizations page: every organisation you own or belong to, your role in each, and which one is current](/docs/organisations-and-projects/organizations.webp)

An organisation has three roles — **owner**, **administrator** and **member** —
and only the owner and administrators can touch the infrastructure. The detail
is in [Teams, roles and server access](/docs/teams-and-access).

## Teams

A team is where people meet applications. A team member deploys onto the
organisation's servers without being able to change those servers — and only
onto the servers the team has been **allocated**. Inside a team there are three
roles: **lead**, **member** and **viewer**.

## Projects

A project groups the applications of one product. It belongs to exactly one
team, and **Organization → Projects** lists them with their environments and
live deployments. A project can be moved to another team, or to [another
organisation](/docs/move-a-project) you also administer.

![The Projects page: projects across every team, their status, and how many environments and live deployments each has](/docs/organisations-and-projects/projects.webp)

## Environments

An environment is a stage of a project. There are six types:

| Type          | Notes                              |
| ------------- | ---------------------------------- |
| `local`       |                                    |
| `development` |                                    |
| `staging`     |                                    |
| `production`  | Treated as production-like         |
| `dr`          | Disaster recovery; production-like |
| `preview`     |                                    |

The application wizard creates the environment it needs, so you rarely make
one by hand. When you do, use **New Environment** on the Environments page
(`/environments`).

![The Environments page: each environment with its type and how many deployments it holds](/docs/organisations-and-projects/environments.webp)

## Deployments

A deployment is one application's footprint in one environment: the servers
it was placed on, the managed services provisioned for it, the applications
attached to it and the pipeline that built it. Your plan's **App environments**
limit counts deployments — one application in production and the same one in
staging is two. A deploy or a release never creates a new one, so deploys are
unlimited on every plan, and a deployment that is deleted, or that failed
without ever holding a server, frees its slot.

How an application, a deployment and a release relate is the next page:
[Applications, deployments and releases](/docs/applications-and-deployments).
