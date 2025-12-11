import { useCallback, useState } from "react";
import { Editor } from "./components/editor";

const STORAGE_KEY = "lexi-editor-content";

function getInitialContent(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function App() {
  const [initialValue] = useState(getInitialContent);

  const handleChange = useCallback((value: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, []);

  return (
    <Editor
      showToolbar
      showFloatingToolbar
      enableSpeechToText
      placeholder="Start writing..."
      initialValue={initialValue}
      onChange={handleChange}
    />
  );
}

export default App;
