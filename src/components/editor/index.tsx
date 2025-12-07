"use client";
import { TRANSFORMERS } from "@lexical/markdown";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import type { EditorState, LexicalEditor } from "lexical";
import type React from "react";
import { useCallback, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { EDITOR_CONFIG } from "./lib/configs";
import type { EditorProps } from "./lib/types/editor";
import { FloatingToolbar } from "./plugins/floating-toolbar";
import SlashCommandPlugin from "./plugins/slash-command";
import TableHoverActionsPlugin from "./plugins/table-hover-actions";
import SpeechToTextPlugin from "./plugins/speech-to-text";
import { Toolbar } from "./plugins/toolbar";
import { debounce } from "./lib/debounce";

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
  const editorStyle = useMemo(
    () => ({
      minHeight,
      maxHeight,
      caretColor: "hsl(var(--editor-primary))",
      lineHeight: "1.7",
    }),
    [minHeight, maxHeight]
  );

  return (
    <div className="relative w-full">
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={cn(
              "p-6 md:p-8",
              "outline-none",
              "max-w-none",
              "w-full",
              "min-h-[inherit]",
              "will-change-auto",
              className
            )}
            readOnly={readOnly}
            style={editorStyle}
            aria-label="Rich text editor"
            aria-multiline="true"
            role="textbox"
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={
          <div className="absolute top-6 md:top-8 left-6 md:left-8 text-muted-foreground/60 pointer-events-none select-none text-base md:text-lg">
            {placeholder}
          </div>
        }
      />
    </div>
  );
}

function EditorPlugins({
  showFloatingToolbar = true,
  enableSpeechToText = false,
  customPlugins = [],
  onChange = () => {},
}: {
  showFloatingToolbar?: boolean;
  enableSpeechToText?: boolean;
  customPlugins?: React.ComponentType[];
  onChange: (
    editorState: EditorState,
    editor: LexicalEditor,
    tags: Set<string>
  ) => void;
}) {
  const pluginElements = useMemo(
    () => customPlugins.map((Plugin, index) => <Plugin key={index} />),
    [customPlugins]
  );

  return (
    <>
      <HistoryPlugin />
      <AutoFocusPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <LinkPlugin />
      <HorizontalRulePlugin />
      {/* table plugins - order matters */}
      <TablePlugin
        hasCellBackgroundColor={true}
        hasCellMerge={true}
        hasTabHandler={true}
      />
      <TableHoverActionsPlugin />
      <SlashCommandPlugin />
      {enableSpeechToText && <SpeechToTextPlugin />}
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <OnChangePlugin onChange={onChange} />
      {showFloatingToolbar && <FloatingToolbar />}
      {pluginElements}
    </>
  );
}

export function Editor({
  initialValue = "",
  placeholder = 'Start writing or use "/" for quick commands',
  className = "",
  minHeight = "400px",
  maxHeight,
  showToolbar = false,
  showFloatingToolbar = true,
  enableSpeechToText = false,
  readOnly = false,
  onChange,
  plugins = [],
}: EditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const initialConfig = useMemo(
    () => ({
      ...EDITOR_CONFIG,
      editorState: initialValue?.trim() || null,
      editable: !readOnly,
    }),
    [initialValue, readOnly]
  );

  const handleEditorChange = useCallback(
    debounce((editorState: EditorState) => {
      const jsonState = editorState.toJSON();
      const jsonString = JSON.stringify(jsonState);
      onChangeRef.current?.(jsonString);
    }, 300),
    []
  );

  return (
    <div className={cn("w-full", className)}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="relative overflow-hidden w-full">
          {showToolbar && <Toolbar enableSpeechToText={enableSpeechToText} />}

          <EditorContent
            maxHeight={maxHeight}
            minHeight={minHeight}
            placeholder={placeholder}
            readOnly={readOnly}
            className={className}
          />

          <EditorPlugins
            customPlugins={plugins}
            onChange={handleEditorChange}
            showFloatingToolbar={showFloatingToolbar}
            enableSpeechToText={enableSpeechToText}
          />
        </div>
      </LexicalComposer>
    </div>
  );
}
