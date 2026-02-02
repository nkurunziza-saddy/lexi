import {
  type EditorConfig,
  ElementNode,
  type LexicalNode,
  type NodeKey,
  type SerializedElementNode,
  type Spread,
} from "lexical";

export type SerializedLayoutContainerNode = Spread<
  {
    templateColumns: string;
  },
  SerializedElementNode
>;

export class LayoutContainerNode extends ElementNode {
  __templateColumns: string;

  constructor(templateColumns: string, key?: NodeKey) {
    super(key);
    this.__templateColumns = templateColumns;
  }

  static getType(): string {
    return "layout-container";
  }

  static clone(node: LayoutContainerNode): LayoutContainerNode {
    return new LayoutContainerNode(node.__templateColumns, node.__key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement("div");
    dom.style.display = "grid";
    dom.style.gridTemplateColumns = this.__templateColumns;
    dom.style.gap = "8px";
    dom.className = "lexical-layout-container";
    return dom;
  }

  updateDOM(prevNode: LayoutContainerNode, dom: HTMLElement): boolean {
    if (prevNode.__templateColumns !== this.__templateColumns) {
      dom.style.gridTemplateColumns = this.__templateColumns;
    }
    return false;
  }

  static importJSON(json: SerializedLayoutContainerNode): LayoutContainerNode {
    return new LayoutContainerNode(json.templateColumns);
  }

  exportJSON(): SerializedLayoutContainerNode {
    return {
      ...super.exportJSON(),
      templateColumns: this.__templateColumns,
      type: "layout-container",
      version: 1,
    };
  }

  setTemplateColumns(templateColumns: string): void {
    const writable = this.getWritable();
    writable.__templateColumns = templateColumns;
  }

  getTemplateColumns(): string {
    return this.getLatest().__templateColumns;
  }
}

export function $createLayoutContainerNode(
  templateColumns: string,
): LayoutContainerNode {
  return new LayoutContainerNode(templateColumns);
}

export function $isLayoutContainerNode(
  node: LexicalNode | null | undefined,
): node is LayoutContainerNode {
  return node instanceof LayoutContainerNode;
}
