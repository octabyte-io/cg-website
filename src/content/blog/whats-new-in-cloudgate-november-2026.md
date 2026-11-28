---
title: "What's new in Cloudgate: November 2026"
seoTitle: "What's new in Cloudgate: November 2026 releases"
description: "Cloudgate's November 2026 releases, 0.2.0 to 0.3.14 and CLI 0.1: a public source, a signed install, a stable CLI, stack and Server backups, and a first deploy."
lede: "November 2026 took Cloudgate from its first numbered release, 0.2.0, to 0.3.14 in fifteen days, and the command-line tool to its first stable version. Here is what changed, grouped by what it means for you, and the two steps to take when you upgrade."
author: azeem
published: '2026-11-26'
updated: '2026-11-28'
topic: releases
related:
  - { href: '/changelog', title: 'The full changelog, release by release' }
  - { href: '/blog/how-cloudgate-keeps-self-hosted-upgrades-safe', title: 'How Cloudgate keeps self-hosted installs and upgrades safe' }
  - { href: '/vibe-coding', title: 'Deploy an app you built with AI' }
  - { href: '/cli', title: 'The Cloudgate CLI' }
  - { href: '/docs/self-host/install', title: 'Install and upgrade a self-hosted Cloudgate' }
faq:
  - { q: 'What is the latest version of Cloudgate?', a: 'Cloudgate 0.3.14, released on 28 November 2026, is the latest platform version. The Cloudgate CLI is at 0.1.1, released on 20 November 2026, on npm''s <code>latest</code> tag.' }
  - { q: 'How do I upgrade a self-hosted Cloudgate?', a: 'Run the same install command again. It installs the newest signed version, saves the database first and keeps the old version until the new one answers its health check. On the Hosted instance upgrades happen by themselves.' }
  - { q: 'Do I need to do anything after upgrading to 0.3.9 or later?', a: 'Yes, once: on each Server you added, press <strong>Run setup again</strong> on its <strong>Infrastructure</strong> tab. It adds the unit that brings Traefik and Compose stacks back after a reboot, and changes nothing already set up.' }
  - { q: 'Do I need to do anything before backing up a Compose stack?', a: 'Yes, once: redeploy the stack on 0.3.13 or later. A deploy records the named volumes each of its services mounts, and the Volume backups tab offers them from that record.' }
  - { q: 'Is the Cloudgate CLI stable?', a: 'Yes. 0.1.0, released on 14 November 2026, is the first stable release, and 0.1.1 is current. Install it with <code>npm install -g @octabyte-io/cloudgate</code> on Node 22 or newer.' }
---

In short: Cloudgate's source is public, self-hosting is one signed command, the CLI is stable, and someone who has never deployed anything can now go from sign-up to a running app over HTTPS, with the steps shown as they happen. The [changelog](/changelog) has every detail; this is the month in one read.

## The source is public, and self-hosting is one command

Since 0.2.0 on 13 November, Cloudgate's source is public at [github.com/octabyte-io/cloudgate](https://github.com/octabyte-io/cloudgate), under the Elastic License 2.0. It is source-available and free to self-host, with no access request.

On a bare Ubuntu 24.04 or 26.04 server, one command installs it:

```sh
curl -fsSL https://cloudgate.octabyte.io/install.sh | sudo sh
```

From 0.3.1 that command no longer builds anything on your server. It downloads a published Cloudgate version, which exists only after the full test run passed on it, so the server needs no compilers, no pnpm and no swap file. [Self-host Cloudgate](/self-hosted) has the requirements.

## Installs and upgrades you can trust

Three releases this month were about running Cloudgate on your own machine without surprises:

- **Signed versions (0.3.5).** The install checks a signature on each version before it downloads it, so a stolen release token alone cannot put code on your server.
- **Upgrades with a way back (0.3.2).** An upgrade dumps the database first and keeps the old version until the new one answers its health check.
- **Reboot recovery (0.3.9).** Traefik and Compose stacks come back after a reboot of the platform host or a Server.
- **Release candidates (0.3.14).** A version can first ship as a candidate, such as `v0.3.14-rc.1`, published as a GitHub pre-release that no install or update notice offers. `CLOUDGATE_VERSION=v0.3.14-rc.1` installs one on a test box.
- **The Same-machine warning (0.3.13).** A Server, Service or Deploy target on the machine Cloudgate itself runs on says so wherever it is shown or picked: if that machine is lost, a Service there goes with Cloudgate's own records. It warns and never refuses.

