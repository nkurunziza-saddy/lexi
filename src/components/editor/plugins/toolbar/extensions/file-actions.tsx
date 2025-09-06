import { useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { FileDown, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exportAsHTML,
  exportAsMarkdown,
  copyAsPlainText,
  importMarkdown,
} from "../../../lib/utils";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Button
              variant="ghost"
              size="sm"
              title="Export"
              className="hover:bg-accent/80 transition-colors"
            >
              <FileDown className="size-4" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="animate-in slide-in-from-top-2 duration-200"
        >
          <DropdownMenuItem
            onClick={() => exportAsHTML(editor)}
            className="hover:bg-accent/80 transition-colors"
          >
            Save as HTML
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => exportAsMarkdown(editor)}
            className="hover:bg-accent/80 transition-colors"
          >
            Save as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => copyAsPlainText(editor)}
            className="hover:bg-accent/80 transition-colors"
          >
            Copy as Plain Text
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="file"
        accept=".md,.markdown"
        ref={importInputRef}
        onChange={handleImport}
        className="hidden"
      />
      <Button
        variant="ghost"
        size="sm"
        title="Import"
        onClick={() => importInputRef.current?.click()}
        className="hover:bg-accent/80 transition-colors"
      >
        <FileUp className="size-4" />
      </Button>
    </>
  );
}
