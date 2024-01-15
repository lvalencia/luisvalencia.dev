<script setup lang="ts">
import MaybeComponent from "../MaybeComponent.vue";
</script>

<script lang="ts">
export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    titleId: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: false,
    },
    contentId: {
      type: String,
      required: false,
    },
  },
};
</script>

<template>
  <MaybeComponent :render-if="title">
    <h3 :key="title" :id="titleId">
      {{ title }}
    </h3>
  </MaybeComponent>
  <MaybeComponent :render-if="content">
    <p :id="contentId" :key="content">
      {{ content }}
    </p>
  </MaybeComponent>
  <slot />
</template>
