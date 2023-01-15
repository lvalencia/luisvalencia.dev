<script setup lang="ts">
import { useI18n } from "vue-i18n";
import ProfileImage from "@/components/ProfileImage.vue";
import AboutSnippet from "@/components/AboutSnippet.vue";
import type { Maybe } from "@/helpers/maybe";

const { t } = useI18n({
  useScope: "local",
});

function translationOrNothing(str: Maybe<string>): Maybe<string> {
  return str ? t(str) : undefined;
}

function externalTargetOrNothing(isExternal: Maybe<boolean>): Maybe<string> {
  return isExternal ? "_blank" : undefined;
}
</script>

<script lang="ts">
import { useGrid } from "../stores/useGrid";
import { mapState } from "pinia";
import MaybeComponent from "@/components/MaybeComponent.vue";

interface SnippetLink {
  id: string;
  href: string;
  text: string;
  external?: boolean;
  recommended?: boolean;
}

interface Snippet {
  keypath: string;
  links: SnippetLink[];
  title?: string;
  titleId?: string;
  content?: string;
  contentId?: string;
}

interface HomeViewData {
  generalSnippets: Snippet[];
  bookSnippets: Snippet[];
}

const aboutSnippet: Snippet = {
  keypath: "about",
  links: [
    {
      id: "luna",
      href: "https://luna.amazon.com/",
      text: "_luna",
      external: true,
    },
    {
      id: "patentHolder",
      href: "#patents",
      text: "_patents",
    },
    {
      id: "reader",
      href: "#read",
      text: "_read",
    },
    {
      id: "familyMan",
      href: "#family",
      text: "_family",
    },
  ],
};

const familySnippet: Snippet = {
  keypath: "family",
  title: "_family_title",
  titleId: "family",
  links: [],
};

const patentsSnippet: Snippet = {
  keypath: "patents",
  title: "_patents_title",
  titleId: "patents",
  links: [
    {
      id: "vui",
      href: "https://patents.google.com/patent/US11250857B1/en",
      text: "_vui",
      external: true,
    },
    {
      id: "manager",
      href: "https://www.linkedin.com/in/greghroberts/",
      text: "_manager",
      external: true,
    },
  ],
};

const readSnippet: Snippet = {
  keypath: "read",
  title: "_read_title",
  titleId: "read",
  links: [
    {
      id: "groundness",
      href: "https://www.amazon.com/Practice-Groundedness-Transformative-Feeds-Not-Crushes-Your/dp/0593329899",
      text: "_groundness",
      external: true,
      recommended: true,
    },
    {
      id: "mentalModels",
      href: "https://fs.blog/tgmm/#volume_one",
      text: "_mental_models_1",
      external: true,
    },
    {
      id: "witcher",
      href: "https://www.amazon.com/Last-Wish-Introducing-Witcher/dp/0316029181",
      text: "_witcher",
      external: true,
    },
    {
      id: "kitchen",
      href: "https://www.amazon.com/Kitchen-Confidential-Updated-Adventures-Underbelly/dp/0060899220",
      text: "_kitchen",
      external: true,
    },
    {
      id: "ultralearning",
      href: "https://www.amazon.com/Ultralearning-Master-Outsmart-Competition-Accelerate/dp/006285268X",
      text: "_ultralearning",
      external: true,
      recommended: true,
    },
    {
      id: "strategic",
      href: "https://www.amazon.com/Strategic-Thinking-Complex-Problem-Solving/dp/0190463902",
      text: "_strategic",
      external: true,
    },
    {
      id: "worrying",
      href: "https://www.amazon.com/How-Stop-Worrying-Start-Living/dp/0671733354",
      text: "_worrying",
      external: true,
    },
    {
      id: "consolations",
      href: "https://www.amazon.com/Consolations-Nourishment-Underlying-Meaning-Everyday/dp/1786897636",
      text: "_consolations",
      external: true,
      recommended: true,
    },
    {
      id: "tao",
      href: "https://www.amazon.com/Tao-Te-Ching-Lao-Tzu/dp/B09YQF2SZ8/",
      text: "_tao",
      external: true,
    },
    {
      id: "psilocybin",
      href: "https://www.amazon.com/Psilocybin-Mushrooms-World-Identification-Guide/dp/0898158397",
      text: "_psilocybin",
      external: true,
    },
    {
      id: "mushrooms",
      href: "https://www.amazon.com/Growing-Gourmet-Medicinal-Mushrooms-Stamets/dp/1580081754",
      text: "_mushrooms",
      external: true,
      recommended: true,
    },
  ],
};

