import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { FORMAT_TEXT_COMMAND } from "lexical";
import {
  Bold,
  CaseUpper,
  Code,
  CodeSquare,
  Italic,
  List,
  ListChecks,
  ListOrdered,
  Quote,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
} from "lucide-react";

export const TEXT_FORMAT_ITEMS = [
  { name: "bold", icon: Bold, command: FORMAT_TEXT_COMMAND, payload: "bold" },
  {
    name: "italic",
    icon: Italic,
    command: FORMAT_TEXT_COMMAND,
    payload: "italic",
  },
  {
    name: "underline",
    icon: Underline,
    command: FORMAT_TEXT_COMMAND,
    payload: "underline",
  },
  {
    name: "strikethrough",
    icon: Strikethrough,
    command: FORMAT_TEXT_COMMAND,
    payload: "strikethrough",
  },
  { name: "code", icon: Code, command: FORMAT_TEXT_COMMAND, payload: "code" },
  {
    name: "subscript",
    icon: Subscript,
    command: FORMAT_TEXT_COMMAND,
    payload: "subscript",
  },
  {
    name: "superscript",
    icon: Superscript,
    command: FORMAT_TEXT_COMMAND,
    payload: "superscript",
  },
];

export const BLOCK_FORMAT_ITEMS = [
  { name: "bullet", icon: List, command: INSERT_UNORDERED_LIST_COMMAND },
  { name: "number", icon: ListOrdered, command: INSERT_ORDERED_LIST_COMMAND },
  { name: "check", icon: ListChecks, command: INSERT_CHECK_LIST_COMMAND },
  { name: "quote", icon: Quote, format: "quote" },
  { name: "code", icon: CodeSquare, format: "code" },
];
