import { useWindowListener } from '@/composables/useWindowListener.ts'

export interface VimKeyActions {
    escape(): boolean // true si Échap a servi à quelque chose (ex. fermer l'aperçu)
    command(): void // « : »
    move(step: number): void // j / k
    shortcut(key: string): void // touches du README
}

/** Raccourcis clavier façon Vim, actifs sur toute la page sauf pendant la saisie d'un champ. */
export function useVimKeys(a: VimKeyActions) {
    useWindowListener('keydown', (e) => {
        if (e.key === 'Escape' && a.escape()) return
        const el = e.target as HTMLElement | null
        if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return
        if (e.ctrlKey || e.metaKey || e.altKey) return
        if (e.key === ':') { e.preventDefault(); a.command(); return }
        if (e.key === 'j') a.move(1)
        else if (e.key === 'k') a.move(-1)
        else a.shortcut(e.key)
    })
}