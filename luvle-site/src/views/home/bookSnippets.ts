import type { ISO8601 } from "@luvle/utils";
import type { Snippet, SnippetLink, SnippetMeta } from "../shared/snippets";

export interface BookSnippetMeta extends SnippetMeta {
  recommended?: boolean;
  finished?: ISO8601;
}

export interface BookSnippetLink extends SnippetLink {
  meta: BookSnippetMeta;
  text: string;
}

export interface BookSnippet extends Snippet {
  keypath: string;
  links: BookSnippetLink[];
}
