---
title: Navigating G8Deck
description: The rail of areas, the panel of pages beside it, Simple and Advanced navigation, page search, the phone layout, and where each page from the old sidebar went.
section: start
order: 20
updated: 2026-11-03
---

The console at [g8deck.app](https://g8deck.app) is laid out as a narrow
**rail** of areas down the left edge. Choose an area and its **panel** lists
the pages inside it. No address changed when this layout arrived, and no page
gained or lost a permission — only where the links sit.

## The areas

| Area         | What it holds                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------- |
| **Home**     | The dashboard                                                                                  |
| **Alerts**   | What is firing now; in Advanced, also Observability, Alert rules and Silences                  |
| **Apps**     | Applications; in Advanced, also Deployments, Promotions, Blueprints and the Component Registry |
| **Fleet**    | Servers, Patches and Adopt a server; in Advanced, also Setup history and Infrastructure        |
| **Services** | Databases, Cache, Storage and Backups                                                          |
| **Platform** | The Platform overview; in Advanced, also Security and Sources                                  |
| **Admin**    | Administration pages — shown to administrators only                                            |

The rail also carries:

- the **organisation switcher** at the top — which organisation you are working
  in, plus **Teams**, **Projects**, **Quotas**, **Organization settings** and
  **Manage organizations**;
- **search**, the **notifications** bell, the **Help** (?) menu with
  Documentation, Support and Changelog, and your avatar menu.

Two counts appear on the rail and in the panels. **Alerts** shows a red count of
the firing alerts you can see. **Patches** shows a grey count of servers waiting
for a restart.

Clicking an area takes you back to the last page you used in it, for as long as
the browser tab stays open.

## The panel

How the panel behaves depends on the width of your window:

| Window width       | The panel                                                                             |
| ------------------ | ------------------------------------------------------------------------------------- |
| 1280px and wider   | Stays docked beside the rail                                                          |
| 1024px to 1279px   | Floats over the page — open it by hovering an area, or press → on a focused rail item |
| Narrower than 1024 | Replaced by the phone and tablet layout below                                         |

The **pin** button, or the `[` key, switches between docked and floating. G8Deck
remembers your choice.

## Simple and Advanced

Every page you are allowed to open is in one of two lists:

- **Simple** lists the everyday pages.
- **Advanced** lists every page you can open, including the operator pages —
  deployments in detail, blueprints, connections, security and sources.

Switch between them from your avatar menu, under **Navigation**. Members start
in Simple; administrators start in Advanced. The choice is yours and is kept on
your account.

Simple hides links, not pages. In Simple, a panel ends with **N more in
Advanced · Show**. If you open an Advanced page from a link or from search, it
stays visible in its panel with a note and a **Show Advanced navigation**
button. Your mode never changes on its own.

## Search pages

Press **Cmd-K** (macOS) or **Ctrl-K** (Windows and Linux), or use the search
icon on the rail or the top bar. Search lists every page you can open, in either
mode, and understands everyday words — _providers_, _k8s_, _cve_, _docker_ —
as well as page names.

## The Platform overview

**Platform** opens one list of the Build, Security, Monitoring, Infrastructure
and Sources pages, with a search box (press `/` to jump to it). It is the
quickest way to find an operator page without switching to Advanced. Members
see _Registries and Git Credentials are managed by your administrators._ in
place of those two pages.

## On a phone or tablet

Below 1024px a top bar replaces the rail: the menu, the name of the current
area, search, notifications and your account. The menu opens a drawer with
large rows and the current area already expanded, and the Simple / Advanced
switch sits at the bottom of the drawer.

## Where did it go?

For anyone who used the console before November 2026:

| Before                                                                       | Now                                                       |
| ---------------------------------------------------------------------------- | --------------------------------------------------------- |
| Advanced › Build › Deployments, Promotions                                   | **Apps › Deployments**, **Apps › Promotions**             |
| Advanced › Build › Blueprints, Component Registry                            | **Apps › Design › Blueprints**, **Component Registry**    |
| Advanced › Monitoring › Observability, Alert rules, Silences                 | **Alerts › Observability**, **Alert rules**, **Silences** |
| Advanced › Infrastructure › Connections, Integrations, Node Pools, Templates | **Fleet › Infrastructure › …**, same names                |
| Advanced › Infrastructure › History                                          | **Fleet › Setup history**                                 |
| Adopt                                                                        | **Fleet › Adopt a server**                                |
| Advanced › Security › Compliance, Vulnerabilities, Advisories                | **Platform › Security › …**, same names                   |
| Advanced › Sources › Registries, Git Credentials                             | **Platform › Sources › …**, same names                    |
| Databases, Cache, Storage, Backups                                           | **Services › …**, same names                              |
| Organization › Teams, Projects, Quotas, Settings                             | The **organisation switcher** at the top of the rail      |
| Organizations                                                                | **Manage organizations**, in the organisation switcher    |
| Notifications                                                                | The **bell** on the rail                                  |
| Documentation, Support, Changelog                                            | The **Help** (?) menu on the rail                         |
| Administration › Backups                                                     | **Admin › Platform backups**                              |

Still lost? Press **Cmd-K** or **Ctrl-K** and type what you are looking for.
