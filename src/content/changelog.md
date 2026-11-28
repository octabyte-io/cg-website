## 0.3.14: backups you can restore on a Bought Server, and Agents that read runtime logs (28 November 2026)

A release about getting a Bought Server back and letting an Agent see what a running app says. Nothing to do on upgrade.

### Bought Servers get their own page, and each one its own tab

On the Hosted instance, an Organization where buying a Server is offered has a **Bought Servers** row in its rail. The page lists every Bought Server with its stage, size and price, under one sentence that gives the count and the monthly total. A Bought Server that is being deleted is left out of the count and the total, and shows no price. When **Buy a Server** is turned off, the page says why. Each Bought Server also has its own **Bought Server** tab, with its Location, Server image, size, price and backups. The Server's **Settings** tab points to it, and the emails about a change or a Restore link straight to it. Three Bought Server messages that said the wrong thing are corrected. More in [Bought Servers](/docs/guide/bought-servers).

### List, take and restore a Bought Server's backups

While a Bought Server's backups are on, its **Server backups** list shows the copies its provider keeps, newest first, with **Being made** on one that is still being made. Up to 7 are kept, one a day.

- **Back up now** takes one more at once, in the same 7 slots. Its confirmation names the backup it will push out once 7 are kept. It is refused while the Organization is frozen, the Server is not Ready, or its backups are off.
- **Restore** on a backup row asks you to type the Server's name and says the backup's date, the downtime and what is lost. Cloudgate takes a safety copy first, puts the disk back as it was at that backup, runs Server setup again, and redeploys every Service on the Server whose current Deployment finished after the backup, so the data is the backup's and the code is your current version. The email names the Services it redeployed. A Restore is never charged, leaves the Server's extra storage as it is, and is refused while the Server is in maintenance.

### Agents can read a Service's runtime log and its container metrics

An Agent has a **Can read runtime logs** switch, off by default. Set it in the **Create an Agent** dialog or on the Agent's row; every change is in the audit log, and a caller Agent never has it. With it on, the MCP tool `read_runtime_log` reads the last lines a granted Application or Compose stack wrote while running (100 by default, 500 at most). The new `get_service_metrics` tool needs no switch: it gives a summary of a granted Service's CPU, memory, network and disk, summed over every container it runs, over an hour by default and 24 hours at most. No tool reads a Server's own metrics. Stored secrets are masked in a runtime log as everywhere else, but whatever the app itself prints, such as a customer's email, is not, so switch it on only for an Agent whose model host you would trust with that output. More in [MCP tools](/docs/mcp/tools) and [Agents](/docs/guide/agents).

### Release candidates, to check a version on a test box first

A version can now be published as a release candidate first, such as `v0.3.14-rc.1`. It is tested, built and signed like a version and published as a GitHub pre-release, but neither the install nor the console's update notice offers it, and it never reaches the Hosted instance. To try one on a test box, name it: `curl -fsSL https://cloudgate.octabyte.io/install.sh | sudo CLOUDGATE_VERSION=v0.3.14-rc.1 sh`. The final version is then published from the same commit, and a box on the candidate upgrades to it by running the install again or from the update notice. A release candidate counts as older than the version it becomes. More in [Install Cloudgate](/docs/self-host/install).

### File editors scroll sideways again, with a Wrap lines switch

An editable file, such as a Compose file, the Project config or a Traefik file, no longer wraps long lines by default. It scrolls sideways inside its own box, so YAML indentation and a parser's column numbers read as written. A **Wrap lines** switch under the editor turns wrapping on, and your browser remembers the choice for every editor. Read-only views, such as diffs, converted files and plan copies, still wrap.

### Nothing else in the console scrolls sideways

A table wider than its card now stacks each row: the name and actions on one line, the other columns as labelled values under it, and the table comes back once there is room. The Servers, Backup destinations, Registries, Services, Domains and Audit log tables were reshaped so they stay tables at laptop width: a Server's SSH address sits under its name, a destination's region under its endpoint, a registry's username under it, and Created under the type. Code views wrap long lines at their indentation, and the **Create an Agent** dialog, picker details, the resource switcher on a phone and a long search in the command palette stay inside their box.

### Smaller fixes

- Six console messages now say what the console does. Server setup names its eight steps, not six. The **Docker cleanup ran** notification says the nightly prune removes stopped containers, unused images and build cache, never volumes. A Compose stack's Source form calls it a Compose stack. Under a running forward-auth proxy on a lapsed plan, the note says removing the proxy makes its gated Domains fail every request, rather than open them to anyone. The Console domain warning and the password-reset screen no longer point at a file in the source.
- A volume backup's restore dialog shows each tarball's file name whole under its folder, with the full path on hover.

## 0.3.13: back up a whole Compose stack, the Same-machine warning and cloudgate.yml (26 November 2026)

