<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import PaperStyler from "./components/stylers/PaperStyler.vue";
import ShowGridSwitch from "./components/ShowGridSwitch.vue";
import LocaleSelector from "./components/LocaleSelector.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({
  useScope: "local",
});
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
      <ShowGridSwitch />
      <LocaleSelector />
      <header class="grid-item" :class="classObject">
        <div class="wrapper">
          <nav>
            <RouterLink to="/">{{ t("home") }}</RouterLink>
            <RouterLink to="/about">{{ t("explore") }}</RouterLink>
          </nav>
        </div>
      </header>
      <RouterView />
    </div>
  </PaperStyler>
</template>

<i18n lang="json">
{
  "en": {
    "home": "Home",
    "explore": "Explore"
  },
  "es": {
    "home": "Inicio",
    "explore": "Explora"
  },
  "ca": {
    "home": "Inici",
    "explore": "Explora"

  }
}
</i18n>
