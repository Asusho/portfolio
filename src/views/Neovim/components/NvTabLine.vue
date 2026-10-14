<script setup lang="ts">
import { ref } from 'vue'
import NvTab from './NvTab.vue'

defineProps<{ buffers: { id: string; name: string; icon: string }[]; current: string; who: string }>()
defineEmits<{ select: [id: string]; close: [id: string]; 'toggle-sidebar': [] }>()

const tabsElement = ref<HTMLElement | null>(null)

function scrollTabs(event: WheelEvent) {
  const tabs = tabsElement.value
  if (!tabs || tabs.scrollWidth <= tabs.clientWidth) return

  const distance = event.deltaY || event.deltaX
  if (!distance) return

  event.preventDefault()
  tabs.scrollLeft += distance
}
</script>

<template>
  <div class="tabline">
    <button class="burger" aria-label="Afficher ou masquer l'explorateur" @click="$emit('toggle-sidebar')"></button>
    <div ref="tabsElement" class="tabs" role="tablist"
         @wheel="scrollTabs" >
      <NvTab v-for="b in buffers" :key="b.id" :name="b.name" :icon="b.icon" :active="b.id === current" :closable="buffers.length > 1"
             @select="$emit('select', b.id)" @close="$emit('close', b.id)" />
    </div>
    <span class="who">{{ who }}</span>
  </div>
</template>

<style scoped src="./NvTabLine.css"></style>
