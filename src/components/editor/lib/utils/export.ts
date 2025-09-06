import type { LexicalEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $convertToMarkdownString } from "@lexical/markdown";
import { TRANSFORMERS } from "@lexical/markdown";
import { $getRoot } from "lexical";

function download(filename: string, text: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function exportAsHTML(editor: LexicalEditor) {
  editor.update(() => {
    const htmlString = $generateHtmlFromNodes(editor, null);
    download("editor-content.html", htmlString);
  });
}

export function exportAsMarkdown(editor: LexicalEditor) {
  editor.update(() => {
    const markdown = $convertToMarkdownString(TRANSFORMERS);
    download("editor-content.md", markdown);
  });
}

export function copyAsPlainText(editor: LexicalEditor) {
  editor.getEditorState().read(() => {
    const text = $getRoot().getTextContent();
    navigator.clipboard.writeText(text);
  });
}
