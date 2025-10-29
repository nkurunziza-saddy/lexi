import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TEXT_FORMAT_ITEMS } from "../toolbar-items";
import { ToolbarButton } from "./toolbar-button";
import type { LexicalCommand } from "lexical";

interface ToolbarState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  blockType?: string;
  [key: string]: boolean | string | undefined;
}

export function TextFormatButtons({
  toolbarState,
}: {
  toolbarState: ToolbarState;
}) {
  const [editor] = useLexicalComposerContext();

  const handleClick = (command: LexicalCommand<unknown>, payload?: unknown) => {
    editor.dispatchCommand(command, payload);
  };

  return (
    <>
      {TEXT_FORMAT_ITEMS.map((item) => (
        <ToolbarButton
          key={item.name}
          onClick={() => handleClick(item.command, item.payload)}
          isActive={
            !!toolbarState[
              `is${item.name.charAt(0).toUpperCase() + item.name.slice(1)}`
            ]
          }
          icon={item.icon}
          title={item.name}
        />
      ))}
    </>
  );
}
