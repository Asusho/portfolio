import { computed, reactive } from 'vue'
import type { Project, ProjectDomain } from '@/types/portfolio.ts'
import { primaryDomain } from '../buffers'

/** Arborescence de l'explorateur : projets groupés par domaine, dossiers repliables. */
export function useExplorer(projects: () => Project[]) {
    const groups = computed(() => {
        const byDomain = new Map<ProjectDomain, Project[]>()
        for (const p of projects()) byDomain.set(primaryDomain(p), [...(byDomain.get(primaryDomain(p)) ?? []), p])
        return [...byDomain.entries()].map(([domain, items]) => ({ domain, items }))
    })

    const closed = reactive(new Set<string>())
    function toggle(key: string) {
        if (closed.has(key)) closed.delete(key)
        else closed.add(key)
    }

    return { groups, closed, toggle }
}