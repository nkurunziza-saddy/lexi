import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { LexicalCommand } from "lexical";
import type { ToolbarState } from "..";
import { TEXT_FORMAT_ITEMS } from "../toolbar-items";
import { ToolbarToggleButton } from "./toolbar-button";

export function TextFormatButtons({
  toolbarState,
}: {
  toolbarState: ToolbarState;
}) {
  const [editor] = useLexicalComposerContext();

  const handleClick = (command: LexicalCommand<string>, payload?: string) => {
    if (!payload) return;
    editor.dispatchCommand(command, payload);
  };

  return (
    <>
      {TEXT_FORMAT_ITEMS.map((item) => (
        <ToolbarToggleButton
          icon={item.icon}
          isActive={
            !!toolbarState[
              `is${
                item.name.charAt(0).toUpperCase() + item.name.slice(1)
              }` as keyof ToolbarState
            ]
          }
          key={item.name}
          onClick={() => handleClick(item.command, item.payload)}
          title={item.name}
        />
      ))}
    </>
  );
}
