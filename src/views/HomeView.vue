<script setup lang="ts">
import TheWelcome from "../components/TheWelcome.vue";
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
    <TheWelcome />
  </main>
</template>
