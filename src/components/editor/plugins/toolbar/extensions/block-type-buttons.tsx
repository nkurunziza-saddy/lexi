import { $createCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import type { ToolbarState } from "..";
import { BLOCK_FORMAT_ITEMS } from "../toolbar-items";
import { ToolbarToggleButton } from "./toolbar-button";

const BLOCK_TYPE_ITEMS = BLOCK_FORMAT_ITEMS.filter((item) => item.format);

export function BlockTypeButtons({
  toolbarState,
}: {
  toolbarState: ToolbarState;
}) {
  const [editor] = useLexicalComposerContext();

  const onClickHandler = (format: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (toolbarState.blockType === format) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          if (format === "quote") {
            $setBlocksType(selection, () => $createQuoteNode());
          } else if (format === "code") {
            $setBlocksType(selection, () => $createCodeNode());
          }
        }
      }
    });
  };

  return (
    <>
      {BLOCK_TYPE_ITEMS.map((item) => {
        return (
          <ToolbarToggleButton
            icon={item.icon}
            isActive={toolbarState.blockType === item.name}
            key={item.name}
            onClick={() => onClickHandler(item.format!)}
            title={item.name}
          />
        );
      })}
    </>
  );
}
