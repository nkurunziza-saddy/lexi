import type { JSX } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { $createParagraphNode, $getNearestNodeFromDOMNode } from "lexical";
import { useRef, useState } from "react";
import { GripVertical } from "lucide-react";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu";

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export default function DraggableBlockPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);
  const [draggableElement, setDraggableElement] = useState<HTMLElement | null>(
    null,
  );

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={
        <div
          ref={menuRef}
          className={`${DRAGGABLE_BLOCK_MENU_CLASSNAME} flex items-center gap-1 p-1 rounded-md bg-background border shadow-sm opacity-0 transition-opacity duration-200 cursor-grab active:cursor-grabbing hover:opacity-100 will-change-transform absolute left-0 top-0 z-50`}
        >
          <div className="p-1 hover:bg-accent rounded-sm transition-colors">
            <GripVertical className="size-3.5 text-muted-foreground/50" />
          </div>
        </div>
      }
      targetLineComponent={
        <div
          ref={targetLineRef}
          className="draggable-block-target-line pointer-events-none bg-primary h-[2px] absolute left-0 top-0 opacity-0 will-change-transform"
        />
      }
      isOnMenu={isOnMenu}
      onElementChanged={setDraggableElement}
    />
  );
}
