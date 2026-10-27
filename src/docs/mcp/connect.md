---
title: Connect an AI client
nav: Connect an AI client
description: Create a token or sign in with OAuth, add the G8Deck MCP endpoint to Claude Code or a hosted AI app, and check the connection with whoami.
section: mcp
order: 20
updated: 2026-10-27
---

There are two ways to connect, and which one you use depends on the client:

| Client                                                                                | Connects with                                            | Lifetime                                     |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------- |
| Claude Code, CI jobs, scripts — anything that takes a header                          | A **personal access token** in `Authorization: Bearer …` | Until you revoke it                          |
| Claude, ChatGPT, Gemini CLI, Cursor, VS Code — hosted connectors that take only a URL | **OAuth 2.1** sign-in and consent                        | One-hour access, refreshed for up to 30 days |

Both reach the same servers through the same checks. Start with the customer
endpoint, `https://g8deck.app/mcp` — it deploys and runs applications, and it is
the one URL most people need.

## Option A — a personal access token

### 1. Create the token

Open **[g8deck.app/settings/mcp-tokens](https://g8deck.app/settings/mcp-tokens)**.
Every sign-up's role can create tokens; the page may not be in your sidebar, so
use the address.

![The MCP Tokens page: a newly created token shown once, the ready-made Claude commands for each server the token reaches, and the tokens already issued](/docs/console/mcp-tokens.jpg)

1. **Name** — where the token will be used, such as `claude-code-laptop`.
2. **Access** — **Read only**, **Read and write**, or **Read, write and
   destroy**. Pick the narrowest that does the job; a token can be narrower than
   you are, never wider.
3. **Generate Token**.

**The token is shown once.** Copy it now; it cannot be shown again. The page
then prints a ready `claude mcp add` command for each of the design, ops,
platform and compliance servers your role reaches.

Tokens do not expire. **Revoke** one from the same page when it is no longer
needed; the list shows when each was created and last used.

### 2. Add it to Claude Code

For the customer endpoint:

```bash
claude mcp add --transport http g8deck https://g8deck.app/mcp \
  --header "Authorization: Bearer YOUR_TOKEN"
```

For one of the granular servers, swap the name and path — this is the command
the token page prints:

```bash
claude mcp add --transport http g8deck-ops https://g8deck.app/mcp/ops \
  --header "Authorization: Bearer YOUR_TOKEN"
```

Or in a project's `.mcp.json`, with the token kept in your environment rather
than in the file:

```json
{
  "mcpServers": {
    "g8deck": {
      "type": "http",
      "url": "https://g8deck.app/mcp",
      "headers": { "Authorization": "Bearer ${G8DECK_TOKEN}" }
    }
  }
}
```

Any other client that speaks MCP over HTTP works the same way: the endpoint URL,
and the token in an `Authorization: Bearer` header.

## Option B — sign in with OAuth

For a hosted app that only takes a URL:

1. Add `https://g8deck.app/mcp` (or `/mcp/ops`, `/mcp/design` …) as a custom
   connector or MCP server.
2. The app is sent to G8Deck to sign in. The consent screen shows the app's
   name, the **address it will send you back to** — the part a look-alike name
   cannot fake — and the access it asks for in plain words.
3. **Pick the organisation** the app will act on. The connection is bound to
   that one organisation; to use another, connect again and pick it.
4. **Allow**.

The app gets a one-hour token it refreshes on its own. Access is the same three
tiers as a personal token, and an app that asks for nothing gets read-only.
Revoke an app under **Connected apps** on the [MCP Tokens
page](https://g8deck.app/settings/mcp-tokens) — that ends its tokens at once.

An organisation whose **AI access** is switched off cannot be picked, and its
existing connections are refused until it is switched back on.

## 3. Check the connection

Ask your client to call **`whoami`**. It reports who you are, your roles, which
servers you can reach, the token's tier (or the OAuth app and its
organisation), and which organisation is used when a call does not name one.

Then try something read-only:

> List my applications and tell me which ones are not live.

## When it does not connect

| Symptom                         | Usually                                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `401` from the endpoint         | No token, a mistyped one, or a revoked one                                                                         |
| `server_access_denied`          | Your role does not reach that server — design needs the `user` role; platform and compliance are not for customers |
| `ability_denied` on a write     | The token is read-only — create one at a higher tier                                                               |
| `ai_access_disabled`            | An administrator switched AI access off for the organisation                                                       |
| `cross_tenant_denied`           | An OAuth connection naming a different organisation from the one chosen at consent                                 |
| A tool is missing from the list | It lives on another server — see the [overview](/docs/api-and-automation)                                          |

## What an agent can and cannot do

Everything is checked against your own permissions, so an agent can do what you
can do on the console and nothing more. Spending money and touching DNS happen
on the customer server only through **plan → your explicit agreement →
execute**. Secret values go in and never come back out. Destructive tools need a
destroy-tier token and a retyped confirmation.

The full tool lists, with every parameter, are in the reference pages:
[customer](/docs/mcp/customer), [design](/docs/mcp/design),
[ops](/docs/mcp/ops), [platform](/docs/mcp/platform) and
[compliance](/docs/mcp/compliance).