const readingSnippet: Snippet = {
  keypath: "reading",
  links: [
    {
      id: "science",
      href: "https://press.stripe.com/the-art-of-doing-science-and-engineering",
      text: "_science",
      external: true,
      recommended: true,
    },
    {
      id: "social",
      href: "https://www.amazon.com/Superhuman-Social-Skills-Likeable-Building-ebook/dp/B015QA1250",
      text: "_social",
      external: true,
    },
    {
      id: "mental",
      href: "https://fs.blog/tgmm/#volume_two",
      text: "_mental_models_2",
      external: true,
    },
    {
      id: "mycelium",
      href: "https://www.amazon.com/Mycelium-Running-Mushrooms-Help-World/dp/1580085792",
      text: "_mycelium",
      external: true,
    },
    {
      id: "thinking",
      href: "https://www.amazon.com/Called-Thinking-Harper-Perennial-Thought/dp/006090528X",
      text: "_thinking",
      external: true,
      recommended: true,
    },
  ],
};

export default {
  data(): HomeViewData {
    return {
      generalSnippets: [aboutSnippet, patentsSnippet, familySnippet],
      bookSnippets: [readSnippet, readingSnippet],
    };
  },
  computed: {
    ...mapState(useGrid, ["classObject"]),
  },
  components: { MaybeComponent },
};
</script>

