# API reference generator

Rebuilds `src/data/openapi.json`, the public, filtered copy of the Cloudgate OpenAPI document the
`/docs/api` pages are generated from. It needs a checkout of the cloudgate repository next to this
one (or `CLOUDGATE_DIR=/path/to/cloudgate`) with `backend/node_modules` installed.

```bash
cd scripts/api-reference
node extract.cjs extract.cjson   # reads summaries and permissions from the backend controllers
python3 build.py               # filters internal routes, enriches and writes src/data/openapi.json
```

Run it when the cloudgate repository's `backend/openapi.json` changes.
