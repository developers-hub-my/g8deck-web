---
title: Terms of Service
description: The agreement between you and Developers Hub Sdn Bhd for using G8Deck — the hosted control plane at g8deck.app and the self-hosted licences.
effective: 2026-09-22
updated: 2026-09-22
version: '1.0'
order: 1
---

These Terms are written in plain language on purpose. Where a heading below says what the product actually does — what happens at the end of a trial, or when an invoice goes unpaid — it describes the behaviour of the software as released on the effective date, and we will update the text and the version number when that behaviour changes.

## 1. Who we are

G8Deck is operated by **Developers Hub Sdn Bhd** (Company Registration No. 202001019928 (1376248-V)), a company incorporated in Malaysia with its office in Johor Bahru, Johor. "We", "us" and "our" mean Developers Hub Sdn Bhd. "You" means the person or organisation that opens an account or signs an order.

You can reach us at [hello@devhub.my](mailto:hello@devhub.my).

## 2. What the service is

G8Deck is an infrastructure deployment and lifecycle-management platform. It deploys and runs your applications on servers you already own or rent — on-premise or in your own cloud account — and manages them from a control plane.

It is offered in two forms:

| Form            | What you get                                                                                                                    | Governed by                                             |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Hosted**      | An account on the control plane we operate at [g8deck.app](https://g8deck.app). Your servers connect to it; we run the console. | These Terms and the plan you choose                     |
| **Self-hosted** | A licence to install and run the G8Deck control plane on your own infrastructure                                                | A signed order or agreement, with these Terms as a base |

In both forms **your applications and their data run on your own servers**. G8Deck holds the credentials, configuration and records it needs to manage those servers; it does not host your workloads.

## 3. Your account

- **One person, one account.** An account is for a single named person and must not be shared. You are responsible for everything done under it, so keep your password private and consider turning on two-factor authentication or a passkey, both of which the console offers.
- **You must be able to contract.** You must be at least 18, or be using the service through an institution that has agreed to these Terms on your behalf (see section 9).
- **Your personal organisation.** Every account is given an organisation of its own at sign-up, which it owns. Being invited into somebody else's organisation adds to that; it does not replace it.
- **Organisations and roles.** Inside an organisation, people hold one of three roles — **owner**, **administrator** or **member** — and inside a team, one of **lead**, **member** or **viewer**. Owners and administrators hold the infrastructure and its credentials; team roles decide who may change which application. An owner is responsible for the acts of everyone they admit.
- **Accurate details.** Keep your email address and billing details current. Notices we send to the address on the account count as delivered.

## 4. Plans, trial and billing

This section applies to the **hosted** service. Self-hosted, Academic and Enterprise licences are billed under their signed order (section 4.7).

### 4.1 Plans and prices

Self-serve plans (Starter, Growth and Business) are **monthly subscriptions priced in US dollars**, at the prices published at [g8deck.app](https://g8deck.app) on the day you subscribe. Each plan carries a published capacity — servers, members and app environments — that the software enforces. Enterprise is priced individually.

Prices exclude taxes. Where Malaysian Sales and Service Tax or another tax applies to you, it is shown as a separate line on your invoice.

### 4.2 Trial

A new organisation starts on a **free trial** of the Starter plan. You do not need to enter a card to start it. When the trial ends and you have not chosen a paid plan, the organisation can no longer create new servers or deployments; nothing that is already running is stopped and nothing is deleted. At the effective date of these Terms the trial is **14 days**; the current length is shown on your Billing page.

### 4.3 Invoices, receipts and payment

Each billing period produces an invoice, sent by email to your organisation's billing contact with a link to pay. Payment is by card through **Stripe**, our payment processor; we never see or store your card number. A receipt is emailed when the payment clears.

An invoice is due a set number of days after it is issued — **7 days** at the effective date; the current figure is on your Billing page.

### 4.4 If an invoice is not paid

1. On the due date the subscription becomes **past due**. Reminders are emailed on a published schedule — at the effective date, on the due date and again **3** and **7** days after it.
2. If the invoice is still unpaid after the published suspension point — **14 days** after the due date at the effective date — the organisation is **suspended**: no new servers, deployments or releases until the balance is paid, and running workloads may be stopped.
3. **Nothing is destroyed for non-payment.** Your servers, configuration and records stay as they are, and paying the outstanding invoice restores the service. If we ever intend to remove a suspended organisation's records, we will give at least 30 days' written notice to the account's email address first.

### 4.5 Changing plan

- **Upgrading** takes effect immediately. A full new period is billed from the date of payment; the unused part of the old period is not credited.
- **Downgrading** takes effect at the end of the current period. There is no proration or refund for the remainder of the period. If your organisation is using more than the smaller plan allows, the software will refuse new capacity until you are within the limit; it does not remove what is already there.

### 4.6 Cancelling

You may cancel at any time from your Billing page. Your subscription runs until the **end of the period you have paid for** and is not renewed. There is no refund for the unused part of a month. The [Refund and Cancellation Policy](/legal/refund-policy) sets out the exceptions.

### 4.7 Annual licences — self-hosted, Academic and Enterprise

These are sold under a **signed order** (a quotation, order form or agreement) and are billed annually, in the currency stated on the order, by bank transfer or as the order provides. Where the order and these Terms differ, the order wins for that licence. A licence ends when its term ends; what happens then is in section 6.

## 5. Acceptable use

You may not use G8Deck, or any server managed through it, to:

- break the law or infringe anyone's rights;
- store or distribute malware, run phishing or credential-harvesting sites, or send spam;
- attack, probe or overload any system you are not authorised to test, including ours;
- mine cryptocurrency on infrastructure we operate or that is shared with other customers;
- resell or sublicense the hosted service without our written agreement;
- attempt to defeat plan limits, security controls or the audit trail.

**Your applications are yours.** You are responsible for the code you deploy, the data it processes, the licences it needs and the people it serves. G8Deck runs what you give it; it does not review it.

We may suspend an organisation immediately where continuing would cause harm to other customers, to the service or to third parties, and we will tell you why.

## 6. Your data, backups and what happens at the end

- **You own your data.** Everything you store — application code, databases, files, secrets and configuration — remains yours. We claim no rights in it beyond what is needed to run the service for you.
- **Backups are your responsibility** unless a managed backup has been configured for a server and is shown as running in the console. Test your restores.
- **At the end of a fixed term** (a trial, an annual licence, or a term that expires) the software behaves gently by design: warnings are emailed **15, 5 and 0 days** before the term ends; on expiry, running deployments are **stopped and their data is kept**; and a grace window — **30 days** at the effective date — follows during which an extension puts everything back. After grace the organisation's capacity is withdrawn. **No automated process in G8Deck deletes a customer's data**, whether for expiry or for non-payment.
- **Closing your account.** You may delete your account from the console at any time. Disconnect or delete the servers you no longer want managed before you do, because a server record that is deleted leaves the machine and everything on it running, untouched, and still billed by whoever hosts it.
- **Records we must keep.** Invoices, receipts, credit notes and the audit trail are kept for as long as Malaysian law requires, which is currently at least seven years for financial records.

## 7. Academic licence

An Academic licence is for **teaching, learning and research** at an educational institution. It may not be used to run a business, to host a commercial or production service, or for any purpose that generates revenue. Members admitted under it must be students or staff of the institution. We may end an Academic licence that is being used outside these limits.

## 8. Availability and support

- **Self-serve plans carry no service-level agreement.** We run the hosted control plane with care and tell you when something is wrong, but we do not promise a particular uptime, response time or resolution time on Starter, Growth or Business.
- **A service-level agreement is available only under an Enterprise agreement**, and its terms are in that agreement.
- Support for self-serve plans is by email at [hello@devhub.my](mailto:hello@devhub.my).
- If the control plane is unavailable your applications keep running — they run on your servers — but you cannot deploy, scale or change them through G8Deck until it returns.

## 9. Institutions and people under 18

An organisation may be opened by a school, university or other institution for its students and staff. The institution accepts these Terms for everyone it admits, is responsible for their use, and must have the consent it needs from any member under 18. The hosted service is not intended for children, and we do not knowingly open accounts for people under 18 outside an institutional arrangement.

## 10. Intellectual property

G8Deck — the software, the console, the documentation and the G8Deck name and marks — belongs to Developers Hub Sdn Bhd or its licensors. Your subscription or licence gives you the right to use it as these Terms describe, and nothing more. If you send us feedback we may use it without owing you anything.

## 11. Warranties and liability

- The service is provided **as is**. To the extent Malaysian law allows, we exclude every warranty not stated in these Terms, including that the service will be uninterrupted, error-free or fit for a purpose we did not agree in writing.
- **Our total liability** to you for everything arising out of these Terms in any twelve-month period is limited to **the fees you paid us in the twelve months before the event giving rise to the claim**.
- We are **not liable for indirect or consequential loss** — lost profit, lost revenue, lost data you did not back up, or loss of business — however it arises.
- Nothing in these Terms excludes liability that cannot be excluded under Malaysian law, including for fraud.

## 12. Termination

- **By you:** cancel your subscription (section 4.6) or delete your account at any time.
- **By us, for cause:** we may suspend or end your access if you break these Terms, do not pay, or use the service in a way that harms others. Where the breach can be fixed we will tell you what it is and give you a reasonable chance to fix it first; where it cannot, or where continuing would cause immediate harm, we may act at once.
- **By us, on notice:** we may withdraw a plan or the hosted service with at least 60 days' written notice, in which case we refund any prepaid fees for the period after withdrawal.
- On termination your right to use the service ends. Sections 6, 10, 11 and 14 survive.

## 13. Changes to these Terms

We may change these Terms. For a material change we will give at least **30 days' notice** by email to the account's address and by updating the effective date and version at the top of this page. Continuing to use the service after the effective date of the new version means you accept it. If you do not, cancel before that date. Where the console asks you to accept these Terms at checkout, it records which version you accepted.

## 14. Governing law

These Terms are governed by the **laws of Malaysia**. Any dispute that we cannot settle between us will be decided by the courts of Malaysia, and you and we both agree to their jurisdiction.

## 15. General

- These Terms, the [Privacy Notice](/legal/privacy), the [Refund and Cancellation Policy](/legal/refund-policy) and any signed order are the whole agreement between us for the service.
- If part of these Terms is found to be unenforceable, the rest still applies.
- Neither of us is responsible for a failure caused by something outside our reasonable control.
- You may not transfer your agreement with us without our written consent. We may transfer ours to a successor of the business, with notice to you.

## Version history

| Version | Date              | Change        |
| ------- | ----------------- | ------------- |
| 1.0     | 22 September 2026 | First version |
