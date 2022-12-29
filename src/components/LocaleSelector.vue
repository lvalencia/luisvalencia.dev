<script lang="ts">
import type { MessageSchema, SuppportedLocales } from "@/helpers/i18n";
import { useI18n } from "vue-i18n";

const LocaleToHumanReadable: Record<SuppportedLocales, string> = {
  en: "English",
  es: "Español",
  ca: "Català"
}

export default {
  setup() {
    const { locale, availableLocales } = useI18n<[MessageSchema], SuppportedLocales>({
      useScope: "global",
    });
    return { locale, availableLocales };
  },
  methods: {
    humanReadableLocale(locale: SuppportedLocales): string {
      return LocaleToHumanReadable[locale];
    }
  }
}
</script>

<template>
  <select v-model="locale" data-testid="locale-select">
    <option v-for="locale in availableLocales" :key="`locale-${locale}`" :value="locale">
      {{ humanReadableLocale(locale) }}
    </option>
  </select>
</template>
