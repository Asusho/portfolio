<script setup lang="ts">
withDefaults(defineProps<{ sidebarOpen?: boolean; reserveDock?: boolean }>(), { sidebarOpen: true, reserveDock: false })
</script>

<template>
  <div class="layout" :class="{ 'reserve-dock': reserveDock }">
    <div class="layout__body">
      <aside v-if="$slots.sidebar" v-show="sidebarOpen" class="layout__sidebar"><slot name="sidebar" /></aside>
      <main class="layout__main">
        <header v-if="$slots.header" class="layout__header"><slot name="header" /></header>
        <slot />
        <footer v-if="$slots.footer" class="layout__footer"><slot name="footer" /></footer>
      </main>
    </div>
    <slot name="overlay" />
  </div>
</template>

<style scoped src="./ThemeLayout.css"></style>