<script setup lang="ts">
import type { ThemeInfo } from '@/types/themes.ts'
import type { ThemeId } from '@/types/themes.ts'

defineProps<{ themes: ThemeInfo[]; modelValue: ThemeId }>()
defineEmits<{ 'update:modelValue': [id: ThemeId] }>()
</script>

<template>
  <nav class="dock" aria-label="Changer de thème">
    <button v-for="t in themes" :key="t.id" :aria-pressed="modelValue === t.id" :aria-label="t.name" :title="t.name"
            @click="$emit('update:modelValue', t.id)">
      <span v-if="t.icon" class="icon" :style="{ '--icon': `url(${t.icon})` }" aria-hidden="true"></span>
      <template v-else>{{ t.glyph }}</template>
    </button>
  </nav>
</template>

<style scoped src="./ThemeDock.css"></style>
