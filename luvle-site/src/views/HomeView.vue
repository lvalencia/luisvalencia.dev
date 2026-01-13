<script setup lang="ts">
import { useI18n } from "vue-i18n";
import ProfileImage from "@/components/home/ProfileImage.vue";
import AboutSnippet from "@/components/home/AboutSnippet.vue";
import MaybeComponent from "@/components/MaybeComponent.vue";
import type { Maybe } from "@luvle/utils";

const { t } = useI18n({
  useScope: "local",
});

function externalTargetOrNothing(isExternal: Maybe<boolean>): Maybe<string> {
  return isExternal ? "_blank" : undefined;
}
</script>

<script lang="ts">
import { useGrid } from "../stores/useGrid";
import { mapState } from "pinia";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { incompleteBooks, completedBooksByYear } from "./home/bookSnippetLinks";
import { fromMaybe } from "@luvle/utils";
import { map, sortBy } from "underscore";
import { translationOrNothing } from "@/helpers/translation";
import type { BookSnippet, BookSnippetLink } from "./home/bookSnippets";
import type { HomeSnippet } from "./home/homeSnippet";

const aboutSnippet: HomeSnippet = {
  keypath: "about",
  links: [
    {
      id: "current_job",
      href: "https://www.singularity6.com/",
      text: "_current_job",
      meta: {
        external: true,
      },
    },
    {
      id: "patentHolder",
      href: "#patents",
      text: "_patents",
      meta: {},
    },
    {
      id: "reader",
      href: "#read",
      text: "_read",
      meta: {},
    },
    {
      id: "familyMan",
      href: "#family",
      text: "_family",
      meta: {},
    },
  ],
};

const familySnippet: HomeSnippet = {
  keypath: "family",
  title: "_family_title",
  titleId: "family",
  links: [],
};

const patentsSnippet: HomeSnippet = {
  keypath: "patents",
  title: "_patents_title",
  titleId: "patents",
  links: [
    {
      id: "vui",
      href: "https://patents.google.com/patent/US11250857B1/en",
      text: "_vui",
      meta: {
        external: true,
      },
    },
    {
      id: "incremental_upload",
      href: "https://patents.google.com/patent/US12293177B1/en",
      text: "_incremental_upload",
      meta: {
        external: true,
      },
    },
    {
      id: "manager",
      href: "https://www.linkedin.com/in/greghroberts/",
      text: "_manager",
      meta: {
        external: true,
      },
    },
    {
      id: "luna",
      href: "https://luna.amazon.com/",
      text: "_luna",
      meta: {
        external: true,
      },
    },
  ],
};

type BookSnippetsWithYear = BookSnippet & { year?: string };

const readSnippets = sortBy(
  map(completedBooksByYear, (books: BookSnippetLink[], year) => {
    return {
      keypath: "read",
      links: books,
      year,
    } as BookSnippetsWithYear;
  }),
  (bookSnippetWithYear) => bookSnippetWithYear.year
).reverse();

export const readingSnippet: BookSnippetsWithYear = {
  keypath: "reading",
  title: "_read_title",
  titleId: "read",
  links: incompleteBooks,
};

interface HomeViewData {
  generalSnippets: HomeSnippet[];
  bookSnippets: BookSnippetsWithYear[];
}

