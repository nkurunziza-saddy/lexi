import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import type { LexicalEditor } from "lexical";

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
