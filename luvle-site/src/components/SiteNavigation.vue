<script setup lang="ts">
import { RouterLink, type RouteRecordNormalized } from "vue-router";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { fromMaybe } from "@luvle/utils";

const { t } = useI18n({
  useScope: "local",
});
</script>

<script lang="ts">
function getMetadata(route: RouteRecordNormalized): any {
  return fromMaybe({
    maybe: route?.meta,
    fallback: {},
  });
}

export default {
  props: {
    routeFilterKey: {
      type: String,
      default: "appearsOnTopNavigation",
    },
  },
  methods: {
    i18n(route: RouteRecordNormalized): string {
      return fromMaybe({
        maybe: getMetadata(route).i18nKey as string,
        fallback: "",
      });
    },
  },
  computed: {
    routes() {
      return router.getRoutes().filter((route) => {
        return fromMaybe({
          maybe: !!getMetadata(route)[this.routeFilterKey],
          fallback: false,
        });
      });
    },
  },
};
</script>

<template>
  <nav>
    <RouterLink
      v-for="route in routes"
      :key="`route-${String(route.name)}`"
      :to="route.path"
    >
      {{ t(i18n(route)) }}
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
    "games": "Games",
    "talks": "Talks"
  },
  "es": {
    "home": "Inicio",
    "games": "Juegos",
    "talks": "Charlas"
  },
  "ca": {
    "home": "Inici",
    "games": "Jocs",
    "talks": "Xerrades"
  }
}
</i18n>
