import { reactive } from 'vue'

export type ReadmeState =
    | { status: 'loading' }
    | { status: 'ok'; text: string }
    | { status: 'error'; message: string }

const TTL = 60 * 60 * 1000

// Partagé par tous les composants : un README n'est chargé qu'une fois.
const states = reactive<Record<string, ReadmeState>>({})

export function useGithubReadme() {
    async function load(repo: string, force = false) {
        const current = states[repo]
        if (current?.status === 'loading' || (!force && current?.status === 'ok')) return

        const key = `gh-readme-${repo}`
        if (!force) {
            try {
                const cached = JSON.parse(localStorage.getItem(key) ?? 'null')
                if (cached && Date.now() - cached.at < TTL) { states[repo] = { status: 'ok', text: cached.text }; return }
            } catch { /* cache illisible : on recharge */ }
        }

        states[repo] = { status: 'loading' }
        try {
            const res = await fetch(`https://api.github.com/repos/${repo}/readme`, { headers: { Accept: 'application/vnd.github.raw+json' } })
            if (res.status === 404) throw new Error('README introuvable (dépôt privé, inexistant ou sans README)')
            if (res.status === 403) throw new Error('limite de requêtes GitHub atteinte, réessaie dans un moment')
            if (!res.ok) throw new Error(`GitHub a répondu ${res.status}`)
            const text = await res.text()
            states[repo] = { status: 'ok', text }
            try { localStorage.setItem(key, JSON.stringify({ at: Date.now(), text })) } catch { /* quota */ }
        } catch (e) {
            states[repo] = { status: 'error', message: e instanceof Error ? e.message : 'Chargement impossible' }
        }
    }

    return { states, load }
}