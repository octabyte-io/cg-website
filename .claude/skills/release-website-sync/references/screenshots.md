# Console screenshots for a release

The docs show the real console, with the fictional **Northwind Labs** Organization, in both
themes. A screenshot is right only when it shows the console of the release being documented, so
take them from a local console built from the release commit, never from memory or an older image.

Contents: what to shoot · running the console · the Northwind Labs data · capturing ·
Hosted-only and unreachable screens (dummy data) · checking and placing

## What to shoot

1. **Changed screens.** For every console file in the release diff, find the screenshots of that
   route (`jq -r '.[] | "\(.name)\t\(.route)"' public/docs/screens/manifest.json`) and retake each
   whose content changed. A renamed button or a new column counts; a change you cannot see does not.
2. **New UI** a reader needs a picture for: a new tab, dialog, card, flow step or state. Crop to
   that element, not the whole page. Roughly one per new feature; not every field needs an image.
3. **Home and /tour copies.** If you retake a name listed in `src/data/tour.ts`, copy the new
   `-dark.webp` and `-light.webp` into `src/assets/console/` too.

Keep the name when retaking (pages and the manifest refer to it). New names are kebab-case,
`<area>-<thing>`: `server-backups-list`, `compose-volume-backups-add`.

## Running the console from the release

```bash
cd /home/user/cloudgate
git worktree add /tmp/cg-release <release-tag-or-rc>   # the exact code that shipped; main may be ahead
cd /tmp/cg-release && pnpm install
sudo service postgresql start          # or: docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:16
# (start the Docker daemon with `sudo dockerd >/tmp/dockerd.log 2>&1 &` if Servers or builds need it)
cp backend/.env.example backend/.env   # fill APP_ENCRYPTION_SECRET and BETTER_AUTH_SECRET with `openssl rand -hex 32`
createdb -h localhost -U postgres cloudgate 2>/dev/null || true
pnpm --filter backend db:migrate
pnpm dev                               # backend :4000, console :3000
```

Run it in the background and wait for `http://localhost:3000` to answer. The cloudgate
`README.md` "Local setup" section is the reference if a step changed. Never push anything from the
worktree; remove it when done (`git worktree remove /tmp/cg-release`).

## The Northwind Labs data

Every screenshot uses the same fictional world so the guide reads as one story:

- Organization **Northwind Labs**; owner **Ada Okafor** (`ada@northwind.example`), plus a few
  members with other roles.
- Projects such as **storefront** and **internal-tools**, Environments **production** and
  **staging**, Services like `web`, `api`, `worker`, `orders-db` (Postgres), `media` (bucket).
- Servers `web-1`, `web-2`, `db-1` (regions and IPs from documentation ranges: `203.0.113.x`,
  `198.51.100.x`), Domains on `northwind.example`.
- Never a real person, company, email, IP or key.

Build it with a seed script kept in the scratchpad that signs up the first account in the console
(the first account owns the instance), saves a Playwright storage state, and creates the records
through the API with that session (`page.request.post('/backend/<path>', { data })`). Read the
endpoint paths and bodies from `frontend/src/lib/api/endpoints/*.ts`. Only creation calls are
needed; Servers that need a real SSH target can be Docker containers running `sshd`, or, for a
screen that only lists them, the dummy-data approach below.

A seed script that worked for the last release is kept in `/mnt/project-files/release-sync/seed/`
(if present): start from it, fix what the release changed, and save the working version back there
for next time (network mount: re-read after writing).

## Capturing

Use the bundled helper. Write a capture script in the scratchpad:

```js
import { openCapture } from '/home/user/cg-website/.claude/skills/release-website-sync/scripts/shoot.mjs';

const cap = await openCapture({ storageState: '/path/to/state.json' });
await cap.shoot('server-backups-list', `/servers/${ids.web1}/settings`, {
  title: 'Server backups',
  description: 'A Bought Server’s backups, newest first, with Back up now',
  manifestRoute: '/servers/[serverId]/settings',
  waitFor: 'text=Server backups',
  crop: (page) => page.getByRole('heading', { name: 'Server backups' }).locator('xpath=ancestor::section[1]'),
});
await cap.shoot('server-backups-restore', `/servers/${ids.web1}/settings`, {
  title: 'Restore a Server backup', description: 'The Restore confirmation',
  waitFor: 'text=Server backups',
  setup: async (page) => { await page.getByRole('button', { name: 'Restore' }).first().click(); },
  crop: '[role=dialog]',
});
await cap.close();   // merges the manifest entries
```

