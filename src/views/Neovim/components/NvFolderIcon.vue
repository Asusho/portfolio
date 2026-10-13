<script setup lang="ts">
defineProps<{ open?: boolean }>()
</script>

<template>
  <svg class="folder" viewBox="0 0 16 16" width="1.1em" height="1.1em" fill="none" stroke="currentColor" stroke-width="1.2"
       stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
    <path v-if="open" d="M1.5 13V3.5h4L7 5h6v2.5" />
    <path :d="open ? 'M1.5 13l1.8-5.5H15L13.2 13z' : 'M1.5 3.5h4L7 5h7.5v8h-13z'" fill="currentColor" fill-opacity=".15" />
  </svg>
</template>

<style scoped src="./NvFolderIcon.css"></style>