export default {
  data(): HomeViewData {
    return {
      generalSnippets: [aboutSnippet, patentsSnippet, familySnippet],
      bookSnippets: [readingSnippet, ...readSnippets],
    };
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
      <span data-testid="occupation">{{ t("occupation") }}</span>
      <wbr />
      <span class="italicized regular" data-testid="location">
        {{ t("location") }}
      </span>
    </h2>
    <ProfileImage />
    <AboutSnippet
      v-for="(snippet, index) in generalSnippets"
      :key="`snippet-${index}`"
      :title="translationOrNothing(t, snippet.title)"
      :titleId="snippet.titleId"
      :content="translationOrNothing(t, snippet.content)"
      :contentId="snippet.contentId"
    >
      <i18n-t :keypath="snippet.keypath" tag="p">
        <template v-for="link in snippet.links" :key="link.id" #[link.id]>
          <a
            :href="link.href"
            :target="externalTargetOrNothing(link.meta.external)"
          >
            {{ t(link.text) }}
          </a>
        </template>
        <template #break>
          <wbr />
        </template>
        <template #emphasis>
          <br />
          <i>{{ t("_emphasis") }}</i>
        </template>
      </i18n-t>
    </AboutSnippet>
    <AboutSnippet
      v-for="(snippet, index) in bookSnippets"
      :key="`snippet-${index}`"
      :title="translationOrNothing(t, snippet.title)"
      :titleId="snippet.titleId"
      :content="translationOrNothing(t, snippet.content)"
      :contentId="snippet.contentId"
    >
      <i18n-t :keypath="snippet.keypath" tag="p">
        <template #year>
          {{
            fromMaybe({
              maybe: snippet.year,
              fallback: t("_read_year_fallback"),
            })
          }}
        </template>
        <template #break>
          <wbr />
        </template>
        <template #links>
          <ul>
            <li v-for="link in snippet.links" :key="link.id">
              <a
                :href="link.href"
                :target="externalTargetOrNothing(link.meta.external)"
              >
                {{ t(link.text) }}
              </a>
              <MaybeComponent :render-if="link.meta.recommended">
                <font-awesome-icon icon="fa-solid fa-asterisk" />
              </MaybeComponent>
            </li>
          </ul>
        </template>
        <template #asterisk>
          <font-awesome-icon icon="fa-solid fa-asterisk" />
        </template>
      </i18n-t>
    </AboutSnippet>
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

a + svg {
  margin-left: 8px;
}
</style>

<i18n lang="json">
{
  "en": {
    "occupation": "Software Engineer",
    "location": "Southern California",
    "_current_job": "Singularity 6",
    "_patents": "inventor",
    "_read": "avid reader",
    "_family": "husband and father",
    "_emphasis": "",
    "about": "I'm a Staff Software Engineer at {current_job}. {break} I am also a {patentHolder}, {familyMan}, and {reader}.",
    "_vui": "Polling with a Natural Language Interface",
    "_incremental_upload": "Techniques for Uploading Network Applications",
    "_manager": "Greg Roberts",
    "_luna": "Amazon Luna",
    "_patents_title": "Inventor",
    "patents": "I currently hold a patent for {vui}; an idea that started as a brainstorm session between my then Software Manager {manager} and I for interactive podcasts. We ended up levarging the technology on a massive real-time trivia game in Alexa that we implemented with what now has become a great group of friends and collegues. {break} I also have a patent for {incremental_upload} as a result of work I did at {luna} for optimizing Game uploads. {break}",
    "_family_title": "Husband and Father",
    "family": "I'm happily married to Jen. We are parents to two wonderful children.",
    "_groundness": "The Practice of Groundedness",
    "_mental_models_1": "The Great Mental Models Volume 1: General Thinking Concepts",
    "_witcher": "The Witcher: The Last Wish",
    "_kitchen": "Kitchen Confidential: Adventures in the Culinary Underbelly",
    "_ultralearning": "Ultralearning: Master Hard Skills, Outsmart the Competition, and Accelerate Your Career",
    "_strategic": "Strategic Thinking in Complex Problem Solving",
    "_worrying": "How to Stop Worrying and Start Living",
    "_consolations": "Consolations: The Solace, Nourishment and Underlying Meaning of Everyday Words",
    "_tao": "Tao The Ching",
    "_psilocybin": "Psilocybin Mushrooms of the World: An Identification Guide",
    "_mushrooms": "Growing Gourmet and Medicinal Mushrooms",
    "_read_title": "Avid Reader",
    "_read_year_fallback": "the last year",
    "read": "In {year} I read:{break} {links}",
    "_science": "The Art of Doing Science and Engineering",
    "_social": "Superhuman Social Skills: A Guide to Being Likeable, Winning Friends, and Building Your Social Circle",
    "_mental_models_2": "The Great Mental Models Volume 2: Physics, Chemistry and Biology",
    "_mycelium": "Mycelium Running: How Mushrooms Can Help Save the World",
    "_thinking": "What Is Called Thinking?",
    "_skeptic": "The Skeptics' Guide to the Future: What Yesterday's Science and Science Fiction Tell Us About the World of Tomorrow",
    "_aizgorri": "La casa de Aizgorri",
    "_labraz": "El mayorazgo de Labraz",
    "_creative_act": "The Creative Act: A Way of Being",
    "_sensual_home": "the sensual home: liberate your senses and change your life",
    "_remote_work": "Remote: Office Not Required",
    "_ferryman": "The Ferryman",
    "_portraits_from_memory": "Portraits from Memory: And Other Essays",
    "_halting_state": "Halting State",
    "_rule_34": "Rule 34 (Halting State Book 2)",
    "_mental_models_3": "The Great Mental Models, Volume 3: Systems and Mathematics",
    "_cien_años": "Cien años de soledad",
    "_good_game_no_rematch": "Good Game, No Rematch: A Life Made of Video Games",
    "_nexus": "Nexus: A Brief History of Information Networks from the Stone Age to AI",
    "_small_is_beautiful": "Small Is Beautiful: Economics as If People Mattered",
    "reading": "I'm currently reading:{break} {links} {break} {asterisk} highly recommend"
  },
  "es": {
    "occupation": "Ingeniero de Software",
    "location": "Sur de California",
    "_current_job": "Singularity 6",
    "_patents": "inventor",
    "_read": "aficiónado a la lectura",
    "_family": "marido y padre",
    "_emphasis": "",
    "about": "Soy Ingeniero de Software (Staff) en {current_job}. {break} Tambien soy {patentHolder}, {familyMan}, y {reader}.",
    "_vui": "Votación usando una Interfaz de Lenguaje Natural",
    "_incremental_upload": "Técnicas para Subir Aplicaciones de Red",
    "_manager": "Greg Roberts",
    "_luna": "Amazon Luna",
    "_patents_title": "Inventor",
    "patents": "Actualmente, tengo un patente de {vui}. La idea empezó en una sesión entre mi Gerente de Ingeniería ({manager}) y yo, en la cual queriamos averiguar como crear la tecnología para un podcast interactivo. Terminamos usando la tecnología para un juego de trivia masivo que creamos en Alexa con colegas los cuales ahora serian considerados amigos. {break} También tengo una patente para {incremental_upload}, resultado del trabajo que hice en {luna} optimizando la carga incremental de datos de juegos. {break}",
    "_family_title": "Marido y Padre",
    "family": "Estoy felizmente casado a mi esposa Jennifer. Juntos tenemos dos niñas hermosas.",
    "_groundness": "The Practice of Groundedness",
    "_mental_models_1": "The Great Mental Models Volume 1: General Thinking Concepts",
    "_witcher": "The Witcher: The Last Wish",
    "_kitchen": "Kitchen Confidential: Adventures in the Culinary Underbelly",
    "_ultralearning": "Ultralearning: Master Hard Skills, Outsmart the Competition, and Accelerate Your Career",
    "_strategic": "Strategic Thinking in Complex Problem Solving",
    "_worrying": "How to Stop Worrying and Start Living",
    "_consolations": "Consolations: The Solace, Nourishment and Underlying Meaning of Everyday Words",
    "_tao": "Tao The Ching",
    "_psilocybin": "Psilocybin Mushrooms of the World: An Identification Guide",
    "_mushrooms": "Growing Gourmet and Medicinal Mushrooms",
    "_read_title": "Aficiónado a La Lectura",
    "_read_year_fallback": "el ultimo año",
    "read": "En {year} leí:{break} {links}",
    "_science": "The Art of Doing Science and Engineering",
    "_social": "Superhuman Social Skills: A Guide to Being Likeable, Winning Friends, and Building Your Social Circle",
    "_mental_models_2": "The Great Mental Models Volume 2: Physics, Chemistry and Biology",
    "_mycelium": "Mycelium Running: How Mushrooms Can Help Save the World",
    "_thinking": "What Is Called Thinking?",
    "_skeptic": "The Skeptics' Guide to the Future: What Yesterday's Science and Science Fiction Tell Us About the World of Tomorrow",
    "_aizgorri": "La casa de Aizgorri",
    "_labraz": "El mayorazgo de Labraz",
    "_creative_act": "The Creative Act: A Way of Being",
    "_sensual_home": "the sensual home: liberate your senses and change your life",
    "_remote_work": "Remote: Office Not Required",
    "_ferryman": "The Ferryman",
    "_portraits_from_memory": "Portraits from Memory: And Other Essays",
    "_halting_state": "Halting State",
    "_rule_34": "Rule 34 (Halting State Book 2)",
    "_mental_models_3": "The Great Mental Models, Volume 3: Systems and Mathematics",
    "_cien_años": "Cien años de soledad",
    "_good_game_no_rematch": "Good Game, No Rematch: A Life Made of Video Games",
    "_nexus": "Nexus. Breve historia de las redes de información desde la Edad de Piedra hasta la IA",
    "_small_is_beautiful": "Small Is Beautiful: Economics as If People Mattered",
    "reading": "Ahora estoy leyendo:{break} {links} {break} {asterisk} lo recomiendo"
  },
  "ca": {
    "occupation": "Enginyer de Software",
    "location": "Sud de Califòrnia",
    "_current_job": "Singularity 6",
    "_patents": "inventor",
    "_read": "aficionat de llibres",
    "_family": "marit i pare",
    "_emphasis": "També un novell en Català; perdonin la traducció fatal.",
    "about": "Sóc Enginyer de Software (Staff) a {current_job}. {break} També sóc {patentHolder}, {familyMan}, i {reader}. {emphasis}",
    "_vui": "Votació usant una Interfície de Llenguatge Natural",
    "_incremental_upload": "Tècniques per pujar Aplicacions de Xarxa",
    "_manager": "Greg Roberts",
    "_luna": "Amazon Luna",
    "_patents_title": "Patents",
    "patents": "Actualment, tinc un patent de {vui}. La idea va començar en una sessió entre el meu Gerent d'Enginyeria ({manager}) i jo, en què volíem esbrinar com crear la tecnologia per a un podcast interactiu. Acabem usant la tecnologia per a un joc de trivia massiu a Alexa el qual creem amb companys que ara serien considerats amics. {break} També tinc una patent per a {incremental_upload}, resultat de la feina que vaig fer a {luna} optimitzant la càrrega incremental de dades de jocs. {break}",
    "_family_title": "Marit i Pare",
    "family": "Estic feliçment casat a la meva dona Jennifer. Junts tenim dues nenes moltas belles.",
    "_groundness": "The Practice of Groundedness",
    "_mental_models_1": "The Great Mental Models Volume 1: General Thinking Concepts",
    "_witcher": "The Witcher: The Last Wish",
    "_kitchen": "Kitchen Confidential: Adventures in the Culinary Underbelly",
    "_ultralearning": "Ultralearning: Master Hard Skills, Outsmart the Competition, and Accelerate Your Career",
    "_strategic": "Strategic Thinking in Complex Problem Solving",
    "_worrying": "How to Stop Worrying and Start Living",
    "_consolations": "Consolations: The Solace, Nourishment and Underlying Meaning of Everyday Words",
    "_tao": "Tao The Ching",
    "_psilocybin": "Psilocybin Mushrooms of the World: An Identification Guide",
    "_mushrooms": "Growing Gourmet and Medicinal Mushrooms",
    "_read_title": "Aficionat de Llibres",
    "_read_year_fallback": "L'últim any",
    "read": "{year} vaig llegir:{break} {links}",
    "_science": "The Art of Doing Science and Engineering",
    "_social": "Superhuman Social Skills: A Guide to Being Likeable, Winning Friends, and Building Your Social Circle",
    "_mental_models_2": "The Great Mental Models Volume 2: Physics, Chemistry and Biology",
    "_mycelium": "Mycelium Running: How Mushrooms Can Help Save the World",
    "_thinking": "What Is Called Thinking?",
    "_skeptic": "The Skeptics' Guide to the Future: What Yesterday's Science and Science Fiction Tell Us About the World of Tomorrow",
    "_aizgorri": "La casa de Aizgorri",
    "_labraz": "El mayorazgo de Labraz",
    "_creative_act": "The Creative Act: A Way of Being",
    "_sensual_home": "the sensual home: liberate your senses and change your life",
    "_remote_work": "Remote: Office Not Required",
    "_ferryman": "The Ferryman",
    "_portraits_from_memory": "Portraits from Memory: And Other Essays",
    "_halting_state": "Halting State",
    "_rule_34": "Rule 34 (Halting State Book 2)",
    "_mental_models_3": "The Great Mental Models, Volume 3: Systems and Mathematics",
    "_cien_años": "Cien años de soledad",
    "_good_game_no_rematch": "Good Game, No Rematch: A Life Made of Video Games",
    "_nexus": "Nexus. Breve historia de las redes de información desde la Edad de Piedra hasta la IA",
    "_small_is_beautiful": "Small Is Beautiful: Economics as If People Mattered",
    "reading": "Actualment estic llegint:{break} {links} {break} {asterisk} ho recomano"
  }
}
</i18n>