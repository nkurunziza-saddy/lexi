import type { LexicalEditor } from "lexical";
import { $convertFromMarkdownString } from "@lexical/markdown";
import { TRANSFORMERS } from "@lexical/markdown";

export function importMarkdown(editor: LexicalEditor, file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string;
    if (text) {
      editor.update(() => {
        $convertFromMarkdownString(text, TRANSFORMERS);
      });
    }
  };
  reader.readAsText(file);
}
