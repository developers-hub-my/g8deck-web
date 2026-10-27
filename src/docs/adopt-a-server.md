---
title: Adopt a server from another panel
nav: Adopt a server
description: Point G8Deck at a machine RunCloud (or plain nginx) already runs. A read-only sweep inventories it, you decide what to take over, and its databases and files can be moved into G8Deck-managed applications.
section: servers
order: 20
updated: 2026-10-27
---

**Adopt** is for a machine another control panel already administers. G8Deck
reads it first and changes nothing; you then decide, item by item, what to take
over. Adopting leaves the machine exactly where it is — nothing is moved or
copied until you ask for a data migration.

Panels G8Deck recognises today: **RunCloud** and **plain nginx**.

![The Adopt page: counts of machines, sweeps and applications found, and the empty state inviting you to connect a server](/docs/adopt-a-server/adopt.webp)

## 1. Point G8Deck at the server

Open **Adopt** and choose **Connect a server**.

| Field          | Notes                                                            |
| -------------- | ---------------------------------------------------------------- |
| **Address**    | Type it, or pick a droplet from a connected DigitalOcean account |
| **Port**       | Usually 22                                                       |
| **Name**       | For your own list only — it changes nothing on the machine       |
| **Login user** | Needs to read configuration under `/etc` — usually `root`        |

How to log in — **Saved credential**, **Generate a key**, or **Paste my own**.
_Generate a key_ makes a key pair and shows you the public half with the
command that installs it; the private half never leaves G8Deck. There is no
password option: panel-managed servers run fail2ban, and password logins get
refused partway through a sweep, so discovery uses a key or nothing.

![Point G8Deck at a server: what the sweep will and will not do, and the address, port, name and login fields](/docs/adopt-a-server/adopt-connect.webp)

The page states the promise in full, and it is kept:

- one SSH session running read-only commands — file reads, package and service
  listings, configuration dumps;
- every command it ran is recorded, and you can read the list afterwards;
- environment **key names** are recorded, never their values;
- nothing is written, installed, restarted or deleted.

## 2. Run the sweep

**Run sweep** queues the read-only inventory — "Nothing will be written to"
the host. When it finishes, the source page lists the applications, databases
and services it found, and **every command the sweep ran**. Changing the
address, the login or the key later wipes the inventory and your decisions, so
a new sweep starts clean.

## 3. Decide

Each application is **Undecided**, **Adopt**, **Skip** or **Replace**; **Set
all** applies one answer to everything. A database that is not on this machine
— a reference to a remote server — cannot be adopted from here.

## 4. Adopt the server

**Adopt server** needs a finished sweep. It checks the login, reads the
hostname and OS, and records the machine as a server of yours — marked
**Adopted — not stack-managed**, because the other panel still owns its
packages.

One optional box, on by default: **Install G8Deck's node tooling** — the
metrics collector (a small script with a systemd timer) and the `sqlite3`
command-line tool. Nothing else is written: no firewall change, no credential
change, no hostname, no manifest. G8Deck refuses to adopt its own control plane
or a server it has already set up.

## Move the data

Two things move data into G8Deck-managed applications, and today both are
driven from the [platform MCP server](/docs/mcp/platform) — they have no
console page yet:

| Tool                    | What it does                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `migrate-adoption-data` | Copies the application's MySQL or MariaDB database into the database `attach-application-database` made for it, and named paths into the application's shared directories. A dry run by default; progress through `get-adoption-data-migration`                                                                                            |
| `import-adoption-env`   | Imports the discovered environment into an application. What the new machine owns (`DB_*`, `REDIS_*`, `APP_KEY`, `APP_URL`) and what the recipe manages (`APP_ENV`, `APP_DEBUG`) are skipped unless you carry them across deliberately — which is how `APP_KEY` must travel, since a fresh key cannot read data encrypted with the old one |

What a data migration guarantees:

- **MySQL and MariaDB only.** PostgreSQL is refused.
- **Local databases only.** A database on another host is not copied.
- **Target tables are replaced**, then verified by an exact `COUNT(*)` per
  table; files are verified by count and bytes per path. A mismatch fails the
  run rather than reporting success.
- **On the source** it writes one private working directory under `/var/tmp`,
  removed afterwards, and puts the application in maintenance mode only if you
  ask it to — the usual shape is one run to copy, then a final sync with
  maintenance on.
- Values travel inbound only — an environment import reports key names, never
  values.

## Removing an adoption source

An adoption source can be deleted while nothing is adopted. Once the server is
adopted, delete it from **Servers** first.
