---
title: Scheduled tasks
description: Run a command on a schedule inside an application's own context — cron syntax, how it becomes a systemd timer, what is refused rather than approximated, and how to read whether it ran.
section: apps
order: 40
updated: 2026-10-27
---

A scheduled task is a command that runs on a schedule as the application's own
user, from its current release, with its environment loaded. Each one becomes a
**systemd timer and a oneshot service** on the server, written when you save —
it does not wait for a deploy.

Scheduled tasks exist on servers that run applications **natively** (connected
over SSH). On a container runtime the tab says _Scheduled tasks are not
available on this runtime_.

## Create a task

Open the application's **Tasks** tab, pick the environment, and choose **New
task**.

![The New scheduled task panel: name, command, a five-field schedule, timezone and timeout](/docs/scheduled-tasks/new-task.webp)

| Field                                  | Rules                                                                                                |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **Name**                               | Lowercase letters, numbers and dashes, up to 64 characters. It is also the systemd unit name         |
| **Command**                            | One line, up to 1,000 characters. Line breaks and control characters are refused                     |
| **Schedule**                           | Five cron fields, or `@hourly`, `@daily`, `@midnight`, `@weekly`, `@monthly`, `@yearly`, `@annually` |
| **Timezone**                           | UTC, or the server's own clock                                                                       |
| **Timeout (seconds)**                  | 5 to 86,400                                                                                          |
| **If the previous run is still going** | **Skip** this run, or **Queue** it                                                                   |

**Save and write to the node** writes the unit straight away. If the server
cannot be reached at that moment, the task is saved and takes effect on the next
deploy — the message says so.

## What is refused instead of approximated

Cron and systemd timers do not mean the same thing for every expression, so
G8Deck converts only what it can convert exactly and refuses the rest:

| Refused                                                | Why                                                              |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| `@reboot`                                              | Not a calendar schedule                                          |
| `L`, `W`, `#`, `?`, `%`                                | No systemd equivalent                                            |
| Six or seven fields                                    | Seconds and years are not cron                                   |
| A day of the month **together with** a day of the week | Cron runs when **either** matches; systemd only when **both** do |

## Run, read, pause

| Action               | What it does                                                                         |
| -------------------- | ------------------------------------------------------------------------------------ |
| **Run now**          | Starts the task immediately and returns — the page does not wait for the result      |
| **Read status**      | Asks the server for each task's last run. Status is read only when you press it      |
| **Logs**             | The task's recent output                                                             |
| **Enable / Disable** | Stops the timer without deleting the task                                            |
| **Delete**           | Removes the task and its unit files — a team lead or organisation administrator only |

The last-run state has four values, and two of them are easy to confuse:

| State         | Means                                                |
| ------------- | ---------------------------------------------------- |
| **Never ran** | The timer has not fired yet. This is not a failure   |
| **Succeeded** | The last run exited cleanly                          |
| **Failed**    | The last run exited with an error                    |
| **Skipped**   | A run was due while the previous one was still going |

## The preset's own scheduler

Some build presets bring a scheduler task of their own — Laravel's
`schedule:run`, for example. You can edit or disable it, but not delete or
rename it, because the preset expects it to exist.

![The Tasks tab with no tasks yet: Read status, New task, and the note that saving writes the unit straight away](/docs/scheduled-tasks/tasks.webp)

## From an AI client

The [ops server](/docs/mcp/ops) has `list-scheduled-tasks`,
`get-scheduled-task`, `run-scheduled-task`, `set-scheduled-task-enabled` and
`refresh-scheduled-task-status`. Its state crosses the wire with all four
values, so an agent can tell "never ran" from "failed" too.