A release about backing up an app that runs as a Compose stack. One thing to do on upgrade: redeploy each Compose stack once before backing it up, so Cloudgate records its named volumes.

### A Compose stack on a Server has a Volume backups tab

A Compose stack on a Server gets a **Volume backups** tab. **Add a backup** offers **The whole stack**, the default, or **One volume**. The whole stack is one schedule and one run: it stops the stack (when **Stop the stack while it runs** is on), copies every named volume into one moment folder on your Destination, and starts the stack again, even if one copy failed, so the app's database and its files come from the same moment. **Stop the stack while it runs** is on by default when a service runs a `postgres`, `mysql`, `mariadb` or `mongo` image. One volume is picked by its service and then one of the named volumes it mounts, or typed as **Other volume**.

**Restore** on a whole-stack backup lists the moments its Destination holds and restores one whole, as one run: it removes the stack's containers (stops a swarm stack), restores each volume, then starts the stack, showing each step. While a whole-stack backup holds a stack's volumes, **Remove containers** is refused. On a swarm stack, only the copy on the stack's Server is backed up; a stack in a Cloud account has no tab. A stack last deployed on an older version says it hasn't deployed successfully yet until you redeploy it once. More in [Backups](/docs/guide/backups) and [Compose stacks](/docs/guide/compose-stacks).

### The Same-machine warning on a self-hosted instance

On a self-hosted instance, a Server, a Service or a Deploy target on Cloudgate's own machine now says so wherever it is shown or picked, and a plan that creates a Service there carries the warning in its Notes. Losing that machine would lose the Service and Cloudgate's own records together, so the warning points to adding another Server. It warns and never refuses. Create forms and a new Environment now open on the first Ready Server instead of Cloudgate's own machine. The Hosted instance never deploys to its own machine, so it never shows the warning.

### `cloudgate.yml` works as well as `cloudgate.yaml`

A repository's Project config may be named `cloudgate.yml`. A branch holding both names uses `cloudgate.yaml`, and moving the config there says the other file is not read. A Template folder may spell its YAML files `.yaml` or `.yml`, but not both.

### A Compose stack can leave its file unnamed

A Compose stack with no file named finds `compose.yaml`, `compose.yml`, `docker-compose.yaml` or `docker-compose.yml` in its source at each deploy. The **Compose file** box can be left empty, and a Project config entry for a Compose stack may leave out `file`.

## 0.3.12: a Help & support page in the console (21 November 2026)

A small release about finding help without leaving the console. Nothing to do on upgrade.

### The console has a Help & support page

A **Help & support** row at the foot of the Organization rail opens a page with the guides on this site ([Quickstart](/docs/quickstart), the [user guide](/docs/guide/get-started), [how Cloudgate fits together](/docs/concepts), the [CLI](/docs/cli), [MCP and agents](/docs/mcp) and the [API reference](/docs/api)), the common answers ([Troubleshooting](/docs/help/troubleshooting), the [FAQ](/docs/help/faq), [Limits](/docs/help/limits) and this changelog), and the support address, [support@octabyte.io](mailto:support@octabyte.io), with **Email support** and a copy button. Every docs link opens in a new tab.

### A Template's page opens on cgt.octabyte.io, and a shown password is whole

A Template's name and logo open its page on the [template directory](https://cgt.octabyte.io/)'s own domain, `https://cgt.octabyte.io/templates/<id>/`. On Get started's done card, **Show** widens the **How to sign in** rows to the card and wraps a long password onto more lines, where it used to end in "…".

### Smaller fixes

- The gate drawn behind the sign-in and sign-up screens is shown whole on a wide monitor, with only its sides falling off a narrow screen.

## 0.3.11: how to sign in to a new app, a Config files tab and HTTPS before Open (20 November 2026)

A release about the last step of a first deploy: opening the app and signing in. Nothing to do on upgrade.

### Get started's done card says how to sign in to the app

A template may now say how a person signs in once the app runs, in an optional `signIn` block in its `template.yaml`. The wizard's done card shows a **How to sign in** block from it. For an account made at setup, it shows the username and a masked password with **Show** and **Copy**, read from the stack's own variables, so a member who cannot read them sees no password. For an app that makes its first account on the first visit, it says where to open the app to make it. An app that signs in on another page (`/admin`) or on another Domain, such as a bundled Keycloak, gets an **Open** link to exactly that page. Without `signIn`, no block. **What next** links straight to the stack's **Variables** tab.

Templates that carry `signIn` name Cloudgate 0.3.11, so an older Instance hides them.

### A stack's Config files tab edits the files its Template shipped

