import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { Bold, Italic, Underline, Code, Highlighter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ANIMATION_CONFIG } from "@/lib/editor/configs";
import { HIGHLIGHT_COLORS } from "@/lib/editor/colors";
import { useFloatingToolbar } from "@/lib/editor/hooks/use-floating-toolbar";

export function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const { toolbarRef, isVisible, position, activeFormats } =
    useFloatingToolbar();

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={toolbarRef}
          className="fixed z-50 flex items-center gap-1 p-2 bg-background/95 backdrop-blur-md border border-border/50 rounded-lg shadow-2xl"
          style={{
            ...position,
            transform: "translateX(-50%)",
          }}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={ANIMATION_CONFIG.spring}
          onMouseDown={(e) => e.preventDefault()}
        >
          {[
            { key: "bold", icon: Bold, format: "bold" },
            { key: "italic", icon: Italic, format: "italic" },
            { key: "underline", icon: Underline, format: "underline" },
            { key: "code", icon: Code, format: "code" },
          ].map(({ key, icon: Icon, format }) => (
            <motion.div key={key} whileTap={{ scale: 0.95 }}>
              <Button
                variant={activeFormats.has(format) ? "secondary" : "ghost"}
                size="sm"
                onClick={() =>
                  editor.dispatchCommand(
                    FORMAT_TEXT_COMMAND,
                    format as
                      | "subscript"
                      | "superscript"
                      | "bold"
                      | "italic"
                      | "underline"
                      | "code"
                      | "strikethrough"
                  )
                }
                className="size-8 p-0 hover:bg-accent/80 transition-colors"
              >
                <Icon className="size-4" />
              </Button>
            </motion.div>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="size-8 p-0">
                  <Highlighter className="size-4" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="animate-in slide-in-from-top-2 duration-200 grid grid-cols-3 gap-1">
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
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
