import type { Snippet, SnippetLink } from "../shared/snippets";

export interface HomeSnippetLink extends SnippetLink {
  text: string;
}

export interface HomeSnippet extends Snippet {
  keypath: string;
  links: HomeSnippetLink[];
}