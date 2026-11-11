// Links into the templates website (the cg-templates repo's own Astro site), the canonical home of
// each template's detail page. Its routes: templates/<id>/, categories/<id>/, alternatives/<id>/,
// all with a trailing slash, under site.templatesSite.
import { site } from './site';

const base = site.templatesSite.replace(/\/?$/, '/');

/** The templates website's page for one template. */
export const templatePageUrl = (id: string) => `${base}templates/${encodeURIComponent(id)}/`;

/** The templates website's page for one category. */
export const templateCategoryUrl = (id: string) => `${base}categories/${encodeURIComponent(id)}/`;

/** The templates website's home, where people browse and search the whole catalogue. */
export const templatesHome = base;
