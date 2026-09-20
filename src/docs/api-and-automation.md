---
title: API and automation
description: Drive G8Deck from an AI client or a script — how tokens are issued, which endpoints exist, what gates each server, and what a destructive call demands.
order: 50
updated: 2026-09-20
---

G8Deck's automation surface is not a REST API. It is four **MCP servers**
mounted on the console at [g8deck.app](https://g8deck.app), authenticated with
Sanctum personal access tokens and designed for a client that speaks Model
Context Protocol — Claude Code, Claude Desktop, or anything else that can send
an `Authorization` header.

Everything below is reachable with a token you issue yourself. Nothing here
needs a separate API key, a sandbox account, or an OAuth app.

## 1. Issue a token

Tokens are self-service, under **Settings → MCP Tokens** in the console. You
need the `mcp.access.tokens` permission, which the `user` and `member` roles
both hold — this is a customer feature, not an administrator one.

<a class="shot" id="shot-1-thumb" href="#shot-1" aria-label="Enlarge: The MCP Tokens settings page: a newly generated token shown once, the ready-made client commands for each server the token may reach, and the tokens already issued"><img src="/docs/console/mcp-tokens.jpg" alt="The MCP Tokens settings page: a newly generated token shown once, the ready-made client commands for each server the token may reach, and the tokens already issued" /></a>

<div id="shot-1" class="lightbox">
  <a class="lightbox-backdrop" href="#shot-1-thumb" aria-label="Close"></a>
  <figure class="lightbox-figure">
    <img src="/docs/console/mcp-tokens.jpg" alt="The MCP Tokens settings page: a newly generated token shown once, the ready-made client commands for each server the token may reach, and the tokens already issued" loading="lazy" />
    <figcaption>The MCP Tokens settings page: a newly generated token shown once, the ready-made client commands for each server the token may reach, and the tokens already issued</figcaption>
  </figure>
  <a class="lightbox-close" href="#shot-1-thumb">Close</a>
</div>

Pick one of three ability tiers. Each includes the ones before it, so there is
no write token that cannot read:

| Tier    | Abilities on the token                 | Use it for                        |
| ------- | -------------------------------------- | --------------------------------- |
| Read    | `mcp:read`                             | Dashboards, diagnosis, CI checks  |
| Write   | `mcp:read`, `mcp:write`                | Deploys, scaling, env changes     |
| Destroy | `mcp:read`, `mcp:write`, `mcp:destroy` | Teardowns, rollbacks, revocations |

The plaintext token is shown **once**, immediately after creation, and never
again. Revoke it from the same page; there is no expiry, so a token lives until
you revoke it.

## 2. Connect a client

The token page prints a ready command for each server you can actually reach —
a server your role does not grant is not offered, rather than handed to you as
a URL that will refuse you:

```bash
claude mcp add --transport http g8deck-ops https://g8deck.app/mcp/ops \
  --header "Authorization: Bearer <your-token>"
```

Any client works the same way: HTTP transport, bearer token in the header.

## 3. The endpoints that exist

This is the whole registered HTTP surface. There is no `/api/v1`, no resource
CRUD, and no OAuth — the token transport is deliberate, and OAuth is future
work rather than an undocumented alternative.

| Endpoint                           | What it is                                       | Gated by                | Rate limit  |
| ---------------------------------- | ------------------------------------------------ | ----------------------- | ----------- |
| `POST /mcp/design`                 | Blueprints, projects, environments, estimates    | `mcp.access.design`     | 60/min      |
| `POST /mcp/ops`                    | Deployments, pipelines, workloads, incidents     | `mcp.access.ops`        | 60/min      |
| `POST /mcp/platform`               | Providers, nodes, bootstrap, quotas              | `mcp.access.platform`   | 30/min      |
| `POST /mcp/compliance`             | Evidence, access reviews, vulnerabilities, certs | `mcp.access.compliance` | 30/min      |
| `POST /webhooks/github/{uuid}`     | Inbound push events for one workload             | HMAC signature          | 60/min · IP |
| `POST /webhooks/billing/{gateway}` | Payment callbacks (`billplz`, `stripe`)          | Gateway signature       | 60/min · IP |

The two lower limits are not arbitrary: the platform and compliance tools reach
real infrastructure, and a node bootstrap is not something to retry in a tight
loop. The webhook routes carry no auth middleware at all — the signature _is_
the authentication.

Of the four servers, a customer role reaches two. `user` holds design and ops;
`member` holds ops alone, because a member cannot author blueprints on the web
either. Platform and compliance are granted to no customer role.

## 4. Two locks, not one

A token's abilities and its holder's permissions are separate gates, and both
are checked before any tool runs:

- **Permissions** say what the _human_ may do — which servers, and which
  operations inside them.
- **Abilities** say what _this token_ may do. A CI agent's read token must not
  destroy, even when the person who minted it could.

A token can therefore be narrower than its holder, never wider. A tool you lack
the server permission for is not listed at all; a tool you can see but lack the
domain permission for answers `permission_denied` and names the permission to
ask for, rather than pretending it does not exist.

## 5. Identifiers are uuids, never ids

Every record G8Deck exposes carries an internal numeric `id` and a public
`uuid`. The `id` is hidden at the model layer — it is never serialised, never
in a URL, and never accepted as an argument. Tools take a `uuid` or, where a
record has one, a `slug`.

The same rule runs through the console's own routes: a deployment page is
`/deployments/{uuid}`, and the GitHub webhook is bound by `{workload:uuid}` for
exactly this reason.

Every tool also accepts an optional `organization` argument. Omit it and your
default is used — and the organisation actually resolved is echoed on **every**
response, because under a token there is no session to infer one from. Reaching
an organisation you are not a member of needs `mcp.access.cross-tenant`, which
only the administrator role holds, and every such call is written to that
tenant's own audit trail.

## 6. Destructive operations

Eight tools are destructive. Each one requires a token carrying `mcp:destroy`
**and** an exact value retyped into a named argument — and a mismatch is
audited, not just refused:

| Tool                       | Retype this             | Why that value               |
| -------------------------- | ----------------------- | ---------------------------- |
| `destroy-deployment`       | deployment name         | Irreversible teardown        |
| `execute-rollback`         | workload name           | Replaces the live release    |
| `delete-project`           | project name            | Takes environments with it   |
| `delete-environment`       | environment **slug**    | Names repeat across projects |
| `delete-infra-provider`    | provider name           | Removes the credential       |
| `retire-managed-node`      | SSH **host address**    | Hostnames can be blank       |
| `withdraw-database-server` | endpoint as `host:port` | Engine names repeat          |
| `revoke-certificate`       | certificate domain      | Domain loses TLS             |

> Read what each one actually destroys. `delete-infra-provider` destroys no
> machine — it removes G8Deck's credential for one, so an adopted host becomes
> unreachable rather than gone, and keeps running and keeps billing.
> `withdraw-database-server` uninstalls nothing. Only
> `retire-managed-node --destroy-machine` deletes hardware.

## 7. Reading a failure

Errors carry a stable machine code beside the human message, plus a
`retryable` flag, so an agent can tell "you may not do this" from "this does not
exist" from "your token is too narrow":

```json
{ "error": { "code": "ability_denied", "message": "…", "retryable": false } }
```

| Code                    | What to change                                    |
| ----------------------- | ------------------------------------------------- |
| `server_access_denied`  | Your role — ask for the `mcp.access.*` permission |
| `permission_denied`     | Your role — the message names the permission      |
| `ability_denied`        | The token — mint one at a higher tier             |
| `cross_tenant_denied`   | The `organization` argument, or your role         |
| `confirmation_mismatch` | The retyped value; the expected shape is named    |
| `capability_simulated`  | The provider — the capability is a declared fake  |
| `conflict`              | The record's state, not your request              |

Only `invalid_argument`, `confirmation_mismatch` and `not_found` are marked
retryable. An authorisation failure will refuse the same call every time, so
retrying one is noise against a boundary that has already answered.

## Where to go next

Call `whoami` first on any server: it reports your roles, which servers you can
reach, your token's abilities, and which organisation is used when you omit the
argument. From there, `list-deployments` and `diagnose-deployment` on the ops
server are the two calls that answer most questions.
