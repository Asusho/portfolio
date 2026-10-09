import { computed, ref, watch } from 'vue'
import { DEFAULT_THEME, themes } from '@/types/themes'
import type { ThemeId } from '@/types/themes'

const STORAGE_KEY = 'portfolio-theme'




function readSaved(): ThemeId {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return themes.find((t) => t.id === saved)?.id ?? DEFAULT_THEME
    } catch {
        return DEFAULT_THEME
    }
}

/** Thème actif, mémorisé dans le navigateur. */
export function useTheme() {
    const theme = ref<ThemeId>(readSaved())
    watch(theme, (id) => {
        try { localStorage.setItem(STORAGE_KEY, id) } catch { /* stockage indisponible */ }
    })
    const themeName = computed(() => themes.find((t) => t.id === theme.value)?.name ?? '')
    return { theme, themeName }
}
