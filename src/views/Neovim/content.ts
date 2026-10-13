import type { Project } from '@/types/portfolio.ts'
import { asset } from '@/utils/asset.ts'
import { statusLabel, type ThemeViewProps } from '../shared'
import type { Line, Tok } from './types'
import type { ReadmeState } from '@/composables/useGithubReadme'
import { markdownToLines } from './markdown'

const tk = (t: string, c?: string, extra: Partial<Tok> = {}): Tok => ({ t, c, ...extra })
const imgRow = (src: string, alt: string, caption: string): Line => [{ t: '', img: { src: asset(src), alt, caption } }]

// [texte](https://...) = lien externe ; [texte](project:web-dashboard) = lien vers un autre projet
const LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|project:[\w-]+)\)/g

/** Transforme un texte contenant des liens Markdown en morceaux : texte simple et liens cliquables. */
function inline(text: string, c?: string): Line {
    const out: Tok[] = []
    let last = 0
    for (const m of text.matchAll(LINK)) {
        const [whole, label = '', target = ''] = m
        const at = m.index ?? 0
        if (at > last) out.push(tk(text.slice(last, at), c))
        out.push(target.startsWith('project:')
            ? tk(label, 'link', { go: `project:${target.slice('project:'.length)}` })
            : tk(label, 'link', { href: target }))
        last = at + whole.length
    }
    if (last < text.length) out.push(tk(text.slice(last), c))
    return out
}

const YOUTUBE = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
const youtubeId = (url: string) => url.match(YOUTUBE)?.[1] ?? null

