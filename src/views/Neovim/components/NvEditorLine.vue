<script setup lang="ts">
import type { Img, Line, Tok } from '../types'
import NvToken from './NvToken.vue'

defineProps<{ line: Line; num: number; active?: boolean }>()
defineEmits<{ select: []; follow: [tok: Tok]; 'open-image': [img: Img] }>()
</script>

<template>
  <div class="ln" :class="{ cur: active }" @click="$emit('select')">
    <span class="num">{{ num }}</span>
    <span class="code"><NvToken v-for="(tok, j) in line" :key="j" :tok="tok" @follow="$emit('follow', $event)" @open-image="$emit('open-image', $event)" /></span>
  </div>
</template>

<style scoped src="./NvEditorLine.css"></style>
