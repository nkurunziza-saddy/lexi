import type { EditorThemeClasses } from "lexical";
import "./editor-theme.css";

export const theme: EditorThemeClasses = {
  ltr: "text-left",
  rtl: "text-right",

  paragraph: "mb-4 leading-relaxed relative",

  heading: {
    h1: "text-4xl font-bold mb-6 mt-8 text-foreground",
    h2: "text-3xl font-semibold mb-4 mt-6 text-foreground/95",
    h3: "text-2xl font-medium mb-3 mt-5 text-foreground/90",
    h4: "text-xl font-medium mb-2 mt-4 text-foreground/85",
    h5: "text-lg font-medium mb-2 mt-4 text-foreground/80",
    h6: "text-base font-medium mb-2 mt-4 text-foreground/80",
  },

  quote:
    "pl-4 border-l-4 border-muted-foreground/40 text-muted-foreground italic my-4 ml-5 mb-4 text-sm",

  list: {
    nested: {
      listitem: "list-none before:hidden after:hidden",
    },
    olDepth: [
      "list-decimal list-outside p-0 m-0",
      "list-[upper-alpha] list-outside p-0 m-0",
      "list-[lower-alpha] list-outside p-0 m-0",
      "list-[upper-roman] list-outside p-0 m-0",
      "list-[lower-roman] list-outside p-0 m-0",
    ],
    ol: "list-decimal list-outside p-0 m-0 mb-4",
    ul: "list-disc list-outside p-0 m-0 mb-4",
    listitem: "mx-8",
    listitemChecked: "lexical-checklist-item lexical-checklist-item--checked",
    listitemUnchecked:
      "lexical-checklist-item lexical-checklist-item--unchecked",
    checklist: "space-y-2",
  },

  text: {
    bold: "font-bold",
    capitalize: "capitalize",
    code: "bg-muted/80 px-2 py-1 rounded-md text-sm font-mono border shadow-sm",
    highlight: "bg-yellow-200/30 border-b-2 border-yellow-300/50 px-1 py-0.5",
    italic: "italic",
    lowercase: "lowercase",
    strikethrough: "line-through",
    subscript: "text-xs align-sub",
    superscript: "text-xs align-super",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
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
    comment: "text-gray-500 dark:text-gray-400",
    constant: "text-purple-600 dark:text-purple-400",
    deleted: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700",
    doctype: "text-gray-500 dark:text-gray-400",
    entity: "text-orange-600 dark:text-orange-400",
    function: "text-red-600 dark:text-red-400",
    important: "text-yellow-600 dark:text-yellow-400",
    inserted:
      "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700",
    keyword: "text-blue-600 dark:text-blue-400",
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
    url: "text-orange-600 dark:text-orange-400",
    variable: "text-yellow-600 dark:text-yellow-400",
  },

  link: "text-primary hover:underline cursor-pointer",

  table:
    "border-collapse border-spacing-0 table-fixed w-fit my-6 overflow-auto",
  tableAddColumns: "lexical-table-add-columns",
  tableAddRows: "lexical-table-add-rows",
  tableAlignment: {
    center: "mx-auto",
    right: "ml-auto",
  },
  tableCell:
    "border border-border px-2 py-1.5 w-20 align-top text-left relative outline-none overflow-auto min-w-[100px]",
  tableCellActionButton: "lexical-table-cell-action-button",
  tableCellActionButtonContainer: "lexical-table-cell-action-button-container",
  tableCellHeader: "bg-muted font-semibold text-left",
  tableCellResizer: "lexical-table-cell-resizer",
  tableCellSelected: "lexical-table-cell-selected",
  tableFrozenColumn: "lexical-table-frozen-column",
  tableFrozenRow: "lexical-table-frozen-row",
  tableRowStriping: "lexical-table-row-striping",
  tableScrollableWrapper: "overflow-x-auto my-0 mr-6 mb-8",
  tableSelected: "outline-2 outline-primary",
  tableSelection: "lexical-table-selection",

  hr: "lexical-hr",
  hrSelected: "lexical-hr-selected",

  indent: "lexical-indent",

  hashtag: "bg-blue-100/60 border-b border-blue-300/50 px-1 py-0.5 rounded-sm",

  blockCursor: "lexical-block-cursor",

  characterLimit: "bg-red-200 dark:bg-red-900/50",

  mark: "bg-yellow-200/30 border-b-2 border-yellow-300/50 pb-0.5",
  markOverlap: "bg-yellow-300/50 border-b-2 border-yellow-400/70",

  embedBlock: {
    base: "select-none",
    focus: "outline-2 outline-primary",
  },

  layoutContainer: "grid gap-2.5 my-2.5",
  layoutItem: "border border-dashed border-border p-2 px-4 min-w-0 max-w-full",

  autocomplete: "text-muted-foreground",

  tab: "lexical-tab-node",

  specialText: "bg-yellow-300 font-bold",

  image: "max-w-full h-auto rounded-lg my-4",
  inlineImage: "inline-block max-h-6",
};

export default theme;
