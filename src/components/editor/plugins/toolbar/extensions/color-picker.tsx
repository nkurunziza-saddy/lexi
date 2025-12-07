import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  type LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { Palette } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu";
import { FONT_COLORS } from "../../../lib/colors";
import { ToolbarButton } from "./toolbar-button";

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
    [editor],
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
                "hsl(var(--foreground))",
              ),
            );
          }
        });
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor]);

  return (
    <Menu>
      <MenuTrigger render={<ToolbarButton disabled={disabled} />}>
        <Palette className="size-4" style={{ color }} />
      </MenuTrigger>
      <MenuPopup className="animate-in grid grid-cols-3 gap-1 slide-in-from-top-2 duration-200">
        {FONT_COLORS.map((c) => (
          <MenuItem
            className=""
            key={c.name}
            onClick={() => applyColor(c.value)}
          >
            <div
              className="size-4 rounded-sm border border-input/20 shadow-sm"
              style={{ backgroundColor: c.value }}
            />
            {c.name}
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  );
}
