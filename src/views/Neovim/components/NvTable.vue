<script setup lang="ts">
import type { Table } from '../types'
import NvToken from './NvToken.vue'

defineProps<{ table: Table }>()
</script>

<template>
  <div class="tablewrap">
    <table>
      <thead>
      <tr>
        <th v-for="(cell, i) in table.head" :key="i" :style="{ textAlign: table.align[i] ?? 'left' }">
          <NvToken v-for="(tok, k) in cell" :key="k" :tok="tok" />
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row, r) in table.rows" :key="r">
        <td v-for="(cell, i) in row" :key="i" :style="{ textAlign: table.align[i] ?? 'left' }">
          <NvToken v-for="(tok, k) in cell" :key="k" :tok="tok" />
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped src="./NvTable.css"></style>