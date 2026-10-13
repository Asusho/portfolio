<script setup lang="ts">
defineProps<{ name: string; active?: boolean; closable?: boolean }>()
defineEmits<{ select: []; close: [] }>()
</script>

<template>
  <div class="tab" :class="{ on: active }" role="presentation">
    <button role="tab" :aria-selected="!!active" @click="$emit('select')">{{ name }}</button>
    <button v-if="closable" class="x" :aria-label="`Fermer ${name}`" @click="$emit('close')">×</button>
  </div>
</template>

<style scoped src="./NvTab.css"></style>
