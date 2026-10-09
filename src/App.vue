<script setup lang="ts">
import { computed } from 'vue'
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
</script>

<template>
  <component :is="view" v-if="view" :portfolio="data" :projects="data.projects"/>
  <EmptyTheme v-else :name="themeName" />
  <ThemeDock v-model="theme" :themes="themes" />
</template>
