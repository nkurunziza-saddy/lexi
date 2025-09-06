import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
} from "@lexical/table";
import { Rows, Columns } from "lucide-react";
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
          variant="ghost"
          size="sm"
          onClick={insertRow}
          title="Insert Row Below"
        >
          <Rows className="size-4" />
        </Button>
      </div>
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={insertColumn}
          title="Insert Column Right"
        >
          <Columns className="size-4" />
        </Button>
      </div>
    </>
  );
}
