import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ImageNode } from "./image-node";
import { EquationNode } from "../../nodes/equation/equation-node";
import { ExcalidrawNode } from "../../nodes/excalidraw";
import { LayoutContainerNode } from "../../nodes/layout-container";
import { LayoutItemNode } from "../../nodes/layout-item";

export const nodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
  AutoLinkNode,
  HorizontalRuleNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  ImageNode,
  EquationNode,
  ExcalidrawNode,
  LayoutContainerNode,
  LayoutItemNode,
];
