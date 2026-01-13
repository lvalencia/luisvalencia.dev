import { toISO8601, hasOwnProperty } from "@luvle/utils";
import type { BookSnippetLink } from "./bookSnippets";
import { groupBy } from "underscore";

const bookSnippetLinks: BookSnippetLink[] = [
  {
    id: "groundness",
    href: "https://www.amazon.com/Practice-Groundedness-Transformative-Feeds-Not-Crushes-Your/dp/0593329899",
    text: "_groundness",
    meta: {
      external: true,
      recommended: true,
      finished: toISO8601("2021-12-10T08:00:00.000Z"),
    },
  },
  {
    id: "mentalModels",
    href: "https://fs.blog/tgmm/#volume_one",
    text: "_mental_models_1",
    meta: {
      external: true,
      finished: toISO8601("2022-05-17T07:00:00.000Z"),
    },
  },
  {
    id: "witcher",
    href: "https://www.amazon.com/Last-Wish-Introducing-Witcher/dp/0316029181",
    text: "_witcher",
    meta: {
      external: true,
      finished: toISO8601("2022-05-17T07:00:00.000Z"),
    },
  },
  {
    id: "kitchen",
    href: "https://www.amazon.com/Kitchen-Confidential-Updated-Adventures-Underbelly/dp/0060899220",
    text: "_kitchen",
    meta: {
      external: true,
      finished: toISO8601("2022-06-16T07:00:00.000Z"),
    },
  },
  {
    id: "ultralearning",
    href: "https://www.amazon.com/Ultralearning-Master-Outsmart-Competition-Accelerate/dp/006285268X",
    text: "_ultralearning",
    meta: {
      external: true,
      recommended: true,
      finished: toISO8601("2020-07-07T07:00:00.000Z"),
    },
  },
  {
    id: "strategic",
    href: "https://www.amazon.com/Strategic-Thinking-Complex-Problem-Solving/dp/0190463902",
    text: "_strategic",
    meta: {
      external: true,
      finished: toISO8601("2021-05-01T07:00:00.000Z"),
    },
  },
  {
    id: "worrying",
    href: "https://www.amazon.com/How-Stop-Worrying-Start-Living/dp/0671733354",
    text: "_worrying",
    meta: {
      external: true,
      finished: toISO8601("2020-05-01T07:00:00.000Z"),
    },
  },
  {
    id: "consolations",
    href: "https://www.amazon.com/Consolations-Nourishment-Underlying-Meaning-Everyday/dp/1786897636",
    text: "_consolations",
    meta: {
      external: true,
      recommended: true,
      finished: toISO8601("2021-11-26T07:00:00.000Z"),
    },
  },
  {
    id: "tao",
    href: "https://www.amazon.com/Tao-Te-Ching-Lao-Tzu/dp/B09YQF2SZ8/",
    text: "_tao",
    meta: {
      external: true,
      finished: toISO8601("2021-12-28T07:00:00.000Z"),
    },
  },
  {
    id: "psilocybin",
    href: "https://www.amazon.com/Psilocybin-Mushrooms-World-Identification-Guide/dp/0898158397",
    text: "_psilocybin",
    meta: {
      external: true,
      finished: toISO8601("2022-04-20T07:00:00.000Z"),
    },
  },
  {
    id: "mushrooms",
    href: "https://www.amazon.com/Growing-Gourmet-Medicinal-Mushrooms-Stamets/dp/1580081754",
    text: "_mushrooms",
    meta: {
      external: true,
      recommended: true,
      finished: toISO8601("2023-01-24T08:00:00.000Z"),
    },
  },
  {
    id: "social",
    href: "https://www.amazon.com/Superhuman-Social-Skills-Likeable-Building-ebook/dp/B015QA1250",
    text: "_social",
    meta: {
      external: true,
      finished: toISO8601("2023-01-15T08:00:00.000Z"),
    },
  },
  {
    id: "science",
    href: "https://press.stripe.com/the-art-of-doing-science-and-engineering",
    text: "_science",
    meta: {
      external: true,
      recommended: true,
      finished: toISO8601("2023-01-15T08:00:00.000Z"),
    },
  },
  {
    id: "mental",
    href: "https://fs.blog/tgmm/#volume_two",
    text: "_mental_models_2",
    meta: {
      external: true,
      finished: toISO8601("2023-01-15T08:00:00.000Z"),
    },
  },
  {
    id: "mycelium",
    href: "https://www.amazon.com/Mycelium-Running-Mushrooms-Help-World/dp/1580085792",
    text: "_mycelium",
    meta: {
      external: true,
      finished: toISO8601("2024-03-01T08:00:00.000Z"),
    },
  },
  {
    id: "thinking",
    href: "https://www.amazon.com/Called-Thinking-Harper-Perennial-Thought/dp/006090528X",
    text: "_thinking",
    meta: {
      external: true,
      recommended: true,
      finished: toISO8601("2024-12-15T08:00:00.000Z"),
    },
  },
  {
    id: "skeptic",
    href: "https://www.amazon.com/Skeptics-Guide-Future-Yesterdays-Tomorrow/dp/1538709546",
    text: "_skeptic",
    meta: {
      external: true,
      finished: toISO8601("2023-01-15T08:00:00.000Z"),
    },
  },
  {
    id: "aizgorri",
    href: "https://www.amazon.com/Tierra-Vasca-Aizgorri-mayorazgo-aventurero-ebook/dp/B01JK2CV2I",
    text: "_aizgorri",
    meta: {
      external: true,
      finished: toISO8601("2023-10-15T08:00:00.000Z"),
    },
  },
  {
    id: "labraz",
    href: "https://www.amazon.com/Tierra-Vasca-Aizgorri-mayorazgo-aventurero-ebook/dp/B01JK2CV2I",
    text: "_labraz",
    meta: {
      external: true,
      finished: toISO8601("2024-12-15T08:00:00.000Z"),
    },
  },
  {
    id: "creative",
    href: "https://www.amazon.com/Creative-Act-Way-Being/dp/0593652886",
    text: "_creative_act",
    meta: {
      external: true,
      finished: toISO8601("2024-12-15T08:00:00.000Z"),
    }, 
  }, 
  {
    id: "sensualHome",
    href: "https://archive.org/details/sensualhomeliber0000craw",
    text: "_sensual_home",
    meta: {
      external: true,
      recommended: true,
      finished: toISO8601("2024-03-01T08:00:00.000Z"),
    }, 
  },
  {
    id: "remoteWork",
    href: "https://www.amazon.com/Remote-Office-Required-Jason-Fried-ebook/dp/B00C0ALZ0W",
    text: "_remote_work",
    meta: {
      external: true,
      finished: toISO8601("2025-01-04T08:00:00.000Z"),
    },
  },
  {
    id: "ferryman",
    href: "https://www.amazon.com/Ferryman-NHB-Modern-Plays-ebook/dp/B0718XGKRY",
    text: "_ferryman",
    meta: {
      external: true,
      recommended: true,
      finished: toISO8601("2024-10-25T08:00:00.000Z"),
    },
  },
  {
    id: "portraitsFromMemory ",
    href: "https://archive.org/details/portraitsfrommem011249mbp",
    text: "_portraits_from_memory",
    meta: {
      external: true,
      finished: toISO8601("2024-09-15T08:00:00.000Z"),
    },
  },
  {
    id: "haltingState",
    href: "https://www.amazon.com/Halting-State-Charles-Stross-ebook/dp/B000W9180A",
    text: "_halting_state",
    meta: {
      external: true,
      finished: toISO8601("2025-03-15T08:00:00.000Z"),
    },
  },
  {
    id: "cienAñosDeSoledad",
    href: "https://www.amazon.com/soledad-Spanish-Gabriel-Garc%C3%ADa-M%C3%A1rquez-ebook/dp/B018RGALE8",
    text: "_cien_años",
    meta: {
      external: true,
      finished: toISO8601("2025-03-15T08:00:00.000Z"),
    },
  },
  {
    id: "rule34",
    href: "https://www.amazon.com/Rule-34-Halting-State-Book-ebook/dp/B004Y3I6XW",
    text: "_rule_34",
    meta: {
      external: true,
      finished: toISO8601("2025-12-15T08:00:00.000Z"),
    },
  },
  {
    id: "models",
    href: "https://fs.blog/tgmm/#volume_three",
    text: "_mental_models_3",
    meta: {
      external: true,
      finished: toISO8601("2025-12-15T08:00:00.000Z"),
    },
  },
  {
    id: "ggNoRemach",
    href: "https://www.harpercollins.com/products/good-game-no-rematch-mike-drucker",
    text: "_good_game_no_rematch",
    meta: {
      external: true,
      finished: toISO8601("2026-01-02T08:00:00.000Z"),
    },
  },
  {
    id: "nexus",
    href: "https://www.ynharari.com/book/nexus/",
    text: "_nexus",
    meta: {
      external: true,
    },
  },
    {
    id: "smallIsBeautiful",
    href: "https://www.alibris.com/search/books/isbn/9780061997761",
    text: "_small_is_beautiful",
    meta: {
      external: true,
      recommended: true
    },
  },
];

function hasFinishedAttribute(snippetLink: BookSnippetLink) {
  return (
    hasOwnProperty(snippetLink, "meta") &&
    hasOwnProperty(snippetLink.meta, "finished")
  );
}

const completedBooks = bookSnippetLinks.filter((snippetLink) => {
  return hasFinishedAttribute(snippetLink);
});

export const incompleteBooks = bookSnippetLinks.filter((snippetLink) => {
  return !hasFinishedAttribute(snippetLink);
});

export const completedBooksByYear = groupBy(
  completedBooks,
  (completedBook: BookSnippetLink) => {
    return new Date(completedBook.meta!.finished!).getFullYear();
  }
);
