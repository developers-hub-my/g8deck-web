---
title: Servers, connections and the fleet
nav: Servers and connections
description: What a server is to G8Deck, the connection that reaches it, how a provider type decides what is real and what is simulated, and what the fleet pages count.
section: concepts
order: 30
updated: 2026-10-27
---

A **server** is a machine G8Deck can reach and run things on. Two records sit
behind every one, and the console shows both:

| Record                      | What it holds                                                         | Where you see it           |
| --------------------------- | --------------------------------------------------------------------- | -------------------------- |
| **Connection** (a provider) | How to reach the machine: its type, credentials and pinned host key   | **Advanced → Connections** |
| **Server** (a managed node) | The machine itself: its OS, stack version, health and what runs on it | **Servers**                |

Connecting a server creates both. A connection can also stand for something
larger than one machine — a Docker host, a Swarm or a Kubernetes cluster.

![The Servers page: one row per machine with its address, OS, stack version and metrics, and the Connect a Server, New Server and Upgrade actions](/docs/connect-a-server/servers.webp)

## Three ways a server arrives

| Way                  | What G8Deck does                                                                                | Guide                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Connect a Server** | Logs in over SSH and sets the machine up — management user, key, packages, agent, firewall      | [Connect a server](/docs/connect-a-server)                       |
| **New Server**       | Creates a droplet in your own DigitalOcean account, then sets it up the same way                | [Connect a server](/docs/connect-a-server#create-a-cloud-server) |
| **Adopt**            | Reads a machine another panel runs, without changing it, and takes it over only when you say so | [Adopt a server](/docs/adopt-a-server)                           |

A server that was set up by G8Deck is **stack-managed**: G8Deck knows which
versions it installed and can [upgrade and patch](/docs/patching) them. An
adopted server is marked **Adopted — not stack-managed**: another panel owns its
packages, so fleet upgrades and patches leave it alone and say why.

## What a provider type really does

The provider type decides which driver G8Deck uses, and a driver is either real
or a declared fake. Today:

| Provider type                                                                                    | Resolves to                                                          |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Docker                                                                                           | Real Docker driver                                                   |
| Docker Swarm                                                                                     | Real Swarm driver                                                    |
| Kubernetes / K3s                                                                                 | Real Kubernetes driver                                               |
| Bare metal, VMware, KVM, AWS, GCP, Azure, Hetzner, DigitalOcean — **with SSH credentials saved** | The SSH driver; applications run natively under systemd              |
| Proxmox — **with an endpoint and API token**                                                     | Real driver for creating VMs; deploying into them is still simulated |
| Anything else, and any of the above with no credentials                                          | The fake pair — nothing is contacted                                 |

Two things follow. A half-configured connection of a supported type falls back
to the fake, so "the type is supported" is not "this connection works". And a
provider lists its **simulated capabilities** with a reason; any pipeline step
that needs one records **Skipped** instead of pretending to succeed. Read that
list before you trust a green pipeline — see [Troubleshooting](/docs/troubleshooting).

## What a server page shows

Each server has a page with a header — status, stack version, how far behind
the current stack it is — four live readings (CPU, memory, disk, last sample)
and these tabs:

| Tab              | Shows                                                                         |
| ---------------- | ----------------------------------------------------------------------------- |
| **Overview**     | The machine, its address and OS, what is placed on it, how G8Deck reaches it  |
| **Monitoring**   | Metrics history from the collector                                            |
| **Applications** | Applications placed on this server                                            |
| **Services**     | The systemd services on the machine, and the deployment services placed here  |
| **Access**       | The management login, the node credential, the pinned host key, setup history |
| **Firewall**     | Custom rules on top of the baseline the setup applied                         |
| **Backups**      | What is on this server, and which of it a backup policy protects              |
| **Activity**     | Recorded changes to the server, searchable                                    |
| **Settings**     | Rename it                                                                     |

![A server's Access tab: the management login, the rotated node credential, the pinned host key and its setup history](/docs/connect-a-server/server-access.webp)

![A server's Firewall tab: custom rules applied on top of the baseline, and the baseline the last setup applied](/docs/connect-a-server/server-firewall.webp)

## Who sees which servers

Organisation owners and administrators see the whole fleet. Everyone else sees
the servers **allocated to a team they are an active member of**, and what runs
on them — a member of no team sees none. That is visibility, not a refusal: the
lists simply contain less. Allocation is set on the team page; see [Teams, roles
and server access](/docs/teams-and-access#server-allocation).
