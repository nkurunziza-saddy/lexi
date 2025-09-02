import React, {
  type JSX,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
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
  type RangeSelection,
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
  $createParagraphNode,
  $createTextNode,
  DecoratorNode,
  KEY_ESCAPE_COMMAND,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Link as LinkIcon,
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
  ChevronDown,
  Minus,
  Plus,
  Type,
  Table,
  Image,
  ListChecks,
  Highlighter,
  Subscript,
  Superscript,
  Upload,
  Palette,
} from "lucide-react";

// Highlight colors
const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#fff59d" },
  { name: "Green", value: "#c8e6c9" },
  { name: "Blue", value: "#bbdefb" },
  { name: "Pink", value: "#f8bbd9" },
  { name: "Orange", value: "#ffcc80" },
];

const FONT_COLORS = [
  { name: "Default", value: "#000000" },
  { name: "Gray", value: "#888888" },
  { name: "Brown", value: "#A35200" },
  { name: "Orange", value: "#FF7C00" },
  { name: "Yellow", value: "#FFC800" },
  { name: "Green", value: "#00A352" },
  { name: "Blue", value: "#0084FF" },
  { name: "Purple", value: "#8400FF" },
  { name: "Red", value: "#FF0000" },
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

  constructor(src: string, alt: string = "Image", key?: string) {
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
      <img
        src={this.__src}
        alt={this.__alt}
        className="max-w-full h-auto rounded-md my-4"
      />
    );
  }
}

function $createImageNode(src: string, alt?: string): ImageNode {
  return new ImageNode(src, alt);
}

function FloatingLinkEditor() {
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState("");
  const [isLink, setIsLink] = useState(false);
  const [lastSelection, setLastSelection] = useState<RangeSelection | null>(
    null
  );
  const popoverRef = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    editor.read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = selection.anchor.getNode();
        const parent = node.getParent();
        if ($isLinkNode(parent)) {
          setLinkUrl(parent.getURL());
          setIsLink(true);
        } else if ($isLinkNode(node)) {
          setLinkUrl(node.getURL());
          setIsLink(true);
        } else {
          setIsLink(false);
        }
        setLastSelection(selection.clone());
      }
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        update();
      });
    });
  }, [editor, update]);

  const handleEdit = () => {
    if (isLink && lastSelection) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
    }
  };

  if (!isLink || !lastSelection) {
    return null;
  }

  return createPortal(
    <div ref={popoverRef} className="fixed z-50">
      <Popover open={isLink}>
        <PopoverTrigger asChild>
          <div
            style={{
              position: "absolute",
              ...editor
                .getElementByKey(lastSelection.anchor.key)
                ?.getBoundingClientRect(),
            }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-80 flex items-center gap-2">
          <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
          <Button onClick={handleEdit} size="sm">
            Save
          </Button>
          <Button
            onClick={() => editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)}
            size="sm"
            variant="destructive"
          >
            Remove
          </Button>
        </PopoverContent>
      </Popover>
    </div>,
    document.body
  );
}

