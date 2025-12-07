import EditorTheme from "./editor-theme";
import { nodes } from "./nodes";

function onError(error: Error) {
  console.error("Lexical error:", error);
}

export const EDITOR_CONFIG = {
  namespace: "Editor",
  theme: EditorTheme,
  onError,
  nodes,
};
