import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { mergeRegister } from "@lexical/utils";
import {
  Bold,
  Italic,
  Underline,
  Code,
  Highlighter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { HIGHLIGHT_COLORS, springTransition } from "@/lib/editor/constants";
import { $patchStyleText } from "@lexical/selection";

export function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: "-1000px", left: "-1000px" });

  const updateToolbar = useCallback(() => {
    editor.read(() => {
      const selection = $getSelection();

      if (
        $isRangeSelection(selection) &&
        !selection.isCollapsed() &&
        selection.getTextContent() !== ""
      ) {
        const nativeSelection = window.getSelection();
        if (!nativeSelection || nativeSelection.rangeCount === 0) {
          setIsVisible(false);
          return;
        }
        const domRange = nativeSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();

        setPosition({
          top: `${rect.top + window.pageYOffset - 60}px`,
          left: `${rect.left + window.pageXOffset + rect.width / 2}px`,
        });
        setIsVisible(true);

        const formats = new Set<string>();
        if (selection.hasFormat("bold")) formats.add("bold");
        if (selection.hasFormat("italic")) formats.add("italic");
        if (selection.hasFormat("underline")) formats.add("underline");
        if (selection.hasFormat("code")) formats.add("code");
        setActiveFormats(formats);
      } else {
        setIsVisible(false);
      }
    });
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const editorRoot = editor.getRootElement();
      if (
        isVisible &&
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node) &&
        !editorRoot?.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editor, isVisible]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.read(() => {
            updateToolbar();
          });
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateToolbar]);

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
          transition={springTransition}
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
