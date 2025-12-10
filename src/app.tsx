import { Editor } from "./components/editor";

function App() {
  return (
    <Editor
      showToolbar
      showFloatingToolbar
      enableSpeechToText
      placeholder="Start writing..."
      // onChange={(value) => console.log(value)}
    />
  );
}

export default App;
