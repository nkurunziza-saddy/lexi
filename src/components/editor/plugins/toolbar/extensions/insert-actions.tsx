import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { Minus, Plus, Table, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function InsertDropDown({
  setShowTableDialog,
  setShowImageDialog,
}: {
  setShowTableDialog: (show: boolean) => void;
  setShowImageDialog: (show: boolean) => void;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button
            variant="ghost"
            size="sm"
            title="Insert"
            className="hover:bg-accent/80 transition-colors"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="animate-in slide-in-from-top-2 duration-200"
      >
        <DropdownMenuItem
          onClick={() =>
            editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
          }
          className="hover:bg-accent/80 transition-colors"
        >
          <Minus className="mr-2 size-4" />
          Divider
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setShowTableDialog(true)}
          className="hover:bg-accent/80 transition-colors"
        >
          <Table className="mr-2 size-4" />
          Table
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setShowImageDialog(true)}
          className="hover:bg-accent/80 transition-colors"
        >
          <ImageIcon className="mr-2 size-4" />
          Image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
