<script lang="ts">
import type { MessageSchema, SuppportedLocales } from "@/helpers/i18n";
import { useI18n } from "vue-i18n";

const LocaleToHumanReadable: Record<SuppportedLocales, string> = {
  en: "English",
  es: "Español",
  ca: "Català",
};

export default {
  setup() {
    const { locale, availableLocales } = useI18n<
      [MessageSchema],
      SuppportedLocales
    >({
      useScope: "global",
    });
    return { locale, availableLocales };
  },
  methods: {
    humanReadableLocale(locale: SuppportedLocales): string {
      return LocaleToHumanReadable[locale];
    },
  },
};
</script>

<template>
  <div class="wrapper">
    <select v-model="locale" data-testid="locale-select">
      <option
        v-for="selectableLocale in availableLocales"
        :key="`locale-${selectableLocale}`"
        :value="selectableLocale"
      >
        {{ humanReadableLocale(selectableLocale) }}
      </option>
    </select>
    <font-awesome-icon class="arrow" icon="fa-solid fa-chevron-down" />
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/mixins.scss";
@import "@/assets/color.scss";

.wrapper {
  position: relative;
}

select {
  position: relative;
  background: transparent;
  @include appearance;
  border: none;
  padding-right: 24px;
  color: $secondary-variant;
}

$arrow-height: 1em;
$arrow-displacement: calc($arrow-height / 2 * -1);
$arrow-center: 50%;

.arrow {
  position: absolute;
  z-index: -1;
  right: 0;
  bottom: 0;
  height: $arrow-height;
  top: $arrow-center;
  margin-top: $arrow-displacement;
}
</style>
