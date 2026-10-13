<script setup lang="ts">
import { computed } from 'vue'
import { useBrokenImages } from '@/composables/useBrokenImages.ts'
import { publicPath } from '@/utils/asset.ts'
import type { Img } from '../types'
import NvPlaceholder from './NvPlaceholder.vue'

const props = defineProps<{ img: Img }>()
defineEmits<{ open: [img: Img] }>()

const { isBroken, markBroken } = useBrokenImages()
const isVideo = computed(() => props.img.kind === 'video' || props.img.kind === 'youtube')
// Ce qui s'affiche dans le texte : la vignette pour YouTube, le fichier lui-même sinon.
const shown = computed(() => (props.img.kind === 'youtube' ? props.img.poster ?? '' : props.img.src))
const broken = computed(() => !shown.value || isBroken(shown.value))
const hint = computed(() => (props.img.kind === 'youtube'
    ? 'Ajoute une image au projet pour la vignette'
    : `Ajoute le fichier dans public${publicPath(props.img.src)}`))
</script>

<template>
  <span class="imgwrap">
    <button class="imgblock" :aria-label="`${isVideo ? 'Lire' : 'Agrandir'} : ${img.caption}`" @click.stop="$emit('open', img)">
      <template v-if="!broken">
        <video v-if="img.kind === 'video'" :src="`${img.src}#t=0.1`" :poster="img.poster" muted playsinline preload="metadata" @error="markBroken(shown)" />
        <img v-else :src="shown" :alt="img.alt" loading="lazy" @error="markBroken(shown)" />
      </template>
      <NvPlaceholder v-else :title="img.alt" :hint="hint" />
      <span class="cap">{{ img.caption }} <i>{{ isVideo ? '[▶]' : '[+]' }}</i></span>
    </button>
  </span>
</template>

<style scoped src="./NvImageBlock.css"></style>