import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  $insertTableColumnAtSelection,
  $insertTableRowAtSelection,
} from "@lexical/table";
import { Columns, Rows } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div>
        <Button
          onClick={insertRow}
          size="icon-sm"
          title="Insert Row Below"
          variant="ghost"
        >
          <Rows className="size-4" />
        </Button>
      </div>
      <div>
        <Button
          onClick={insertColumn}
          size="icon-sm"
          title="Insert Column Right"
          variant="ghost"
        >
          <Columns className="size-4" />
        </Button>
      </div>
    </>
  );
}
