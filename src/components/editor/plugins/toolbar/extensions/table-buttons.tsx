import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
} from "@lexical/table";
import { Columns, Rows } from "lucide-react";
import { ToolbarButton } from "./toolbar-button";

export function TableButtons() {
  const [editor] = useLexicalComposerContext();

  const insertRow = () => {
    editor.update(() => {
      $insertTableRowAtSelection(true);
    });
  };

  const insertColumn = () => {
    editor.update(() => {
      $insertTableColumnAtSelection(true);
    });
  };

  return (
    <>
      <ToolbarButton onClick={insertRow} title="Insert Row Below" icon={Rows} />
      <ToolbarButton
        onClick={insertColumn}
        title="Insert Column Right"
        icon={Columns}
      />
    </>
  );
}
