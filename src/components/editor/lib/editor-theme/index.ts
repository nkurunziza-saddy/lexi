import type { EditorThemeClasses } from "lexical";

export const theme: EditorThemeClasses = {
  ltr: "text-left",
  rtl: "text-right",

  paragraph: "m-0 mt-5 first:mt-0 leading-relaxed relative",

  heading: {
    h1: "text-3xl font-bold mt-12 mb-4 text-foreground first:mt-0",
    h2: "text-2xl font-bold mt-10 mb-3 text-foreground first:mt-0",
    h3: "text-xl font-semibold mt-8 mb-3 text-foreground first:mt-0",
    h4: "text-lg font-semibold mt-8 mb-2 text-foreground first:mt-0",
    h5: "text-base font-semibold mt-8 mb-2 text-foreground first:mt-0",
    h6: "text-sm font-semibold mt-8 mb-2 text-foreground first:mt-0",
  },

  quote:
    "pl-4 py-1.5 my-6 border-l-4 border-muted-foreground/30 text-muted-foreground italic bg-muted/20 rounded-r will-change-auto first:mt-0",

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
    ol: "list-decimal list-outside my-6 ml-6 space-y-1 first:mt-0",
    ul: "list-disc list-outside my-6 ml-6 space-y-1 first:mt-0",
    listitem: "pl-2 leading-relaxed",
    listitemChecked:
      "relative flex items-center gap-2 list-none outline-none text-muted-foreground/50 line-through before:content-[''] before:flex-shrink-0 before:mt-1 before:size-4 before:rounded-[0.25rem] before:border before:border-foreground before:bg-foreground before:cursor-pointer before:flex before:items-center before:justify-center before:[content:'✓'] before:text-background before:text-xs before:font-bold",
    listitemUnchecked:
      "relative flex items-center gap-2 list-none outline-none before:content-[''] before:flex-shrink-0 before:mt-1 before:size-4 before:rounded-[0.25rem] before:border before:border-border before:bg-muted before:cursor-pointer hover:before:border-foreground/50 transition-colors duration-80",
    checklist: "my-6 space-y-2 pl-1 first:mt-0",
  },

  text: {
    bold: "font-bold",
    capitalize: "capitalize",
    code: "bg-muted text-foreground border border-border mx-0.5 px-1 py-0.5 rounded-[0.375rem] text-[0.875em] font-mono leading-snug",
    highlight: "bg-yellow-200/40 dark:bg-yellow-900/30 px-1 rounded",
    italic: "italic",
    lowercase: "lowercase",
    strikethrough: "line-through opacity-70",
    subscript: "text-xs align-sub",
    superscript: "text-xs align-super",
    underline: "underline decoration-auto underline-offset-auto",
    underlineStrikethrough: "underline line-through opacity-70",
    uppercase: "uppercase",
  },

  code: "relative block bg-muted/80 dark:bg-muted/60 rounded-md overflow-x-auto my-4 text-sm leading-relaxed px-4 py-3 font-mono border border-border/50 first:mt-0",
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

  link: "text-editor-link underline cursor-pointer",

  table:
    "border-collapse table-fixed w-full max-w-full my-8 border border-editor-border rounded-md overflow-hidden border-separate border-spacing-0 [&_tr:last-child_td]:border-b-0 [&_tr:last-child_th]:border-b-0",
  tableAddColumns:
    "absolute h-full w-5 top-0 -right-5 hover:bg-editor-muted cursor-pointer border-0 rounded transition-all duration-200 opacity-0 hover:opacity-100 after:content-['+'] after:absolute after:flex after:items-center after:justify-center after:w-full after:h-full after:text-editor-muted-foreground after:text-lg after:font-bold",
  tableAddRows:
    "absolute w-full h-5 left-0 -bottom-5 hover:bg-editor-muted cursor-pointer border-0 rounded transition-all duration-200 opacity-0 hover:opacity-100 after:content-['+'] after:absolute after:flex after:items-center after:justify-center after:w-full after:h-full after:text-editor-muted-foreground after:text-lg after:font-bold",
  tableAlignment: {
    center: "mx-auto",
    right: "ml-auto",
  },
  tableCell:
    "border-b border-r border-editor-border last:border-r-0 p-3 align-top text-left relative outline-none overflow-auto min-w-[7.5rem] md:min-w-[5rem] md:p-2 md:text-sm [&_p]:mt-0",
  tableCellActionButton:
    "absolute top-0 right-0 z-10 w-6 h-6 bg-editor-background border border-editor-border rounded-bl hover:bg-editor-muted transition-colors duration-200 flex items-center justify-center text-xs text-editor-muted-foreground hover:text-editor-foreground cursor-pointer opacity-0 group-hover:opacity-100",
  tableCellActionButtonContainer:
    "absolute top-0 right-0 w-6 h-6 pointer-events-auto",
  tableCellHeader:
    "border-b border-r border-editor-border last:border-r-0 p-3 align-top text-left relative outline-none overflow-auto min-w-[7.5rem] md:min-w-[5rem] md:p-2 md:text-sm font-normal [&_p]:mt-0",
  tableCellResizer:
    "absolute right-0 top-0 h-full w-1 bg-transparent cursor-col-resize hover:bg-editor-primary/50 transition-colors duration-200",
  tableCellSelected: "bg-editor-primary/10 outline-2 outline-editor-primary",
  tableFrozenColumn:
    "sticky left-0 z-20 bg-editor-background border border-editor-border",
  tableFrozenRow:
    "sticky top-0 z-10 bg-editor-background border border-editor-border",
  tableRowStriping: "",
  tableScrollableWrapper:
    "overflow-x-auto border border-editor-border rounded-md my-0 mb-6",
  tableSelected: "outline-2 outline-editor-primary",
  tableSelection:
    "bg-editor-primary/10 border-2 border-editor-primary/50 rounded",

  hr: "my-9 border-none h-px bg-border",
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
    "border border-dashed border-border p-4 min-w-0 max-w-full rounded-md",

  autocomplete: "text-editor-muted-foreground bg-muted/50 px-2 py-1 rounded",

  tab: "relative inline-block no-underline w-[4ch]",

  specialText:
    "bg-yellow-300/60 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100 px-1 rounded font-medium",

  image:
    "max-w-full h-auto rounded-[0.25rem] my-8 transition-[outline] outline-[3px] outline-transparent",
  inlineImage: "inline-block max-h-6 rounded",
};

export default theme;
