---
title: MCP and AI automation
nav: Overview
description: G8Deck's automation surface is five Model Context Protocol servers on the console. Which one to use, who can reach each, the two locks every call passes, how secrets are kept out of transcripts, and how errors read.
section: mcp
order: 10
updated: 2026-10-27
---

G8Deck has no REST API to script against. Its automation surface is a set of
**MCP servers** — Model Context Protocol, the protocol AI clients such as Claude
Code, Claude, ChatGPT, Cursor and VS Code use to call tools. An agent works with
the same permissions and refusals as the person behind it.

## Five servers, one per audience

| Server         | Endpoint                            | For                                                                                                           | Reference                          |
| -------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **Customer**   | `https://g8deck.app/mcp`            | The one URL most people add: deploy a repository in two or three calls, then status, logs, redeploy, rollback | [Customer](/docs/mcp/customer)     |
| **Design**     | `https://g8deck.app/mcp/design`     | Organisations, teams, projects, environments, blueprints — nothing is provisioned                             | [Design](/docs/mcp/design)         |
| **Ops**        | `https://g8deck.app/mcp/ops`        | Run and troubleshoot deployments, applications, domains, env, caches, backups, storage                        | [Ops](/docs/mcp/ops)               |
| **Platform**   | `https://g8deck.app/mcp/platform`   | Servers, setup, cloud servers, database and storage servers, adoption, patching, quotas                       | [Platform](/docs/mcp/platform)     |
| **Compliance** | `https://g8deck.app/mcp/compliance` | Evidence, access reviews, vulnerabilities, secret rotations, certificates                                     | [Compliance](/docs/mcp/compliance) |

The server is the first privilege boundary: a tool not registered on a server
cannot be reached through it, whatever the caller holds. Which servers a role
reaches:

| Role                                 | Customer | Design | Ops | Platform | Compliance |
| ------------------------------------ | :------: | :----: | :-: | :------: | :--------: |
| `user` — the role every sign-up gets |   Yes    |  Yes   | Yes |    —     |     —      |
| `member` — the limited tier          |   Yes    |   —    | Yes |    —     |     —      |
| G8Deck's own operators               |   Yes    |  Yes   | Yes |   Yes    |    Yes     |

The customer server is gated by the ops permission: every tool on it is an ops
tool or a thin wrapper over one. Platform and compliance are for the people who
run G8Deck itself, not for customers.

Each reference page is **generated from the application's source**, so its
tool list, parameters and tiers match what the server actually registers.

## Two locks on every call

A call passes two separate checks, and the narrower one wins:

- **Your permissions** — what _you_ may do: which servers, which operations,
  and as which organisation role. Write tools ask exactly the question the
  console's own buttons ask.
- **The token's tier** — what _this token_ may do, so a read-only token for a
  dashboard cannot destroy anything even when its owner could.

| Tier        | Abilities                              | Use it for                            |
| ----------- | -------------------------------------- | ------------------------------------- |
| **Read**    | `mcp:read`                             | Dashboards, diagnosis, CI checks      |
| **Write**   | `mcp:read`, `mcp:write`                | Deploys, scaling, environment changes |
| **Destroy** | `mcp:read`, `mcp:write`, `mcp:destroy` | Deletes, rollbacks, revocations       |

A token can be narrower than you are, never wider. A tool you can see but lack
the permission for answers `permission_denied` and names the permission to ask
an administrator for, rather than pretending it does not exist.

## Values go in, never out

**Secret and credential values never cross the MCP boundary outward.** Tools
take a value inbound — an environment variable, a secret, a database
connection — and their responses name the **key** and what happened to it:
added, changed, unchanged, removed or generated. No read tool returns a value.

- `set-workload-env` can **generate** a value where it is stored — `APP_KEY`
  above all — so a secret nobody needs to read never enters a transcript.
- `create-database-user` generates the password and never returns it; it is
  revealed on the server's page, behind a permission, and audited.
- Read tools report which credential _fields_ are set. The one exception is an
  SSH host key fingerprint, which is trust state to compare, not a secret.
- Logs are redacted unless you hold the raw-logs permission, and the response
  says which you got.
- Anything read from a repository is returned as **data**, never as
  instructions, so a file in a repository cannot steer the agent reading it.

## Destructive calls

A tool in the destroy tier needs a token carrying `mcp:destroy`, and nearly all
of them also need an identifying value **retyped** into a confirmation argument
— the deployment's name, an environment's slug, a server's SSH address, a
database server's `host:port`. The value is chosen so it cannot repeat across
rows: environment names repeat ("Production"), so environments confirm on the
slug. A mismatch is refused **and audited**.

Read what each one actually destroys — the reference page says. Deleting a
server or a database server from G8Deck removes a record; the machine keeps
running and keeps billing unless the tool is told, explicitly, to delete a
machine G8Deck created.

## The organisation every call acts on

Every tool takes an optional `organization` (uuid or slug). Omit it and your
default is used; the organisation actually used is **echoed on every response**,
so check it rather than assuming. Records are identified by uuid — or a slug
where they have one — never by an internal number.

Reaching an organisation you are not a member of needs a cross-tenant
permission no customer role holds, and every such call is written to that
organisation's audit trail. A token from an OAuth sign-in is bound to the one
organisation chosen at consent and cannot reach any other.

An organisation owner or administrator can switch **AI access** off in the
organisation's settings. Every MCP call for that organisation is then refused —
existing tokens are kept and work again when it is switched back on.

## Rate limits

Two limits apply to every call:

| Limit                                              | Read | Write | Destroy |
| -------------------------------------------------- | :--: | :---: | :-----: |
| Per person, per minute, across all tokens and apps |  60  |  20   |    5    |
| Per AI app, per person, per minute (OAuth only)    |  30  |  10   |    3    |

On top of those, each endpoint has a floor: 60 requests a minute on `/mcp`,
`/mcp/design` and `/mcp/ops`; 30 on `/mcp/platform` and `/mcp/compliance`,
because those reach real infrastructure. Over a limit, the error says which
budget ran out and when it refills.

## Reading an error

Errors carry a stable code beside the message, and a `retryable` flag:

```json
{ "error": { "code": "ability_denied", "message": "…", "retryable": false } }
```

| Code                    | What to change                                               | Retry? |
| ----------------------- | ------------------------------------------------------------ | :----: |
| `not_authenticated`     | The token — it is missing or not recognised                  |   No   |
| `server_access_denied`  | Your role does not reach this server                         |   No   |
| `permission_denied`     | Your role — the message names the permission                 |   No   |
| `ability_denied`        | The token — create one at a higher tier                      |   No   |
| `cross_tenant_denied`   | The `organization` argument                                  |   No   |
| `ai_access_disabled`    | An administrator switched AI access off for the organisation |   No   |
| `capability_simulated`  | The provider — the capability is a declared fake there       |   No   |
| `conflict`              | The record's state, not your request                         |   No   |
| `invalid_argument`      | The arguments                                                |  Yes   |
| `confirmation_mismatch` | The retyped value; the expected shape is named               |  Yes   |
| `not_found`             | The identifier                                               |  Yes   |
| `rate_limited`          | Wait — the error says until when                             |  Yes   |

An authorisation failure refuses the same call every time, so retrying it only
spends budget.

## Start here

[Connect an AI client](/docs/mcp/connect), then call `whoami` first on any
server: it reports your roles, the servers you can reach, your token's tier and
which organisation is used when you omit the argument. On the ops server,
`list-deployments` and `diagnose-deployment` answer most questions.
