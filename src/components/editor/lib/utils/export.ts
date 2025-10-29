import type { LexicalEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $convertToMarkdownString } from "@lexical/markdown";
import { TRANSFORMERS } from "@lexical/markdown";
import { $getRoot } from "lexical";

function download(filename: string, text: string, mimeType = "text/plain") {
  const element = document.createElement("a");
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);

  element.setAttribute("href", url);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
  URL.revokeObjectURL(url);
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

export function exportAsJSON(editor: LexicalEditor) {
  editor.getEditorState().read(() => {
    const editorState = editor.getEditorState();
    const json = JSON.stringify(editorState.toJSON(), null, 2);
    download("editor-content.json", json, "application/json");
  });
}

export function copyAsPlainText(editor: LexicalEditor) {
  editor.getEditorState().read(() => {
    const text = $getRoot().getTextContent();
    navigator.clipboard.writeText(text);
  });
}
