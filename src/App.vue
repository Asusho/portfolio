<script setup lang="ts">
import { computed, watch } from 'vue'
import portfolio from '@/data/portfolio_data.json'
import { themes } from '@/types/themes'
import type { PortfolioData } from '@/types/portfolio'
import ThemeDock from '@/components/ThemeDock/ThemeDock.vue'
import { useTheme } from '@/composables/useTheme'
import EmptyTheme from '@/views/EmptyTheme/EmptyTheme.vue'
import { themeViews } from '@/views/registry'

// TypeScript lit le JSON avec des types larges (string) : on le force vers nos types précis.
const data = portfolio as unknown as PortfolioData

const { theme, themeName } = useTheme()
const view = computed(() => themeViews[theme.value])

watch(theme, (id) => {
  const selected = themes.find((item) => item.id === id)
  if (!selected) return

  let favicon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]')
  if (!favicon) {
    favicon = document.createElement('link')
    favicon.rel = 'icon'
    document.head.append(favicon)
  }

  favicon.href = selected.icon ?? `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#1c2225"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#a7c080" font-family="monospace" font-size="28" font-weight="bold">${selected.glyph.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</text></svg>`,
  )}`
}, { immediate: true })
</script>

<template>
  <component :is="view" v-if="view" :portfolio="data" :projects="data.projects"/>
  <EmptyTheme v-else :name="themeName" />
  <ThemeDock v-model="theme" :themes="themes" />
</template>
