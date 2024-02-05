<script setup lang="ts">
import { useI18n } from "vue-i18n";
import AboutSnippet from "@/components/games/AboutSnippet.vue";
import { translationOrNothing } from "@/helpers/translation";
import { inDevelopmentGames, releasedGames } from "./games/cube-up/gameSnippetLink";
import type { GameSnippet } from "./games/cube-up/gameSnippets";
const { t } = useI18n({
  useScope: "local",
});

function uriForImage(image: string) {
  const url = new URL(
      `../assets/images/${image}`,
      import.meta.url
    );
    return url.href;
}

</script>

<script lang="ts">

interface GameViewData {
  inDevelopmentGames: GameSnippet[];
  releasedGames: GameSnippet[];
}

export default {
  data(): GameViewData {
    return {
      inDevelopmentGames,
      releasedGames,
    }
  },
};

</script>

<template>
  <div class="games">
    <h1>{{ t("title") }}</h1>
    <h2>{{ t("_in_development") }}</h2>
    <AboutSnippet
      v-for="(snippet, index) in inDevelopmentGames"
      :key="`snippet-${index}`"
      :title="translationOrNothing(t, snippet.title)"
      :titleId="snippet.titleId"
      :content="translationOrNothing(t, snippet.content)"
      :contentId="snippet.contentId"
      :image="uriForImage(snippet.image)"
      :imageText="translationOrNothing(t, '_image_text')"
      :href="snippet.link.href"
      :hrefId="snippet.link.id"
    >
    </AboutSnippet>
  </div>
</template>

<style scoped lang="scss">

</style>

<i18n lang="json">
{
  "en": {
    "title": "Games",
    "_in_development": "In Development",
    "_image_text": "(Click image to play game in browser).",
    "_cube_up_title": "Cube Up!",
    "_cube_up_content": "I think this is the first game I'd be able to call \"my first game.\" Though I have built some games before; Massive real-time trivia game while in Alexa and Alien Decoder during the Alexa Button Launch, I have never game I could call my own. I wanted the game to be simple, silly, and lighthearted. This is my take on a whack-a-mole variant using cubes."
  },
  "es": {
    "title": "Juegos",
    "_in_development": "En Desarollo",
    "_image_text": "(Haz clic en la imagen para descargar en juegop el navegador).",
    "_cube_up_title": "Cube Up!",
    "_cube_up_content": "Creo que éste juego cuenta como mi \"primer juego.\". En el pasado si he escrito otros juegos; cuando hizimos el juego de trivia masivo en Alexa o Alien Decorder cuando se lanzaron los Alexa Buttons, pero nunca he hecho un juego que llamaría mi juego. Quice hacer un juego simple, tonto, y liviano. Éste es mi giro en un juego estilo Pegale-al-Topo pero con cubos."
  },
  "ca": {
    "title": "Jocs",
    "_image_text": "Fes clic a la imatge per jugar al joc al navegador.",
    "_in_development": "En Desenvolupament",
    "_cube_up_title": "Cube Up!",
    "_cube_up_content": "Crec que aquest joc compta com el meu \"primer joc\". En el passat sí que he escrit altres jocs; quan vam fer el joc de trivia massiu en Alexa o Alien Decoder quan es van llançar els botons d'Alexa, però mai he fet un joc que anomenaria el meu joc. Vaig voler fer un joc senzill, absurd i lleuger. Aquest és el meu gir en un joc d'estil Pega-al-Tou però amb cubs."
  }
}
</i18n>
