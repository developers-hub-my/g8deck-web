---
title: Connect a server or create one
nav: Connect a server
description: Bring a Linux machine you already run under G8Deck over SSH, or have G8Deck create a droplet in your own DigitalOcean account — and what setup does to the machine, step by step.
section: servers
order: 10
updated: 2026-10-27
---

Both doors are on the **Servers** page: **Connect a Server** for a machine you
already have, **New Server** for a new one. Either way you end with a server
G8Deck has set up and can deploy to. Both need you to be an owner or
administrator of the organisation.

| You have                                       | Use                                                 |
| ---------------------------------------------- | --------------------------------------------------- |
| A VPS, a bare-metal box or a VM you can SSH to | **Connect a Server**                                |
| A DigitalOcean account and no machine yet      | **New Server**                                      |
| A machine another panel (RunCloud) runs today  | [**Adopt**](/docs/adopt-a-server) — read-only first |

## Before you start

- **Ubuntu, Debian, AlmaLinux or Rocky.** Machines that already run things are
  fine.
- **`root`, or a user with passwordless sudo.** G8Deck opens no terminal, so a
  sudo password prompt cannot be answered.
- **The SSH port reachable from G8Deck.**

## Connect a Server

Three steps. Nothing is queued until the machine has answered a pre-flight
probe.

![Step one of Connect a Server: the server name, where it is hosted, the address and port, and the credential](/docs/connect-a-server/connect-wizard.webp)

### 1. Connection

| Field                       | Notes                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Server name**             | Unique in the organisation                                                                               |
| **Where is it hosted?**     | DigitalOcean, AWS, Google Cloud, Azure, Hetzner or Other. Bookkeeping — every choice is reached over SSH |
| **IP address / host, Port** | Not the control plane's own address; use a LAN address for a machine on the same host                    |
| **Authenticate with**       | An SSH key (paste the private key) or a password, plus the user — usually `root`                         |

A password is used to get in once: setup installs a per-server key and disables
password login. You can also reuse a connection already saved in the
organisation. With a DigitalOcean account connected under **Integrations**,
**Pick a machine from DigitalOcean** fills the name, address, port and user for
you — the credential is still yours to give.

### 2. Reach it

**Test connection** logs in and reads `/etc/os-release`, then reports the OS
and the round-trip time, or the error.

### 3. Pre-flight & start

The pre-flight shows whether the machine is reachable, the detected OS, and the
**host key fingerprint that will be pinned**. Compare it with the one your
hosting provider shows if you can. The **setup template** must match the OS
family; after the probe, a template from the wrong family is switched for you,
and a mismatch that remains would be refused at the Detect OS step.

**Start setup** queues the job and takes you to the setup log.

## What setup does to the machine

Setup runs sixteen steps, in order, and logs every one:

| #   | Step                                 | #   | Step                        |
| --- | ------------------------------------ | --- | --------------------------- |
| 1   | Verify SSH connectivity              | 9   | Install base packages       |
| 2   | Detect operating system              | 10  | Install container runtime   |
| 3   | Provision the G8Deck management user | 11  | Install G8Deck agent        |
| 4   | Rotate SSH credentials               | 12  | Configure firewall baseline |
| 5   | Disable SSH password authentication  | 13  | Register node               |
| 6   | Set hostname                         | 14  | Install metrics collector   |
| 7   | Set kernel parameters                | 15  | Write node manifest         |
| 8   | Configure swap                       | 16  | Verify node ready           |

![A setup run: the server, its template and attempts, and the log of each step as it ran, including a step that was skipped with its reason](/docs/connect-a-server/setup-run.webp)

A step that has nothing to do says so — "The machine already has active swap;
G8Deck does not add a second area" — rather than doing it twice. When the run
reports **Ready**, the server appears on **Servers** and in the application
wizard.

**Reconnect**

![A set-up server: Ready, its stack version and how far behind it is, the CPU, memory and disk readings, and the Overview tab](/docs/connect-a-server/server-overview.webp)
, in a server's menu, runs a short version — verify SSH, detect
OS, register, write the manifest, verify ready — for a machine that is already
set up.

## Create a cloud server

**New Server** creates a machine in **your own DigitalOcean account** and then
sets it up exactly as above. DigitalOcean is the only cloud G8Deck can create
servers in today. Connect the account once under **Integrations**; the page
tells you when it is missing.

![New Server with no DigitalOcean account connected: the prompt to connect one, or to connect a machine you already have instead](/docs/connect-a-server/new-cloud-server.webp)

| Field                | Notes                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------- |
| **Server name**      | Becomes the machine's hostname at DigitalOcean                                                |
| **Region**           | Only available regions are listed                                                             |
| **Operating system** | Only images a setup template exists for                                                       |
| **Plan**             | By family and processor, cheapest first, labelled "from $X/mo"; changing the region resets it |
| **Setup template**   | Switched to match the image                                                                   |

Prices are DigitalOcean's own list price in US dollars, billed by DigitalOcean
to your account. G8Deck neither resells nor marks them up. Your plan's server
limit is checked before anything is created.

**Create server** mints an SSH key for the machine, creates the droplet tagged
`g8deck`, records the connection, then waits up to ten minutes for an address
and for SSH to answer before starting setup. If that wait runs out, the
machine **exists and is billing** — the error says so.

G8Deck can create servers here but cannot resize or power them; those stay in
DigitalOcean's console. It can delete a machine it created — see below.

## The host key, after a rebuild

A rebuilt machine presents a new host key, and G8Deck refuses to talk to a
machine whose key changed. On the connection's page (**Advanced →
Connections**), **Check host key** probes the machine and **Trust this key**
pins the new one — do it only if you rebuilt the machine and the fingerprint
matches its console. If the key changes again between the check and the click,
the trust is refused.

## Delete a server

**Delete…** is in the server's menu, and the dialog states what will happen
before you confirm:

- **Deployments still on it** are listed, with a box to delete them first and
  then the server. Without it, the delete is refused.
- **A machine G8Deck created** asks a required question: _Delete it_ —
  irreversible, its data goes with it, billing stops — or _Keep it running_ —
  removed from G8Deck only, it keeps billing. Deleting the machine needs its
  SSH address typed exactly.
- **A machine G8Deck did not create** keeps running and keeps billing. G8Deck
  cannot delete it; remove it at its own hosting provider when you are done.

The server record is a soft delete and its setup history is kept. Protected
servers have the action disabled, with the reason shown.
