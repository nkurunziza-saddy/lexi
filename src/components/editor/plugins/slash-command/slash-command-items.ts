import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  CodeSquare,
  Minus,
  Type,
} from "lucide-react";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  type LexicalEditor,
} from "lexical";

export interface SlashCommand {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  action: (editor: LexicalEditor) => void;
  keywords: string[];
}

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    title: "Text",
    icon: Type,
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    },
    keywords: ["paragraph", "p", "text"],
  },
  {
    title: "Heading 1",
    icon: Heading1,
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h1"));
        }
      });
    },
    keywords: ["heading", "h1"],
  },
  {
    title: "Heading 2",
    icon: Heading2,
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h2"));
        }
      });
    },
    keywords: ["heading", "h2"],
  },
  {
    title: "Heading 3",
    icon: Heading3,
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode("h3"));
        }
      });
    },
    keywords: ["heading", "h3"],
  },
  {
    title: "Bulleted List",
    icon: List,
    action: (editor) => {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    },
    keywords: ["list", "bulleted", "ul"],
  },
  {
    title: "Numbered List",
    icon: ListOrdered,
    action: (editor) => {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    },
    keywords: ["list", "numbered", "ol"],
  },
  {
    title: "Check List",
    icon: ListChecks,
    action: (editor) => {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    },
    keywords: ["list", "check", "todo"],
  },
  {
    title: "Quote",
    icon: Quote,
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    },
    keywords: ["quote", "blockquote"],
  },
  {
    title: "Code Block",
    icon: CodeSquare,
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    },
    keywords: ["code", "codeblock"],
  },
  {
    title: "Divider",
    icon: Minus,
    action: (editor) => {
      editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    },
    keywords: ["divider", "hr", "horizontal rule"],
  },
];
