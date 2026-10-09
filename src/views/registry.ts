import { defineAsyncComponent, type Component } from 'vue'
import type { ThemeId } from '@/types/themes'

// Seul Neovim a une vue. Un thème absent de cette liste affiche EmptyTheme.
export const themeViews: Partial<Record<ThemeId, Component>> = {
    neovim: defineAsyncComponent(() => import('@/views/Neovim/NeovimView.vue')),
}
