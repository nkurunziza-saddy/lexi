import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu";
import { ToolbarButton } from "./toolbar-button";

export function AlignButtons() {
  const [editor] = useLexicalComposerContext();

  const formatElement = (format: "left" | "center" | "right" | "justify") => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
  };

  return (
    <Menu>
      <MenuTrigger
        render={<ToolbarButton icon={AlignLeft} title="Text Alignment" />}
      />

      <MenuPopup
        align="start"
        className="animate-in slide-in-from-top-2 duration-200"
      >
        <MenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => formatElement("left")}
        >
          <AlignLeft className="mr-2 size-4" />
          Left
        </MenuItem>
        <MenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => formatElement("center")}
        >
          <AlignCenter className="mr-2 size-4" />
          Center
        </MenuItem>
        <MenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => formatElement("right")}
        >
          <AlignRight className="mr-2 size-4" />
          Right
        </MenuItem>
        <MenuItem
          className="hover:bg-accent/80 transition-colors"
          onClick={() => formatElement("justify")}
        >
          <AlignJustify className="mr-2 size-4" />
          Justify
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
}
