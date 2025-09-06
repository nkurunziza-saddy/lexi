import { useState, useCallback, useEffect, useReducer } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  type ElementNode,
  type TextNode,
} from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { BlockFormatDropDown } from "./extensions/block-format-dropdown";
import { $isListNode, ListNode } from "@lexical/list";
import { $isCodeNode } from "@lexical/code";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import { INSERT_TABLE_COMMAND, $isTableCellNode } from "@lexical/table";
import {
  $getNearestNodeOfType,
  mergeRegister,
  $findMatchingParent,
} from "@lexical/utils";
import { LinkIcon, Highlighter, Github } from "lucide-react";
import { FileActions } from "./extensions/file-actions";
import { TableButtons } from "./extensions/table-buttons";
import { InsertDropDown } from "./extensions/insert-actions";
import { AlignButtons } from "./extensions/align-buttons";
import { TextFormatButtons } from "./extensions/text-format-buttons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LinkDialog, TableDialog, ImageDialog } from "../../components";
import { $createImageNode } from "../../lib/nodes/image-node";
import { HIGHLIGHT_COLORS } from "../../lib/colors";
import { ColorPicker } from "./extensions/color-picker";
import { HistoryButtons } from "./extensions/history-buttons";
import { ListButtons } from "./extensions/list-buttons";
import { BlockTypeButtons } from "./extensions/block-type-buttons";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import Separator from "../../components/toolbar-separator";
import { ModeToggle } from "../../components/theme-toggler";

const initialState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  isCode: false,
  isLink: false,
  isHighlight: false,
  isSubscript: false,
  isSuperscript: false,
  isCapitalized: false,
  isTable: false,
  isBulletedList: false,
  isNumberedList: false,
  isCheckList: false,
  isQuote: false,
  isCodeBlock: false,
  blockType: "paragraph",
  canUndo: false,
  canRedo: false,
};

type ToolbarState = typeof initialState;
type Action =
  | { type: "UPDATE"; payload: Partial<ToolbarState> }
  | { type: "SET_CAN_UNDO"; payload: boolean }
  | { type: "SET_CAN_REDO"; payload: boolean };

const toolbarReducer = (state: ToolbarState, action: Action): ToolbarState => {
  switch (action.type) {
    case "UPDATE":
      return { ...state, ...action.payload };
    case "SET_CAN_UNDO":
      return { ...state, canUndo: action.payload };
    case "SET_CAN_REDO":
      return { ...state, canRedo: action.payload };
    default:
      return state;
  }
};

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [toolbarState, dispatch] = useReducer(toolbarReducer, initialState);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  const updateToolbar = useCallback(() => {
    editor.read(() => {
      const selection = $getSelection();
      const newToolbarState = {
        isBulletedList: false,
        isNumberedList: false,
        isCheckList: false,
        isQuote: false,
        isCodeBlock: false,
        isStrikethrough: false,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isCode: false,
        isLink: false,
        isHighlight: false,
        isSubscript: false,
        isSuperscript: false,
        isCapitalized: false,
        isTable: false,
        blockType: "paragraph",
      };

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
        newToolbarState.blockType = blockType;

        const cell = $findMatchingParent(anchorNode, (node) =>
          $isTableCellNode(node)
        );
        newToolbarState.isTable = cell !== null;

        let isLink = false;
        let node: ElementNode | TextNode | null = anchorNode;
        while (node) {
          if ($isLinkNode(node)) {
            isLink = true;
            break;
          }
          const parent: ElementNode | null = node.getParent();
          if (parent === node) break;
          node = parent;
        }
        newToolbarState.isLink = isLink;

        newToolbarState.isBulletedList = blockType === "bullet";
        newToolbarState.isNumberedList = blockType === "number";
        newToolbarState.isCheckList = blockType === "check";
        newToolbarState.isQuote = blockType === "quote";
        newToolbarState.isCodeBlock = blockType === "code";

        newToolbarState.isBold = selection.hasFormat("bold");
        newToolbarState.isItalic = selection.hasFormat("italic");
        newToolbarState.isUnderline = selection.hasFormat("underline");
        newToolbarState.isStrikethrough = selection.hasFormat("strikethrough");
        newToolbarState.isCode = selection.hasFormat("code");
        newToolbarState.isHighlight = selection.hasFormat("highlight");
        newToolbarState.isSubscript = selection.hasFormat("subscript");
        newToolbarState.isSuperscript = selection.hasFormat("superscript");
        newToolbarState.isCapitalized = selection.hasFormat("capitalize");
      }

      dispatch({ type: "UPDATE", payload: newToolbarState });
    });
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(updateToolbar),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload: boolean) => {
        dispatch({ type: "SET_CAN_UNDO", payload });
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload: boolean) => {
        dispatch({ type: "SET_CAN_REDO", payload });
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor]);

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

  const handleImageSubmit = (src: string, alt: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const imageNode = $createImageNode(src, alt);
        selection.insertNodes([imageNode]);
      }
    });
  };

  return (
    <div className="flex items-center gap-1 p-3 border-b bg-gradient-to-r from-background via-background to-accent/5 backdrop-blur-sm flex-wrap">
      <HistoryButtons
        canUndo={toolbarState.canUndo}
        canRedo={toolbarState.canRedo}
      />

      <Separator />
      <BlockFormatDropDown blockType={toolbarState.blockType} />

      <Separator />

      <ListButtons toolbarState={toolbarState} />
      <BlockTypeButtons toolbarState={toolbarState} />

      <Separator />

      <TextFormatButtons toolbarState={toolbarState} />
      <ColorPicker editor={editor} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <Button
              variant={toolbarState.isHighlight ? "secondary" : "ghost"}
              size="sm"
              title="Highlight"
              className="hover:bg-accent/80 transition-all duration-200"
            >
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
      <Separator />
      <div>
        <Button
          variant={toolbarState.isLink ? "secondary" : "ghost"}
          size="sm"
          onClick={insertLink}
          title="Insert Link"
          className="hover:bg-accent/80 transition-all duration-200"
        >
          <LinkIcon className="size-4" />
        </Button>
      </div>

      <Separator />

      <InsertDropDown
        setShowTableDialog={setShowTableDialog}
        setShowImageDialog={setShowImageDialog}
      />

      {toolbarState.isTable && (
        <>
          <Separator />
          <TableButtons />
        </>
      )}

      <Separator />

      <AlignButtons />

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

      <Separator />

      <FileActions />
      <div className="ml-auto">
        <ModeToggle />
        <Button size={"sm"} variant={"ghost"}>
          <a target="_blank" href="https://github.com/nkurunziza-saddy/lexi">
            <Github className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
