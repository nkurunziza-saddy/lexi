import { $isCodeNode } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isListNode, ListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isHeadingNode, $isQuoteNode } from "@lexical/rich-text";
import { $patchStyleText } from "@lexical/selection";
import { $isTableCellNode, INSERT_TABLE_COMMAND } from "@lexical/table";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  $wrapNodeInElement,
  mergeRegister,
} from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  type ElementNode,
  SELECTION_CHANGE_COMMAND,
  type TextNode,
} from "lexical";
import { Highlighter, LinkIcon, Mic, MicOff } from "lucide-react";
import { useCallback, useEffect, useReducer, useState } from "react";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { ImageDialog, LinkPopover, TableDialog } from "../../components";
import { InsertEquationDialog } from "../../plugins/equations";
import ExcalidrawModal from "../../components/excalidraw-modal";
import type { AppState } from "@excalidraw/excalidraw/types";
import { $createExcalidrawNode } from "../../nodes/excalidraw";
import { Separator } from "../../components/toolbar-separator";
import { HIGHLIGHT_COLORS } from "../../lib/colors";
import { $createImageNode } from "../../lib/nodes/image-node";
import { AlignButtons } from "./extensions/align-buttons";
import { BlockFormatDropDown } from "./extensions/block-format-dropdown";
import { BlockTypeButtons } from "./extensions/block-type-buttons";
import { ColorPicker } from "./extensions/color-picker";
import { FileActions } from "./extensions/file-actions";
import { HistoryButtons } from "./extensions/history-buttons";
import { InsertDropDown } from "./extensions/insert-actions";
import { ListButtons } from "./extensions/list-buttons";
import { TableButtons } from "./extensions/table-buttons";
import { TextCaseMenu } from "./extensions/text-case-menu";
import { TextFormatButtons } from "./extensions/text-format-buttons";
import { ToolbarButton } from "./extensions/toolbar-button";
import { useSpeechToTextState } from "../../plugins/speech-to-text";

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
  isUppercase: false,
  isLowercase: false,
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

export type ToolbarState = typeof initialState;
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

export function Toolbar({
  enableSpeechToText = false,
}: {
  enableSpeechToText?: boolean;
}) {
  const [editor] = useLexicalComposerContext();
  const [toolbarState, dispatch] = useReducer(toolbarReducer, initialState);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showEquationDialog, setShowEquationDialog] = useState(false);
  const [showExcalidrawModal, setShowExcalidrawModal] = useState(false);
  const { isListening: isSpeechToTextActive } = useSpeechToTextState();

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
        isUppercase: false,
        isLowercase: false,
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
        newToolbarState.isUppercase = selection.hasFormat("uppercase");
        newToolbarState.isLowercase = selection.hasFormat("lowercase");
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
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload: boolean) => {
          dispatch({ type: "SET_CAN_UNDO", payload });
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload: boolean) => {
          dispatch({ type: "SET_CAN_REDO", payload });
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor, updateToolbar]);

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
    const validRows = Math.max(1, Math.min(rows, 20));
    const validColumns = Math.max(1, Math.min(columns, 20));
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: validColumns.toString(),
      rows: validRows.toString(),
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
    <div className="flex relative items-center gap-1 p-3 border-b flex-wrap">
      <HistoryButtons
        canRedo={toolbarState.canRedo}
        canUndo={toolbarState.canUndo}
      />

      <Separator />
      <BlockFormatDropDown blockType={toolbarState.blockType} />

      <Separator />

      <ListButtons toolbarState={toolbarState} />
      <BlockTypeButtons toolbarState={toolbarState} />

      <Separator />

      <TextFormatButtons toolbarState={toolbarState} />
      <TextCaseMenu toolbarState={toolbarState} />
      <Separator />
      <ColorPicker editor={editor} />

      <Menu>
        <MenuTrigger
          render={
            <ToolbarButton
              icon={Highlighter}
              isActive={toolbarState.isHighlight}
              title="Highlight"
            />
          }
        />
        <MenuPopup className="animate-in slide-in-from-top-2 duration-200">
          {HIGHLIGHT_COLORS.map((color) => (
            <MenuItem
              className="hover:bg-accent/80 transition-colors"
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
            >
              <div
                className="size-4 rounded-sm mr-2 border shadow-sm"
                style={{ backgroundColor: color.value }}
              />
              {color.name}
            </MenuItem>
          ))}
          <MenuSeparator />
          <MenuItem
            className="hover:bg-accent/80 transition-colors"
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
          </MenuItem>
        </MenuPopup>
      </Menu>
      <Separator />
      <LinkPopover
        isOpen={showLinkDialog}
        initialUrl=""
        onClose={() => setShowLinkDialog(false)}
        onSubmit={handleLinkSubmit}
        trigger={
          <ToolbarButton
            icon={LinkIcon}
            isActive={toolbarState.isLink}
            onClick={insertLink}
            title="Insert Link"
          />
        }
      />

      <Separator />

      <InsertDropDown
        setShowImageDialog={setShowImageDialog}
        setShowTableDialog={setShowTableDialog}
        setShowEquationDialog={setShowEquationDialog}
        setShowExcalidrawModal={setShowExcalidrawModal}
      />

      {toolbarState.isTable && (
        <>
          <Separator />
          <TableButtons />
        </>
      )}

      <Separator />

      <AlignButtons />

      {enableSpeechToText && (
        <>
          <Separator />
          <ToolbarButton
            icon={isSpeechToTextActive ? MicOff : Mic}
            isActive={isSpeechToTextActive}
            onClick={() => {
              const event = new CustomEvent("toggle-speech-to-text");
              window.dispatchEvent(event);
            }}
            title={
              isSpeechToTextActive
                ? "Stop Speech to Text"
                : "Start Speech to Text"
            }
          />
        </>
      )}

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

      {showEquationDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg border bg-popover shadow-lg">
            <InsertEquationDialog
              activeEditor={editor}
              onClose={() => setShowEquationDialog(false)}
            />
          </div>
        </div>
      )}

      {showExcalidrawModal && (
        <ExcalidrawModal
          initialElements={[]}
          initialAppState={{} as AppState}
          initialFiles={{}}
          isShown={showExcalidrawModal}
          onDelete={() => setShowExcalidrawModal(false)}
          onClose={() => setShowExcalidrawModal(false)}
          onSave={(elements, appState, files) => {
            editor.update(() => {
              const excalidrawNode = $createExcalidrawNode();
              excalidrawNode.setData(
                JSON.stringify({
                  appState,
                  elements,
                  files,
                })
              );
              $insertNodes([excalidrawNode]);
              if ($isRootOrShadowRoot(excalidrawNode.getParentOrThrow())) {
                $wrapNodeInElement(
                  excalidrawNode,
                  $createParagraphNode
                ).selectEnd();
              }
            });

            setShowExcalidrawModal(false);
          }}
          closeOnClickOutside={false}
        />
      )}

      <Separator />

      <FileActions />
    </div>
  );
}
