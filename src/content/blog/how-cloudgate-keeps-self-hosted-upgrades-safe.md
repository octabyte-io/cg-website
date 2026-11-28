---
title: How Cloudgate keeps self-hosted installs and upgrades safe
seoTitle: How Cloudgate keeps self-hosted upgrades safe
description: "Why Cloudgate's installer runs only signed, fully tested versions, saves your database before an upgrade and keeps the old version until the new one is healthy."
lede: "A self-hosted Cloudgate installs only a version that passed the full test run and carries a valid signature, dumps its database before an upgrade, and keeps the old version until the new one is healthy. Here is why each of those three decisions was made, and what it costs."
author: arfan
published: '2026-11-26'
topic: engineering
related:
  - { href: '/docs/self-host/install', title: 'Install and upgrade a self-hosted Cloudgate' }
  - { href: '/self-hosted', title: 'Self-host Cloudgate on your own server' }
  - { href: '/security', title: 'Security at Cloudgate' }
  - { href: '/blog/whats-new-in-cloudgate-november-2026', title: "What's new in Cloudgate: November 2026" }
faq:
  - { q: 'How does the Cloudgate installer check that a version is genuine?', a: 'Each published version carries a signature on its checksum file, made with Octabyte''s signing key. The install script holds the public key and checks the signature with <code>ssh-keygen -Y verify</code> before it downloads the version. A missing or failing signature stops the run with nothing changed.' }
  - { q: 'What happens if a Cloudgate upgrade fails?', a: 'The run stops and keeps the old version at <code>/opt/cloudgate.previous</code>, next to a dump of the database taken before the migrations. It prints the steps to go back by hand. Going back is never automatic.' }
  - { q: 'Can I skip the database backup during an upgrade?', a: 'Yes, with <code>CLOUDGATE_SKIP_BACKUP=1</code>, for a database too large to dump on every upgrade. Without it, a dump that fails stops the upgrade before anything changes.' }
  - { q: 'Which servers can run a self-hosted Cloudgate?', a: 'An x86-64 (amd64) server with Ubuntu 24.04 or 26.04. Any other release, Debian and Ubuntu 22.04 among them, is refused before anything is downloaded.' }
---

Self-hosting a platform means trusting its installer with root on your server, again on every upgrade. Cloudgate's answer is three rules: install only what passed the tests, install only what Octabyte signed, and never upgrade without a way back.

## Only a version that passed the full test run can be installed

Until 0.3.0, the install cloned the repository onto your server and built it there. That needed compilers, 4 GB of swap and minutes of CPU on a small server, and it turned every build failure into an install failure.

Now each version is one prebuilt download attached to its GitHub release, and the install only ever installs a published version. Two gates come before publishing:

- **The end-to-end suite must have passed on the release's exact commit.** A red run publishes nothing, so no server can install an untested version.
- **Only a tag on `main` is published.** A tag cut from a side branch, even a green one, never becomes the version every self-hosted server installs.

Since 0.3.14 a version can also ship first as a release candidate, such as `v0.3.14-rc.1`: tested, built and signed like any version, but published as a GitHub pre-release that no install or update notice offers. `CLOUDGATE_VERSION=v0.3.14-rc.1` installs it on a test box, and once it holds up, the version itself is published from the same commit.

**The cost:** a fix reaches your server only once it is tagged and published. Building from a branch is now a by-hand developer path, not something the install does.

## Only a version Octabyte signed is installed

A checksum beside a download proves the file arrived whole, not who published it: anyone who could write to a release could replace both. So since 0.3.5, the publish workflow signs each checksum, and the install script carries Octabyte's public key and checks the signature with `ssh-keygen -Y verify` before it downloads the version. A missing signature, one that does not verify, or a checksum that names another file stops the run with nothing changed.

The practical result: a stolen release token alone can no longer put code on your server.

**Why an SSH key and not something newer?** Two alternatives were weighed:

| Option | Why it was not chosen |
| --- | --- |
| Sigstore keyless signing | No key to look after, but every server would first have to download `cosign` before it could check anything. |
| GitHub artifact attestations alone | Only someone running `gh` checks them; the server would still trust the checksum. |
| An SSH signing key (chosen) | `ssh-keygen` ships with `openssh-client`, already on a stock Ubuntu server. The cost is one secret to keep and rotate. |

Rotation is planned for: the install holds a list of allowed keys, so for a while it accepts the old key and the new one, and the old one is dropped once no version signed with it needs installing.

## An upgrade always leaves a way back

Database migrations only go forward. Before 0.3.2, an upgrade that broke the backend at start left nothing to return to: the old version was deleted as soon as the services restarted, and no backup was taken.

Now a run that changes the version does two things first:

1. **It dumps the database** to `/var/backups/cloudgate/`, readable by root only, keeping the newest three. A dump that fails stops the run before anything changes.
2. **It keeps the old version** at `/opt/cloudgate.previous` until the new one answers its health check. If it never does, the run fails, keeps the old version and prints how to restore both by hand.

Going back stays a deliberate step by a person, never automatic. This was chosen over a dump alone, which saves your data but leaves you to find the old version again, and over a line in the docs telling you to take a backup, "which nobody follows before an upgrade that looks routine".

## What this means when you run it

You run the same command to install and to upgrade:

```sh
curl -fsSL https://cloudgate.octabyte.io/install.sh | sudo sh
```

Behind it, the version is tested, signed and checked before it touches your server, and the previous version and a fresh database dump wait beside it until the new one proves healthy. [Install and upgrade a self-hosted Cloudgate](/docs/self-host/install) has every option.
