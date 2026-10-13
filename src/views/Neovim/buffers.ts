import type { Project, ProjectDomain } from '../../types/portfolio'
import type { Buf, StaticBuf } from './types'

export const staticBufs: StaticBuf[] = [
    { id: 'README.md', name: 'README.md', path: 'README.md', ft: 'markdown', icon: '◆' },
    { id: 'about.md', name: 'about.md', path: 'about.md', ft: 'markdown', icon: '◆' },
    { id: 'skills.lua', name: 'skills.lua', path: 'skills.lua', ft: 'lua', icon: '☾' },
    { id: 'contact.sh', name: 'contact.sh', path: 'contact.sh', ft: 'sh', icon: '$' },
    { id: 'help.txt', name: 'help.txt', path: 'help.txt', ft: 'help', icon: '?' },
]

const pick = (ids: string[]) => staticBufs.filter((b) => ids.includes(b.id))
/** Fichiers affichés avant et après le dossier projects/ dans l'explorateur. */
export const treeTop = pick(['README.md', 'about.md', 'skills.lua'])
export const treeBottom = pick(['contact.sh'])

export const primaryDomain = (p: Project): ProjectDomain => p.domains[0] ?? 'other'

export const projectBuf = (p: Project): Buf => ({
    id: `project:${p.id}`,
    name: `${p.id}.md`,
    path: `projects/${primaryDomain(p)}/${p.id}.md`,
    ft: 'markdown',
})

export function findBuffer(id: string, projects: Project[]): Buf | undefined {
    const fixed = staticBufs.find((b) => b.id === id)
    if (fixed) return fixed
    const p = projects.find((x) => `project:${x.id}` === id)
    return p ? projectBuf(p) : undefined
}

const stripExt = (name: string) => name.toLowerCase().replace(/\.(md|lua|log|sh|txt)$/, '')

/** Retrouve un fichier par son nom, avec ou sans extension, ou par un morceau de nom (:e about). */
export function findByName(arg: string, projects: Project[]): Buf | undefined {
    const q = stripExt(arg)
    if (!q) return undefined
    const all: Buf[] = [...staticBufs, ...projects.map(projectBuf)]
    return all.find((b) => stripExt(b.name) === q) ?? all.find((b) => stripExt(b.name).includes(q))
}