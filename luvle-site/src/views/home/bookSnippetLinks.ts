import { toISO8601, hasOwnProperty } from "@luvle/utils";
import type { BookSnippetLink } from "./snippets";
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
    },
  },
  {
    id: "mental",
    href: "https://fs.blog/tgmm/#volume_two",
    text: "_mental_models_2",
    meta: {
      external: true,
    },
  },
  {
    id: "mycelium",
    href: "https://www.amazon.com/Mycelium-Running-Mushrooms-Help-World/dp/1580085792",
    text: "_mycelium",
    meta: {
      external: true,
    },
  },
  {
    id: "thinking",
    href: "https://www.amazon.com/Called-Thinking-Harper-Perennial-Thought/dp/006090528X",
    text: "_thinking",
    meta: {
      external: true,
      recommended: true,
    },
  },
  {
    id: "skeptic",
    href: "https://www.amazon.com/Skeptics-Guide-Future-Yesterdays-Tomorrow/dp/1538709546",
    text: "_skeptic",
    meta: {
      external: true,
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