The config files a Template ships were kept as the stack's file mounts but never shown, so changing one meant SSH and an edit Cloudgate's copy would later overwrite. A **Config files** tab, after **Shell**, lists them by path and opens one in the editor. **Save** writes the new content where the stack runs, and **Restart to apply** restarts the stack. The tab is absent for a stack with no file mount, or for a role that cannot read its mounts.

### A Domain says when its HTTPS certificate is still being issued

Until Let's Encrypt answers, Traefik serves its own self-signed certificate, so opening a brand-new app could land on a browser warning. Get started now adds a **Getting its HTTPS certificate** stage and shows **Open** once the certificate is issued. The Domains tab and the Overview's Domain card say whether the certificate is issuing, valid until a date, or not issued yet, read from what the Domain's host really serves (`GET /domains/:id/served-certificate`).

### A faster Templates list

The Templates list carried every logo inline, about 10 MB for the official catalogue, so the screen sat on placeholders. It now carries each logo's address, served and cached on its own, with an SVG logo sandboxed so it runs no script. A Template from the official catalogue opens its page in the [template directory](https://cgt.octabyte.io/) from its name and logo; a mirror or a private catalogue still opens the app's website.

### Smaller fixes

- On Hosted, the **This host** card, a shell on the platform host, is shown only to the instance's operators.
- Get started's **Location** card shows the world map, as **Buy a server** does.
- Setting up a Template in a new Project with nowhere to deploy opens Get started, instead of a form with no Deploy target.
- The masthead's Organization cell is the rail's width, so their borders meet.

## CLI 0.1.1: template check takes signIn (20 November 2026)

`cloudgate template check` and `cloudgate template pack` take a template's `signIn` block, which 0.1.0 refused as a field a template does not have. Both of its forms are taken: an account made at setup (`password`, with `username` when the app asks one, and `path` when its sign-in page is not `/`), and an account made on the first visit (`firstVisit: { path, note }`). Either may name the Domain it is on with `domain: <service>`. A password held in a `value` input is taken when its text is exactly one reference to a secret input, such as `{ value: "{{ADMIN_PASSWORD_RANDOM}}" }`. The check refuses both forms at once, an input the template has no rule for or its compose file does not read, a `domain` that `domains` does not list or several Domains share, and a password that is not a secret. Its check is Cloudgate 0.3.11's.

## 0.3.10: expand any file editor, real progress in Get started and the operating system at Buy (18 November 2026)

Nothing to do on upgrade.

### Expand a file editor to fill the window

Every file editor in the console has an **Expand** button. It opens the same file filling the browser window: a top bar with the file's name, where it belongs, an **Unsaved changes** mark and the editor's own **Discard** and **Save**, then the file edge to edge, and a status line with its line count and, for a compose file or a Project config, whether the YAML is valid. **Back to page** or Esc returns with the edit kept. It is on the Compose file card, the Project config panel, the Traefik files, the Variables editor, the patch editor and every text box that holds a whole file, such as mounts, certificates, custom CSS and the Server's setup command. An Environment's copy of a repository-kept config expands too, read-only.

### The Get started wizard shows real progress

The wizard's single spinners are gone. Setting up a server says which of its eight setup steps is running and the machine's newest line, the launch shows each of its parts and the deploy's output, and a card confirmation says how long it has taken.

### Buy a server picks the operating system, and the wizard buys with every option

**Buy a server** has an **Operating system** select, filtered to the chosen size's architecture and named in the summary. It opens on Ubuntu 24.04, what every bought Server ran before. Server families are named Standard, Performance, Arm and Dedicated, the screen opens on two suggestions, **Closest** and **Cheapest**, and the summary stays in view as you scroll. The Get started wizard now offers every option the Buy screen has, the operating system, backups and extra storage among them. After you buy, its next step opens at once, with the server's progress in a strip above it, and asks the web address, Project and setup name as a Template setup does, so your own domain and its DNS check work there too.

### A powered-off bought Server is refused as a deploy target

A bought Server an operator powered off was still offered as a deploy target, and a deploy to it failed with a server error. A deploy, rollback, Start or restart, Run now, upload or preview is now refused with a clear message naming the Server, a Template setup waits for it to be powered on, and the pickers leave it out. Its notice says **Powered off by an operator**, gives the reason and links support.

### Smaller fixes

- A new bought Server's first setup waits up to ten minutes for the machine to accept SSH, where it could time out and leave the Server at **Setup failed**.
- A Server's **Terminal** tab is now its **Shell** tab, at `/servers/<id>/shell`; the old address forwards there.

## 0.3.9: reboot recovery, a MongoDB 8 kernel warning and a DNS check in template setup (18 November 2026)

A release about what happens after a reboot, and about saying why before something fails. One step on upgrade, for each Server you added: press **Run setup again** once.

### Traefik and Compose stacks come back after a reboot

