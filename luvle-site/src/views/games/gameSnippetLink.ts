import { hasOwnProperty, toISO8601 } from "@luvle/utils";
import type { GameSnippet } from "./gameSnippets";

const gameSnippets: GameSnippet[] = [
  {
    title: "cube_up_title",
    content: "cube_up_content",
    image: "cube_up_gif",
    link: {
      id: "cube-up-link",
      href: "/games/cube-up",
    },
    meta: {
      released: toISO8601("2024-02-25T08:00:00.000Z"),
      retroLink: "/games/cube-up/retro"
    }
  }
];

function hasBeenReleased(snippetLink: GameSnippet) {
  return (
    hasOwnProperty(snippetLink, "meta") &&
    hasOwnProperty(snippetLink.meta, "released") &&
    new Date(snippetLink.meta.released!).getTime() <= Date.now()
  );
}

export const releasedGames = gameSnippets.filter((gameSnippet) => {
  return hasBeenReleased(gameSnippet);
});

export const inDevelopmentGames = gameSnippets.filter((gameSnippet) => {
  return !hasBeenReleased(gameSnippet);
});