/** Image du projet, vidéo locale, ou vidéo YouTube si `video` est renseigné. */
const projectMedia = (p: Project): Line => {
    if(!p.video && !p.image) return [];
    if (!p.video) return imgRow(p.image ?? `/images/projects/${p.id}.jpg`, `Aperçu de ${p.title}`, p.title)
    const yt = youtubeId(p.video)
    const poster = p.image ? asset(p.image) : yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : undefined
    const alt = `Vidéo de ${p.title}`
    return [{ t: '', img: yt
            ? { kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${yt}`, alt, caption: p.title, poster }
            : { kind: 'video', src: asset(p.video), alt, caption: p.title, poster } }]
}

/** Touches du README → fichier à ouvrir. Partagé avec le clavier. */
export function readmeTargets(projects: Project[]): Record<string, string> {
    return { a: 'about.md', s: 'skills.lua', c: 'contact.sh', p: projects[0] ? `project:${projects[0].id}` : 'about.md' }
}

function readmeLines({ portfolio, projects }: ThemeViewProps): Line[] {
    const pr = portfolio.profile
    const to = readmeTargets(projects)
    const menu = (key: string, label: string, file: string): Line => [tk('  '), tk(`[${key}]`, 'key'), tk('  '), tk(label.padEnd(18), 'fn', { go: to[key] }), tk(file, 'com')]
    return [
        [tk(`# ${pr.firstName} ${pr.lastName}`, 'h')], [],
        [tk('Un portfolio créatif', 'str')], [],
        [tk('## Navigation', 'h')], [],
        menu('a', 'À propos', 'about.md'), menu('s', 'Compétences', 'skills.lua'), menu('p', 'Projets', 'projects/'),
        menu('c', 'Contact', 'contact.sh'), [],
        [tk('-- Tape ', 'com'), tk(':help', 'cmd'), tk(' pour la liste des commandes.', 'com')],
    ]
}

function aboutLines({ portfolio }: ThemeViewProps): Line[] {
    const pr = portfolio.profile
    const user = pr.githubUsername
    return [
        [tk('# À propos', 'h')], [], [tk(pr.bio)], [],
        imgRow(pr.photo ?? '/images/photo.jpg', `Portrait de ${pr.firstName} ${pr.lastName}`, `Moi (${pr.firstName})`), [],
        [tk('## Infos', 'h')], [],
        [tk('- '), tk('Rôle', 'key'), tk(' : '), tk(pr.role, 'str')],
        [tk('- '), tk('GitHub', 'key'), tk(' : '), tk(`@${user}`, 'link', { href: `https://github.com/${user}` })],
    ]
}

function skillsLines({ portfolio }: ThemeViewProps): Line[] {
    const out: Line[] = [[tk('-- Ce que je sais faire', 'com')], [tk('local', 'kw'), tk(' skills = {')]]
    for (const s of portfolio.skills) {
        out.push(
            [tk('  {')],
            [tk('    name', 'key'), tk(' = '), tk(`"${s.name}"`, 'str'), tk(',')],
            [tk('    detail', 'key'), tk(' = '), tk(`"${s.detail}"`, 'str'), tk(',')],
            [tk('  },')],
        )
    }
    out.push([tk('}')], [], [tk('return', 'kw'), tk(' skills')])
    return out
}

function contactLines({ portfolio }: ThemeViewProps): Line[] {
    const { githubUsername: user, contactEmail: mail } = portfolio.profile
    const gh = `https://github.com/${user}`
    const hint: Line[] = mail ? [] : [[tk('# (ajoute contactEmail dans portfolio.json pour afficher ton e-mail)', 'com')]]
    const mailLine: Line[] = mail ? [[tk('xdg-open ', 'fn'), tk(`"mailto:${mail}"`, 'link', { href: `mailto:${mail}` })]] : []
    return [
        [tk('#!/usr/bin/env bash', 'com')], [tk('# Une idée, un projet, une partie ?', 'com')],
        ...hint, [],
        ...mailLine,
        [tk('xdg-open ', 'fn'), tk(`"${gh}"`, 'link', { href: gh })],
    ]
}

const HELP: [string, string][] = [
    [':e <fichier>', 'ouvrir un fichier (ex. :e about, :e web-portfolio)'],
    [':ls', 'lister les buffers ouverts'],
    [':bd', 'fermer le buffer courant'],
    [':only', 'fermer tous les buffers sauf le courant'],
    [':q  :w', 'essaie, pour voir'],
    ['j / k', 'descendre / monter le curseur'],
    ['a s p c', 'raccourcis du README'],
]

function helpLines(): Line[] {
    return [[tk('# Aide', 'h')], [], ...HELP.map(([k, d]): Line => [tk(k.padEnd(34), 'cmd'), tk(d, 'mut')])]
}

function related(p: Project, all: Project[]) {
    const ids = new Set([...(p.relatedProjects ?? []), ...all.filter((q) => q.relatedProjects?.includes(p.id)).map((q) => q.id)])
    return all.filter((q) => ids.has(q.id))
}

/** Section « Technologies » : une ligne de morceaux entre accents graves, façon code Markdown. */
function stackLines(stack: string[] | undefined): Line[] {
    if (!stack?.length) return []
    const row = stack.flatMap((s, i): Tok[] => [...(i ? [tk('  ')] : []), tk('`', 'mut'), tk(s, 'str'), tk('`', 'mut')])
    return [[], [tk('## Technologies', 'h')], [], row]
}


function readmeSection(p: Project, state?: ReadmeState): Line[] {
    if (!p.repo) return []
    const head: Line[] = [
        [tk('## README', 'h')], [],
        [tk('- '), tk(p.repo, 'link', { href: `https://github.com/${p.repo}` }), tk('  (voir sur GitHub)', 'com')], [],
    ]
    if (!state || state.status === 'loading') return [...head, [tk('-- chargement du README…', 'com')]]
    if (state.status === 'error') return [...head, [tk(`E: ${state.message}`, 'err')], [tk('Réessayer : '), tk('réessayer', 'cmd', { go: 'readme:retry' })]]
    return [...head, ...markdownToLines(state.text, p.repo)]
}

function projectLines(p: Project,  all: Project[], readme?: ReadmeState): Line[] {
    const sc = { finished: 'ok', ongoing: 'warn', concept: 'mut' }[p.status]
    const box = { finished: '[x]', ongoing: '[~]', concept: '[ ]' }[p.status]
    const rel = related(p, all)
    const seeAlso: Line[] = rel.length
        ? [[], [tk('## Voir aussi', 'h')], [], ...rel.map((q): Line => [tk('- '), tk(`[[${q.title}]]`, 'link', { go: `project:${q.id}` })])]
        : []
    const link: Line[] = p.url
        ? [[], [tk('## Lien', 'h')], [], [tk('- '), tk('[Ouvrir le projet]', 'link', { href: p.url }), tk(`(${p.url})`, 'com')]]
        : []
    // Quand le README du dépôt est affiché, il contient déjà le titre et la description du projet.
    const intro: Line[] = readme?.status === 'ok' ? [] : [[tk(`# ${p.title}`, 'h')], [], [tk(p.description)], []]
    return [
        [tk('---', 'mut')],
        [tk('title', 'key'), tk(': '), tk(`"${p.title}"`, 'str')],
        [tk('status', 'key'), tk(': '), tk(p.status, sc), tk(`   # ${statusLabel(p.status)}`, 'com')],
        [tk('domains', 'key'), tk(`: [${p.domains.join(', ')}]`)],
        [tk('tags', 'key'), tk(`: [${p.tags.join(', ')}]`)],
        [tk('---', 'mut')], [],
        ...intro,
        ...readmeSection(p, readme),
        projectMedia(p), [],
        [tk('## Statut', 'h')], [], [tk(`- ${box} `, sc), tk(statusLabel(p.status))],
        ...stackLines(p.stack),
        ...seeAlso,
        ...link,
    ]
}

/** Construit les lignes d'un fichier. C'est ici qu'on modifie les textes du site. */
export function buildLines(id: string, ctx: ThemeViewProps, readmes: Record<string, ReadmeState> = {}): Line[] {
    switch (id) {
        case 'README.md': return readmeLines(ctx)
        case 'about.md': return aboutLines(ctx)
        case 'skills.lua': return skillsLines(ctx)
        case 'contact.sh': return contactLines(ctx)
        case 'help.txt': return helpLines()
    }
    const p = ctx.portfolio.projects.find((x) => `project:${x.id}` === id)
    return p ? projectLines(p, ctx.portfolio.projects, p.repo ? readmes[p.repo] : undefined) : [[]]
}