// Parse every *.controller.ts in the cloudgate backend: route method, path, JSDoc, @RequirePermission,
// @Public, @Query names, @HttpCode. Keyed by operationId (<Class>_<method>).
const path = require('path');
const cloudgate = process.env.CLOUDGATE_DIR || path.join(__dirname, '../../../cloudgate');
const ts = require(path.join(cloudgate, 'backend/node_modules/typescript'));
const fs = require('fs');
const root = path.join(cloudgate, 'backend/src');
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (p.endsWith('.controller.ts')) files.push(p); } })(root);
const out = {};
const decs = (n) => (ts.canHaveDecorators(n) ? ts.getDecorators(n) || [] : []);
const decInfo = (d, sf) => { const e = d.expression; if (!ts.isCallExpression(e)) return { name: e.getText(sf), args: [] }; return { name: e.expression.getText(sf), args: e.arguments.map((a) => a.getText(sf)) }; };
const strip = (s) => s.replace(/^['"`]|['"`]$/g, '');
const jsdoc = (n, sf) => {
  const full = sf.getFullText(); const ranges = ts.getLeadingCommentRanges(full, n.getFullStart()) || [];
  const docs = ranges.map((r) => full.slice(r.pos, r.end)).filter((c) => c.startsWith('/**'));
  if (!docs.length) return '';
  return docs[docs.length - 1].replace(/^\/\*\*\s?/, '').replace(/\s*\*\/$/, '').split('\n').map((l) => l.replace(/^\s*\* ?/, '')).join('\n').trim();
};
for (const f of files) {
  const sf = ts.createSourceFile(f, fs.readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true);
  ts.forEachChild(sf, function visit(n) {
    if (ts.isClassDeclaration(n) && n.name) {
      const cd = decs(n).map((d) => decInfo(d, sf));
      const ctrl = cd.find((d) => d.name === 'Controller');
      if (!ctrl) return;
      const classPerm = cd.filter((d) => d.name === 'RequirePermission').map((d) => d.args.map(strip));
      const classPublic = cd.some((d) => d.name === 'Public');
      const classDoc = jsdoc(n, sf);
      for (const m of n.members) {
        if (!ts.isMethodDeclaration(m)) continue;
        const md = decs(m).map((d) => decInfo(d, sf));
        const http = md.find((d) => ['Get', 'Post', 'Put', 'Patch', 'Delete', 'All'].includes(d.name));
        if (!http) continue;
        const queries = [];
        for (const p of m.parameters) for (const d of decs(p)) { const i = decInfo(d, sf); if (i.name === 'Query') queries.push({ name: i.args[0] ? strip(i.args[0]) : null, type: p.type ? p.type.getText(sf) : null, optional: !!p.questionToken }); }
        const headers = [];
        for (const p of m.parameters) for (const d of decs(p)) { const i = decInfo(d, sf); if (i.name === 'Headers' && i.args[0]) headers.push(strip(i.args[0])); }
        const id = `${n.name.text}_${m.name.getText(sf)}`;
        out[id] = {
          file: path.relative(root, f), doc: jsdoc(m, sf), classDoc,
          perm: [...classPerm, ...md.filter((d) => d.name === 'RequirePermission').map((d) => d.args.map(strip))],
          public: classPublic || md.some((d) => d.name === 'Public'),
          httpCode: md.find((d) => d.name === 'HttpCode')?.args[0] ?? null,
          frozen: md.some((d) => d.name === 'AllowedWhenFrozen'),
          queries, headers,
        };
      }
    }
  });
}
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(Object.keys(out).length);
