export interface BaseSnippetMeta {
  external?: boolean;
}

export interface SnippetMeta extends BaseSnippetMeta {}

export interface BaseSnippetLink {
  id: string;
  href: string;
}

export interface SnippetLink extends BaseSnippetLink {
  meta: SnippetMeta;
}

export interface BaseSnippet {
  title?: string;
  titleId?: string;
  content?: string;
  contentId?: string;
}

export interface Snippet extends BaseSnippet {
  links: SnippetLink[];
}