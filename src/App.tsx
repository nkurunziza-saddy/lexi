"use client";

import type React from "react";
import { type JSX, useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, cubicBezier } from "motion/react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";

// Essential nodes
import {
  HeadingNode,
  QuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from "@lexical/rich-text";
import { ListItemNode, ListNode, $isListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode, $isCodeNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";

// Lexical commands and utilities
import {
  type LexicalEditor,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  type SerializedLexicalNode,
} from "lexical";
import {
  $setBlocksType,
  $patchStyleText,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
} from "@lexical/list";
import { $createCodeNode } from "@lexical/code";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import { INSERT_TABLE_COMMAND } from "@lexical/table";

// UI Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Icons
import {
  Bold,
  Italic,
  Underline,
  Code,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Plus,
  Table,
  ImageIcon,
  ListChecks,
  Highlighter,
  Subscript,
  Superscript,
  Upload,
  Palette,
  Strikethrough,
} from "lucide-react";

// Premium animation configurations
const springTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

const smoothTransition = {
  duration: 0.2,
  ease: cubicBezier(0.4, 0, 0.2, 1),
};

// Highlight colors with premium palette
const HIGHLIGHT_COLORS = [
  { name: "Golden", value: "rgba(255, 235, 59, 0.3)" },
  { name: "Emerald", value: "rgba(16, 185, 129, 0.3)" },
  { name: "Sky", value: "rgba(14, 165, 233, 0.3)" },
  { name: "Rose", value: "rgba(244, 63, 94, 0.3)" },
  { name: "Violet", value: "rgba(139, 92, 246, 0.3)" },
  { name: "Amber", value: "rgba(245, 158, 11, 0.3)" },
];

const FONT_COLORS = [
  { name: "Default", value: "hsl(var(--foreground))" },
  { name: "Muted", value: "hsl(var(--muted-foreground))" },
  { name: "Slate", value: "#64748b" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Emerald", value: "#10b981" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Rose", value: "#f43f5a" },
  { name: "Indigo", value: "#6366f1" },
];

// Custom Image Node
type ImageNodeSerialized = {
  src: string;
  alt: string;
  type: string;
  version: 1;
} & SerializedLexicalNode;

class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  static importJSON(serializedNode: ImageNodeSerialized): ImageNode {
    const { src, alt } = serializedNode;
    return new ImageNode(src, alt);
  }

  exportJSON(): ImageNodeSerialized {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      alt: this.__alt,
    } as ImageNodeSerialized;
  }

  constructor(src: string, alt = "Image", key?: string) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }

  createDOM(): HTMLElement {
    const div = document.createElement("div");
    div.className = "image-node";
    return div;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springTransition}
        className="my-4"
      >
        <img
          src={this.__src || "/placeholder.svg"}
          alt={this.__alt}
          className="max-w-full h-auto rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
        />
      </motion.div>
    );
  }
}

function $createImageNode(src: string, alt?: string): ImageNode {
  return new ImageNode(src, alt);
}

// Enhanced floating toolbar with premium animations
function FloatingToolbar() {
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

        // Update format buttons
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

          {/* Highlight dropdown with enhanced animation */}
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

// Enhanced Link Dialog with premium styling
function LinkDialog({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  initialUrl?: string;
}) {
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
    }
  }, [isOpen, initialUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md backdrop-blur-md bg-background/95">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={springTransition}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Insert Link
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="url" className="text-sm font-medium">
                    URL
                  </Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    autoFocus
                    className="mt-1.5 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Insert Link
                  </Button>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

// Enhanced Table Dialog
function TableDialog({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rows: number, columns: number) => void;
}) {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rows, columns);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md backdrop-blur-md bg-background/95">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={springTransition}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Insert Table
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rows" className="text-sm font-medium">
                      Rows
                    </Label>
                    <Input
                      id="rows"
                      type="number"
                      min="1"
                      max="20"
                      value={rows}
                      onChange={(e) =>
                        setRows(
                          Math.max(1, Number.parseInt(e.target.value) || 1)
                        )
                      }
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="columns" className="text-sm font-medium">
                      Columns
                    </Label>
                    <Input
                      id="columns"
                      type="number"
                      min="1"
                      max="20"
                      value={columns}
                      onChange={(e) =>
                        setColumns(
                          Math.max(1, Number.parseInt(e.target.value) || 1)
                        )
                      }
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Insert Table
                  </Button>
                </div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