It takes dark and light at 2x with reduced motion, hides the Next.js dev overlay, refuses a page
that shows an error, crops with 16px padding, writes WebP to `public/docs/screens/` and merges the
manifest by name. Raw PNGs stay in `$TMPDIR/cg-shots-raw/` for you to look at. Run one browser at a
time.

Safety while capturing: open dialogs and fill forms, then close them without submitting. Never
confirm a delete, remove, revoke, stop, restore or rollback against data other shots use. If only
submitting reaches the state, make a throwaway record and delete it after.

## Hosted-only and unreachable screens: real components, dummy data

Some screens never render on a local self-hosted console: billing, Buy a Server, a Bought Server's
card and backups, trial banners, plan limits, anything gated on the Hosted instance; and states that
are hard to reach (a failed payment, a full allowance, a backup being made). Do not skip them and do
not draw them. Render the **real console components** and answer their API calls with **dummy
data**, the way the console's own UI tests do.

1. **Find how the component gets its data.** The route's page under `frontend/src/app/(console)/`
   renders feature components from `frontend/src/features/<area>/`. They read data through hooks in
   `frontend/src/lib/api/use-*.ts`, which call `frontend/src/lib/api/endpoints/*.ts`; the endpoint
   file gives the URL (the browser calls it as `/backend/<path>` on the console's origin) and the
   TypeScript type of the answer.
2. **Find the dummy data the tests already use.** The component's `*.test.tsx` beside it renders
   it with fixtures that satisfy that type, e.g. `frontend/src/features/billing/plan-card.test.tsx`
   builds a `BillingState` with `state({...})`. Copy the shape, then make the values realistic
   Northwind Labs values. Prices, plans and allowances must match `src/data/site.ts` on the website.
3. **Tell the console it is Hosted.** The console asks `GET /settings/about` (`useInstanceMode`);
   patch its answer's `mode` to `"hosted"`.
4. **Answer the calls** with `mocks` in `openCapture` (every shot) or `shoot` (one shot):

```js
const hosted = { url: '**/backend/settings/about', patch: (about) => ({ ...about, mode: 'hosted' }) };
const cap = await openCapture({ storageState, mocks: [hosted] });
await cap.shoot('billing', '/settings/billing', {
  waitFor: 'text=Current plan',
  mocks: [{ url: '**/backend/billing/subscription', json: billingState /* shaped like the test's state() */ }],
  crop: (page) => page.getByText('Current plan').locator('xpath=ancestor::*[@data-slot="card"][1]'),
});
```

   Watch the network (`page.on('request')`) on a first run to find every call the screen makes,
   and mock each one the screen needs.
5. **When a component has no reachable route at all** (it only renders deep inside a flow), mount
   it on a temporary page under the console's dev galleries, `frontend/src/app/dev/shots/<name>/page.tsx`,
   with the fixture as props or a `QueryClient` pre-filled with `setQueryData`, and shoot that page
   (`/dev/*` is served under `next dev` only). The page is scaffolding: delete it after the shot and
   check `git -C <worktree> status` is clean. Nothing from this skill is committed to cloudgate.

The caption of a dummy-data screenshot describes it like any other; the data is fictional
everywhere, so it needs no special note.

## Checking and placing

- **Look at every image** in both themes (Read the raw PNG): the right state, the data loaded (no
  skeletons, spinners, toasts or error text), nothing cut off, no dev overlay, crop tight around
  what the caption talks about. Retake until it is right.
- **Place it** with `<Screenshot name="..." alt="..." caption="..." />` inside the step or section
  it illustrates. `alt` says what is on screen; the caption says what to notice. Both must match
  the actual picture, including the fictional names in it.
- **Remove** images no page uses any more (the copy checker lists them) and their manifest entries.
- If a screen truly cannot be shown even with dummy data, keep the prose, leave the image out, and
  say why in the PR.
