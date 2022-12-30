<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n({
  useScope: "local",
});
</script>

<template>
  <nav>
    <RouterLink to="/">{{ t("home") }}</RouterLink>
    <RouterLink to="/about">{{ t("explore") }}</RouterLink>
  </nav>
</template>

<style scoped lang="scss">
nav > * + * {
  margin-left: 8px;
}
</style>

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
