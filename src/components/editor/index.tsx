import type React from "react";
import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import EditorTheme from "@/lib/editor/theme";
import { EDITOR_CONFIG, ANIMATION_CONFIG } from "@/lib/editor/constants";
import { Toolbar } from "@/components/editor/toolbar";
import { FloatingToolbar } from "@/components/editor/floating-toolbar";
import type { EditorProps } from "@/types/editor";
import { $getRoot, type EditorState, type LexicalEditor } from "lexical";

function EditorContent({
  placeholder = "Start writing ...",
  className = "",
  minHeight = "400px",
  maxHeight,
  readOnly = false,
}: Pick<
  EditorProps,
  "placeholder" | "className" | "minHeight" | "maxHeight" | "readOnly"
>) {
  const editorStyle = {
    minHeight,
    maxHeight,
    caretColor: "hsl(var(--editor-primary))",
    lineHeight: "1.7",
  };

  return (
    <div className="relative">
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={`
              p-6 md:p-8 
              outline-none 
              prose prose-lg max-w-none 
              transition-all duration-300
              ${className}
            `}
            style={editorStyle}
            readOnly={readOnly}
          />
        }
        placeholder={
          <motion.div
            className="absolute top-6 md:top-8 left-6 md:left-8 text-muted-foreground/60 pointer-events-none select-none text-base md:text-lg"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={ANIMATION_CONFIG.smooth}
          >
            {placeholder}
          </motion.div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </div>
  );
}

function EditorPlugins({
  showFloatingToolbar = true,
  customPlugins = [],
  onChange = () => {},
}: {
  showFloatingToolbar?: boolean;
  customPlugins?: React.ComponentType[];
  onChange: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>
  ) => void;
}) {
  return (
    <>
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <LinkPlugin />
      <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
      <HorizontalRulePlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <OnChangePlugin onChange={onChange} />
      {showFloatingToolbar && <FloatingToolbar />}
      {customPlugins.map((Plugin, index) => (
        <Plugin key={index} />
      ))}
    </>
  );
}

export function Editor({
  initialValue = "",
  placeholder = "Start writing your masterpiece...",
  className = "",
  minHeight = "400px",
  maxHeight,
  showToolbar = false,
  showFloatingToolbar = true,
  readOnly = false,
  onChange,
  plugins = [],
}: EditorProps) {
  const [editorState, setEditorState] = useState<string>(initialValue);

  const initialConfig = {
    ...EDITOR_CONFIG,
    editorState: initialValue ? initialValue : null,
    theme: EditorTheme,
    editable: !readOnly,
  };

  const handleEditorChange = useCallback(
    (editorState: any) => {
      const jsonState = editorState.toJSON();
      const jsonString = JSON.stringify(jsonState);

      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent();
        console.log("Plain text:", textContent);
      });

      setEditorState(jsonString);
      onChange?.(jsonString);
    },
    [onChange]
  );

  return (
    <div className={`w-full ${className}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className=" relative overflow-hidden">
          {showToolbar && <Toolbar />}

          <EditorContent
            placeholder={placeholder}
            minHeight={minHeight}
            maxHeight={maxHeight}
            readOnly={readOnly}
          />

          <EditorPlugins
            showFloatingToolbar={showFloatingToolbar}
            customPlugins={plugins}
            onChange={handleEditorChange}
          />
        </div>
      </LexicalComposer>
    </div>
  );
}
