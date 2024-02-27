<script setup lang="ts">
import { RouterView } from "vue-router";
import PaperStyler from "./components/stylers/PaperStyler.vue";
import SiteNavigation from "./components/SiteNavigation.vue";
import SiteOptions from "./components/SiteOptions.vue";
</script>

<script lang="ts">
import { useGrid } from "./stores/useGrid";
import { mapState } from "pinia";
import { useEnlarger } from "./stores/useEnlarger";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(useGrid, {
      gridClassObject: 'classObject'
    }),
    ...mapState(useEnlarger, {
      enlargerClassObject: 'classObject'
    }),
    classObject() {
      return {
        ...this.gridClassObject,
        ...this.enlargerClassObject,
      }
    }
  },
};
</script>

<template>
  <PaperStyler>
    <div class="grid-container" :class="classObject">
      <header class="grid-item flex-container" :class="classObject">
        <SiteNavigation />
        <SiteOptions />
      </header>
      <RouterView />
    </div>
  </PaperStyler>
</template>