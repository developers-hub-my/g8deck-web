---
title: Launch an application from git
nav: Launch from git
description: Create an application from a repository, connect GitHub or a deploy key, turn on push-to-deploy, and upload a new version when there is no repository at all.
section: apps
order: 10
updated: 2026-10-27
---

[Your first deployment](/docs/first-deployment) walks the wizard once. This
page is the reference for a git-sourced application: how G8Deck reaches the
repository, how it builds it, and how a push becomes a release.

![The Applications page: each application as a card with its source, environments and whether it is live](/docs/launch-from-git/applications.webp)

## Create it

**Applications → New application**, then on step one choose **Git
repository**:

| Field                | Notes                                                                               |
| -------------------- | ----------------------------------------------------------------------------------- |
| **Application name** | 2–120 characters                                                                    |
| **Repository URL**   | `https://`, `ssh://`, `git://`, `file://` or `git@host:owner/repo`                  |
| **Branch**           | `main` unless you say otherwise                                                     |
| **Build**            | `Dockerfile (repo ships its own)` — then a Dockerfile path — or one of nine presets |
| **Domain**           | Optional. Leave blank to reach it internally only                                   |
| **Health path**      | Optional. Each deploy waits until the application answers 2xx here                  |

The nine build presets are `static`, `laravel`, `node`, `nextjs`, `astro`,
`python`, `django`, `symfony` and `go`. A preset decides how the code is built
and run, and some carry their own needs — a Laravel, Symfony or Django build
without a database is called out on step three.

## Reach the repository

Three ways, depending on where the code lives:

| Repository                        | How G8Deck reads it                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| On GitHub, with the App installed | **Pick a repository from GitHub** lists repositories from every connected account (the first 100 per account) and fills the URL and branch |
| Private, reached over SSH         | A **deploy key** the application generates — register its public half on the repository                                                    |
| Public over HTTPS                 | Nothing to set up                                                                                                                          |

**Connect GitHub** is on **Integrations** (under **Advanced**). Connecting
installs the G8Deck GitHub App on the account you pick; **Disconnect**
uninstalls it there and deletes nothing else.

**Deploy keys** are per application. **Save & deploy** probes the clone before
anything is queued, and if the repository refuses, the wizard's fourth step
shows the public key and the one instruction that matters — _Repository →
Settings → Deploy keys → Add deploy key; read-only access is enough_ — with
**Test connection** before **Deploy** unlocks. You can also finish later: the
application's **Settings** tab has **Generate**, **Copy**, **Test connection**
and **Regenerate** for the key.

## Push-to-deploy

Every git application has its own webhook. On **Settings**, switch
**Push-to-deploy** on; turning it on creates a secret if there is none. Copy the
**Webhook URL** and **Secret** into the repository's webhook settings on GitHub.
**Rotate** replaces the secret — the old one stops working, so update GitHub
too. A repository covered by the GitHub App needs no webhook of its own; the
panel says so.

![An application's Settings tab: name, branch and description, the push-to-deploy webhook and its tracked branch, and the SSH deploy key panel](/docs/launch-from-git/settings.webp)

What a delivery does:

| Delivery                                              | Result                                                            |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| A push to the tracked branch, signature valid         | A deploy, and the release it caused is linked                     |
| A push to another branch                              | **Ignored** — "The push was to _x_; this application tracks _y_." |
| Any other event, a deleted branch, push-to-deploy off | **Ignored**, with the reason                                      |
| A bad signature                                       | **Rejected** (401), with the reason                               |

The **Push-to-deploy** tab keeps the last 50 deliveries with their status,
reason, whether the signature was valid, and the release each one caused. The
raw request body is never stored.

![The Push-to-deploy tab before any delivery: the empty list and where to find the webhook settings](/docs/launch-from-git/push-to-deploy.webp)

## Upload instead of a repository

**Upload a folder** takes a `.zip` or `.tar.gz` up to 100 MB. The format is
read from the file itself, the build preset is detected from what is inside,
and when everything sits inside one folder, that folder becomes the site root.
Each upload is kept, so you can roll back to it. Ship a new version from the
application's **Settings** tab with **Upload a new version**.

## Deploy scripts

The **Overview** tab shows the application's **pre-deploy** and
**post-deploy** scripts with **Edit**. They run inside the release, at deploy
time, and their output is kept on the release.

## Releases and rollback

Every build becomes a release on the **Releases** tab. **View details** shows
its status, trigger, commit, failure reason and the output of the deploy
scripts; **Roll back to this** reruns that release's exact image without
rebuilding.

## From an AI client

The [customer MCP server](/docs/mcp/customer) deploys a repository in two or
three calls — `plan-deployment`, then `execute-deployment` after you agree to
what it will cost, then `deployment-progress`. The [ops
server](/docs/mcp/ops) has the granular tools: `create-application`,
`launch-application`, `list-repositories`, `register-github-webhook` and
`rotate-deploy-webhook-secret`.
