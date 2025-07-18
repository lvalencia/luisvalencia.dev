import { toISO8601, type ISO8601 } from "@luvle/utils";
import type { BaseSnippet, BaseSnippetMeta } from "../shared/snippets";

interface TalkSnippetMeta extends BaseSnippetMeta {
  date?: ISO8601;
}

export interface TalkSnippet extends BaseSnippet {
  image: string;
  presentation: string;
  notes: string;
  meta: TalkSnippetMeta;
}

const talkSnippets: TalkSnippet[] = [
  {
    title: "lean_times",
    content: "lean_times_content",
    image: "lean_times.png",
    presentation:  "presentation/lean_times.key",
    notes: "document/lean_times.pages",
    meta: {
      date: toISO8601("2025-02-04T20:00:00.000Z"),
    }
  },
  {
    title: "game_lifecycle",
    content: "game_lifecycle_content",
    image: "game_lifecycle.png",
    presentation:  "presentation/game_lifecycle.key",
    notes: "document/game_lifecycle.pages",
    meta: {
      date: toISO8601("2025-02-11T20:00:00.000Z"),
    }
  },
  {
    title: "career_planning",
    content: "career_planning_content",
    image: "career_planning.jpeg",
    presentation:  "presentation/career_planning.key",
    notes: "document/career_planning.pages",
    meta: {
      date: toISO8601("2025-03-13T20:00:00.000Z"),
    }
  },
]

function alreadyPresented(snippet: TalkSnippet): boolean {
  return new Date(snippet.meta.date!).getTime() <= Date.now()
}

export const givenTalks = talkSnippets.filter(alreadyPresented);
export const upcomingTalks = talkSnippets.filter((talkSnippet) => {
  return !alreadyPresented(talkSnippet);
})