<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n({
  useScope: "local",
});
</script>

<script lang="ts">
import { useGrid } from "../stores/useGrid";
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
  <main class="grid-item" :class="classObject">
    <h1>Luis Valencia</h1>
    <h2>
      <span>{{ t("occupation") }}</span>
      <wbr />
      <span class="italicized regular">{{ t("location") }}</span>
    </h2>
    <p>
      <font-awesome-icon
        class="construction-icon"
        icon="fa-solid fa-person-digging"
      />
      <span>{{ t("message") }}</span>
    </p>
    <i18n-t keypath="state" tag="p">
      <template #state>
        <strong>{{ t("_state") }}</strong>
      </template>
      <template #status>
        <span> {{ t("_status") }}</span>
      </template>
    </i18n-t>
  </main>
</template>

<style scoped lang="scss">
.construction-icon + span {
  margin-left: 8px;
}

h1 {
  margin-bottom: 0em;

  & + h2 {
    margin-top: 0em;
  }
}

h2 {
  span:last-child {
    margin-left: 8px;
  }
}
</style>

<i18n lang="json">
{
  "en": {
    "occupation": "Software Engineer",
    "location": "Southern California",
    "message": "Site Under Construction",
    "_state": "State",
    "_status": "Broke Ground",
    "state": "{state}: {status}"
  },
  "es": {
    "occupation": "Ingeniero de Software",
    "location": "Sur de California",
    "message": "Bajo Construcción",
    "_state": "Condición",
    "_status": "Abriendo Nuevos Caminos",
    "state": "{state}: {status}"
  },
  "ca": {
    "occupation": "Enginyer de Software",
    "location": "Sud de Califòrnia",
    "message": "En Construcció",
    "_state": "Estat",
    "_status": "Desenvolupant el Lloc",
    "state": "{state}: {status}"
  }
}
</i18n>
