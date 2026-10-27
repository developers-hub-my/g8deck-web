---
title: Databases
description: Install or adopt a database server on one of your servers, then manage what is inside it — databases, users, grants, TLS, allowed networks, PostgreSQL extensions and replicas — and connect it to an application.
section: data
order: 10
updated: 2026-10-27
---

**Databases** in the sidebar is the organisation's fleet of database servers —
daemons G8Deck administers on servers you have connected. They live outside any
one deployment, so several applications can share one, and their data outlives
every deployment that uses it.

That is different from the database in an application's _shape_, which is part
of that one deployment and lives and dies with it. The two meet in the
application wizard, where you can point an application at a server from this
fleet instead.

![The Databases page: server, active, setting-up and failed counts, one PostgreSQL server with its endpoint, and the Files section for SQLite below](/docs/databases/database-servers.webp)

## Engines

| Engine         | Install | Adopt | Notes                                                  |
| -------------- | :-----: | :---: | ------------------------------------------------------ |
| **PostgreSQL** |   Yes   |  Yes  | Extensions and replicas are PostgreSQL-only            |
| **MySQL**      |   Yes   |  Yes  |                                                        |
| **MariaDB**    |   Yes   |  Yes  |                                                        |
| **MongoDB**    |   Yes   |  Yes  |                                                        |
| **ClickHouse** |   Yes   |  Yes  | Wants 4 GB of RAM or more; its memory is capped at 80% |

SQLite is not a server — see [SQLite files](#sqlite-files) below.

## Set up a database server

**Set up a database server** opens a three-step wizard: _Server & engine_,
_Network & access_, _Review_.

![Set up a database server: install a new server or adopt an existing one, the server picker, and the engine cards](/docs/databases/new-database-server.webp)

**Set up a new server** installs the engine on a server G8Deck has finished
setting up, moves it to a non-default port, and opens it to exactly the
networks you allow:

| Field                            | Notes                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Port**                         | 1024–65535, and never the engine's stock port — G8Deck moves it on purpose                                          |
| **Bind address**                 |                                                                                                                     |
| **Host name (optional)**         | Handed out in connection strings instead of the address, so applications survive a rebuild. Generated if left blank |
| **Allowed networks**             | At least one CIDR. There is no open default; one-click `/32` buttons cover your own servers, and `0.0.0.0/0` warns  |
| **Encrypt connections with TLS** | G8Deck issues an internal certificate for the server                                                                |

Setup then runs six steps — install, move the port, remote access, TLS,
firewall, connection check. It is refused on a server that has not been set up
yet, on a port the server already uses for the same engine, and on the stock
port.

**Adopt an existing server** records a daemon that already runs — its port,
connect address and host name — and changes nothing on the machine. An adopted
server's access rules and TLS stay managed outside G8Deck.

## Inside a server

A database server's page has the tabs **Databases**, **Users**, **Access** and
**Backups**, plus **Extensions** and **Cluster** on PostgreSQL. Everything here
is queued: a new database or user shows **pending** until the daemon has
converged, and **failed** carries the daemon's own reason.

![A PostgreSQL server: its endpoint and TLS state, the tabs, and one database with its owner](/docs/databases/database-server.webp)

### Databases and users

| Action              | Notes                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| **Create database** | Lowercase letters, digits and underscores, up to 63 characters, not starting with a digit or `pg_` |
| **Create user**     | A username only — **the password is generated** and shown once                                     |
| **Reset password**  | Shows the new password once. Not for accounts imported from an adopted server                      |
| **Drop database**   | Type the name. Destroys the database and everything in it; there is no undo                        |
| **Drop user**       | Type the username. Refused while the user still owns a database — drop the database first          |

**Dropped names stay reserved** on their server, so "already exists" can name
something you can no longer see. Each engine also reserves its own system
names:

| Engine          | Reserved databases                                         | Reserved users                       |
| --------------- | ---------------------------------------------------------- | ------------------------------------ |
| PostgreSQL      | `postgres`, `template0`, `template1`                       | `postgres`, `public`, `g8deck_admin` |
| MySQL / MariaDB | `information_schema`, `mysql`, `performance_schema`, `sys` | `root`, `mysql`, `g8deck_admin`      |
| MongoDB         | `admin`, `config`, `local`                                 | `g8deck_admin`                       |
| ClickHouse      | `system`, `default`, `INFORMATION_SCHEMA`                  | `default`, `g8deck_admin`            |

A user can also be allowed to **create its own databases** inside a name prefix.
On MySQL, MariaDB, MongoDB and ClickHouse the server enforces the prefix; on
PostgreSQL it is a convention only.

### Grants

**Grant access** gives one user one privilege on one database:

| Privilege        | Allows                                        |
| ---------------- | --------------------------------------------- |
| **Read only**    | Connect and read every table                  |
| **Read & write** | Read and change data — but not run migrations |
| **Owner**        | Create tables and run migrations              |

There is **one privilege per user and database**. A new grant replaces the old
one rather than adding to it, and every grant is audited.

### Access, TLS and credentials

The **Access** tab holds the connection details, a connection string per user,
the host name, and the allowed networks.

![The Access tab: host, port and TLS, a connection string per user with its password masked and a Reveal button, the host name and the allowed networks](/docs/databases/database-access.webp)

- **Reveal** shows a stored password in its connection string. It needs the
  reveal-credentials permission and is audited every time. A generated
  password is therefore not lost after its first showing — but only people you
  have given that permission can see it again.
- **Save allowlist** and **Enable / Disable TLS** re-run the server's setup to
  apply the change.

### PostgreSQL extensions

**Extensions** enables `vector` (pgvector) or `postgis` per database; the
package is installed first when it is missing.

### PostgreSQL replicas

**Cluster** adds streaming replicas. One primary takes writes; replicas
stream from it asynchronously; applications and backups always use the
primary.

![The Cluster tab: a standalone server and the form to add a replica on another server](/docs/databases/database-cluster.webp)

- **Add replica** installs PostgreSQL on the server you pick and replaces its
  data directory with a base backup of the primary. It must be a different
  machine from the primary, already set up, with the port free.
- **Nothing fails over on its own.** **Promote to primary…** is a person's
  decision, behind the box _I accept that writes this replica has not received
  will be lost_. The old primary is stopped and disabled and needs a rebuild,
  other replicas are marked for rebuild, and applications get the new host on
  their next deploy.

## Connect an application

Pick a database server in the **Database** select when you create an
application, or when you attach an application on a deployment's page. G8Deck
then creates a database and an owner user named from the deployment, and
writes the connection into the application's environment. Detaching never
drops the data.

For an application that already exists, use `attach-application-database` on
the [ops MCP server](/docs/mcp/ops) — the application page has no database tab.
Moving an application to a different database is refused: its data would stay
behind and nothing would copy it.

## Delete a database server

**Delete** is in the **Access** tab's danger zone and the list's row menu. It
removes the **record** — its databases, users and stored admin credentials as
G8Deck knows them — and detaches applications that used it. **The daemon keeps
running, no data is dropped, and the machine keeps billing**; delete the server
itself to stop that. A primary that still has replicas cannot be deleted: delete
the replicas, or promote one, first.

## SQLite files

SQLite has no daemon, so it gets no card in the setup wizard. The **Files**
section at the bottom of **Databases** lists SQLite files found on your servers
by **Scan servers**. Each file can be checked for integrity and switched between
write-ahead logging and a rollback journal. **Delete** removes the record only —
the file is not touched, and it stops being checked and stops being snapshotted
in its application's backups.
