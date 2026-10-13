<script setup lang="ts">
defineProps<{ title: string; hint?: string; big?: boolean }>()
</script>

<template>
  <span class="ph" :class="{ big }"><b>{{ title }}</b><small v-if="hint">{{ hint }}</small></span>
</template>

<style scoped src="./NvPlaceholder.css"></style>
