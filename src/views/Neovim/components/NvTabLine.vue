<script setup lang="ts">
import NvTab from './NvTab.vue'

defineProps<{ buffers: { id: string; name: string; icon: string }[]; current: string; who: string }>()
defineEmits<{ select: [id: string]; close: [id: string]; 'toggle-sidebar': [] }>()
</script>

<template>
  <div class="tabline">
    <button class="burger" aria-label="Afficher ou masquer l'explorateur" @click="$emit('toggle-sidebar')">☰</button>
    <div class="tabs" role="tablist">
      <NvTab v-for="b in buffers" :key="b.id" :name="b.name" :icon="b.icon" :active="b.id === current" :closable="buffers.length > 1"
             @select="$emit('select', b.id)" @close="$emit('close', b.id)" />
    </div>
    <span class="who">{{ who }}</span>
  </div>
</template>

<style scoped src="./NvTabLine.css"></style>
