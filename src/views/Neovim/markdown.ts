import type { Line, Table, Tok } from './types'

const tk = (t: string, c?: string, extra: Partial<Tok> = {}): Tok => ({ t, c, ...extra })
const imgRow = (src: string, alt: string, caption: string): Line => [{ t: '', img: { src, alt, caption } }]

const MAX_LINES = 300
const BADGE = /shields\.io|badgen|badge|travis-ci|codecov|\/actions\/workflows\//i
const HTML_TAG = /<\/?(?:p|br|div|span|a|img|h[1-6]|picture|source|details|summary|center|b|i|em|strong|sub|sup|kbd|table|thead|tbody|tr|td|th|ul|ol|li|hr)\b[^>]*>/gi
// 1 = texte du lien, 2 = adresse, 3 = code, 4 = gras, 5 = adresse brute
const INLINE = /\[([^\]]+)\]\(([^)\s]+)[^)]*\)|`([^`]+)`|\*\*([^*]+)\*\*|(https?:\/\/[^\s<>)]+)/g

/** Ligne de séparation d'un tableau : |---|:---:|---:| */
const isSeparator = (s: string) => s.includes('|') && s.includes('-') && /^[\s|:-]+$/.test(s)

/** Découpe une ligne de tableau en cellules (le \| échappé reste un |). */
function splitRow(row: string): string[] {
    let r = row.trim()
    if (r.startsWith('|')) r = r.slice(1)
    if (r.endsWith('|') && !r.endsWith('\\|')) r = r.slice(0, -1)
    return r.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'))
}

const alignOf = (cell: string): 'left' | 'center' | 'right' | null => {
    const c = cell.trim()
    if (c.startsWith(':') && c.endsWith(':')) return 'center'
    if (c.endsWith(':')) return 'right'
    if (c.startsWith(':')) return 'left'
    return null
}

/** Dans une cellule : plus de HTML, et les images deviennent leur texte alternatif. */
const cleanCell = (c: string) => c
    .replace(HTML_TAG, ' ')
    .replace(/\[!\[([^\]]*)\]\([^)]*\)\]\(([^)]*)\)/g, (_m, alt: string, link: string) => (alt ? `[${alt}](${link})` : ''))
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim()

/** Convertit le Markdown d'un README GitHub en lignes de l'éditeur. Aucun HTML n'est injecté dans la page. */
export function markdownToLines(markdown: string, repo: string): Line[] {
    const rawBase = `https://raw.githubusercontent.com/${repo}/HEAD/`
    const blobBase = `https://github.com/${repo}/blob/HEAD/`

    /** Adresse absolue et sûre, ou null : on n'accepte que http(s) et mailto. */
    function resolve(url: string, base: string): string | null {
        const u = url.trim()
        if (/^(https?:\/\/|mailto:)/i.test(u)) return u
        if (u.startsWith('//')) return `https:${u}`
        if (u.startsWith('#')) return `https://github.com/${repo}${u}`
        if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return null // javascript:, data:, etc.
        return base + u.replace(/^\.?\//, '')
    }

    function inline(text: string, c?: string): Tok[] {
        const out: Tok[] = []
        let last = 0
        for (const m of text.matchAll(INLINE)) {
            const at = m.index ?? 0
            const [whole, linkText, linkUrl, code, bold, auto] = m
            if (at > last) out.push(tk(text.slice(last, at), c))
            if (code) out.push(tk(code, 'str'))
            else if (bold) out.push(tk(bold, 'fn'))
            else if (auto) {
                const href = resolve(auto, blobBase)
                out.push(href ? tk(auto, 'link', { href }) : tk(auto, c))
            } else if (linkText) {
                const href = resolve(linkUrl ?? '', blobBase)
                out.push(href ? tk(linkText, 'link', { href }) : tk(linkText, c))
            }
            last = at + (whole?.length ?? 0)
        }
        if (last < text.length) out.push(tk(text.slice(last), c))
        return out
    }

    const out: Line[] = []
    const src = markdown.replace(/\r\n?/g, '\n').split('\n')
    let inCode = false
    let inComment = false

    for (let i = 0; i < src.length; i++) {
        const source = src[i] ?? ''
        if (out.length >= MAX_LINES) {
            out.push([], [tk('-- README tronqué : la suite est sur GitHub.', 'com')])
            break
        }

        // Blocs de code : affichés tels quels
        if (inCode) {
            if (/^\s*```/.test(source)) { inCode = false; out.push([tk('```', 'mut')]) }
            else out.push([tk(source, 'str')])
            continue
        }
        const fence = source.match(/^\s*```(.*)$/)
        if (fence) { inCode = true; out.push([tk('```' + (fence[1] ?? '').trim(), 'mut')]); continue }

        // Commentaires HTML
        if (inComment) { if (source.includes('-->')) inComment = false; continue }
        if (source.includes('<!--') && !source.includes('-->')) { inComment = true; continue }
        let line = source.replace(/<!--.*?-->/g, '')

        // HTML : on garde la première image (hors badges) et on retire les balises
        const html = line.match(/<img\b[^>]*>/i)
        if (html) {
            const imgSrc = html[0].match(/\ssrc=["']([^"']+)["']/i)?.[1]
            const alt = html[0].match(/\salt=["']([^"']*)["']/i)?.[1] ?? ''
            const url = imgSrc && !BADGE.test(imgSrc) ? resolve(imgSrc, rawBase) : null
            if (url && /^https?:/i.test(url)) out.push(imgRow(url, alt || 'Image du README', alt || 'README'))
        }
        const hadTags = HTML_TAG.test(line)
        HTML_TAG.lastIndex = 0
        line = line.replace(HTML_TAG, '')
        if (hadTags && !line.trim()) continue

        // Tableau : une ligne d'en-tête suivie d'une ligne de séparation |---|---|
        const next = src[i + 1]
        if (line.includes('|') && next !== undefined && isSeparator(next)) {
            const head = splitRow(line)
            const align = splitRow(next).map(alignOf)
            const rows: string[][] = []
            let j = i + 2
            for (; j < src.length; j++) {
                const row = src[j] ?? ''
                if (!row.trim() || !row.includes('|')) break
                rows.push(splitRow(row))
            }
            i = j - 1
            const cols = head.length
            const table: Table = {
                head: head.map((c) => inline(cleanCell(c), 'h')),
                rows: rows.map((r) => Array.from({ length: cols }, (_, k) => inline(cleanCell(r[k] ?? '')))),
                align: Array.from({ length: cols }, (_, k) => align[k] ?? null),
            }
            out.push([{ t: '', table }])
            continue
        }

        // Images Markdown : seule sur sa ligne, c'est une image ; au milieu d'un texte, un simple lien
        const images = [...line.matchAll(/!\[([^\]]*)\]\(([^)\s]+)[^)]*\)/g)]
        if (images.length) {
            const rest = line.replace(/\[!\[[^\]]*\]\([^)]*\)\]\([^)]*\)/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').trim()
            if (!rest) {
                const first = images.find((m) => !BADGE.test(m[2] ?? ''))
                const url = first ? resolve(first[2] ?? '', rawBase) : null
                if (first && url && /^https?:/i.test(url)) out.push(imgRow(url, first[1] || 'Image du README', first[1] || 'README'))
                continue
            }
            line = line
                .replace(/\[!\[([^\]]*)\]\([^)]*\)\]\(([^)]*)\)/g, (_m, alt: string, link: string) => `[${alt || 'image'}](${link})`)
                .replace(/!\[([^\]]*)\]\(/g, (_m, alt: string) => `[${alt || 'image'}](`)
        }

        // Lignes vides : jamais deux d'affilée, jamais en tête
        if (!line.trim()) {
            const last = out[out.length - 1]
            if (last && last.length > 0) out.push([])
            continue
        }

        const heading = line.match(/^(#{1,6})\s+(.*)$/)
        if (heading) { out.push([tk(`${heading[1] ?? '#'} `, 'h'), ...inline(heading[2] ?? '', 'h')]); continue }

        const quote = line.match(/^\s*>\s?(.*)$/)
        if (quote) { out.push([tk('> ', 'com'), ...inline(quote[1] ?? '', 'com')]); continue }

        if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { out.push([tk('---', 'mut')]); continue }

        const item = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/)
        if (item) { out.push([tk(item[1] ?? ''), tk(`${item[2] ?? '-'} `, 'key'), ...inline(item[3] ?? '')]); continue }

        out.push(inline(line))
    }

    // Pas de ligne vide à la fin
    while (out.length && out[out.length - 1]?.length === 0) out.pop()
    return out
}