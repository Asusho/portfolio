<script setup lang="ts">
import { computed } from 'vue'
import type { Img, Line, Tok } from '../types'
import NvTable from './NvTable.vue'
import NvToken from './NvToken.vue'

const props = defineProps<{ line: Line; num: number; active?: boolean }>()
defineEmits<{ select: []; follow: [tok: Tok]; 'open-image': [img: Img] }>()

// Une ligne qui contient un tableau ne contient que lui.
const table = computed(() => props.line[0]?.table)
</script>

<template>
  <div class="ln" :class="{ cur: active }" @click="$emit('select')">
    <span class="num">{{ num }}</span>
    <span class="code" :class="{ wide: table }"><NvTable v-if="table" :table="table" /><template v-else><NvToken v-for="(tok, j) in line" :key="j" :tok="tok" @follow="$emit('follow', $event)" @open-image="$emit('open-image', $event)" /></template></span>
  </div>
</template>

<style scoped src="./NvEditorLine.css"></style>