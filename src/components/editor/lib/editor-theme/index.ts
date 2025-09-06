import type { EditorThemeClasses } from "lexical";
import "../../../../index.css";
import "./editor-theme.css";

export const theme: EditorThemeClasses = {
  ltr: "text-left",
  rtl: "text-right",

  paragraph: "m-0 mb-2 leading-relaxed relative",

  heading: {
    h1: "text-3xl font-bold my-4 text-foreground",
    h2: "text-2xl font-semibold my-3 text-foreground/95",
    h3: "text-xl font-medium my-3 text-foreground/90",
    h4: "text-lg font-medium my-2 text-foreground/85",
    h5: "text-base font-medium my-2 text-foreground/80",
    h6: "text-sm font-medium my-2 text-foreground/80",
  },

  quote:
    "ml-4 my-3 border-l-4 border-muted-foreground/30 pl-4 text-muted-foreground italic bg-muted/20 py-2 rounded-r",

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
    listitemChecked: "lexical-checklist-item lexical-checklist-item--checked",
    listitemUnchecked:
      "lexical-checklist-item lexical-checklist-item--unchecked",
    checklist: "my-2 space-y-2",
  },

  text: {
    bold: "font-bold",
    capitalize: "capitalize",
    code: "bg-muted/80 mx-1 px-1.5 py-0.5 rounded text-sm font-mono border border-border",
    highlight: "bg-yellow-200/40 px-1 rounded",
    italic: "italic",
    lowercase: "lowercase",
    strikethrough: "line-through opacity-70",
    subscript: "text-xs align-sub",
    superscript: "text-xs align-super",
    underline: "underline decoration-2 underline-offset-2",
    underlineStrikethrough: "underline line-through opacity-70",
    uppercase: "uppercase",
  },

  code: "lexical-code-block",
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

  link: "text-primary hover:text-primary/80 underline decoration-primary/50 hover:decoration-primary transition-colors duration-200 cursor-pointer",

  table:
    "border-collapse table-fixed w-full max-w-[80vw] my-4 border border-border rounded-lg overflow-hidden",
  tableAddColumns: "lexical-table-add-columns",
  tableAddRows: "lexical-table-add-rows",
  tableAlignment: {
    center: "mx-auto",
    right: "ml-auto",
  },
  tableCell: "lexical-table-cell",
  tableCellActionButton: "lexical-table-cell-action-button",
  tableCellActionButtonContainer: "lexical-table-cell-action-button-container",
  tableCellHeader: "lexical-table-cell-header",
  tableCellResizer: "lexical-table-cell-resizer",
  tableCellSelected: "lexical-table-cell-selected",
  tableFrozenColumn: "lexical-table-frozen-column",
  tableFrozenRow: "lexical-table-frozen-row",
  tableRowStriping: "lexical-table-row-striping",
  tableScrollableWrapper: "overflow-x-auto my-0 mb-6",
  tableSelected: "outline-2 outline-editor-primary",
  tableSelection: "lexical-table-selection",

  hr: "lexical-hr",
  hrSelected: "lexical-hr-selected",

  indent: "lexical-indent",

  hashtag:
    "bg-blue-100/60 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 rounded-sm font-medium",

  blockCursor: "lexical-block-cursor",

  characterLimit: "bg-red-200 dark:bg-red-900/50",

  mark: "bg-yellow-200/40 px-1 rounded",
  markOverlap: "bg-yellow-300/60 px-1 rounded",

  embedBlock: {
    base: "select-none my-2",
    focus: "outline-2 outline-primary rounded",
  },

  layoutContainer: "grid gap-4 my-4",
  layoutItem:
    "border border-dashed border-border p-4 min-w-0 max-w-full rounded-lg",

  autocomplete: "text-muted-foreground bg-muted/50 px-2 py-1 rounded",

  tab: "lexical-tab-node",

  specialText:
    "bg-yellow-300/60 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-100 px-1 rounded font-medium",

  image: "max-w-full h-auto rounded-lg my-4 shadow-sm",
  inlineImage: "inline-block max-h-6 rounded",
};

export default theme;