After a reboot of the platform host or a Server, `cloudgate-traefik` and the Compose containers on `cloudgate-network` could stay down, so nothing answered on ports 80 and 443 until someone ran `docker start`. Docker starts them before the swarm has brought the network up, the start fails, and Docker never tries again. A new systemd unit, `cloudgate-boot-recover`, runs after every start of Docker, waits up to 3 minutes for the network, and starts exactly the containers whose start failed on it. A stack you stopped stays stopped, and `journalctl -u cloudgate-boot-recover -b` says what it started.

**What to do on upgrade**: the install adds the unit, so upgrading the platform host is enough there. On each Server, press **Run setup again** on its **Infrastructure** tab: it adds the unit as setup step 8 and changes nothing already set up.

### The console says when MongoDB 8 will not start on a host's kernel

MongoDB 8 exits at start on a Linux kernel from 6.19.0 to 7.0.13, which includes Ubuntu 26.04's first 7.0 kernels, and Swarm restarted it forever while the deploy read done. Cloudgate now reads each host's real kernel version and warns before anything is deployed: a **Kernel** row under a Server's **What is installed** and the platform host's **What this host is running**, and the same warning in the database form when a MongoDB 8 image is picked, on a MongoDB's Overview, and in a Template's setup when the template runs one. Nothing is refused. The fix is a kernel update and a reboot (`sudo apt update && sudo apt full-upgrade`, then `sudo reboot`); until then `mongo:7` starts.

### A Template setup shows the DNS record for your own domain, and checks it

When you type your own domain in a Template's setup instead of the generated sslip.io host, the field now shows the A record to make, its name and the address it points at, with **Check DNS** beside it, as the **Add a domain** dialog does. A failed check does not hold **Set up** back. With no public address recorded for the Cloudgate host, the panel says to set it under **Settings** > **Instance**.

### Compose stack actions that match the stack

- A running Compose stack offers **Restart** where **Start** used to do nothing. With any container stopped or removed, it is **Start** again.
- **Remove containers** now shows that it ran: a toast, the status reads **stopped**, and the Containers tab shows its empty state, where a second press used to send a second removal. A stopped stack's empty tabs offer **Start**.
- The reason **Start** and **Stop** are off is a line under the row of buttons, not text that pushed **Remove containers** off the page.
- A Template's logo and name open its website in a new tab, on the catalogue and on its setup page.

### A generated Domain on a public address is served over HTTPS

**Generate one for me** in the **Add a domain** dialog now turns on **Serve over HTTPS** with Let's Encrypt when the server's address is public, as a Template setup does, and leaves HTTPS off for a private address. `POST /domains/generate` now answers JSON, `{ "host": "…", "https": true }`, instead of plain text.

## 0.3.8: a public address from the install, and template setup that opens on the template (17 November 2026)

0.3.8 carries everything planned for 0.3.7, which was tagged but never published. Nothing to do on upgrade.

### The install fills in the public address sslip.io Domains need

A fresh install left **Settings** > **Instance** > **Public address** empty, so a free sslip.io Domain for something on the platform host could not be made. The install now finds the host's public IP and the backend saves it there at boot, only while the setting has never been set. `CLOUDGATE_PUBLIC_IP=<ip>` names the address instead, and `CLOUDGATE_PUBLIC_IP=none` turns this off. The field now takes only an IP address; one the server does not know as its own is refused, with a **Save it anyway** switch for an address behind NAT or a load balancer.

### A Template's setup opens on the Template

Setting up a Template now opens on the Template itself: its logo, name, version, description, links and tags. You pick the Project from cards (**New Project** and each Project), and the form follows in the same card. A Project with no Environment says so and offers to add one. A yes-or-no value is a switch, and catalogue cards are wide rows with Website, Docs and Source under the name.

### Template setup fixes from an end-to-end walk

- A generated sslip.io host names a service called as its Template once: `ackee-<hash>`, not `ackee-ackee-<hash>`.
- An applied Template's result lists every Domain it made, and a catalogue search puts the templates whose name matches first.
- A Compose stack's Deployment pulls images quietly, so its log is no longer hundreds of progress lines.
- An Environment's **Pending setups** are rows, and a Domains table no longer cuts the host short.

### Well-formed SSH keys and a sturdier build queue

- About one generated ed25519 SSH key in 256 came out malformed and was refused by the Server. Every generated key is well-formed now; delete and generate again any key a Server refused.
- A failed read of the builds concurrency (with PostgreSQL away) no longer ends the backend; the queue runs one build at a time until it can read it.

### The install ends with the Cloudgate mark

A successful install now ends with the Cloudgate mark, the version and what to open next: the sign-up address while the instance is unclaimed, the sign-in address after that.

## 0.3.5 and 0.3.6: signed versions, and arm64 for the Hosted instance (16 November 2026)

