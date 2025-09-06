import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type TextFormatType,
} from "lexical";
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
  Palette,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useFloatingToolbar } from "../../lib/hooks/use-floating-toolbar";
import Separator from "../../components/toolbar-separator";

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "#fef08a" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Purple", value: "#e9d5ff" },
  { name: "Pink", value: "#fce7f3" },
  { name: "Orange", value: "#fed7aa" },
];

interface FormatItem {
  name: string;
  icon: LucideIcon;
  format: string;
  group: "basic" | "script" | "special";
}

const FORMAT_ITEMS: FormatItem[] = [
  { name: "Bold", icon: Bold, format: "bold", group: "basic" },
  { name: "Italic", icon: Italic, format: "italic", group: "basic" },
  { name: "Underline", icon: Underline, format: "underline", group: "basic" },
  {
    name: "Strikethrough",
    icon: Strikethrough,
    format: "strikethrough",
    group: "basic",
  },
  { name: "Code", icon: Code, format: "code", group: "special" },
  {
    name: "Superscript",
    icon: Superscript,
    format: "superscript",
    group: "script",
  },
  { name: "Subscript", icon: Subscript, format: "subscript", group: "script" },
];

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  icon: LucideIcon;
  title: string;
  disabled?: boolean;
}

function ToolbarButton({
  onClick,
  isActive,
  icon: Icon,
  title,
  disabled,
}: ToolbarButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`
        h-8 w-8 p-0 transition-all duration-150
        ${
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "hover:bg-muted"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseDown={(e) => e.preventDefault()}
    >
      <Icon className="size-4" />
    </Button>
  );
}

export function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const { toolbarRef, isVisible, position, activeFormats, selectedText } =
    useFloatingToolbar();

  const formatText = useCallback(
    (format: string) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format as TextFormatType);
      editor.focus();
    },
    [editor]
  );

  const formatHighlight = useCallback(
    (color: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            "background-color": color || "transparent",
          });
        }
      });
      editor.focus();
    },
    [editor]
  );

  const groupedItems = useMemo(() => {
    const groups = FORMAT_ITEMS.reduce((acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    }, {} as Record<string, FormatItem[]>);

    return groups;
  }, []);

  if (!isVisible) return null;

  return createPortal(
    <div
      ref={toolbarRef}
      className="absolute z-50 flex items-center gap-1 p-2 bg-popover/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg transition-all duration-200 ease-out"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        opacity: position.opacity,
        transform: position.opacity === 1 ? "scale(1)" : "scale(0.95)",
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {groupedItems.basic?.map((item) => (
        <ToolbarButton
          key={item.name}
          onClick={() => formatText(item.format)}
          isActive={activeFormats.has(item.format)}
          icon={item.icon}
          title={item.name}
        />
      ))}

      <Separator />

      {groupedItems.special?.map((item) => (
        <ToolbarButton
          key={item.name}
          onClick={() => formatText(item.format)}
          isActive={activeFormats.has(item.format)}
          icon={item.icon}
          title={item.name}
        />
      ))}

      <Separator />

      {groupedItems.script?.map((item) => (
        <ToolbarButton
          key={item.name}
          onClick={() => formatText(item.format)}
          isActive={activeFormats.has(item.format)}
          icon={item.icon}
          title={item.name}
        />
      ))}

      <Separator />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted"
            title="Highlight"
          >
            <Highlighter className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-48 animate-in slide-in-from-top-2 duration-200"
          align="center"
        >
          <div className="grid grid-cols-3 gap-1 p-2">
            {HIGHLIGHT_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => formatHighlight(color.value)}
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-muted/50 transition-colors"
                title={color.name}
              >
                <div
                  className="w-6 h-4 rounded border border-border/50 shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-xs text-muted-foreground">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => formatHighlight("")}
            className="flex items-center gap-2"
          >
            <Palette className="size-4" />
            Remove Highlight
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedText.length > 50 && (
        <>
          <Separator />
          <div className="text-xs text-muted-foreground px-2">
            {selectedText.length} chars
          </div>
        </>
      )}
    </div>,
    document.body
  );
}
