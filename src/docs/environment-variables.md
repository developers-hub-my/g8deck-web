---
title: Environment variables and secrets
nav: Environment variables
description: Set an application's environment per environment, what the editor refuses and why, how .env.example is used, declared secrets and token references, and how values travel over MCP.
section: apps
order: 30
updated: 2026-10-27
---

An application has one set of environment variables **per environment** it runs
in — production and staging do not share a set. Edit them on the application's
**Environment** tab; there is one card per environment.

![The Environment tab: one card per environment, its variables, and the Edit button](/docs/environment-variables/environment.webp)

## Edit and save

**Edit** opens the card for changes:

| Control                      | What it does                                            |
| ---------------------------- | ------------------------------------------------------- |
| **Add variable**             | A new key/value row                                     |
| **Insert from .env.example** | Adds the keys your repository's `.env.example` declares |
| **Bulk edit**                | One `KEY=VALUE` per line, for pasting a whole file      |
| **Discard**                  | Throws the draft away                                   |
| **Save variables**           | Writes the whole set at once                            |

Saving **replaces the whole set** for that environment — a key you removed from
the draft is gone. Values are stored encrypted, and nothing restarts when you
save: **variables apply on the next deploy** ("Variables saved — they apply on
the next deploy."). Values that look like secrets are masked on screen, with
**Reveal** and **Copy**. You need permission to run the deployment's pipeline
to edit its variables.

## What the editor refuses

Each rule exists because the runtime would otherwise fail silently:

| Refused                                                                        | Why                                                                                                                                    |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| A key that is not letters, digits and underscores, or that starts with a digit | systemd drops a key it cannot parse — absent at runtime, with nothing in the journal                                                   |
| A value containing a line break                                                | An environment file cannot hold one; the rest is read as further variables. Store multi-line material as a file and reference its path |
| The same key twice                                                             | Only one would win, and not visibly                                                                                                    |

Values are trimmed of surrounding whitespace.

## .env.example

The first deploy captures your repository's `.env.example`. It shows under the
card as a collapsible **From the repo's .env.example** layer, so you can see
which keys the application expects. **Insert from .env.example** copies those
keys into your draft, skipping the ones the platform manages itself, such as
`APP_ENV`.

## Laravel's APP_KEY

The console does not generate `APP_KEY` for you; the Laravel build preset's
Dockerfile runs `key:generate` at build time. Over MCP, `set-workload-env` can
**generate** a value where it is stored — `APP_KEY` above all — so a secret
nobody needs to read never enters a transcript.

## Declared secrets and tokens

A deployment's **Secrets** page (in its sub-navigation) is for values that other
configuration refers to by **token** — `{{ component.field }}` — rather than by
value.

- **Declare secret** takes a key in `component.field` form — a key with no dot
  can never be referenced by a token — and a value, encrypted at rest.
- **Replace value** and **Delete** act on one secret.
- **Resolved tokens** lists what each token resolved to when the pipeline last
  ran, masked. Revealing them needs the raw-logs permission.

![The Secrets page: declared secrets and resolved tokens, both empty before the pipeline has stamped any](/docs/environment-variables/secrets.webp)

Tokens are resolved after provisioning, so an application never carries a
hard-coded address: `{{ postgres.connection_string }}` resolves to the
database the deployment actually got.

## Over MCP: values travel inbound only

`set-workload-env` on the [ops server](/docs/mcp/ops) and `set-secrets` on the
[customer server](/docs/mcp/customer) write variables, and they are stricter
than the editor in one way: **they merge**. Each response names every key and
whether it was added, changed, unchanged, removed or generated — and **never
echoes a value**. No read tool returns a value either; they report key names.
That is the rule for every secret and credential G8Deck holds: it can go in
through an AI client, and it never comes back out through one.