0.3.5 is the first published version with a signature on each checksum, and carries everything from 0.3.3 and 0.3.4, which were not published. 0.3.6 changes nothing in the install or the console. Nothing to do on upgrade.

### The install refuses a version whose signature does not verify

Each published version now ships a signature for each tarball's `.sha256`, beside the tarball and the checksum. The one-command install carries Cloudgate's public key and checks that signature with `ssh-keygen -Y verify` before it downloads the tarball. A missing signature, one that does not verify, or a checksum file that names another tarball stops the run with nothing changed. A release counts as the latest only once its signature is attached, and the console's update notice counts versions the same way. So a stolen release token alone can no longer put code on your server.

### An arm64 build for the Hosted instance

Each version is published for arm64 as well as amd64, so the Hosted instance can run on Arm machines and upgrade there by itself. A self-hosted install still needs an x86-64 (amd64) server, and the install refuses arm64 by name.

## 0.3.2: safer upgrades and an uninstall (15 November 2026)

A release about running Cloudgate on your own server: upgrades that can be undone, an uninstall that keeps your data, and an installer that warns before it starts. Nothing to do on upgrade.

### An upgrade saves the database first and keeps the old version until the new one works

When running the install command again changes the version, it first dumps the `cloudgate` database to `/var/backups/cloudgate`, readable only by root, and keeps the newest three dumps. A dump that fails stops the run with nothing changed; `CLOUDGATE_SKIP_BACKUP=1` skips it. The old version stays at `/opt/cloudgate.previous` until the new one answers its health check. If it never does, the run fails, keeps the old version and prints the steps to go back by hand.

### Uninstall Cloudgate and keep the instance

`deploy/uninstall.sh`, run as root, takes Cloudgate off the server: its two services, its Traefik container and its files. It keeps the instance, naming each path: the database, the settings in `/etc/default/cloudgate-*` and `/etc/cloudgate`, the upgrade dumps and the install logs, so a later install is the same instance. `--purge` removes those as well, only after you type the instance's public host. Docker, PostgreSQL and the firewall are left in place.

### The installer runs on Ubuntu 26.04 too

The one-command install now runs on Ubuntu 26.04 as well as 24.04, on x86-64, with the same Cloudgate version. Any other release, 22.04 and Debian among them, is refused before anything is downloaded.

### The installer warns before it starts, retries its downloads and logs every run

Before downloading anything, the install warns about what is likely to fail later: another program on port 80, 443, 3000 or 4000, less than 15 GB free disk, less than 4 GB memory, or a download host that does not answer. No warning stops the run, and `CLOUDGATE_SKIP_PREFLIGHT=1` skips the checks. Every download is tried again up to three times, and every run is logged to `/var/log/cloudgate`, with the newest ten kept.

### The installer keeps SSH open on any port, and waits for apt

The firewall step now allows the port your SSH server really listens on, not only port 22, so a server with SSH on another port keeps it. On a fresh server where the system is still installing updates, the install waits for apt instead of failing, and a second run started while one is under way stops without changing anything.

### A re-run brings Traefik to its version

When a Cloudgate version moves to a newer Traefik, running the install command again now replaces the running Traefik container with it, so ports 80 and 443 drop for a few seconds. A failed download leaves the old one serving.

### Cloudgate runs its own Node

The install puts Node in `/usr/local/share/cloudgate/node` and runs Cloudgate from there, so a Node of your own in `/usr/local` is left alone. The copy an older install put in `/usr/local` is no longer used; remove it by hand if nothing else needs it.

## CLI 0.1.0: the first stable release (14 November 2026)

The Cloudgate CLI's first stable release is on npm's `latest` tag, so `npm install -g @octabyte-io/cloudgate` installs it, with no `@next`. It holds everything in the 0.0.2 betas below. Anyone on a beta is told about it by the update notice.

### Fixes

- `cloudgate config plan` exits 1 when you decline the plan or mistype a Config name, as a root `cloudgate deploy` does, so a script can tell it from an apply.
- Deploying one app from its own folder inside a Project folder uploads the whole Project folder, keeping the code shared between apps.
- A root `cloudgate deploy` no longer starts a doomed rebuild of each folder app's previous upload before uploading the new one.
- The build's own `.env` file is no longer counted as deleted, and a deploy with nothing changed says `Nothing changed since the last upload`. A setting a plan removes reads `<field> (removed)`.

### Templates may ship a `.js` config file

`cloudgate template check` and `cloudgate template pack` take a config file ending in `.js`, for an app that reads its config as a JavaScript module. Other scripts are still refused.

## 0.3.0 and 0.3.1: install a published version (14 November 2026)

From here on, each Cloudgate version is published as a prebuilt download on GitHub, once it has passed the full test run. 0.3.1 is the first one published; 0.3.0 has no download.

