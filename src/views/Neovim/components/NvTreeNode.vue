<script setup lang="ts">
import type { ProjectStatus } from '@/types/portfolio.ts'
import NvFolderIcon from './NvFolderIcon.vue'

defineProps<{open?:boolean; depth: 1 | 2 | 3; label: string; icon?: string; dir?: boolean; active?: boolean; status?: ProjectStatus; count?: number;}>()

const gitMark = { finished: '✓', ongoing: '~', concept: '?' } as const
</script>

<template>
  <button class="node" :class="[`d${depth}`, { dir, active }]">
    <NvFolderIcon v-if="dir" :open="open" />
    <span v-if="icon" :class="dir ? 'arrow' : 'ico'">{{ icon }}</span>{{ label }}
    <i v-if="status" class="git" :class="status">{{ gitMark[status] }}</i>
    <small v-if="count" class="badge">{{ count }} project{{ count > 1 ? 's' : '' }}</small>
  </button>
</template>

<style scoped src="./NvTreeNode.css"></style>
