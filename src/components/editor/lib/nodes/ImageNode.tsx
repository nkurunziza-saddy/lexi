import type { JSX } from "react";
import { DecoratorNode } from "lexical";
import { motion } from "motion/react";

import type { ImageNodeSerialized } from "@/components/editor/lib/types/editor";
import { ANIMATION_CONFIG } from "../configs";

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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={ANIMATION_CONFIG.spring}
        className="my-4"
      >
        <img
          src={this.__src || "/placeholder.svg"}
          alt={this.__alt}
          className="max-w-full h-auto rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
        />
      </motion.div>
    );
  }
}

export function $createImageNode(src: string, alt?: string): ImageNode {
  return new ImageNode(src, alt);
}