### Self-hosting installs a published version instead of building one

The one-command install no longer clones or builds anything on your server. It downloads the latest published Cloudgate version, or the one `CLOUDGATE_VERSION=v0.3.1` names, checks it against its published checksum and installs it. A version older than the one installed is refused, since database migrations only go forward. The server needs less for it: no compilers, no pnpm and no swap file. A server installed from a git checkout is switched over by the next run on its own, with the database and settings kept; the run says where the old checkout went, for you to delete. `CLOUDGATE_REF` is gone: name a version instead.

### The console reads its API address when it starts

The console takes its API address from `/etc/default/cloudgate-console` when it starts, so changing it, for example to serve the console on its own domain with live logs, is a restart of `cloudgate-console` instead of a rebuild.

### Templates may ship a `.js` config file

A template's config file may now end in `.js`, for an app that reads its config as a JavaScript module, such as Formbricks. An older Cloudgate refuses a catalogue that holds one and keeps its last good copy, so such templates arrive only once this version is out.

### The Hosted instance upgrades to each published version

The Hosted instance now installs the same published version a self-hosted server does, by itself, once that version is out.

## 0.2.0: the platform (13 November 2026)

The first numbered release of the Cloudgate server, on the Hosted instance and in a self-hosted install. It is the first version that takes an upload of only the changed files. The Cloudgate CLI works with 0.1.0 and newer.

### The Hosted instance updates itself to each release

Each new version of Cloudgate that passes the full test run now reaches the Hosted instance by itself, with a backup taken first. A release that needs a manual step on upgrade waits for a person instead. Self-hosted installs still upgrade when you run the install command again.

### The source is public on GitHub

Cloudgate's source repository, [github.com/octabyte-io/cloudgate](https://github.com/octabyte-io/cloudgate), is public. Self-hosting needs no access request (see [how to self-host Cloudgate](/self-hosted)). Bug reports, feature ideas and pull requests are welcome as GitHub issues, as the [contributing guide](https://github.com/octabyte-io/cloudgate/blob/main/CONTRIBUTING.md) describes, and a security problem is reported privately on the repository's Security tab, under **Report a vulnerability**. The license is still the Elastic License 2.0.

### Self-hosting is one command

On a bare Ubuntu 24.04 server, `curl -fsSL https://cloudgate.octabyte.io/install.sh | sudo sh` installs Cloudgate. It checks the server, clones the public repository into `/opt/cloudgate` (or brings the copy already there up to date) and runs the installer. The address the console is built for is now optional: a first install uses the server's public IP address, and running the command again reuses the address the last install was given. Running it again is also how you upgrade. An install made while the repository was private may still fetch over SSH; point it at `https://github.com/octabyte-io/cloudgate.git` first.

### Fixes to uploads, Project folders and sign-out

- Uploads larger than 10 MB through the console's address no longer fail with an error after four minutes.
- A deploy no longer reports the build's own `.env` file as deleted, and skips the upload when nothing changed since the last one.
- A plan line that removes a setting now says so, for example `build.context (removed)`.
- Deploying one app from its own folder inside a Project folder uploads the whole Project folder, so code shared between apps is included and the config entry is left as it was.
- Applying a Plan in a root `cloudgate deploy` no longer starts a doomed rebuild of each folder app from its previous upload.
- A relative `build.context` is counted from the app's build path.
- An upload that loses its connection to the build host stops instead of carrying on.
- Personal key names can be up to 255 characters again, where a sign-in library limit refused names over 32.
- Signing out also clears the session cookie of the other instance mode.
- `cloudgate config plan` exits 1 when you answer no, so scripts can tell it from an apply.

### A deploy uploads only the files that changed

An Instance at 0.2.0 compares the folder you deploy with what its build host already holds, file by file, and takes only the files it lacks or holds different. Files deleted on your side are deleted there too, and the new set of files replaces the old one only once every file matches; if the files changed meanwhile, the old set is left as it was. The Cloudgate CLI uses this from 0.0.2-beta.3 on; an older Instance still gets the full upload.

### One folder for a whole Project, and a config that knows its version

A Project config now has a version that moves with every Apply and every saved change. A whole-file edit that started from an older version is refused, saying when the config last changed and who changed it, so two people editing the same Project cannot overwrite each other. Cloudgate can also list which apps a Project builds from a subfolder of one folder, which is what a root `cloudgate deploy` builds. An app built from a folder is never built before its first upload, where before that first Deployment ran with no files and failed.

### Deploy an app from the templates website, with no server and no account yet

Each "Deploy" button on the templates website now opens the console's **Get started** wizard: three steps for someone who has never used a deployment tool. Sign up or sign in on the way, then get a Server (buy one from Cloudgate, or use your own: the wizard makes a key and gives you the one command to run), then press Deploy. Cloudgate applies the setup by itself once the Server is ready and shows **Open &lt;app&gt;** with its address. The free sslip.io address is plain http; add your own domain for https.

