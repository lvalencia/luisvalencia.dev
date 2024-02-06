<script setup lang="ts">
import { RouterView } from "vue-router";
import PaperStyler from "./components/stylers/PaperStyler.vue";
import SiteNavigation from "./components/SiteNavigation.vue";
import SiteOptions from "./components/SiteOptions.vue";
</script>

<script lang="ts">
import { useGrid } from "./stores/useGrid";
import { mapState } from "pinia";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(useGrid, ["classObject"]),
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