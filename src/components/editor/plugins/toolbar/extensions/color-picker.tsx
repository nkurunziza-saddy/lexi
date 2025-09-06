import { useState, useCallback, useEffect } from "react";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  type LexicalEditor,
} from "lexical";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import { Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FONT_COLORS } from "../../../lib/colors";

export function ColorPicker({
  editor,
  disabled = false,
}: {
  editor: LexicalEditor;
  disabled?: boolean;
}) {
  const [color, setColor] = useState("hsl(var(--foreground))");

  const applyColor = useCallback(
    (newColor: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { color: newColor });
        }
      });
    },
    [editor]
  );

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        editor.read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            setColor(
              $getSelectionStyleValueForProperty(
                selection,
                "color",
                "hsl(var(--foreground))"
              )
            );
          }
        });
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" disabled={disabled} className="">
          <Palette className="size-4" style={{ color }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="animate-in grid grid-cols-3 gap-1 slide-in-from-top-2 duration-200">
        {FONT_COLORS.map((c) => (
          <DropdownMenuItem
            key={c.name}
            className=""
            onClick={() => applyColor(c.value)}
          >
            <div
              className="size-4 rounded-sm border border-input/20 shadow-sm"
              style={{ backgroundColor: c.value }}
            />
            {c.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
