<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <main class="empty">
    <p>Le thème « {{ name }} » est vide pour l'instant.</p>
  </main>
</template>

<style scoped src="./EmptyTheme.css"></style>
