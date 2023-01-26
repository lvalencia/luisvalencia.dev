import type { ISO8601 } from "@/helpers/date";

interface BaseSnippetMeta {
  external?: boolean;
}

interface SnippetMeta extends BaseSnippetMeta {}

export interface BaseSnippetLink {
  id: string;
  href: string;
  text: string;
}

interface SnippetLink extends BaseSnippetLink {
  meta: SnippetMeta;
}

interface BaseSnippet {
  keypath: string;
  title?: string;
  titleId?: string;
  content?: string;
  contentId?: string;
}

export interface Snippet extends BaseSnippet {
  links: SnippetLink[];
}

export interface BookSnippetMeta extends BaseSnippetMeta {
  recommended?: boolean;
  finished?: ISO8601;
}

export interface BookSnippetLink extends BaseSnippetLink {
  meta: BookSnippetMeta;
}

export interface BookSnippet extends BaseSnippet {
  links: BookSnippetLink[];
}
