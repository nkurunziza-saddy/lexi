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
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Lexi Editor</h1>
          <p className="text-muted-foreground mt-2">
            A modern, extensible rich text editor.
          </p>
        </header>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <Editor
            {...EditorPresets.full}
            onChange={setContent}
            className="border-0 shadow-none"
          />
        </div>

        {content && (
          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-2">Editor Content (JSON):</h4>
            <pre className="text-xs overflow-auto max-h-48 text-muted-foreground bg-background p-4 rounded-md">
              {JSON.stringify(JSON.parse(content), null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}