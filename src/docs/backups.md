---
title: Backups and restore
description: What a backup policy captures for a database, an application, a bucket or a server, where the copies go, how they are encrypted and verified, and how to download or restore one.
section: data
order: 40
updated: 2026-10-27
---

**Backups** shows what is protected, when it was last proven, and how to get it
back. The **Unprotected** panel lists everything that has no backup policy at
all — start there.

![The Backups page: policy, failing, paused and unprotected counts, the Unprotected panel, and the policy list](/docs/backups/backups.webp)

## What a backup captures

A policy protects one **subject**:

| Subject            | Captured                                                                                                                                                                                                     | Not captured                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| **Database**       | A database on a managed database server                                                                                                                                                                      |                                                                             |
| **Application**    | Its declared volumes; on a native server, the build preset's shared directories (Laravel's `storage/`, for example); SQLite files, copied hot with no downtime; the resolved `.env` and the release manifest | The code, and managed databases — give those a Database policy of their own |
| **Storage bucket** | The objects in a bucket                                                                                                                                                                                      |                                                                             |
| **Server**         | The server's declared configuration                                                                                                                                                                          | Files on the server                                                         |

An application's **Backups** tab and a server's **Backups** tab show the same
picture from their side.

![An application's Backups tab: which of its parts are protected, and Create policy for those that are not](/docs/backups/application-backups.webp)

## Create a policy

**New backup policy** tells you what will actually be captured before you save
it.

![New backup policy: kind and subject, then the destination with its type and region, and the warning about G8Deck Storage being a staging tier](/docs/backups/new-policy.webp)

| Setting                     | Notes                                                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| **Kind**, **Subject**       | A subject that already has a policy at that destination is marked, not hidden                      |
| **Destination**, **Prefix** | Where the copies land                                                                              |
| **Preflight**               | Checks the policy can run; **Re-check** after a fix                                                |
| **Schedule**                | Cron. Blank means manual only                                                                      |
| **Timezone**                |                                                                                                    |
| **Retention**               | _Keep this many runs_ **and** _Keep for this many days_ — a copy is pruned only when it fails both |
| **Verification**            | **Integrity**, **Readability** or **Restorability**; restorability adds a drill schedule           |
| **Run on the schedule**     | Off pauses the schedule without deleting anything                                                  |

### Encryption

Every backup is encrypted with AES-256. When you create a policy, its
passphrase is generated and **shown once**, and the policy is not created until
you tick _I have stored this passphrase somewhere outside G8Deck_. It is what
decrypts a downloaded copy. **Reveal passphrase** on an
existing policy is audited.

## Destinations

**Destinations** lists where backups can land; new policies use the default.

![Backup destinations: G8Deck Storage as the active default, with its policy count](/docs/backups/destinations.webp)

| Destination             | Notes                                                                                                                       |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **G8Deck Storage**      | Storage on the G8Deck installation itself, set up by a platform administrator. A staging tier, with a size ceiling per copy |
| **Object storage (S3)** | **Add destination**: an object storage connection, or a bucket on one of your storage servers                               |

Where a destination writes cannot be changed after it is created — make a new
one and move policies to it.

## Run, pause, move

| Action                 | Notes                                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Run now**            | Queues a backup immediately                                                                                                                                               |
| **Pause / Resume**     | Pausing keeps existing copies                                                                                                                                             |
| **Change destination** | For one or many policies: leave existing copies where they are, copy them across, or move them. A move deletes the source copy only after the destination has verified it |
| **Delete**             | Removes the policy. Existing copies are kept and stay restorable                                                                                                          |

A run goes **Pending → Running → Uploading → Verifying → Completed**, or
**Failed** with the reason.

## Download or restore

Open a run to see its manifest and every copy with its verification state.

- **Download copy** streams the stored file, **still encrypted**, and is
  audited. The page shows the `openssl enc -d …` command that decrypts it with
  your passphrase.
- **Restore to a new target** touches nothing that is live.
- **Restore in place** asks you to type the subject's name. A safety copy is
  taken first, and the restore is refused if that copy fails.

Restore, download and changing destinations are owner and administrator
actions.

## From an AI client

The [ops server](/docs/mcp/ops) has `list-backup-policies`, `create-backup-policy`,
`run-backup-policy`, `set-backup-policy-enabled`,
`set-backup-policy-destination`, `list-backup-runs`, `list-backup-destinations`
and `delete-backup-destination`.
