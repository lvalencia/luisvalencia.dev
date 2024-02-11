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
    href: {
      type: String,
      required: true,
    },
    hrefId: {
      type: String,
      required: false
    },
    image: {
      type: String,
      required: true,
    },
    imageId: {
      type: String,
      required: false
    },
    imageText: {
      type: String,
      required: false
    },
    imageTextId: {
      type: String,
      required: false
    },
    imageAlt: {
      type: String,
      required: false
    },
    contentTitle: {
      type: String,
      required: false,
    },
    contentTitleId: {
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
  <div>
    <MaybeComponent :render-if="title">
      <h3 :key="title" :id="titleId">
        {{ title }}
      </h3>
    </MaybeComponent>
    <a :href="href" :id="hrefId">
      <img :src="image" :id="imageId" :alt="imageAlt" />
    </a>
    <MaybeComponent :render-if="imageText">
      <p :id="imageTextId" :key="imageText">
        {{ imageText }}
      </p>
    </MaybeComponent>
    <MaybeComponent :render-if="contentTitle">
      <h4 :id="contentTitleId" :key="contentTitle">
        {{ contentTitle }}
      </h4>
    </MaybeComponent>
    <MaybeComponent :render-if="content">
      <p :id="contentId" :key="content">
        {{ content }}
      </p>
    </MaybeComponent>
    <slot />
  </div>
</template>
