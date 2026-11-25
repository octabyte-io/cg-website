// The people who write the blog (src/content/blog). A post names one by `author: <id>`.
// Each author with at least one post gets a page at /blog/authors/<id>; one with none gets no page.
export interface Author {
  id: string;
  name: string;
  /** One plain sentence under the name on the author page. Say only what is true. */
  bio: string;
}

const team = 'Writes about Cloudgate for the team at Octabyte, the company that makes it.';

export const authors: Author[] = [
  { id: 'azeem', name: 'Azeem', bio: team },
  { id: 'arfan', name: 'Arfan', bio: team },
  { id: 'haider', name: 'Haider', bio: team },
  { id: 'taimur', name: 'Taimur', bio: team },
  { id: 'musa', name: 'Musa', bio: team },
  { id: 'saladin', name: 'Saladin', bio: team },
];

export const authorIds = authors.map((a) => a.id) as [string, ...string[]];

export const authorById = (id: string): Author => {
  const a = authors.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown blog author "${id}": add them to src/data/authors.ts`);
  return a;
};
