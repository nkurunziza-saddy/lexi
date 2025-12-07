import { $generateHtmlFromNodes } from "@lexical/html";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import type { LexicalEditor } from "lexical";
import { $getRoot } from "lexical";

function download(filename: string, text: string, mimeType = "text/plain") {
  try {
    const blob = new Blob([text], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.setAttribute("href", url);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download file:", error);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:${mimeType};charset=utf-8,${encodeURIComponent(text)}`
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}

export function exportAsHTML(editor: LexicalEditor) {
  try {
    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      if (htmlString) {
        download("editor-content.html", htmlString, "text/html");
      } else {
        console.warn("No HTML content to export");
      }
    });
  } catch (error) {
    console.error("Failed to export as HTML:", error);
  }
}

export function exportAsMarkdown(editor: LexicalEditor) {
  try {
    editor.update(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      if (markdown) {
        download("editor-content.md", markdown, "text/markdown");
      } else {
        console.warn("No markdown content to export");
      }
    });
  } catch (error) {
    console.error("Failed to export as Markdown:", error);
  }
}

export async function copyAsPlainText(editor: LexicalEditor) {
  try {
    editor.getEditorState().read(() => {
      const text = $getRoot().getTextContent();
      if (text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).catch((error) => {
            console.error("Failed to copy to clipboard:", error);
            fallbackCopyTextToClipboard(text);
          });
        } else {
          fallbackCopyTextToClipboard(text);
        }
      } else {
        console.warn("No text content to copy");
      }
    });
  } catch (error) {
    console.error("Failed to copy text:", error);
  }
}

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (error) {
    console.error("Fallback copy failed:", error);
  }
  document.body.removeChild(textArea);
}
