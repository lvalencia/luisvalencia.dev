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
      :contentTitle="translationOrNothing(t, '_about_game')"
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

<style lang="scss">

</style>

<i18n lang="json">
{
  "en": {
    "title": "Games",
    "_in_development": "In Development",
    "_image_text": "(Click image to play game in browser).",
    "_about_game": "About this Game",
    "_cube_up_title": "Cube Up!",
    "_cube_up_content": "This is the first game I would call my own game. I wanted the game to be simple, silly, and lighthearted. It’s my take on a cube-based whack-a-mole variant."
  },
  "es": {
    "title": "Juegos",
    "_in_development": "En Desarollo",
    "_image_text": "(Haz clic en la imagen para descargar en juegop el navegador).",
    "_about_game": "Acerca de Este Juego",
    "_cube_up_title": "Cubos Arriba!",
    "_cube_up_content": "Este es el primer juego que llamaría mi propio juego. Quería que el juego fuera simple, tonto y desenfadado. Es mi versión de una variante de golpear-topos basada en cubos."
  },
  "ca": {
    "title": "Jocs",
    "_image_text": "(Fes clic a la imatge per jugar al joc al navegador).",
    "_in_development": "En Desenvolupament",
    "_about_game": "Sobre Aquest Joc",
    "_cube_up_title": "Cubs Amunt!",
    "_cube_up_content": "Aquest és el primer joc que anomenaria el meu propi joc. Volia que el joc fos senzill, ximple i desenfadat. És la meva versió d'una variant de picar-talps basada en cubs."
  }
}
</i18n>