### Buy a Server from Cloudgate on the Hosted instance

Servers has a new **Buy a Server** page: a world map of locations sorted by distance, the sizes sold there, optional backups and extra storage from 10 GB to 10 TB, and a summary with the monthly price and exactly what is charged today. Bought Servers are paid monthly in advance on the same invoice as the plan. Nothing is made until the payment succeeds, Cloudgate runs the first setup by itself, and a machine the provider refuses is refunded in full. Resize, add backups or grow storage from the Server's settings; Delete credits the unused part of the month.

### Templates come from the official Template catalogue and are set up as a Plan

The Templates screen reads the official catalogue on a fresh install, with nothing to configure. Its first release holds 20 apps, among them Ghost, n8n, Nextcloud, Plausible Analytics, Uptime Kuma, Vaultwarden and WordPress. A Template is an ordinary Project config (`cloudgate.yaml`), so setting one up is an ordinary **Plan** you review and Apply. Every generated password is made once from a secure source, kept encrypted and never shown in the Plan. The older `template.toml` format is gone.

### The Template catalogue is one zip, checked whole

Each catalogue release is now one `catalogue.zip`, checked in memory before anything in it is read. A zip with anything a template does not need, an unsafe path, a symlink or an oversized payload is refused as a whole, and the screen keeps the last good copy.

### Compose stacks in a cloud: resize, grow the disk, replace the VM

A Compose stack in an AWS or Google Cloud account runs on its own Stack VM. Resizing it, growing its data disk or replacing the VM with a newer pinned image is now a line in the Environment's Plan, with the old and new monthly price. **Stop** stops the VM too, so a stopped stack pays only for its disk; **Start** brings it back as it was; **Restart** restarts the containers without touching the VM.

### Changing an Application's port moves its Domains

Change an Application's port and every Domain on the old port moves to the new one in the same step, instead of answering 502 until each is edited. The console says which Domains moved and which stayed.

### One Organization that pays for itself per person, and attached ones on Business

On the Hosted instance a person can own one Organization that pays for itself. On Business, that Organization can pay for more. Every member of an attached Organization can see who pays for it.

### Self-hosted: one Organization without a license

A self-hosted install holds one Organization for free. An Enterprise license adds more, alongside SSO, SCIM, custom roles, forward auth, white-labelling and parallel builds. An install that already has several keeps them all; only a new one is refused.

### A safer Hosted instance: https only, a Secure session cookie, and a check at sign-up

The Hosted instance serves one hostname over https with a Let's Encrypt certificate, its session cookie is `Secure`, and its sign-up form asks for a Cloudflare Turnstile check. A confirmation email goes to one address at most once every five minutes.

### On the Hosted instance the paid features come with a plan, not a license key

On the Hosted instance SSO, SCIM, custom roles and forward auth come with the Business plan or an Enterprise deal. A self-hosted install still unlocks them with its license key.

### Cloud builds run in your cloud's own build service

On the Hosted instance a Service in an AWS account builds in CodeBuild in that account, and one in Google Cloud builds in Cloud Build in that project. The build log streams live into the Deployment log, Cancel stops the cloud build, and the source goes up without its `.git` folder, so no git token leaves Cloudgate. A private registry password reaches the build only through the cloud's own secret store and is deleted when the build ends.

### Hosted billing: one plan, Add-ons, and never switching a Server off

The Hosted instance sells one monthly plan that counts 3 Servers and 3 Cloud Environments, and an Add-on for one more of each. Going over a count refuses only the next addition: nothing running is ever switched off by billing.

### Exact machine sizes on AWS and Google Cloud

Name a native database class, cache node type or container CPU and memory in the Project config and it wins over `size` in that cloud, while `size` still counts on every other target. The Plan shows both, and taking the setting out never shrinks a machine to the smallest.

### Cloud settings in the Project config: `native.aws` and `native.gcp`

A Service in the Project config can carry the cloud provider's own settings for what Cloudgate makes: ECS, RDS, ElastiCache, S3 and CloudFront on AWS; Cloud Run, Cloud SQL and Memorystore on Google Cloud. Every Plan checks them against the pinned provider schema, so a typo shows on any Plan, not on the first cloud deploy. Settings that would widen access, drop deletion protection or lose data are locked, and every locked setting names its reason.

### Swarm settings in the Project config: `native.docker`

A Service on a Server can carry its Swarm settings (labels, health check, restart, update and rollback policy, stop grace period and ulimits) in the Project config, written exactly as the Docker Engine API takes them. The Generator writes your current values into the file, so the first Plan changes nothing.

### Agents and the MCP endpoint

