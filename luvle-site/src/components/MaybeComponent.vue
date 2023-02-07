<script lang="ts">
import { isSomething, type Maybe } from "@luvle/utils";

export default {
  props: {
    renderIf: {
      type: undefined as Maybe<any>,
      default: false,
    },
  },
  methods: {
    conditionalRender(shouldRender: Maybe<any>): any[] {
      const showAttr = [];
      if (isSomething(shouldRender) && !!shouldRender) {
        showAttr.push(shouldRender);
      }
      return showAttr;
    },
  },
};
</script>

<template>
  <slot v-for="_ in conditionalRender(renderIf)" :key="_" />
</template>
