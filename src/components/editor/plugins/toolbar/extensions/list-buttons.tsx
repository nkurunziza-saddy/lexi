import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { BLOCK_FORMAT_ITEMS } from "../toolbar-items";
import { ToolbarButton } from "./toolbar-button";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";

const LIST_ITEMS = BLOCK_FORMAT_ITEMS.filter(
  (item) => item.command && ["bullet", "number", "check"].includes(item.name)
);

interface ToolbarState {
  blockType: string;
  [key: string]: boolean | string;
}

export function ListButtons({ toolbarState }: { toolbarState: ToolbarState }) {
  const [editor] = useLexicalComposerContext();

  const handleListToggle = (listType: string) => {
    editor.update(() => {
      // If the button is already active, remove the list
      if (toolbarState.blockType === listType) {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      } else {
        // Otherwise, insert the appropriate list type
        if (listType === "bullet") {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else if (listType === "number") {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        } else if (listType === "check") {
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
        }
      }
    });
  };

  return (
    <>
      {LIST_ITEMS.map((item) => {
        return (
          <ToolbarButton
            key={item.name}
            onClick={() => handleListToggle(item.name)}
            isActive={toolbarState.blockType === item.name}
            icon={item.icon}
            title={item.name}
          />
        );
      })}
    </>
  );
}
