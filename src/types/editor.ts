import type { SerializedLexicalNode } from "lexical";

export type ImageNodeSerialized = {
  src: string;
  alt: string;
  type: string;
  version: 1;
} & SerializedLexicalNode;
