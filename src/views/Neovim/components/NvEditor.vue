<script setup lang="ts">
import { ref, toRef } from 'vue'
import { useEditorScroll } from '../composables/useEditorScroll'
import type { Img, Line, Tok } from '../types'
import NvEditorLine from './NvEditorLine.vue'

const props = defineProps<{ lines: Line[]; cursor: number; bufferKey: string }>()
defineEmits<{ 'select-line': [index: number]; follow: [tok: Tok]; 'open-image': [img: Img] }>()

const el = ref<HTMLElement | null>(null)
useEditorScroll(el, toRef(props, 'cursor'), toRef(props, 'bufferKey'))
</script>

<template>
  <div ref="el" class="editor" tabindex="0" aria-label="Contenu du fichier">
    <NvEditorLine v-for="(line, i) in lines" :key="bufferKey + i" :line="line" :num="i + 1" :active="i === cursor"
                  @select="$emit('select-line', i)" @follow="$emit('follow', $event)" @open-image="$emit('open-image', $event)" />
  </div>
</template>

<style scoped src="./NvEditor.css"></style>
