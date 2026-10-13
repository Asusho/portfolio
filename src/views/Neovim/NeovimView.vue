<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { useResponsiveSidebar } from '@/composables/useResponsiveSidebar.ts'
import { useImageViewer } from '@/composables/useImageViewer.ts'
import ThemeLayout from '../../layouts/ThemeLayout.vue'
import type { ThemeViewProps } from '../shared'
import { findBuffer, findByName } from './buffers'
import { buildLines, readmeTargets } from './content'
import NvCmdLine from './components/NvCmdLine.vue'
import NvEditor from './components/NvEditor.vue'
import NvFloatWindow from './components/NvFloatWindow.vue'
import NvStatusLine from './components/NvStatusLine.vue'
import NvTabLine from './components/NvTabLine.vue'
import NvTree from './components/NvTree.vue'
import NvWinBar from './components/NvWinBar.vue'
import { useBuffers } from './composables/useBuffers'
import { useCommandLine } from './composables/useCommandLine'
import { useExplorer } from './composables/useExplorer'
import { useVimKeys } from './composables/useVimKeys'
import type { Tok } from './types'

const props = defineProps<ThemeViewProps>()

const pr = computed(() => props.portfolio.profile)
const resolve = (id: string) => findBuffer(id, props.portfolio.projects)

const { sidebar, toggleSidebar, closeOnMobile } = useResponsiveSidebar()
const { image, openImage, closeImage } = useImageViewer()
const { groups, closed, toggle } = useExplorer(() => props.projects)

const { open, current, cursor, openBuffer, closeBuffer, closeOthers, moveCursor } = useBuffers(resolve, (buf) => {
  closeOnMobile()
  void nextTick(() => say(`"${buf.path}" ${lines.value.length}L`))
})
const lines = computed(() => buildLines(current.value, props))

const { cmdOpen, cmdText, message, messageErr, say, openCmd, closeCmd, submitCmd } = useCommandLine({
  edit: (arg) => {
    const hit = findByName(arg, props.portfolio.projects)
    if (hit) openBuffer(hit.id)
    return !!hit
  },
  openHelp: () => openBuffer('help.txt'),
  listBuffers: () => open.value.map((id, i) => `${i + 1} ${resolve(id)?.name ?? id}`).join('   '),
  closeCurrent: () => closeBuffer(current.value),
  closeOthers: () => closeOthers(),
  currentPath: () => resolve(current.value)?.path ?? '',
})

useVimKeys({
  escape: () => {
    if (!image.value) return false
    closeImage()
    return true
  },
  command: openCmd,
  move: (step) => moveCursor(step, lines.value.length),
  shortcut: (key) => {
    if (current.value !== 'README.md') return
    const target = readmeTargets(props.projects)[key]
    if (target) openBuffer(target)
  },
})

function follow(tok: Tok) {
  if (tok.go) openBuffer(tok.go)
}

const openBuffers = computed(() => open.value.map((id) => ({ id, name: resolve(id)?.name ?? id })))
const currentBuf = computed(() => resolve(current.value))
const crumbs = computed(() => ['portfolio', ...(currentBuf.value?.path.split('/') ?? [])])
const percent = computed(() => (lines.value.length < 2 ? 'All' : `${Math.round((cursor.value / (lines.value.length - 1)) * 100)}%`))
</script>

<template>
  <ThemeLayout class="nvim" :sidebar-open="sidebar" reserve-dock>
    <template #header>
      <NvTabLine :buffers="openBuffers" :current="current" :who="`${pr.firstName.toLowerCase()}@nvim`"
                 @select="openBuffer" @close="closeBuffer" @toggle-sidebar="toggleSidebar" />
    </template>

    <template #sidebar>
      <NvTree :groups="groups" :closed="closed" :current="current" @open="openBuffer" @toggle="toggle" />
    </template>

    <NvWinBar :crumbs="crumbs" />
    <NvEditor :lines="lines" :cursor="cursor" :buffer-key="current" @select-line="cursor = $event" @follow="follow" @open-image="openImage" />

    <template #footer>
      <NvStatusLine :command-mode="cmdOpen" :path="currentBuf?.path ?? ''" :ft="currentBuf?.ft ?? ''" :line="cursor + 1" :percent="percent" />
      <NvCmdLine v-model="cmdText" :open="cmdOpen" :message="message" :error="messageErr" @open="openCmd" @submit="submitCmd" @close="closeCmd" />
    </template>

    <template #overlay>
      <NvFloatWindow v-if="image" :img="image" @close="closeImage" />
    </template>
  </ThemeLayout>
</template>

<style src="./styles/tokens.css"></style>