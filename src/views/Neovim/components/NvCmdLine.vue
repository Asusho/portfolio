<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{ open: boolean; modelValue: string; message: string; error?: boolean }>()
defineEmits<{ 'update:modelValue': [value: string]; open: []; submit: []; close: [] }>()

const input = ref<HTMLInputElement | null>(null)
watch(() => props.open, async (isOpen) => {
  if (!isOpen) return
  await nextTick()
  input.value?.focus()
})
</script>

<template>
  <div class="cmdline" @click="!open && $emit('open')">
    <template v-if="open">
      <span class="colon">:</span>
      <input ref="input" :value="modelValue" aria-label="Ligne de commande" spellcheck="false" autocomplete="off"
             @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
             @keydown.enter.prevent="$emit('submit')" @keydown.esc.prevent="$emit('close')" @blur="$emit('close')" />
    </template>
    <span v-else :class="{ err: error }">{{ message }}</span>
  </div>
</template>

<style scoped src="./NvCmdLine.css"></style>
