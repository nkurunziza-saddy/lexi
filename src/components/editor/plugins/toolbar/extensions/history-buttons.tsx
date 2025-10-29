import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { UNDO_COMMAND, REDO_COMMAND } from "lexical";
import { Undo, Redo } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HistoryButtons({
  canUndo,
  canRedo,
}: {
  canUndo: boolean;
  canRedo: boolean;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <>
      <div>
        <Button
          variant="ghost"
          size="sm"
          disabled={!canUndo}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          title="Undo"
          aria-label="Undo last action"
          aria-disabled={!canUndo}
          className="hover:bg-accent/80 transition-all duration-200"
        >
          <Undo className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <div>
        <Button
          variant="ghost"
          size="sm"
          disabled={!canRedo}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          title="Redo"
          aria-label="Redo last action"
          aria-disabled={!canRedo}
          className="hover:bg-accent/80 transition-all duration-200"
        >
          <Redo className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </>
  );
}
