import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { ImageIcon, Minus, Pencil, Plus, Sigma, Table } from "lucide-react";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/components/ui/menu";
import { ToolbarButton } from "./toolbar-button";

export function InsertDropDown({
  setShowTableDialog,
  setShowImageDialog,
  setShowEquationDialog,
  setShowExcalidrawModal,
}: {
  setShowTableDialog: (show: boolean) => void;
  setShowImageDialog: (show: boolean) => void;
  setShowEquationDialog: (show: boolean) => void;
  setShowExcalidrawModal: (show: boolean) => void;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <Menu>
      <MenuTrigger render={<ToolbarButton icon={Plus} title="Insert" />} />
      <MenuPopup
        align="start"
        className="animate-in slide-in-from-top-2 duration-200"
      >
        <MenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() =>
            editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
          }
        >
          <Minus className="mr-2 size-4" />
          Divider
        </MenuItem>
        <MenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => setShowTableDialog(true)}
        >
          <Table className="mr-2 size-4" />
          Table
        </MenuItem>
        <MenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => setShowImageDialog(true)}
        >
          <ImageIcon className="mr-2 size-4" />
          Image
        </MenuItem>
        <MenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => setShowExcalidrawModal(true)}
        >
          <Pencil className="mr-2 size-4" />
          Drawing
        </MenuItem>
        <MenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => setShowEquationDialog(true)}
        >
          <Sigma className="mr-2 size-4" />
          Equation
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
}
