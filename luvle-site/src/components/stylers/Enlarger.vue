<script lang="ts">
import { fromNullable } from '@luvle/utils';
import type { Nullable } from '@luvle/utils';

export default {
  mounted() {
    this.enlargeMaxPageWidth();  
  },
  beforeUnmount() {
    this.resetMaxPageWidth();
  },
  methods: {
    enlargeMaxPageWidth() {
      this.container.classList.add('large');
    },
    resetMaxPageWidth() {
      this.container.classList.remove('large');
    },
  },
  computed: {
    container(): Element {
      const element: Nullable<Element> = document.querySelector('#app > div.grid-container');

      return fromNullable({
        nullable: element,
        fallback: document.createElement('null')
      });
    },
  }
}
</script>

<template>
  <slot />
</template>
