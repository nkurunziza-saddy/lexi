import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Highlighter,
  Strikethrough,
  Subscript,
  Superscript,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { HIGHLIGHT_COLORS } from "../../lib/colors";
import { useFloatingToolbar } from "../../lib/hooks/use-floating-toolbar";
import { ToolbarButton } from "../toolbar/extensions/toolbar-button";

export function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const { toolbarRef, isVisible, position, activeFormats } =
    useFloatingToolbar();

  return createPortal(
    <>
      {isVisible && (
        <div
          ref={toolbarRef}
          className="fixed z-50 flex items-center gap-1 p-2 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-2xl"
          style={{
            ...position,
            transform: "translateX(-50%)",
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {[
            {
              name: "bold",
              icon: Bold,
              format: "bold",
            },
            {
              name: "italic",
              icon: Italic,
              format: "italic",
            },
            {
              name: "underline",
              icon: Underline,
              format: "underline",
            },
            {
              name: "strikethrough",
              icon: Strikethrough,
              format: "strikethrough",
            },
            {
              name: "code",
              icon: Code,
              format: "code",
            },
            {
              name: "subscript",
              icon: Subscript,
              format: "subscript",
            },
            {
              name: "superscript",
              icon: Superscript,
              format: "superscript",
            },
          ].map((item) => (
            <ToolbarButton
              key={item.name}
              onClick={() =>
                editor.dispatchCommand(
                  FORMAT_TEXT_COMMAND,
                  item.format as
                    | "subscript"
                    | "superscript"
                    | "bold"
                    | "italic"
                    | "underline"
                    | "code"
                    | "strikethrough"
                )
              }
              isActive={activeFormats.has(item.format)}
              icon={item.icon}
              title={item.name}
            />
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div>
                <Button variant="ghost" size="sm" className="size-8 p-0">
                  <Highlighter className="size-4" />
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="animate-in slide-in-from-top-2 duration-200">
              {HIGHLIGHT_COLORS.map((color) => (
                <DropdownMenuItem
                  key={color.value}
                  onClick={() => {
                    editor.update(() => {
                      const selection = $getSelection();
                      if ($isRangeSelection(selection)) {
                        $patchStyleText(selection, {
                          "background-color": color.value,
                        });
                      }
                    });
                  }}
                  className=""
                >
                  <div
                    className="size-4 rounded-sm border border-input/20 shadow-sm"
                    style={{ backgroundColor: color.value }}
                  />
                  {color.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                      $patchStyleText(selection, { "background-color": "" });
                    }
                  });
                }}
              >
                Remove Highlight
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>,
    document.body
  );
}
