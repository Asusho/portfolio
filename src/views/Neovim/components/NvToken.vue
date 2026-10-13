<script setup lang="ts">
import type { Img, Tok } from '../types'
import NvImageBlock from './NvImageBlock.vue'

defineProps<{ tok: Tok }>()
defineEmits<{ follow: [tok: Tok]; 'open-image': [img: Img] }>()
</script>

<template>
  <NvImageBlock v-if="tok.img" :img="tok.img" @open="$emit('open-image', $event)" />
  <a v-else-if="tok.href" :class="tok.c" :href="tok.href" target="_blank" rel="noopener noreferrer">{{ tok.t }}</a>
  <button v-else-if="tok.go" class="golink" :class="tok.c" @click.stop="$emit('follow', tok)">{{ tok.t }}</button>
  <span v-else :class="tok.c">{{ tok.t }}</span>
</template>

<style scoped src="./NvToken.css"></style>
