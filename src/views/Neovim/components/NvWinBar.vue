<script setup lang="ts">
defineProps<{ crumbs: string[] }>()
</script>

<template>
  <div class="winbar" aria-label="Chemin du fichier">
    <template v-for="(c, i) in crumbs" :key="i"><span v-if="i" class="sep"> › </span><span :class="{ last: i === crumbs.length - 1 }">{{ c }}</span></template>
  </div>
</template>

<style scoped src="./NvWinBar.css"></style>
