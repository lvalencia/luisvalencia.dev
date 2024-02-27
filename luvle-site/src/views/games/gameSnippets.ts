import type { ISO8601 } from "@luvle/utils";
import type { BaseSnippet, BaseSnippetLink, BaseSnippetMeta } from "../shared/snippets";

export interface GameSnippetMeta extends BaseSnippetMeta {
  released?: ISO8601;
  retroLink?: string;
}

export interface GameSnippet extends BaseSnippet {
  image: string;
  link: BaseSnippetLink;
  meta: GameSnippetMeta;
}
