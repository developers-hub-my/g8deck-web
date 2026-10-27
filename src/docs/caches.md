---
title: Caches
description: Run a Valkey or Redis instance on one of your servers, or record one that already runs, and attach it to as many applications as you like — with what Delete does to each kind.
section: data
order: 20
updated: 2026-10-27
---

**Cache** in the sidebar holds Valkey and Redis instances that live outside any
deployment — one instance per purpose, shareable by any number of
applications. A memory limit and an eviction policy belong to the process, so
two applications that want different answers want different instances, and two
that agree can share one.

![The Cache page before any instance exists, explaining why an instance is per purpose](/docs/caches/caches.webp)

## Create an instance

**Create a cache instance** offers two modes:

| Mode                           | What G8Deck does                                                                                                                    |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Install a new instance**     | Installs the engine, writes its own unit on the port you choose, sets a generated password and opens the firewall to your allowlist |
| **Record one already running** | Records what it finds and changes nothing — no port move, no config rewrite, no firewall change                                     |

![Create a cache instance: install a new one or record one already running, then name and server](/docs/caches/new-cache.webp)

| Field                         | Notes                                                                                   |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| **Name**                      | What the instance is for; there is nothing inside a cache to recognise it by            |
| **Server**                    | Installing needs a server G8Deck has set up; recording works on any server it can reach |
| **Engine**                    | **Valkey** or **Redis**                                                                 |
| **Port**, **Bind address**    |                                                                                         |
| **Memory limit (MB)**         | Default 256                                                                             |
| **When the limit is reached** | One of eight eviction policies; default `allkeys-lru`                                   |
| **Who may connect**           | CIDRs. Leave it empty and nothing off the machine can reach the instance                |
| **Existing password**         | Recording only, optional                                                                |

## Attach it to an application

Attach from the **application**, not from the instance: open the application's
**Cache** tab and choose **Attach a cache**. Pick the instance and a **key
prefix**. The attachment is per environment, so production and staging can use
different instances.

![Attaching a cache instance from an application's Cache tab](/docs/caches/attach-cache.webp)

A key prefix keeps two applications' keys apart, but not their data: a
`FLUSHALL` from either still empties the instance for both. The connection is
written into the environment and **applies on the next deploy**. **Detach**
leaves the instance and everything in it untouched, also from the next deploy.

An instance G8Deck does not hold a working password for cannot be attached
until it does.

## The instance page

An instance's page shows the applications attached to it, its connection
details, the password (**Reveal** is recorded every time), **Run setup again**
and **Delete**.

## Delete an instance

Refused while any application is attached — detach it first. Then what Delete
does depends on how the instance arrived:

| Instance      | Delete does                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| **Installed** | Stops the daemon and removes its data directory. The data is gone; the server keeps running and billing |
| **Recorded**  | Removes the record and the stored password. The daemon keeps running with every key                     |

## From an AI client

The [ops server](/docs/mcp/ops) has `list-managed-caches`, `get-managed-cache`,
`create-managed-cache`, `attach-application-cache`, `detach-application-cache`
and `delete-managed-cache` (destructive — it asks for the endpoint retyped as
`host:port`).