<template>
  <main class="grid-item" :class="classObject">
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

    <h1>Luis Valencia</h1>
    <h2>
      <span>{{ t("occupation") }}</span>
      <wbr />
      <span class="italicized regular">{{ t("location") }}</span>
    </h2>
    <ProfileImage />
    <AboutSnippet
      v-for="(snippet, index) in generalSnippets"
      :key="`snippet-${index}`"
      :title="translationOrNothing(snippet.title)"
      :titleId="snippet.titleId"
      :content="translationOrNothing(snippet.content)"
      :contentId="snippet.contentId"
    >
      <i18n-t :keypath="snippet.keypath" tag="p">
        <template v-for="link in snippet.links" :key="link.id" #[link.id]>
          <a :href="link.href" :target="externalTargetOrNothing(link.external)">
            {{ t(link.text) }}
          </a>
        </template>
        <template #break>
          <wbr />
        </template>
        <template #emphasis>
          <br />
          <i>{{  t("_emphasis") }}</i>
        </template>
      </i18n-t>
    </AboutSnippet>
    <AboutSnippet
      v-for="(snippet, index) in bookSnippets"
      :key="`snippet-${index}`"
      :title="translationOrNothing(snippet.title)"
      :titleId="snippet.titleId"
      :content="translationOrNothing(snippet.content)"
      :contentId="snippet.contentId"
    >
      <i18n-t :keypath="snippet.keypath" tag="p">
        <template #break>
          <wbr />
        </template>
        <template #links>
          <ul>
            <li v-for="link in snippet.links" :key="link.id">
              <a :href="link.href">{{ t(link.text) }}</a>
              <MaybeComponent :render-if="link.recommended">
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
    "message": "Under Construction",
    "_state": "State",
    "_status": "Developing the Site",
    "state": "{state}: {status}",
    "_luna": "Amazon Luna",
    "_patents": "inventor",
    "_read": "voracious reader",
    "_family": "husband and father",
    "about": "I'm a Sr. Software Engineer at {luna}. {break} I am also a {patentHolder}, {familyMan}, and {reader}.",
    "_vui": "Polling with a Natural Language Interface",
    "_manager": "Greg Roberts",
    "_patents_title": "Inventor",
    "patents": "I currently hold a patent for {vui}; an idea that started as a brainstorm session between my then Software Manager {manager} and I for interactive podcasts. We ended up levarging the technology on a massive real-time trivia game in Alexa that we implemented with what now has become a great group of friends and collegues. {break} Additionally, I also have a patent pending for a generic video game representation format for our Cloud platform. {break}",
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
    "_read_title": "Voracious Reader",
    "read": "In the last year I've read:{break} {links}",
    "_science": "The Art of Doing Science and Engineering",
    "_social": "Superhuman Social Skills: A Guide to Being Likeable, Winning Friends, and Building Your Social Circle",
    "_mental_models_2": "The Great Mental Models Volume 2: Physics, Chemistry and Biology",
    "_mycelium": "Mycelium Running: How Mushrooms Can Help Save the World",
    "_thinking": "What Is Called Thinking?",
    "reading": "I'm currently reading:{break} {links} {break} {asterisk} highly recommend"
  },
  "es": {
    "occupation": "Ingeniero de Software",
    "location": "Sur de California",
    "message": "Bajo Construcción",
    "_state": "Condición",
    "_status": "Desarollando el Sitio",
    "state": "{state}: {status}",
    "_luna": "Amazon Luna",
    "_patents": "inventor",
    "_read": "aficiónado a la lectura",
    "_family": "marido y padre",
    "about": "Soy Ingeniero de Software (Senior) en {luna}. {break} Tambien soy {patentHolder}, {familyMan}, y {reader}.",
    "_vui": "Votación usando una Interfaz de Lenguaje Natural",
    "_manager": "Greg Roberts",
    "_patents_title": "Inventor",
    "patents": "Actualmente, tengo un patente de {vui}. La idea empezó en una sesión entre mi Gerente de Ingeniería ({manager}) y yo, en la cual queriamos averiguar como crear la tecnología para un podcast interactivo. Terminamos usando la tecnología para un juego de trivia masivo que creamos en Alexa con colegas los cuales ahora serian considerados amigos. {break} Tambien tengo otro patente pendiene para un formato generico para representar cualquier video juego en nuestra plataforma Cloud. {break}",
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
    "read": "En el ultimo año he leído:{break} {links}",
    "_science": "The Art of Doing Science and Engineering",
    "_social": "Superhuman Social Skills: A Guide to Being Likeable, Winning Friends, and Building Your Social Circle",
    "_mental_models_2": "The Great Mental Models Volume 2: Physics, Chemistry and Biology",
    "_mycelium": "Mycelium Running: How Mushrooms Can Help Save the World",
    "_thinking": "What Is Called Thinking?",
    "reading": "Ahora estoy leyendo:{break} {links} {break} {asterisk} lo recomiendo"
  },
  "ca": {
    "occupation": "Enginyer de Software",
    "location": "Sud de Califòrnia",
    "message": "En Construcció",
    "_state": "Estat",
    "_status": "Desenvolupando el Lloc",
    "state": "{state}: {status}",
    "_luna": "Amazon Luna",
    "_patents": "inventor",
    "_read": "aficionat de llibres",
    "_family": "marit i pare",
    "_emphasis": "També un novell en Català; perdonin la traducció fatal.",
    "about": "Sóc Enginyer de Software (Sènior) a {luna}. {break} També sóc {patentHolder}, {familyMan}, i {reader}. {emphasis}",
    "_vui": "Votació usant una Interfície de Llenguatge Natural",
    "_manager": "Greg Roberts",
    "_patents_title": "Patents",
    "patents": "Actualment, tinc un patent de {vui}. La idea va començar en una sessió entre el meu Gerent d'Enginyeria ({manager}) i jo, en què volíem esbrinar com crear la tecnologia per a un podcast interactiu. Acabem usant la tecnologia per a un joc de trivia massiu a Alexa el qual creem amb companys que ara serien considerats amics. {break} També tinc un altre patent pendiene per a un format genèric que representa qualsevol videojoc a la nostra plataforma Cloud. {break}",
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
    "read": "L'últim any he llegit:{break} {links}",
    "_science": "The Art of Doing Science and Engineering",
    "_social": "Superhuman Social Skills: A Guide to Being Likeable, Winning Friends, and Building Your Social Circle",
    "_mental_models_2": "The Great Mental Models Volume 2: Physics, Chemistry and Biology",
    "_mycelium": "Mycelium Running: How Mushrooms Can Help Save the World",
    "_thinking": "What Is Called Thinking?",
    "reading": "Actualment estic llegint:{break} {links} {break} {asterisk} ho recomano"
  }
}
</i18n>
