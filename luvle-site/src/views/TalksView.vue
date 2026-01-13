<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n({
  useScope: "local",
});
</script>

<script lang="ts">
import moment from "moment";
import type { SuppportedLocales } from "@/helpers/i18n";
import type { LocaleSpecification, Moment } from "moment";
import type { TalkSnippet } from "./talks/talkSnippets";
import type { ISO8601, Maybe } from "@luvle/utils";
import AboutSnippet from "@/components/talks/AboutSnippet.vue";
import { givenTalks, upcomingTalks } from "./talks/talkSnippets";
import { translationOrNothing } from "@/helpers/translation";
import { fromMaybe, isSomething } from "@luvle/utils";
import MaybeComponent from "@/components/MaybeComponent.vue";

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

enum AssetType {
  Image = "images",
}

function uriForAsset(assetType: AssetType, asset: Maybe<string>) {
  asset = fromMaybe({
    maybe: asset,
    fallback: ""
  });

  const url = new URL(
    `../assets/${assetType}/${asset}`,
    import.meta.url
  );

  return url.href;
}

interface TalksViewData {
  startedWorkingDate: Moment;
  givenTalks: TalkSnippet[];
  upcomingTalks: TalkSnippet[];
}

export default {
  data(): TalksViewData {
    return {
      startedWorkingDate: moment("20120601", "YYYYMMDD"),
      givenTalks,
      upcomingTalks,
    }
  },
  methods: {
    formattedDate(maybeDate: Maybe<ISO8601>) {
      if (isSomething(maybeDate)) {
        return moment(maybeDate).format("MM/DD/YYYY")
      }
      return "";
    }
  },
  computed: {
    talkGroupings() {
      return [
        {
          heading: "upcoming_talks",
          talks: upcomingTalks
        },
        {
          heading: "given_talks",
          talks: givenTalks 
        }, 
      ];
    }
  }
};
</script>

<template>
  <div class="talks">
    <h1>{{ t("title") }}</h1>
    <p>{{  t("snippet", { yearsInIndustry: startedWorkingDate.locale(locale).fromNow(true) }) }}</p>
    <p>{{  t("talks")  }}</p>
    <template v-for="{heading, talks} in talkGroupings">
      <MaybeComponent :render-if="talks">
        <h2>{{  t(heading) }}</h2>
        <AboutSnippet v-for="(snippet, index) in talks" :key="`snippet-${index}`" class="about"
          :date="formattedDate(snippet.meta.date)"
          :title="translationOrNothing(t, snippet.title)" 
          :titleId="snippet.titleId"
          :contentTitle="translationOrNothing(t, snippet.meta.venue)"
          :contentTitleId="snippet.contentId"
          :content="translationOrNothing(t, snippet.content)"
          :contentId="snippet.contentId"
          :image="uriForAsset(AssetType.Image, snippet.image)"
        >
        </AboutSnippet>
      </MaybeComponent>
    </template>
  </div>
</template>

<style scoped lang="scss">
.talks {
  .about {
    :deep(img) {
      max-width: 100%;
    }
    &+ .about {
      margin-top: 32px;
    }

  }
}

</style>

