import { useState, useCallback, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { motion } from "motion/react";
import {
  $getSelection, 
  $isRangeSelection, 
  FORMAT_TEXT_COMMAND, 
  FORMAT_ELEMENT_COMMAND, 
  SELECTION_CHANGE_COMMAND, 
  CAN_UNDO_COMMAND, 
  CAN_REDO_COMMAND, 
  UNDO_COMMAND, 
  REDO_COMMAND, 
  COMMAND_PRIORITY_CRITICAL 
} from "lexical";
import {
  $setBlocksType,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND, $isListNode } from "@lexical/list";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { $getNearestNodeOfType } from "@lexical/utils";
import {
  Bold, Italic, Underline, Code, LinkIcon, List, ListOrdered, Quote, Heading1, Heading2, Heading3, Undo, Redo, AlignLeft, AlignCenter, AlignRight, Minus, Plus, Table, ImageIcon, ListChecks, Highlighter, Subscript, Superscript, Strikethrough
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToolbarState } from "@/lib/editor/hooks/useToolbarState";
import { LinkDialog, TableDialog, ImageDialog } from "@/components/editor/dialogs";
import { ColorPicker } from "./ColorPicker";
import { HIGHLIGHT_COLORS, smoothTransition } from "@/lib/editor/constants";
import { $createImageNode } from "@/lib/editor/nodes/ImageNode";
import { $patchStyleText } from "@lexical/selection";

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const { toolbarState, setToolbarState } = useToolbarState();
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const updateToolbar = useCallback(() => {
    let newToolbarState = {};
    editor.read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element =
          anchorNode.getKey() === "root"
            ? anchorNode
            : anchorNode.getTopLevelElementOrThrow();

        let blockType = "paragraph";
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          blockType = parentList
            ? parentList.getListType()
            : element.getListType();
        } else {
          if ($isHeadingNode(element)) {
            blockType = element.getTag();
          } else if ($isQuoteNode(element)) {
            blockType = "quote";
          } else if ($isCodeNode(element)) {
            blockType = "code";
          }
        }

        let isLink = false;
        let node = anchorNode;
        while (node) {
          if ($isLinkNode(node)) {
            isLink = true;
            break;
          }
          const parent = node.getParent();
          if (parent === node) break;
          node = parent;
        }

        newToolbarState = {
          blockType: blockType,
          isHeading1: blockType === "h1",
          isHeading2: blockType === "h2",
          isHeading3: blockType === "h3",
          isBulletedList: blockType === "bullet",
          isNumberedList: blockType === "numbered",
          isCheckList: blockType === "check",
          isQuote: blockType === "quote",
          isCodeBlock: blockType === "code",
          isStrikethrough: selection.hasFormat("strikethrough"),
          isBold: selection.hasFormat("bold"),
          isItalic: selection.hasFormat("italic"),
          isUnderline: selection.hasFormat("underline"),
          isCode: selection.hasFormat("code"),
          isHighlight: selection.hasFormat("highlight"),
          isSubscript: selection.hasFormat("subscript"),
          isSuperscript: selection.hasFormat("superscript"),
          isLink: isLink,
          fontColor: $getSelectionStyleValueForProperty(
            selection,
            "color",
            "hsl(var(--foreground))"
          ),
        };
      }
    });
    setToolbarState((prev) => ({
      ...prev,
      ...newToolbarState,
    }));
  }, [editor, setToolbarState]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        editor.read(() => {
          updateToolbar();
        });
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload: boolean) => {
        setToolbarState((prev) => ({ ...prev, canUndo: payload }));
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, setToolbarState]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload: boolean) => {
        setToolbarState((prev) => ({ ...prev, canRedo: payload }));
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, setToolbarState]);

  const insertLink = () => {
    if (!toolbarState.isLink) {
      setShowLinkDialog(true);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  const handleLinkSubmit = (url: string) => {
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  const handleTableSubmit = (rows: number, columns: number) => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: columns.toString(),
      rows: rows.toString(),
    });
  };

  const handleImageSubmit = (src: string, alt?: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const imageNode = $createImageNode(src, alt);
        selection.insertNodes([imageNode]);
      }
    });
  };

  return (
    <motion.div
      layout
      className="flex items-center gap-1 p-3 border-b bg-gradient-to-r from-background via-background to-accent/5 backdrop-blur-sm flex-wrap"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={smoothTransition}
    >
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="sm"
          disabled={!toolbarState.canUndo}
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          title="Undo"
          className="hover:bg-accent/80 transition-all duration-200"
        >
          <Undo className="size-4" />
        </Button>
      </motion.div>
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="sm"
          disabled={!toolbarState.canRedo}
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          title="Redo"
          className="hover:bg-accent/80 transition-all duration-200"
        >
          <Redo className="size-4" />
        </Button>
      </motion.div>

      <div className="w-px h-6 bg-gradient-to-b from-transparent via-border to-transparent mx-2" />

      <div className="w-px h-6 bg-gradient-to-b from-transparent via-border to-transparent mx-2" />

      {[
        {
          key: "h1",
          icon: Heading1,
          format: "h1",
          state: toolbarState.blockType === "h1",
        },
        {
          key: "h2",
          icon: Heading2,
          format: "h2",
          state: toolbarState.blockType === "h2",
        },
        {
          key: "h3",
          icon: Heading3,
          format: "h3",
          state: toolbarState.blockType === "h3",
        },
      ].map(({ key, icon: Icon, format, state }) => (
        <motion.div key={key} whileTap={{ scale: 0.95 }}>
          <Button
            variant={state ? "secondary" : "ghost"}
            size="sm"
            onClick={() =>
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  $setBlocksType(selection, () =>
                    $createHeadingNode(format as "h1" | "h2" | "h3")
                  );
                }
              })
            }
            className="hover:bg-accent/80 transition-all duration-200"
          >
            <Icon className="size-4" />
          </Button>
        </motion.div>
      ))}

      <div className="w-px h-6 bg-gradient-to-b from-transparent via-border to-transparent mx-2" />

      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant={toolbarState.isBulletedList ? "secondary" : "ghost"}
          size="sm"
          onClick={() =>
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
          }
          className="hover:bg-accent/80 transition-all duration-200"
        >
          <List className="size-4" />
        </Button>
      </motion.div>
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant={toolbarState.isNumberedList ? "secondary" : "ghost"}
          size="sm"
          onClick={() =>
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
          }
          className="hover:bg-accent/80 transition-all duration-200"
        >
          <ListOrdered className="size-4" />
        </Button>
      </motion.div>
      <div className="w-px h-6 bg-gradient-to-b from-transparent via-border to-transparent mx-2" />
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant={toolbarState.isCheckList ? "secondary" : "ghost"}
          size="sm"
          onClick={() =>
            editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
          }
          className="hover:bg-accent/80 transition-all duration-200"
        >
          <ListChecks className="size-4" />
        </Button>
      </motion.div>
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant={toolbarState.isQuote ? "secondary" : "ghost"}
          size="sm"
          onClick={() =>
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
              }
            })
          }
          className="hover:bg-accent/80 transition-all duration-200"
        >
          <Quote className="size-4" />
        </Button>
      </motion.div>
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant={toolbarState.isCode ? "secondary" : "ghost"}
          size="sm"
          onClick={() =>
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createCodeNode());
              }
            })
          }
          className="hover:bg-accent/80 transition-all duration-200"
        >
          <Code className="size-4" />
        </Button>
      </motion.div>

      <div className="w-px h-6 bg-gradient-to-b from-transparent via-border to-transparent mx-2" />

      {[
        { key: "bold", icon: Bold, format: "bold", state: toolbarState.isBold },
        {
          key: "italic",
          icon: Italic,
          format: "italic",
          state: toolbarState.isItalic,
        },
        {
          key: "underline",
          icon: Underline,
          format: "underline",
          state: toolbarState.isUnderline,
        },
        {
          key: "strikethrough",
          icon: Strikethrough,
          format: "strikethrough",
          state: toolbarState.isStrikethrough,
        },
        { key: "code", icon: Code, format: "code", state: toolbarState.isCode },
        {
          key: "subscript",
          icon: Subscript,
          format: "subscript",
          state: toolbarState.isSubscript,
        },
        {
          key: "superscript",
          icon: Superscript,
          format: "superscript",
          state: toolbarState.isSuperscript,
        },
      ].map(({ key, icon: Icon, format, state }) => (
        <motion.div key={key} whileTap={{ scale: 0.95 }}>
          <Button
            variant={state ? "secondary" : "ghost"}
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
            className="hover:bg-accent/80 transition-all duration-200"
          >
            <Icon className="size-4" />
          </Button>
        </motion.div>
      ))}

      <ColorPicker editor={editor} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant={toolbarState.isHighlight ? "secondary" : "ghost"}
              size="sm"
              title="Highlight"
              className="hover:bg-accent/80 transition-all duration-200"
            >
              <Highlighter className="size-4" />
            </Button>
          </motion.div>
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
              className="hover:bg-accent/80 transition-colors"
            >
              <div
                className="size-4 rounded-sm mr-2 border shadow-sm"
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
            className="hover:bg-accent/80 transition-colors"
          >
            Remove Highlight
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          variant={toolbarState.isLink ? "secondary" : "ghost"}
          size="sm"
          onClick={insertLink}
          title="Insert Link"
          className="hover:bg-accent/80 transition-all duration-200"
        >
          <LinkIcon className="size-4" />
        </Button>
      </motion.div>

      <div className="w-px h-6 bg-gradient-to-b from-transparent via-border to-transparent mx-2" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              title="Insert"
              className="hover:bg-accent/80 transition-colors"
            >
              <Plus className="size-4" />
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="animate-in slide-in-from-top-2 duration-200"
        >
          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
            }
            className="hover:bg-accent/80 transition-colors"
          >
            <Minus className="mr-2 size-4" />
            Divider
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowTableDialog(true)}
            className="hover:bg-accent/80 transition-colors"
          >
            <Table className="mr-2 size-4" />
            Table
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowImageDialog(true)}
            className="hover:bg-accent/80 transition-colors"
          >
            <ImageIcon className="mr-2 size-4" />
            Image
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-gradient-to-b from-transparent via-border to-transparent mx-2" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              title="Text Alignment"
              className="hover:bg-accent/80 transition-colors"
            >
              <AlignLeft className="size-4" />
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="animate-in slide-in-from-top-2 duration-200"
        >
          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
            }
            className="hover:bg-accent/80 transition-colors"
          >
            <AlignLeft className="mr-2 size-4" />
            Left
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
            }
            className="hover:bg-accent/80 transition-colors"
          >
            <AlignCenter className="mr-2 size-4" />
            Center
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
            }
            className="hover:bg-accent/80 transition-colors"
          >
            <AlignRight className="mr-2 size-4" />
            Right
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LinkDialog
        isOpen={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        onSubmit={handleLinkSubmit}
      />

      <TableDialog
        isOpen={showTableDialog}
        onClose={() => setShowTableDialog(false)}
        onSubmit={handleTableSubmit}
      />

      <ImageDialog
        isOpen={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        onSubmit={handleImageSubmit}
      />
    </motion.div>
  );
}
