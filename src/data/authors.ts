// The people who write the blog (src/content/blog). A post names one by `author: <id>`.
// Each author with at least one post gets a page at /blog/authors/<id>; one with none gets no page.
export interface Author {
  id: string;
  name: string;
  /** One or two sentences under the name on the author page: what they write about. Say only what is true. */
  bio: string;
}

export const authors: Author[] = [
  {
    id: 'azeem',
    name: 'Azeem',
    bio: "Azeem writes about Cloudgate's product direction and each month's releases, turning the changelog into what changed for the people who deploy with it and what to do when they upgrade.",
  },
  {
    id: 'arfan',
    name: 'Arfan',
    bio: "Arfan covers how Cloudgate is engineered: signed releases, safe upgrades, self-hosting and security, explained from the design decisions recorded in Cloudgate's public repository.",
  },
  {
    id: 'haider',
    name: 'Haider',
    bio: 'Haider writes the step-by-step guides: deploying a framework to a server you own, moving an app from another platform, and running it in production with domains, backups and monitoring.',
  },
  {
    id: 'taimur',
    name: 'Taimur',
    bio: "Taimur covers AI on Cloudgate: agents that deploy over MCP within the guard rails you set, and open models served on your own GPUs behind Cloudgate's OpenAI-compatible Gateway.",
  },
  {
    id: 'musa',
    name: 'Musa',
    bio: 'Musa writes the comparisons: how Cloudgate stands against other ways to deploy and host apps, with the trade-offs stated plainly and the facts dated so readers can check them.',
  },
  {
    id: 'saladin',
    name: 'Saladin',
    bio: 'Saladin runs the measured pieces: what a server of a given size really handles, what an app costs to run, and how each number was measured so anyone can repeat it.',
  },
];

export const authorIds = authors.map((a) => a.id) as [string, ...string[]];

export const authorById = (id: string): Author => {
  const a = authors.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown blog author "${id}": add them to src/data/authors.ts`);
  return a;
};
