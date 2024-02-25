<script setup lang="ts">
import { useI18n } from "vue-i18n";
import moment from 'moment';
import AboutSnippet from "@/components/games/AboutSnippet.vue";
import { translationOrNothing } from "@/helpers/translation";
import { inDevelopmentGames, releasedGames } from "./games/gameSnippetLink";
import { fromMaybe, isSomething, type ISO8601 } from "@luvle/utils";
import type { GameSnippet } from "./games/gameSnippets";
import type { Maybe } from "@luvle/utils";
import MaybeComponent from "@/components/MaybeComponent.vue";

const { t } = useI18n({
  useScope: "local",
});

function uriForImage(image: Maybe<string>) {
  image = fromMaybe({
    maybe: image,
    fallback: ""
  });

  const url = new URL(
    `../assets/images/${image}`,
    import.meta.url
  );
  return url.href;
}

function humanReadableDateOrNothing(iso: Maybe<ISO8601>): Maybe<string> {
  if (isSomething(iso)) {
    const date = new Date(iso);
    const formattedDate = moment(date).format('MMMM Do YYYY');
    return formattedDate;
  }
  return undefined;
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
  computed: {
    totalNumberOfGames(): number {
      return inDevelopmentGames.length + releasedGames.length;
    },
    gameGroupings() {
      return [
        {
          heading: "in_development",
          games: inDevelopmentGames
        },
        {
          heading: "released",
          games: releasedGames
        }
      ];
    }
  }
};

</script>

<template>
  <div class="games">
    <h1>{{ t("title") }}</h1>
    <p
      v-html='t("snippet", { link: `<a target="_blank" href="https://abagames.github.io/joys-of-small-game-development-en/fun_to_make_small_games.html">"Making Small Games, Which Is Fun in Itself"</a>` })'>
    </p>
    <p>{{ t("number_of_games", { count: totalNumberOfGames }) }}</p>
    <template v-for="{ heading, games } in gameGroupings">
      <MaybeComponent :renderIf="games.length > 0">
        <h2>{{ t(heading) }}</h2>
        <AboutSnippet v-for="(snippet, index) in games" :key="`snippet-${index}`"
          :title="translationOrNothing(t, snippet.title)" :titleId="snippet.titleId"
          :contentTitle="translationOrNothing(t, 'about_game')" 
          :content="translationOrNothing(t, snippet.content)"
          :contentId="snippet.contentId" :image="uriForImage(translationOrNothing(t, snippet.image))"
          :releaseDate="humanReadableDateOrNothing(snippet.meta.released)"
          :imageText="translationOrNothing(t, 'image_text')" :href="snippet.link.href" :hrefId="snippet.link.id">
        </AboutSnippet>
      </MaybeComponent>
    </template>
  </div>
</template>

<style lang="scss"></style>

<i18n lang="json">
{
  "en": {
    "title": "Games",
    "in_development": "In Development",
    "released": "Released",
    "snippet": "Inspired by the ABA Games post {link}, below is a collection of games I've written.",
    "number_of_games": "Right now it's just {count} game. | Currently, that's {count} games",
    "image_text": "(Click image to play game in browser).",
    "about_game": "About this Game",
    "cube_up_title": "Cube Up!",
    "cube_up_content": "This is the first game I would call my own game. I wanted the game to be simple, silly, and lighthearted. It’s my take on a cube-based whack-a-mole variant.",
    "cube_up_gif": "cube_up.gif"
  },
  "es": {
    "title": "Juegos",
    "in_development": "En Desarollo",
    "released": "Lanzados",
    "snippet": "Inspirado por un post de ABA Games {link}, aqui esta la colección de juegos que escrito.",
    "number_of_games": "Ahorita solo es {count}. | En total son {count} juegos.",
    "image_text": "(Haz clic en la imagen para descargar en juego el navegador).",
    "about_game": "Acerca de Este Juego",
    "cube_up_title": "Cubos Arriba!",
    "cube_up_content": "Este es el primer juego que llamaría mi propio juego. Quería que el juego fuera simple, tonto y desenfadado. Es mi versión de una variante de golpear-topos basada en cubos.",
    "cube_up_gif": "cubos_arriba.gif"
  },
  "ca": {
    "title": "Jocs",
    "in_development": "En Desenvolupament",
    "released": "Llançats",
    "snippet": "Inspirat per un post d'ABA Games {link}, aquí està la col·lecció de jocs que he escrit.",
    "number_of_games": "Ara mateix només és {count}. | En total són {count} jocs.",
    "image_text": "(Fes clic a la imatge per jugar al joc al navegador).",
    "about_game": "Sobre Aquest Joc",
    "cube_up_title": "Cubs Amunt!",
    "cube_up_content": "Aquest és el primer joc que anomenaria el meu propi joc. Volia que el joc fos senzill, ximple i desenfadat. És la meva versió d'una variant de picar-talps basada en cubs.",
    "cube_up_gif": "cubs_amunt.gif"
  }
}
</i18n>