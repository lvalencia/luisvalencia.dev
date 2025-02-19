<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n({
  useScope: "local",
});
</script>

<script lang="ts">
import type { SuppportedLocales } from "@/helpers/i18n";
import moment from "moment";
import type { LocaleSpecification, Moment } from "moment";

type OverridenLocale = Exclude<SuppportedLocales, "en">;
const LocaleOverrides: Record<OverridenLocale, Partial<LocaleSpecification>> = {
  es: {
    relativeTime : {
        y : 'un año',
        yy : '%d años'
    },
  },
  ca: {
    relativeTime : {
        y : 'un any',
        yy : '%d anys'
    },
  }
};

for (const [overridenLocale, overrideConfiguration] of Object.entries(LocaleOverrides)) {
  moment.locale(overridenLocale, overrideConfiguration);
}

interface TalksViewData {
  startedWorkingDate: Moment;
}

export default {
  data(): TalksViewData {
    return {
      startedWorkingDate: moment("20120601", "YYYYMMDD"),
    }
  },
};
</script>

<template>
  <div class="talks">
    <h1>{{ t("title") }}</h1>
    <p>{{  t("snippet", { yearsInIndustry: startedWorkingDate.locale(locale).fromNow(true) }) }}</p>
    <p>{{  t("talks")  }}</p>
  </div>
</template>

<i18n lang="json">
  {
    "en": {
      "title": "Talks",
      "snippet": "After {yearsInIndustry} in the industry I've come to realize I have a knack for mentorship and clear, written commnunication. I wanted to see if this extends to verbal communication in the form of talks, wherein I could combine mentorship with a medium that scales.",
      "talks": "The following are talks I've given to date."
    },
    "es": {
      "title": "Charlas",
      "snippet": "Despues de {yearsInIndustry} en la industria me he dado cuenta que tengo un don para le mentoría, aparte de poder communicarme de forma clara en el medio escrito. Quería ver si ese don se traducia al medio de communicaion verbal, donde (dado el formato) prodria expander mi mentoría.",
      "talks": "Estas son algunas de charlas que he dado"
    },
    "ca": {
      "title": "Xerrades",
      "snippet": "Després de de {yearsInIndustry} a la indústria, m’he adonat que tinc un do per a la mentoria, a més de saber-me comunicar clarament per escrit. Volia veure si aquest do es traduïa també al mitjà de comunicació verbal, on, pel format, podria expandir la meva mentoria",
      "talks": "Les següents són xerrades que he donat fins ara."
    }
  }
  </i18n>