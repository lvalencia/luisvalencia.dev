import { hasOwnProperty } from "@luvle/utils";
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
    }
  }
];

function hasReleasedAttribute(snippetLink: GameSnippet) {
  return (
    hasOwnProperty(snippetLink, "meta") &&
    hasOwnProperty(snippetLink.meta, "released")
  );
}

export const releasedGames = gameSnippets.filter((gameSnippet) => {
  return hasReleasedAttribute(gameSnippet);
});

export const inDevelopmentGames = gameSnippets.filter((gameSnippet) => {
  return !hasReleasedAttribute(gameSnippet);
});
