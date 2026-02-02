import {
  type EditorConfig,
  ElementNode,
  type LexicalNode,
  type NodeKey,
  type SerializedElementNode,
} from "lexical";

export type SerializedLayoutItemNode = SerializedElementNode;

export class LayoutItemNode extends ElementNode {
  constructor(key?: NodeKey) {
    super(key);
  }

  static getType(): string {
    return "layout-item";
  }

  static clone(node: LayoutItemNode): LayoutItemNode {
    return new LayoutItemNode(node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement("div");
    dom.className = "lexical-layout-item";
    dom.style.minWidth = "0";
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importJSON(json: SerializedLayoutItemNode): LayoutItemNode {
    return new LayoutItemNode();
  }

  exportJSON(): SerializedLayoutItemNode {
    return {
      ...super.exportJSON(),
      type: "layout-item",
      version: 1,
    };
  }
}

export function $createLayoutItemNode(): LayoutItemNode {
  return new LayoutItemNode();
}

export function $isLayoutItemNode(
  node: LexicalNode | null | undefined,
): node is LayoutItemNode {
  return node instanceof LayoutItemNode;
}
