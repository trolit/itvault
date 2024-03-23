import { inject } from "vue";
import type MarkdownIt from "markdown-it";

export const useMarkdownService = (): MarkdownIt => {
  const markdown: MarkdownIt | undefined = inject("markdown");

  if (!markdown) {
    throw Error("Markdown is not available!");
  }

  return markdown;
};
