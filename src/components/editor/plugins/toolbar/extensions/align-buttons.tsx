import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { FORMAT_ELEMENT_COMMAND } from "lexical";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AlignButtons() {
  const [editor] = useLexicalComposerContext();

  const formatElement = (format: "left" | "center" | "right" | "justify") => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <Button
            variant="ghost"
            size="sm"
            title="Text Alignment"
            className="hover:bg-accent/80 transition-colors"
          >
            <AlignLeft className="size-4" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="animate-in slide-in-from-top-2 duration-200"
      >
        <DropdownMenuItem
          onClick={() => formatElement("left")}
          className="hover:bg-accent/80 transition-colors"
        >
          <AlignLeft className="mr-2 size-4" />
          Left
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => formatElement("center")}
          className="hover:bg-accent/80 transition-colors"
        >
          <AlignCenter className="mr-2 size-4" />
          Center
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => formatElement("right")}
          className="hover:bg-accent/80 transition-colors"
        >
          <AlignRight className="mr-2 size-4" />
          Right
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => formatElement("justify")}
          className="hover:bg-accent/80 transition-colors"
        >
          <AlignJustify className="mr-2 size-4" />
          Justify
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
