import json, re, sys
BAD = re.compile(r"@[A-Z]\w+|\.ts\b|\w+(Service|Controller|Repository|Guard|Pipe|Module|Dto|Schema|Filter|Interceptor)\b|\bspec\b|e2e|src/|\b(above|below)\b|sibling|\bH-\d+|#\d+|\bNest\b|decorat|`[a-z]+\.[a-z]+[A-Z]\w*|\(\)|\bcolumn\b|\bjsonb\b|\bdrizzle|\btable\b|\brow's\b|the console's own|\bwe\b|\bWe\b|\bonce had\b|\bused to\b|\bfix\b|\bdefect|\bbug\b|\bTODO|\bissue\b|\bcensus\b|\boracle\b|`[A-Za-z]+\.[A-Za-z]+\(|statement|\btest/", re.I)
def clean(doc):
    if not doc: return ''
    p = doc.split('\n\n')[0]
    p = re.sub(r'\s*\(ADR-?\d+[^)]*\)', '', p)
    p = re.sub(r'\s*\(H-\d+\)', '', p)
    p = re.sub(r'\{@link ([^}]+)\}', r'\1', p)
    p = re.sub(r'\s*\((maintenance|traefik)TargetAuthority\)', '', p)
    p = re.sub(r'\s*\(see maintenanceTargetAuthority[^)]*\)', '', p)
    p = re.sub(r'\s*\(?(maintenance|traefik)TargetAuthority\)?', '', p)
    p = p.replace('**', '').replace('\n', ' ')
    p = re.sub(r'\s+', ' ', p).strip()
    sents = re.split(r'(?<=[.!?])\s+(?=[A-Z`"(])', p)
    keep = []
    for s in sents:
        if BAD.search(s) or 'ADR' in s or re.search(r'\bUS\d+', s): break
        if re.search(r'Promise|status rule|`\d{3}` (either way|for all)|^Left at|sibling', s): continue
        if re.match(r'(Gated|Guarded|Scoped|Void|Same shape|No `@)', s): continue
        if re.search(r"`\w+: \[?'?\w+", s) and len(keep): continue
        if re.search(r"`\w+: \[?'?\w+", s): s = re.sub(r"\s*\(?`\w+: \[?[^`]*`\)?", '', s).strip()
        if re.fullmatch(r"`\d{3}`[^.]*\.", s) and len(s) < 60: continue
        keep.append(s)
        if len(' '.join(keep)) > 320: break
    out = ' '.join(keep).strip()
    if out and not out.endswith(('.', '?', '!', ':')): out += '.'
    return out if len(out) > 12 else ''
if __name__ == '__main__':
    e = json.load(open(sys.argv[1]))
    for k, v in e.items():
        c = clean(v['doc'])
        if c: print(k, '|', c)
