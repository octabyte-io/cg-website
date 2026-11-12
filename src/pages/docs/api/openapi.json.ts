import type { APIRoute } from 'astro';
import { apiGroups, openapiDocument } from '../../../data/api-reference';

// The public OpenAPI document, for download and code generators: src/data/openapi.json (operator-only,
// webhook and internal routes left out) with the reference's grouping as `x-tagGroups`.
export const GET: APIRoute = () => {
  const doc = {
    ...openapiDocument,
    externalDocs: { description: 'Cloudgate API reference', url: 'https://cloudgate.octabyte.io/docs/api' },
    'x-tagGroups': apiGroups.map((g) => ({ name: g.title, tags: g.tags })),
  };
  return new Response(JSON.stringify(doc), { headers: { 'Content-Type': 'application/json' } });
};
