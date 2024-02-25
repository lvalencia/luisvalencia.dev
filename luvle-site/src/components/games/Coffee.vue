<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n({
  useScope: "local",
});

const username = "Luis-Valencia-15";
const amount = "5"
const note = encodeURIComponent("👾☕");
const venmoLink = `https://venmo.com/${username}?txn=pay&amount=${amount}&note=${note}`;
</script>

<template>
  <div>
    <a :href="venmoLink" target="_blank">{{ t("buy_me_a_coffee") }} <font-awesome-icon icon="fa-solid fa-mug-hot" /></a>
  </div>
</template>

<i18n lang="json">
  {
    "en": {
      "buy_me_a_coffee": "Buy me a Coffee"
    },
    "es": {
      "buy_me_a_coffee": "Compareme a Café"
    },
    "ca": {
      "buy_me_a_coffee": "Compra'm un Cafè"
    }
  }
  </i18n>