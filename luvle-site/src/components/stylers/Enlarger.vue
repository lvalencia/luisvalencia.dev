<script lang="ts">
import { mapActions } from 'pinia';
import { useEnlarger } from '@/stores/useEnlarger';

export default {
  mounted() {
    this.enlargeMaxPageWidth();  
  },
  beforeUnmount() {
    this.resetMaxPageWidth();
  },
  methods: {
    ...mapActions(useEnlarger, ["enlarge", "reset"]),
    enlargeMaxPageWidth() {
      this.enlarge();
    },
    resetMaxPageWidth() {
      this.reset();
    },
  },
}
</script>

<template>
  <slot />
</template>
