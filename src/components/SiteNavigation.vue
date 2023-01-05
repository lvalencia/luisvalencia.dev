<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import router from "@/router";

const { t } = useI18n({
  useScope: "local",
});
</script>

<template>
  <nav>
    <RouterLink
      v-for="route in router.getRoutes()"
      :key="`route-${String(route.name)}`"
      :to="route.path"
    >
      {{ t(String(route.name)) }}
    </RouterLink>
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
    "lab": "Lab"
  },
  "es": {
    "home": "Inicio",
    "lab": "Laboratorio"
  },
  "ca": {
    "home": "Inici",
    "lab": "Laboratori"
  }
}
</i18n>
