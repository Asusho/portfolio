<script setup lang="ts">
defineProps<{ commandMode: boolean; path: string; ft: string; line: number; percent: string }>()
</script>

<template>
  <div class="status">
    <span class="mode" :class="{ cmd: commandMode }">{{ commandMode ? 'COMMAND' : 'NORMAL' }}</span>
    <span class="branch">⎇ main</span>
    <span class="file">{{ path }}</span>
    <span class="spacer"></span>
    <span class="ft">{{ ft }}</span><span class="enc">utf-8</span><span class="pos">Ln {{ line }}, Col 1</span><span class="pct">{{ percent }}</span>
  </div>
</template>

<style scoped src="./NvStatusLine.css"></style>