// Enhanced Image Dialog
function ImageDialog({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (src: string, alt?: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim(), alt.trim() || "Image");
    }
    onClose();
    setUrl("");
    setAlt("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onSubmit(result, file.name);
          onClose();
          setUrl("");
          setAlt("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md backdrop-blur-md bg-background/95">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={springTransition}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Insert Image
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="image-url" className="text-sm font-medium">
                      Image URL
                    </Label>
                    <Input
                      id="image-url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image-alt" className="text-sm font-medium">
                      Alt Text (optional)
                    </Label>
                    <Input
                      id="image-alt"
                      value={alt}
                      onChange={(e) => setAlt(e.target.value)}
                      placeholder="Describe the image"
                      className="mt-1.5"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={!url.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Insert Image
                    </Button>
                  </div>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-medium">
                      Or
                    </span>
                  </div>
                </div>

                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full hover:bg-accent/80 transition-colors bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="size-4 mr-2" />
                    Upload from Computer
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}

// Toolbar state hook
function useToolbarState() {
  const [toolbarState, setToolbarState] = useState({
    isHeading1: false,
    isHeading2: false,
    isHeading3: false,
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
    blockType: "paragraph",
    canUndo: false,
    canRedo: false,
  });

  return { toolbarState, setToolbarState };
}

function ColorPicker({
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

// Main toolbar component with enhanced animations
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { toolbarState, setToolbarState } = useToolbarState();
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  // Update toolbar state based on selection
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

        // Block type
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

        // Link check
        let isLink = false;
        let node:
          | import("lexical").ElementNode
          | import("lexical").TextNode
          | null = anchorNode;
        while (node) {
          if ($isLinkNode(node)) {
            isLink = true;
            break;
          }
          const parent: import("lexical").ElementNode | null = node.getParent();
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
      {/* Undo/Redo with enhanced animations */}
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

      {/* Inline Block Format */}

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

      {/* Text Format with enhanced button styling */}
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

      {/* Highlight dropdown */}
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

      {/* Insert Menu */}
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

      {/* Alignment */}
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

      {/* Dialogs */}
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

// Premium theme configuration with proper checklist support
const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "text-muted-foreground/70",
  paragraph: "mb-3 leading-relaxed",
  quote:
    "border-l-4 border-gradient-to-b from-primary/60 to-primary/20 pl-6 py-2 italic text-muted-foreground/90 my-6 bg-accent/20 rounded-r-lg",
  heading: {
    h1: "text-4xl font-bold mb-6 mt-8 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent",
    h2: "text-3xl font-semibold mb-4 mt-6 text-foreground/95",
    h3: "text-2xl font-medium mb-3 mt-5 text-foreground/90",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal ml-6 mb-4 space-y-1",
    ul: "list-disc ml-6 mb-4 space-y-1",
    listitem: "mb-2 leading-relaxed",
    checklist: "list-none ml-0 mb-4 space-y-2",
    listitemChecked:
      "flex items-start gap-3 mb-2 text-muted-foreground/70 line-through transition-all duration-200",
    listitemUnchecked:
      "flex items-start gap-3 mb-2 transition-all duration-200",
  },
  text: {
    bold: "font-semibold text-foreground",
    italic: "italic",
    underline: "underline decoration-2 underline-offset-2",
    code: "bg-accent/80 px-2 py-1 rounded-md text-sm font-mono border shadow-sm",
    highlight: "px-1 py-0.5 rounded-sm",
    subscript: "text-xs align-sub",
    superscript: "text-xs align-super",
  },
  code: "bg-accent/60 p-4 rounded-xl font-mono text-sm my-6 overflow-x-auto block border shadow-sm backdrop-blur-sm",
  link: "text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary/60 underline-offset-2 transition-all duration-200 cursor-pointer",
  table:
    "border-collapse table-auto w-full my-6 border border-border/60 rounded-lg overflow-hidden shadow-sm",
  tableCell:
    "border border-border/40 px-4 py-3 min-w-[100px] transition-colors hover:bg-accent/20",
  tableCellHeader:
    "border border-border/40 px-4 py-3 bg-accent/60 font-semibold min-w-[100px] backdrop-blur-sm",
  hr: "my-8 border-t border-gradient-to-r from-transparent via-border to-transparent",
};

// Essential nodes including new ones
const nodes = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
  AutoLinkNode,
  HorizontalRuleNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  ImageNode,
];

function onError(error: Error) {
  console.error("Lexical error:", error);
}

export default function App() {
  const initialConfig = {
    namespace: "PremiumEditor",
    theme,
    onError,
    nodes,
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <LexicalComposer initialConfig={initialConfig}>
        <motion.div
          className="relative"
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <ToolbarPlugin />
          <div className="relative max-w-6xl mx-auto my-6">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="p-8 outline-none prose prose-lg max-w-none transition-all duration-300"
                  style={{
                    minHeight: "600px",
                    caretColor: "hsl(var(--primary))",
                    lineHeight: "1.7",
                  }}
                />
              }
              placeholder={
                <motion.div
                  className="absolute top-8 left-8 text-muted-foreground/60 pointer-events-none select-none text-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Start writing your masterpiece...
                </motion.div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <LinkPlugin />
            <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
            <HorizontalRulePlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <FloatingToolbar />
          </div>
        </motion.div>
      </LexicalComposer>
    </motion.div>
  );
}
