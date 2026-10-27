---
title: Domains and TLS
description: Route a domain to an application, let G8Deck create the DNS record or tell you which one to create, get a certificate issued and renewed, and tune the web server in front of it.
section: apps
order: 20
updated: 2026-10-27
---

A domain is what makes an application answerable from outside its server. It
lives on a **port** of the application: nginx routes the domain to that port,
and the certificate is issued for the domain. A published port on its own
binds loopback and is reachable only from the machine.

## Add a domain

Open the application's **Domains & TLS** tab and choose **Ports & domains**
(**Add domain** once one exists).

![The Ports & domains panel: a port with its name, application port, host port and domain, the health path, and Save ports](/docs/domains-and-ssl/ports-and-domains.webp)

| Field           | Notes                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------ |
| **Name**        | A label for the port, such as `http`                                                             |
| **App port**    | The port your application listens on                                                             |
| **Host port**   | On a native server the app port _is_ the host port; nginx proxies the domain to it               |
| **Domain**      | One per port entry. Two entries cannot claim the same domain or host port                        |
| **Health path** | Each deploy waits until the application answers 2xx here on the first port. Blank skips the gate |

**Save ports**, then press **Re-run Pipeline** on the deployment: saving queues
the DNS and certificate steps again, and the re-run is what routes, records and
certifies the domain.

![The Domains & TLS tab with nothing routed yet: the empty state and the Ports & domains button](/docs/domains-and-ssl/domains.webp)

## DNS: automatic, manual or unconfirmed

When you type a domain, the console checks who can create its record:

| Coverage              | Meaning                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| **Automatic DNS**     | A DNS account connected to your organisation is authoritative for the zone; G8Deck creates the record |
| **Manual DNS**        | You create the A/AAAA record pointing at the server yourself                                          |
| **DNS not confirmed** | G8Deck could not tell                                                                                 |

For a manual record behind Cloudflare, turn the proxy **off** (grey cloud). A
proxied record terminates TLS at Cloudflare, and the certificate challenge
never reaches your server.

**Delete domain**, on the domain's row, asks first and then stops it routing
here — "Domain removed — _x_ no longer routes here."

## Certificates

Each domain row shows its certificate's issuer and expiry, or **No certificate
yet**, with **Issue / Manage certificate**, which opens the deployment's
**Certificates** page.

| Source            | Used for                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| **Let's Encrypt** | Every public domain. Issued over ACME HTTP-01 and renewed automatically                                |
| **Self-signed**   | `localhost`, IP addresses, names with no dot, and `.localhost`, `.local`, `.test`, `.internal`, `.lan` |
| **Custom**        | A certificate you import: domain, certificate PEM, private key PEM and an optional chain               |

The source is chosen for you from the domain. On the Certificates page:

- **Issue certificate** queues issuance for a domain this deployment routes.
- **Import certificate** stores your own; it is never renewed by G8Deck — upload
  a replacement instead. You get a warning 14 days before it expires.
- **Renew now** renews a Let's Encrypt certificate early.
- **Revoke** cannot be undone and counts against Let's Encrypt's rate limit.
- **Delete** removes the certificate; the domain falls back to plain HTTP.

Renewal runs twice a day, at 03:00 and 15:00, and renews anything within 30
days of expiry. Port 80 keeps serving plain HTTP for those renewals — that is
deliberate; redirecting it would break the challenge.

![The Certificates page for a deployment, with the Let's Encrypt staging notice and no certificates issued yet](/docs/domains-and-ssl/certificates.webp)

> If the page shows **Let's Encrypt staging is on**, certificates issued now are
> not trusted by browsers. Staging is how an installation proves issuance works
> without spending the production rate limit.

## A name without a domain

An application with no domain can be given a platform hostname —
`<application>.<platform base domain>` — on its primary port. This happens only
when an administrator has set a platform base domain for the installation, and
only for an application attached to a single deployment.

## The web server

The **Web server** tab changes the nginx in front of the application without
anyone editing a file on the server — the configuration is stored by G8Deck and
regenerated on every change.

| Setting                      | Notes                                                                                                                                          |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Maximum upload size**      | A number with `k`, `m` or `g`; blank leaves nginx's own default of 1m                                                                          |
| **Response timeout**         | How long nginx waits for your application                                                                                                      |
| **Buffer responses**         | Turn off for server-sent events, streamed downloads or long-polling                                                                            |
| **Compress text responses**  | HTML, CSS, JavaScript, JSON, XML and SVG                                                                                                       |
| **Index files, error pages** |                                                                                                                                                |
| **Require a password**       | HTTP basic auth with your own prompt and users. Only password hashes reach the server; the certificate challenge and the health path stay open |

**Apply** writes it. If the health path stops answering after a change, the
previous revision is put back automatically — which is why the tab asks for a
health path. **History** keeps every revision with **Revert to this**.

The tab needs the application to be attached to a deployment with a domain, and
it is not available on Kubernetes, where these settings belong on the cluster's
ingress.

![The Web server tab: upload size, response timeout, buffering and compression, with the notice that the application has no domain yet](/docs/domains-and-ssl/web-server.webp)