An Organization can now have **Agents**: members an AI tool acts as, each with a role (Reader or Operator), grants to the Projects, Environments and Services it may reach, and its own agent keys. An Agent connects to your console's address followed by `/mcp`. Every call it makes is a row in the audit log, allowed or refused, and every result passes through a mask that hides stored secrets. Create one under Settings, Agents; its Connect panel has the configuration for each supported client.

### API keys are now personal keys

Existing API keys keep working, now called personal keys. Creating, listing or deleting keys needs a signed-in console session, so deleting a key really revokes it, and new keys expire after 90 days unless you choose otherwise. Give an AI agent an Agent with an agent key, never your personal key.

### Smaller additions for the CLI

The server gained what the Cloudgate CLI calls: a public "is this a Cloudgate" check the CLI asks before it sends a key, a device login approved in the console, a key that can delete itself on logout, a Service's variables set and unset by name and never shown, a Deployment's status, and a Runtime log that can be read as a tail. Uploading a whole project folder of several MB now builds, and an upload during a running build is refused instead of pulling files out from under it.

## CLI 0.0.2-beta.3

### Deploy uploads only the files that changed

`cloudgate deploy` sends a list of the folder's files with a checksum of each, and uploads only the ones the Instance lacks or holds different. Files you deleted are deleted there too. It says what it sent, such as `Uploading 3 changed files, 12.0 kB (211 unchanged, 1 deleted)`, and its sizes and the 100 MB warning are about the zip actually sent. `--full` sends every file. An Instance older than 0.2.0 gets the full upload, with no error and no question.

### Project folders: `link --whole-project`, `config pull` and `config plan`

A folder, usually a monorepo's root, can be linked to a whole Project rather than one Service. `cloudgate link --whole-project` saves the Project config there as `cloudgate.yaml`, your working copy. `cloudgate config pull` replaces it with the current config, asking first if you have edited it. `cloudgate config plan` shows what each Environment's Plan creates, changes and destroys, and applies it on a yes; destroying a Service or a major upgrade needs its Config name typed, and `--yes` in CI still refuses both. A copy the config has moved on from is refused, sending nothing.

### A root `cloudgate deploy` deploys every app built from a subfolder

In a Project folder, `cloudgate deploy` runs the same plan step first, then uploads the folder to each app whose config entry names a subfolder of it (`source: { folder: apps/web }`), builds each, and follows every build to its end, with one line per app at the end. Apps from a repository or an image, databases and buckets are listed as skipped. `--service` deploys one app only.

### A first deploy asks which Project, or creates one

In a folder with no link, a first `cloudgate deploy` in a terminal asks which Project, plus **Create a new Project**, then whether this is one app or the whole Project. A new Project gets its name (the folder's by default), a `production` Environment on a ready Server or a Cloud account and region you pick, and a starter `cloudgate.yaml` in the folder to add your apps to. In CI, or with a target flag or variable, nothing new is asked.

### `cloudgate template try` and `test-values.yaml`, for template authors

`cloudgate template try <template folder>` starts a template's compose part on this computer's Docker the way an Instance would, checks that each Domain answers, prints the containers' state and logs when something fails, and always removes everything afterwards. It needs no Instance and no login, only Docker with Compose 2.1.1 or newer. Values a template asks for come from the folder's `test-values.yaml`, then the ask's default, then a sample; `template check` and `template pack` skip that file.

## CLI 0.0.2-beta.2

### `cloudgate template check` and `cloudgate template pack`

`template check` runs Cloudgate's own Template check on a template folder or a catalogue, with no account needed, and prints each template it would offer or hide and why. `template pack` builds a catalogue release from template folders, checking it before anything is written.

## CLI 0.0.2-beta.1

### Deploy a folder from your terminal

`cloudgate deploy` uploads the current folder (respecting `.gitignore` and `.cloudgateignore`, and leaving `.env` files out), starts a Deployment, follows its log and exits 0 only if it ends done. It waits for a running build instead of uploading under it, and asks before switching a Service away from its git source.

### Log in through the browser, link a folder, read status, logs and variables

`cloudgate login` shows a code you approve in the console, from any device, and saves a personal key in the system keychain. `cloudgate link` ties a folder to one Service, so `deploy`, `status`, `logs` and `vars` need no flags there. `cloudgate vars` sets a variable by name, reading a secret from hidden input or stdin so it never lands in your shell history, and never prints a value. `cloudgate logout` deletes this computer's key on the Instance.

### Checked before your key leaves the terminal

Every command first asks the address whether it is a Cloudgate, without the key. Anything else is refused, plain `http://` is refused except on localhost, and redirects are never followed, so a key is never carried somewhere else. `CLOUDGATE_KEY` works in CI, output pipes cleanly, and exit codes are documented.