<i18n lang="json">
  {
    "en": {
      "title": "Talks",
      "snippet": "After {yearsInIndustry} in the industry I've come to realize I have a knack for mentorship and clear, written commnunication. I wanted to see if this could also extend to verbal communication in the form of talks.",
      "talks": "The following are talks I've given to date.",
      "_ccp_game_dev_club": "[CPP Game Development Club]",
      "_ccp_she_codes": "[CPP She Codes]",
      "_ccp_sea_club": "[CPP Software Engineering Association]",
      "_ieee_cpp": "[CPP IEEE]",
      "lean_times": "Navigating Industry in Lean Times",
      "lean_times_content": "A talk about how the industry has changed the past couple years and what the current landscape means for getting a job, remote work, and your skillset in the era of AI.",
      "game_lifecycle": "Video Game Lifecycle Management in Distribution Platforms",
      "game_lifecycle_content": "We all more or less know what goes into making a game, but what about all the ancillary work necessary to manage the lifecycle of a game in a distribution platform? This talk explains what goes into managing the lifecycle of a game in a distribution platform such as Amazon Luna, Steam, Epic Games Store, etc.",
      "career_planning": "Planning for a Meaningful Career",
      "career_planning_content": "How to think about your career progression over time and be intentional about your career choices.",
      "rust_arduino": "[Workshop] Rust x Arduino",
      "rust_arduino_content": "Workshop for how to cross-compile rust code for Arduino and load and run on an Uno microcontroller.",
      "lsb_embedding": "Least Significant Bit Embedding in Lossless Images",
      "lsb_embedding_content": "When you don’t want someone to know the contents of a message, you encrypt it. But what about when you don’t want someone to know that you’ve even sent a message? This talk devles into the Image Steganography technique of the Least Significant Bit Embedding for obfuscating data.",
      "given_talks": "Previous Talks",
      "upcoming_talks": "Upcoming Talks"
    },
    "es": {
      "title": "Charlas",
      "snippet": "Despues de {yearsInIndustry} en la industria me he dado cuenta que tengo un don para le mentoría, aparte de poder communicarme de forma clara en el medio escrito. Quería ver si ese don se traducia al medio de communicaion verbal.",
      "talks": "Estas son algunas de charlas que he dado",
      "_ccp_game_dev_club": "[CPP Game Development Club]",
      "_ccp_she_codes": "[CPP She Codes]",
      "_ccp_sea_club": "[CPP Software Engineering Association]",
      "_ieee_cpp": "[CPP IEEE]",
      "lean_times": "Navegando la Industria en Tiempos Difíciles",
      "lean_times_content": "Una charla sobre cómo ha cambiado la industria en los últimos años y qué significa el panorama actual para conseguir trabajo, el trabajo remoto y tu conjunto de habilidades en la era de la inteligencia artificial.",
      "game_lifecycle": "Gestión del Ciclo de Vida de Videojuegos en Plataformas de Distribución",
      "game_lifecycle_content": "Más o menos todos sabemos lo que implica hacer un juego, pero ¿qué hay del trabajo adicional necesario para gestionar su ciclo de vida en una plataforma de distribución? Esta charla explica lo que implica administrar el ciclo de vida de un juego en plataformas como Amazon Luna, Steam, Epic Games Store, etc.",
      "career_planning": "Planeando una carrera con propósito",
      "career_planning_content": "Cómo pensar en la progresión de tu carrera a lo largo del tiempo y tomar decisiones profesionales de manera intencional.",
      "rust_arduino": "[Taller] Rust x Arduino",
      "rust_arduino_content": "Taller sobre cómo compilar código Rust para Arduino y cargarlo y ejecutarlo en un microcontrolador Uno.",
      "lsb_embedding": "",
      "lsb_embedding_content": "",
      "given_talks": "Charlas Previas",
      "upcoming_talks": "Proximas Charlas"
    },
    "ca": {
      "title": "Xerrades",
      "snippet": "Després de de {yearsInIndustry} a la indústria, m’he adonat que tinc un do per a la mentoria, a més de saber-me comunicar clarament per escrit. Volia veure si aquest do es traduïa també al mitjà de comunicació verbal.",
      "_ccp_game_dev_club": "[CPP Game Development Club]",
      "_ccp_she_codes": "[CPP She Codes]",
      "_ccp_sea_club": "[CPP Software Engineering Association]",
      "_ieee_cpp": "[CPP IEEE]",
      "talks": "Les següents són xerrades que he donat fins ara.",
      "lean_times": "Navegant la Indústria en Temps Difícils",
      "lean_times_content": "Una xerrada sobre com ha canviat la indústria els darrers anys i què significa el panorama actual per trobar feina, el treball remot i el teu conjunt d’habilitats en l’era de la intel·ligència artificial.",
      "game_lifecycle": "Gestió del Cicle de Vida dels Videojocs en Plataformes de Distribució",
      "game_lifecycle_content": "Més o menys tots sabem què implica fer un joc, però què hi ha de tota la feina addicional necessària per gestionar-ne el cicle de vida en una plataforma de distribució? Aquesta xerrada explica què comporta administrar el cicle de vida d’un joc en plataformes com Amazon Luna, Steam, Epic Games Store, etc.",
      "career_planning": "Planificant una trajectòria professional amb propòsit",
      "career_planning_content": "Com pensar en la progressió de la teva carrera al llarg del temps i prendre decisions professionals de manera intencionada.",
      "rust_arduino": "[Taller] Rust x Arduino",
      "rust_arduino_content": "Taller sobre com compilar codi Rust per a Arduino i carregar-lo i executar-lo en un microcontrolador Uno.",
      "lsb_embedding": "",
      "lsb_embedding_content": "",
      "given_talks": "Xerrades prèvies",
      "upcoming_talks": "Xerrades Pròximes"
    }
  }
  </i18n>