Why each of these works the way it does is in [How Cloudgate keeps self-hosted installs and upgrades safe](/blog/how-cloudgate-keeps-self-hosted-upgrades-safe).

## The CLI is stable

The Cloudgate CLI reached its first stable release, 0.1.0, on 14 November, and 0.1.1 followed on 20 November. Every install line is now simply:

```sh
npm install -g @octabyte-io/cloudgate
```

A `cloudgate deploy` uploads only the files that changed since the last one, and a Project folder holds a whole Project's `cloudgate.yaml`, so `cloudgate config plan` shows what a change will create, change or destroy before you apply it. [The CLI page](/cli) shows the commands.

## A first deploy for people who have never deployed

The **Get started** wizard is for someone who built an app, often with an AI tool, and wants it online. It has three steps: an account, a Server (buy one from Cloudgate or connect your own with one command), and Deploy. This month it learned to explain itself:

- **Real progress (0.3.10).** It shows which of the Server's eight setup steps is running and the machine's newest line, then the deploy's own output.
- **HTTPS before Open (0.3.11).** On a Server with a public address, the free sslip.io address is served over HTTPS, and **Open** appears only once Let's Encrypt has issued the certificate, so a new app never opens on a browser warning.
- **How to sign in (0.3.11).** The done card says how to sign in to the app you just made: the username and a masked password with **Show** and **Copy**, or where to open the app to make the first account.
- **Your own domain (0.3.9).** Typing your own domain shows the DNS record to make, with **Check DNS** beside it.

[Deploy an app you built with AI](/vibe-coding) walks through it.

## Running apps day to day

- **A Config files tab (0.3.11)** lists the files a Template ships, such as an app's settings file, and edits them where the stack runs, with **Restart to apply**. No SSH needed.
- **Expand any file editor (0.3.10)** to fill the window, with **Save**, **Discard** and a line that says whether the YAML is valid.
- **A Domain says when its certificate is issued (0.3.11)**: issuing, valid until a date, or not issued yet, read from what the address really serves.
- **A MongoDB 8 warning (0.3.9)** says before you deploy when the host's kernel will stop MongoDB 8 from starting, and how to fix it.
- **Help & support (0.3.12)** is a page in the console with the guides on this site and the support address.
- **A Compose stack's Volume backups tab (0.3.13)** backs up the whole stack in one run, every named volume under one moment, and restores a moment whole. **Stop the stack while it runs** starts on when a service runs a PostgreSQL, MySQL, MariaDB or MongoDB image.
- **A Compose Service may leave its file unnamed (0.3.13)**: each deploy then finds `compose.yaml`, `compose.yml`, `docker-compose.yaml` or `docker-compose.yml`. Cloudgate also reads a repository's config from `cloudgate.yml`; CLI 0.1.1 still reads only `cloudgate.yaml`.
- **Bought Servers get a page and a tab (0.3.14)**: on the Hosted instance, a Bought Servers page lists every one with its stage, size and price, and each Bought Server's own tab lists its Server backups, with **Back up now** and **Restore**.
- **Wrap lines (0.3.14)**: a file editor scrolls sideways again so YAML indentation reads as written, and a switch under it turns wrapping on.

## Agents that deploy, with guard rails

Since 0.2.0 an Organization can have **Agents**: members an AI tool acts as, each with its own role, grants and keys, reached at your console's address followed by `/mcp`. Every call an Agent makes is in the audit log, allowed or refused, and stored secrets are masked out of every result. From 0.3.14 an Agent can also read a granted Service's container metrics, and its Runtime log once its **Can read runtime logs** switch is on, which is off by default. [Cloudgate for AI agents](/ai-agents) explains what an Agent can and cannot do.

## What to do when you upgrade

Two releases this month need a step from you. After you upgrade to 0.3.9 or later, press **Run setup again** once on each Server's **Infrastructure** tab. It adds the unit that restarts Traefik and Compose stacks after a reboot, and changes nothing already set up. The platform host gets the unit from the install itself.

After you upgrade to 0.3.13 or later, redeploy each Compose stack you want to back up once. The deploy records the named volumes its services mount, which the **Volume backups** tab offers to back up.

On the Hosted instance at [cloudgate.octabyte.app](https://cloudgate.octabyte.app), every one of these releases arrived by itself.
