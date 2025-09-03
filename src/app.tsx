import { useState } from "react";
import { Editor } from "@/components/editor";

const EditorPresets = {
  minimal: {
    showToolbar: true,
    showFloatingToolbar: false,
    minHeight: "200px",
    placeholder: "Type something...",
  },
  full: {
    showToolbar: true,
    showFloatingToolbar: true,
    minHeight: "400px",
    placeholder: "Start writing...",
  },
  notes: {
    showToolbar: false,
    showFloatingToolbar: true,
    minHeight: "300px",
    placeholder: "Take your notes here...",
  },
};

export default function App() {
  const [content, setContent] = useState("");

  return (
    <div className="">
      <Editor
        {...EditorPresets.full}
        onChange={setContent}
        className="border-primary/20"
      />

      {content && (
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <h4 className="font-medium mb-2">Editor Content (JSON):</h4>
          <pre className="text-xs overflow-auto max-h-32 text-muted-foreground">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}
