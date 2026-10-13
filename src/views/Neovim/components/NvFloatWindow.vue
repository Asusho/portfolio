<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBrokenImages } from '@/composables/useBrokenImages.ts'
import { useDraggable } from '@/composables/useDraggable.ts'
import type { Img } from '../types'
import NvPlaceholder from './NvPlaceholder.vue'

defineProps<{ img: Img }>()
defineEmits<{ close: [] }>()

const el = ref<HTMLElement | null>(null)
const { style, onPointerDown, onPointerMove, onPointerUp } = useDraggable(el)
const { isBroken, markBroken } = useBrokenImages()
const fileName = (src: string) => src.split('/').pop() ?? src

onMounted(() => el.value?.focus())
</script>

<template>
  <div ref="el" class="float" role="dialog" aria-label="Aperçu de l'image" tabindex="-1" :style="style">
    <div class="ftitle" @pointerdown="onPointerDown" @pointermove="onPointerMove" @pointerup="onPointerUp" @pointercancel="onPointerUp">{{ fileName(img.src) }}</div>
    <button class="fclose" aria-label="Fermer l'aperçu" @click="$emit('close')">[x]</button>
    <iframe v-if="img.kind === 'youtube'" class="fvideo" :src="`${img.src}?autoplay=1&rel=0`" :title="img.alt"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" />
    <template v-else-if="!isBroken(img.src)">
      <video v-if="img.kind === 'video'" class="fimg" :src="img.src" :poster="img.poster" controls autoplay playsinline @error="markBroken(img.src)" />
      <img v-else class="fimg" :src="img.src" :alt="img.alt" />
    </template>
    <NvPlaceholder v-else big :title="img.alt" hint="Média introuvable" />
  </div>
</template>

<style scoped src="./NvFloatWindow.css"></style>
