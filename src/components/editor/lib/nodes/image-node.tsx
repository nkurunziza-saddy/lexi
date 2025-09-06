import type { JSX } from "react";
import { DecoratorNode } from "lexical";

import type { ImageNodeSerialized } from "@/components/editor/lib/types/editor";

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  static importJSON(serializedNode: ImageNodeSerialized): ImageNode {
    const { src, alt } = serializedNode;
    return new ImageNode(src, alt);
  }

  exportJSON(): ImageNodeSerialized {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      alt: this.__alt,
    } as ImageNodeSerialized;
  }

  constructor(src: string, alt = "Image", key?: string) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.className = "image-node";
    return div;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <div>
        <img
          src={this.__src || "/placeholder.svg"}
          alt={this.__alt}
          style={{
            height: "inherit",
            width: "inherit",
            maxWidth: 500,
          }}
          // onError={() => setIsLoadError(true)}
        />
      </div>
    );
  }
}

export function $createImageNode(src: string, alt?: string): ImageNode {
  return new ImageNode(src, alt);
}