// Fixed floating toolbar that only shows on text selection
function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const updateToolbar = useCallback(() => {
    editor.read(() => {
      const selection = $getSelection();
      const toolbar = toolbarRef.current;

      if (
        $isRangeSelection(selection) &&
        !selection.isCollapsed() &&
        selection.getTextContent() !== "" &&
        toolbar
      ) {
        const nativeSelection = window.getSelection();
        if (!nativeSelection || nativeSelection.rangeCount === 0) {
          toolbar.style.opacity = "0";
          toolbar.style.top = "-1000px";
          return;
        }
        const domRange = nativeSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();

        toolbar.style.opacity = "1";
        toolbar.style.top = `${rect.top + window.pageYOffset - 60}px`;
        toolbar.style.left = `${
          rect.left + window.pageXOffset + rect.width / 2
        }px`;

        // Update format buttons
        const formats = new Set<string>();
        if (selection.hasFormat("bold")) formats.add("bold");
        if (selection.hasFormat("italic")) formats.add("italic");
        if (selection.hasFormat("underline")) formats.add("underline");
        if (selection.hasFormat("code")) formats.add("code");
        setActiveFormats(formats);
      } else if (toolbar) {
        toolbar.style.opacity = "0";
        toolbar.style.top = "-1000px";
      }
    });
  }, [editor]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const toolbar = toolbarRef.current;
      const editorRoot = editor.getRootElement();
      if (
        toolbar &&
        !toolbar.contains(event.target as Node) &&
        !editorRoot?.contains(event.target as Node)
      ) {
        toolbar.style.opacity = "0";
        toolbar.style.top = "-1000px";
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editor]);

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
    <div
      ref={toolbarRef}
      className="fixed z-50 flex items-center gap-1 p-2 bg-popover border rounded-md shadow-md transition-opacity duration-200"
      style={{
        opacity: 0,
        top: "-1000px",
        transform: "translateX(-50%)",
      }}
      onMouseDown={(e) => e.preventDefault()} // Prevent editor from losing focus
    >
      <Button
        variant={activeFormats.has("bold") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant={activeFormats.has("italic") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant={activeFormats.has("underline") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <Underline className="w-4 h-4" />
      </Button>

      {/* Highlight dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <Highlighter className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
            >
              <div
                className="w-4 h-4 rounded mr-2 border"
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

      <Button
        variant={activeFormats.has("code") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
      >
        <Code className="w-4 h-4" />
      </Button>
    </div>,
    document.body
  );
}

// Fixed Link Dialog
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Insert Link</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Table Insert Dialog
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Table</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rows">Rows</Label>
            <Input
              id="rows"
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={(e) =>
                setRows(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
          </div>
          <div>
            <Label htmlFor="columns">Columns</Label>
            <Input
              id="columns"
              type="number"
              min="1"
              max="20"
              value={columns}
              onChange={(e) =>
                setColumns(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Insert Table</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Image Upload Dialog
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="image-url">Image URL</Label>
              <Input
                id="image-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Alt Text (optional)</Label>
              <Input
                id="image-alt"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!url.trim()}>
                Insert Image
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
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
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload from Computer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Toolbar state hook
function useToolbarState() {
  const [toolbarState, setToolbarState] = useState({
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
    fontColor: "#000000",
  });

  return { toolbarState, setToolbarState };
}

// Block format dropdown
function BlockFormatDropDown({
  editor,
  blockType,
  disabled = false,
}: {
  editor: LexicalEditor;
  blockType: string;
  disabled?: boolean;
}) {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const formatCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  };

  const getBlockIcon = () => {
    switch (blockType) {
      case "h1":
        return <Heading1 className="w-4 h-4" />;
      case "h2":
        return <Heading2 className="w-4 h-4" />;
      case "h3":
        return <Heading3 className="w-4 h-4" />;
      case "bullet":
        return <List className="w-4 h-4" />;
      case "number":
        return <ListOrdered className="w-4 h-4" />;
      case "check":
        return <ListChecks className="w-4 h-4" />;
      case "quote":
        return <Quote className="w-4 h-4" />;
      case "code":
        return <Code className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  const getBlockName = () => {
    switch (blockType) {
      case "h1":
        return "Heading 1";
      case "h2":
        return "Heading 2";
      case "h3":
        return "Heading 3";
      case "bullet":
        return "Bullet List";
      case "number":
        return "Numbered List";
      case "check":
        return "Check List";
      case "quote":
        return "Quote";
      case "code":
        return "Code Block";
      default:
        return "Normal";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 px-3" disabled={disabled}>
          {getBlockIcon()}
          <span className="ml-2 text-sm">{getBlockName()}</span>
          <ChevronDown className="ml-1 w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={formatParagraph}>
          <Type className="mr-2 w-4 h-4" />
          Normal
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => formatHeading("h1")}>
          <Heading1 className="mr-2 w-4 h-4" />
          Heading 1
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => formatHeading("h2")}>
          <Heading2 className="mr-2 w-4 h-4" />
          Heading 2
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => formatHeading("h3")}>
          <Heading3 className="mr-2 w-4 h-4" />
          Heading 3
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
          }
        >
          <List className="mr-2 w-4 h-4" />
          Bullet List
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
          }
        >
          <ListOrdered className="mr-2 w-4 h-4" />
          Numbered List
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
          }
        >
          <ListChecks className="mr-2 w-4 h-4" />
          Checklist
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={formatQuote}>
          <Quote className="mr-2 w-4 h-4" />
          Quote
        </DropdownMenuItem>
        <DropdownMenuItem onClick={formatCodeBlock}>
          <Code className="mr-2 w-4 h-4" />
          Code Block
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ColorPicker({
  editor,
  disabled = false,
}: {
  editor: LexicalEditor;
  disabled?: boolean;
}) {
  const [color, setColor] = useState("#000000");

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
              $getSelectionStyleValueForProperty(selection, "color", "#000000")
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
        <Button variant="ghost" size="sm" disabled={disabled}>
          <Palette className="w-4 h-4" style={{ color }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {FONT_COLORS.map((c) => (
          <DropdownMenuItem key={c.name} onClick={() => applyColor(c.value)}>
            <div
              className="w-4 h-4 rounded-full mr-2 border"
              style={{ backgroundColor: c.value }}
            />
            {c.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Main toolbar component
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
            "#000000"
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
    <div className="flex items-center gap-1 p-2 border-b bg-card flex-wrap">
      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="sm"
        disabled={!toolbarState.canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={!toolbarState.canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-2" />

      {/* Block Format */}
      <BlockFormatDropDown editor={editor} blockType={toolbarState.blockType} />

      <div className="w-px h-6 bg-border mx-2" />

      {/* Text Format */}
      <Button
        variant={toolbarState.isBold ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        variant={toolbarState.isItalic ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        variant={toolbarState.isUnderline ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
      >
        <Underline className="w-4 h-4" />
      </Button>
      <Button
        variant={toolbarState.isCode ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code")}
      >
        <Code className="w-4 h-4" />
      </Button>
      <Button
        variant={toolbarState.isSubscript ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")}
      >
        <Subscript className="w-4 h-4" />
      </Button>
      <Button
        variant={toolbarState.isSuperscript ? "secondary" : "ghost"}
        size="sm"
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")
        }
        title="Superscript"
      >
        <Superscript className="w-4 h-4" />
      </Button>

      <ColorPicker editor={editor} />

      {/* Highlight dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={toolbarState.isHighlight ? "secondary" : "ghost"}
            size="sm"
            title="Highlight"
          >
            <Highlighter className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
            >
              <div
                className="w-4 h-4 rounded mr-2 border"
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

      <Button
        variant={toolbarState.isLink ? "secondary" : "ghost"}
        size="sm"
        onClick={insertLink}
        title="Insert Link"
      >
        <LinkIcon className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-2" />

      {/* Insert Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" title="Insert">
            <Plus className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
            }
          >
            <Minus className="mr-2 w-4 h-4" />
            Divider
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowTableDialog(true)}>
            <Table className="mr-2 w-4 h-4" />
            Table
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowImageDialog(true)}>
            <Image className="mr-2 w-4 h-4" />
            Image
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-px h-6 bg-border mx-2" />

      {/* Alignment */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" title="Text Alignment">
            <AlignLeft className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
            }
          >
            <AlignLeft className="mr-2 w-4 h-4" />
            Left
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
            }
          >
            <AlignCenter className="mr-2 w-4 h-4" />
            Center
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
            }
          >
            <AlignRight className="mr-2 w-4 h-4" />
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
    </div>
  );
}

// Theme configuration with improved checklist styling
const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "text-muted-foreground",
  paragraph: "mb-2",
  quote: "border-l-4 border-border pl-4 italic text-muted-foreground my-4",
  heading: {
    h1: "text-3xl font-bold mb-4 mt-6",
    h2: "text-2xl font-semibold mb-3 mt-5",
    h3: "text-xl font-medium mb-2 mt-4",
  },
  list: {
    nested: {
      listitem: "list-none",
    },
    ol: "list-decimal ml-4 mb-2",
    ul: "list-disc ml-4 mb-2",
    listitem: "mb-1",
    checklist: "list-none ml-0 mb-2",
    listitemChecked:
      "flex items-center gap-2 mb-1 text-muted-foreground line-through",
    listitemUnchecked: "flex items-center gap-2 mb-1",
    listitemCheckboxChecked:
      "w-4 h-4 bg-muted border-2 border-border rounded-sm",
    listitemCheckboxUnchecked: "w-4 h-4 border-2 border-border rounded-sm",
  },
  text: {
    bold: "font-semibold",
    italic: "italic",
    underline: "underline",
    code: "bg-muted px-1 py-0.5 rounded text-sm font-mono",
    highlight: "bg-yellow-200 dark:bg-yellow-800",
    subscript: "text-xs align-sub",
    superscript: "text-xs align-super",
  },
  code: "bg-muted p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto block",
  link: "text-primary underline hover:no-underline cursor-pointer",
  table: "border-collapse table-auto w-full my-4 border border-border",
  tableCell: "border border-border px-4 py-2 min-w-[100px]",
  tableCellHeader:
    "border border-border px-4 py-2 bg-muted font-semibold min-w-[100px]",
  hr: "my-4 border-t border-border",
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
    namespace: "ImprovedEditor",
    theme,
    onError,
    nodes,
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <ToolbarPlugin />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="p-6 outline-none prose prose-sm max-w-none transition-all"
                  style={{
                    minHeight: "500px",
                    caretColor: "hsl(var(--primary))",
                  }}
                />
              }
              placeholder={
                <div className="absolute top-6 left-6 text-muted-foreground pointer-events-none select-none">
                  Start typing here... or type "/" for commands.
                </div>
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
            <FloatingLinkEditor />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}
