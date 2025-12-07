import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FileDown, FileUp } from "lucide-react";
import { useRef } from "react";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  copyAsPlainText,
  exportAsHTML,
  exportAsMarkdown,
  importMarkdown,
} from "../../../lib/utils";
import { ToolbarButton } from "./toolbar-button";

export function FileActions() {
  const [editor] = useLexicalComposerContext();
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importMarkdown(editor, file);
    }
  };

  return (
    <>
      <Menu>
        <MenuTrigger
          render={
            <ToolbarButton
              className="hover:bg-accent/80 transition-colors"
              icon={FileDown}
              title="Export"
              variant="ghost"
            />
          }
        />
        <MenuPopup
          align="start"
          className="animate-in slide-in-from-top-2 duration-200"
        >
          <MenuItem
            className="hover:bg-accent/80 transition-colors"
            onClick={() => exportAsHTML(editor)}
          >
            Save as HTML
          </MenuItem>
          <MenuItem
            className="hover:bg-accent/80 transition-colors"
            onClick={() => exportAsMarkdown(editor)}
          >
            Save as Markdown
          </MenuItem>
          <MenuItem
            className="hover:bg-accent/80 transition-colors"
            onClick={() => copyAsPlainText(editor)}
          >
            Copy as Plain Text
          </MenuItem>
        </MenuPopup>
      </Menu>

      <input
        accept=".md,.markdown"
        className="hidden"
        onChange={handleImport}
        ref={importInputRef}
        type="file"
      />
      <ToolbarButton
        icon={FileUp}
        onClick={() => importInputRef.current?.click()}
        title="Import"
      />
    </>
  );
}
