import { Editor } from "@/components/editor";

const EditorPresets = {
  showToolbar: true,
  showFloatingToolbar: true,
  minHeight: "400px",
  placeholder: 'Start writing or use "/" for quick commands',
};

export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Editor {...EditorPresets} />
    </main>
  );
}
