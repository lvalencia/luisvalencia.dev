<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { locale, availableLocales } = useI18n({
  useScope: "global",
});
</script>

<template>
  <select v-model="locale">
    <option 
      v-for="locale in availableLocales"
      :key="`locale-${locale}`"
      :value="locale"
    >
      {{ locale }}
    </option>
  </select>
</template>
