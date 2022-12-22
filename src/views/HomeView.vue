<script setup lang="ts">
</script>

<script lang="ts">
import { useGrid } from '../stores/useGrid';
import { mapState } from 'pinia';

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState(useGrid, ['classObject']),
  }
}
</script>

<template>
  <main class="grid-item"
  :class="classObject">
    <h1>Luis Valencia</h1>
    <p>Software Engineer in Sunny SoCal</p>
    <font-awesome-icon class="construction-icon" icon="fa-solid fa-person-digging" /><span>Site Under Construction</span>
    <p><strong>State:</strong> Broke Ground</p>
  </main>
</template>

<style scoped lang="scss">
.construction-icon + span {
  margin-left: 8px;
}
</style>
