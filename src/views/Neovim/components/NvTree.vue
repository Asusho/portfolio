<script setup lang="ts">
import type { Project, ProjectDomain } from '@/types/portfolio.ts'
import { treeBottom, treeTop } from '../buffers'
import NvTreeNode from './NvTreeNode.vue'
import NvFolderIcon from './NvFolderIcon.vue'

defineProps<{ groups: { domain: ProjectDomain; items: Project[] }[]; closed: Set<string>; current: string }>()
defineEmits<{ open: [id: string]; toggle: [key: string] }>()
</script>

<template>
  <nav class="tree" aria-label="Explorateur de fichiers">
    <p class="tree-head">EXPLORER</p>
    <p class="root-dir"><NvFolderIcon open /> portfolio/</p>

    <NvTreeNode v-for="b in treeTop" :key="b.id" :depth="1" :icon="b.icon" :label="b.name" :active="current === b.id" @click="$emit('open', b.id)" />

    <NvTreeNode dir :depth="1" :open="!closed.has('projects')" label="projects/" @click="$emit('toggle', 'projects')" />
    <template v-if="!closed.has('projects')">
      <template v-for="g in groups" :key="g.domain" >
        <NvTreeNode dir :depth="2" :open="!closed.has(g.domain)" :label="`${g.domain}/`" :count="g.items.length" @click="$emit('toggle', g.domain)" />
        <template v-if="!closed.has(g.domain)">
          <NvTreeNode v-for="p in g.items" :key="p.id" :depth="3" icon="" :label="`${p.id}.md`" :status="p.status"
                      :active="current === `project:${p.id}`" @click="$emit('open', `project:${p.id}`)" />
        </template>
      </template>
    </template>

    <NvTreeNode v-for="b in treeBottom" :key="b.id" :depth="1" :icon="b.icon" :label="b.name" :active="current === b.id" @click="$emit('open', b.id)" />
  </nav>
</template>

<style scoped src="./NvTree.css"></style>
