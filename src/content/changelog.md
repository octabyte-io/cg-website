## 0.2.0: the platform (13 November 2026)

The first numbered release of the Cloudgate server, on the Hosted instance and in a self-hosted install. It is the first version that takes an upload of only the changed files. The Cloudgate CLI works with 0.1.0 and newer.

### The Hosted instance updates itself to each release

Each new version of Cloudgate that passes the full test run now reaches the Hosted instance by itself, with a backup taken first. A release that needs a manual step on upgrade waits for a person instead. Self-hosted installs still upgrade when you run the install command again.

### The source is public on GitHub

Cloudgate's source repository, [github.com/octabyte-io/cloudgate](https://github.com/octabyte-io/cloudgate), is public. Self-hosting needs no access request (see [how to self-host Cloudgate](/self-hosted)). Bug reports, feature ideas and pull requests are welcome as GitHub issues, as `CONTRIBUTING.md` describes, and a security problem is reported privately on the repository's Security tab, under **Report a vulnerability**. The license is still the Elastic License 2.0.

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
