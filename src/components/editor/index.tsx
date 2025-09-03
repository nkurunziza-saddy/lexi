import "@/styles/editor.css";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { motion } from "motion/react";

import { nodes } from "@/lib/editor/nodes";
import { Toolbar } from "./toolbar";
import { FloatingToolbar } from "./floating-toolbar";

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "text-muted-foreground/70",
  paragraph: "mb-3 leading-relaxed",
  quote:
    "border-l-4 border-gradient-to-b from-primary/60 to-primary/20 pl-6 py-2 italic text-muted-foreground/90 my-6 bg-accent/20 rounded-r-lg",
  heading: {
    h1: "text-4xl font-bold mb-6 mt-8 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent",
    h2: "text-3xl font-semibold mb-4 mt-6 text-foreground/95",
    h3: "text-2xl font-medium mb-3 mt-5 text-foreground/90",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal ml-6 mb-4 space-y-1",
    ul: "list-disc ml-6 mb-4 space-y-1",
    listitem: "mb-2 leading-relaxed",
    checklist: "list-none ml-0 mb-4 space-y-2",
    listitemChecked:
      "flex items-start gap-3 mb-2 text-muted-foreground/70 line-through transition-all duration-200",
    listitemUnchecked:
      "flex items-start gap-3 mb-2 transition-all duration-200",
  },
  text: {
    bold: "font-semibold text-foreground",
    italic: "italic",
    underline: "underline decoration-2 underline-offset-2",
    code: "bg-accent/80 px-2 py-1 rounded-md text-sm font-mono border shadow-sm",
    highlight: "px-1 py-0.5 rounded-sm",
    subscript: "text-xs align-sub",
    superscript: "text-xs align-super",
  },
  code: "bg-accent/60 p-4 rounded-xl font-mono text-sm my-6 overflow-x-auto block border shadow-sm backdrop-blur-sm",
  link: "text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 underline-offset-2 transition-all duration-200 cursor-pointer",
  table:
    "border-collapse table-auto w-full my-6 border border-border/60 rounded-lg overflow-hidden shadow-sm",
  tableCell:
    "border border-border/40 px-4 py-3 min-w-[100px] transition-colors hover:bg-accent/20",
  tableCellHeader:
    "border border-border/40 px-4 py-3 bg-accent/60 font-semibold min-w-[100px] backdrop-blur-sm",
  hr: "my-8 border-t border-gradient-to-r from-transparent via-border to-transparent",
};

function onError(error: Error) {
  console.error("Lexical error:", error);
}

export function Editor() {
  const initialConfig = {
    namespace: "PremiumEditor",
    theme,
    onError,
    nodes,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <motion.div
        className="relative"
        initial={{ scale: 0.98 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Toolbar />
        <div className="relative max-w-6xl mx-auto my-6">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="p-8 outline-none prose prose-lg max-w-none transition-all duration-300"
                style={{
                  minHeight: "600px",
                  caretColor: "hsl(var(--primary))",
                  lineHeight: "1.7",
                }}
              />
            }
            placeholder={
              <motion.div
                className="absolute top-8 left-8 text-muted-foreground/60 pointer-events-none select-none text-lg"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Start writing your masterpiece...
              </motion.div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <LinkPlugin />
          <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
          <HorizontalRulePlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <FloatingToolbar />
        </div>
      </motion.div>
    </LexicalComposer>
  );
}
