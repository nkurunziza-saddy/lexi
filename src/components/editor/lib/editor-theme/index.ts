import type { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  ltr: "text-left",
  rtl: "text-right",

  paragraph: "m-0 mb-2 leading-relaxed relative will-change-auto",

  heading: {
    h1: "text-3xl font-bold my-4 text-foreground will-change-auto",
    h2: "text-2xl font-semibold my-3 text-foreground/95 will-change-auto",
    h3: "text-xl font-medium my-3 text-foreground/90 will-change-auto",
    h4: "text-lg font-medium my-2 text-foreground/85 will-change-auto",
    h5: "text-base font-medium my-2 text-foreground/80 will-change-auto",
    h6: "text-sm font-medium my-2 text-foreground/80 will-change-auto",
  },

  quote:
    "ml-4 my-3 border-l-4 border-muted-foreground/30 pl-4 text-muted-foreground italic bg-muted/20 py-2 rounded-r will-change-auto",

  list: {
    nested: {
      listitem: "list-none",
    },
    olDepth: [
      "list-decimal list-outside ml-6",
      "list-[upper-alpha] list-outside ml-6",
      "list-[lower-alpha] list-outside ml-6",
      "list-[upper-roman] list-outside ml-6",
      "list-[lower-roman] list-outside ml-6",
    ],
    ol: "list-decimal list-outside my-2 ml-6 space-y-1",
    ul: "list-disc list-outside my-2 ml-6 space-y-1",
    listitem: "pl-2",
    listitemChecked:
      "relative flex items-center gap-2 list-none outline-none text-muted-foreground before:content-[''] before:flex-shrink-0 before:mt-0.5 before:size-4 before:rounded before:border before:border-primary before:bg-primary before:cursor-pointer before:flex before:items-center before:justify-center before:[content:'✓'] before:text-primary-foreground before:text-sm before:font-medium [&>span]:line-through",
    listitemUnchecked:
      "relative flex items-center gap-2 list-none outline-none before:content-[''] before:flex-shrink-0 before:mt-0.5 before:size-4 before:rounded before:border before:border-border/50 before:bg-muted before:cursor-pointer hover:before:border-border/70",
    checklist: "my-2 space-y-2",
  },

  text: {
    bold: "font-bold",
    capitalize: "capitalize",
    code: "bg-muted/90 dark:bg-muted/70 mx-0.5 px-1.5 py-0.5 rounded text-sm font-mono border border-border/50 text-foreground/90",
    highlight: "bg-yellow-200/40 dark:bg-yellow-900/30 px-1 rounded",
    italic: "italic",
    lowercase: "lowercase",
    strikethrough: "line-through opacity-70",
    subscript: "text-xs align-sub",
    superscript: "text-xs align-super",
    underline: "underline decoration-2 underline-offset-2",
    underlineStrikethrough: "underline line-through opacity-70",
    uppercase: "uppercase",
  },

  code: "relative block bg-muted/50 dark:bg-muted/30 rounded-lg overflow-x-auto my-4 text-sm leading-relaxed px-4 py-3 font-mono border border-border/50",
  codeHighlight: {
    atrule: "text-blue-600 dark:text-blue-400",
    attr: "text-blue-600 dark:text-blue-400",
    boolean: "text-purple-600 dark:text-purple-400",
    builtin: "text-green-600 dark:text-green-400",
    cdata: "text-gray-500 dark:text-gray-400",
    char: "text-green-600 dark:text-green-400",
    class: "text-red-600 dark:text-red-400",
    "class-name": "text-red-600 dark:text-red-400",
    comment: "text-gray-500 dark:text-gray-400 italic",
    constant: "text-purple-600 dark:text-purple-400",
    deleted: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700",
    doctype: "text-gray-500 dark:text-gray-400",
    entity: "text-orange-600 dark:text-orange-400",
    function: "text-red-600 dark:text-red-400",
    important: "text-yellow-600 dark:text-yellow-400 font-bold",
    inserted:
      "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700",
    keyword: "text-blue-600 dark:text-blue-400 font-medium",
    namespace: "text-yellow-600 dark:text-yellow-400",
    number: "text-purple-600 dark:text-purple-400",
    operator: "text-orange-600 dark:text-orange-400",
    prolog: "text-gray-500 dark:text-gray-400",
    property: "text-purple-600 dark:text-purple-400",
    punctuation: "text-gray-600 dark:text-gray-300",
    regex: "text-yellow-600 dark:text-yellow-400",
    selector: "text-green-600 dark:text-green-400",
    string: "text-green-600 dark:text-green-400",
    symbol: "text-purple-600 dark:text-purple-400",
    tag: "text-purple-600 dark:text-purple-400",
    unchanged:
      "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600",
    url: "text-orange-600 dark:text-orange-400 underline",
    variable: "text-yellow-600 dark:text-yellow-400",
  },

  link: "text-editor-accent hover:text-editor-primary/80 underline decoration-primary/50 hover:decoration-editor-primary transition-colors duration-200 cursor-pointer",

  table:
    "border-collapse table-fixed w-full max-w-[80vw] my-4 border border-border rounded-lg overflow-hidden",
  tableAddColumns:
    "absolute h-full w-5 top-0 -right-5 bg-editor-muted/70 hover:bg-editor-muted cursor-pointer border-0 rounded transition-all duration-200 opacity-0 hover:opacity-100 after:content-['+'] after:absolute after:flex after:items-center after:justify-center after:w-full after:h-full after:text-editor-muted-foreground after:text-lg after:font-bold",
  tableAddRows:
    "absolute w-full h-5 left-0 -bottom-5 bg-editor-muted/70 hover:bg-editor-muted cursor-pointer border-0 rounded transition-all duration-200 opacity-0 hover:opacity-100 after:content-['+'] after:absolute after:flex after:items-center after:justify-center after:w-full after:h-full after:text-editor-muted-foreground after:text-lg after:font-bold",
  tableAlignment: {
    center: "mx-auto",
    right: "ml-auto",
  },
  tableCell:
    "border border-editor-border/60 p-3 align-top text-left relative outline-none overflow-auto min-w-[7.5rem] bg-editor-background md:min-w-[5rem] md:p-2 md:text-sm",
  tableCellActionButton:
    "absolute top-0 right-0 z-10 w-6 h-6 bg-editor-background border border-editor-border rounded-bl hover:bg-editor-muted transition-colors duration-200 flex items-center justify-center text-xs text-editor-muted-foreground hover:text-editor-foreground cursor-pointer opacity-0 group-hover:opacity-100",
  tableCellActionButtonContainer:
    "absolute top-0 right-0 w-6 h-6 pointer-events-auto",
  tableCellHeader:
    "bg-editor-muted/30 font-semibold text-editor-foreground border-b-2 border-editor-border",
  tableCellResizer:
    "absolute right-0 top-0 h-full w-1 bg-transparent cursor-col-resize hover:bg-editor-primary/50 transition-colors duration-200",
  tableCellSelected: "bg-editor-primary/10 outline-2 outline-editor-primary",
  tableFrozenColumn:
    "sticky left-0 z-20 bg-editor-background border-r-2 border-editor-border shadow-sm",
  tableFrozenRow:
    "sticky top-0 z-10 bg-editor-background border-b-2 border-editor-border shadow-sm",
  tableRowStriping: "even:bg-editor-muted/20 odd:bg-editor-background",
  tableScrollableWrapper:
    "overflow-x-auto border border-editor-border rounded-lg my-0 mb-6",
  tableSelected: "outline-2 outline-editor-primary",
  tableSelection:
    "bg-editor-primary/10 border-2 border-editor-primary/50 rounded",

  hr: "my-4 border relative after:content-[''] after:block",
  hrSelected: "outline-2 outline-primary rounded select-none",

  hashtag:
    "bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 rounded-sm font-medium",

  blockCursor:
    "block absolute pointer-events-none after:content-[''] after:absolute after:block after:-top-0.5 after:w-5 after:border-t-2 after:border-foreground after:animate-[cursor-blink_1.1s_steps(2,start)_infinite]",

  characterLimit: "bg-red-200 dark:bg-red-900/50",

  mark: "bg-yellow-200/40 px-1 rounded",
  markOverlap: "bg-yellow-300/60 px-1 rounded",

  embedBlock: {
    base: "select-none my-2",
    focus: "outline-2 outline-editor-primary rounded",
  },

  layoutContainer: "grid gap-4 my-4",
  layoutItem:
    "border border-dashed border-border p-4 min-w-0 max-w-full rounded-lg",

  autocomplete: "text-editor-muted-foreground bg-muted/50 px-2 py-1 rounded",

  tab: "relative inline-block no-underline w-[4ch]",

  specialText:
    "bg-yellow-300/60 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100 px-1 rounded font-medium",

  image: "max-w-full h-auto rounded-lg my-4 shadow-sm",
  inlineImage: "inline-block max-h-6 rounded",
};

export default theme;
