import { nodes } from "./nodes";
import EditorTheme from "./editor-theme";

function onError(error: Error) {
  console.error("Lexical error:", error);
}

export const EDITOR_CONFIG = {
  namespace: "Editor",
  theme: EditorTheme,
  onError,
  nodes,
  // Limit undo/redo history to prevent memory leaks
  // ~100 states is reasonable for most use cases
  editorState: null,
  maxHistorySize: 100,
};
