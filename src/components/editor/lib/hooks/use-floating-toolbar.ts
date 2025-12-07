import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

interface Position {
  top: number;
  left: number;
  opacity: number;
}

interface UseFloatingToolbarReturn {
  toolbarRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  position: Position;
  activeFormats: Set<string>;
  selectedText: string;
}

export function useFloatingToolbar(): UseFloatingToolbarReturn {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState<Position>({
    top: -1000,
    left: -1000,
    opacity: 0,
  });

  const calculatePosition = useCallback((rect: DOMRect): Position => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return { top: -1000, left: -1000, opacity: 0 };

    const toolbarRect = toolbar.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let top = rect.top + window.scrollY - toolbarRect.height - 10;
    let left =
      rect.left + window.scrollX + rect.width / 2 - toolbarRect.width / 2;

    if (left < 10) {
      left = 10;
    } else if (left + toolbarRect.width > viewport.width - 10) {
      left = viewport.width - toolbarRect.width - 10;
    }

    if (top < window.scrollY + 10) {
      top = rect.bottom + window.scrollY + 10;
    }

    return { top, left, opacity: 1 };
  }, []);

  const FORMATS = [
    "bold",
    "italic",
    "underline",
    "code",
    "strikethrough",
    "superscript",
    "subscript",
  ] as const;

  const updateToolbar = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    editor.read(() => {
      const selection = $getSelection();

      if (
        $isRangeSelection(selection) &&
        !selection.isCollapsed() &&
        selection.getTextContent().trim() !== ""
      ) {
        const nativeSelection = window.getSelection();
        if (!nativeSelection || nativeSelection.rangeCount === 0) {
          setIsVisible(false);
          return;
        }

        const domRange = nativeSelection.getRangeAt(0);
        const rect = domRange.getBoundingClientRect();
        const text = selection.getTextContent().trim();

        if (text.length < 2) {
          setIsVisible(false);
          return;
        }

        setSelectedText(text);

        const formats = new Set<string>();
        FORMATS.forEach((format) => {
          if (selection.hasFormat(format)) {
            formats.add(format);
          }
        });

        setActiveFormats(formats);
        setIsVisible(true);

        requestAnimationFrame(() => {
          const newPosition = calculatePosition(rect);
          setPosition((prev) => {
            if (
              Math.abs(prev.top - newPosition.top) > 1 ||
              Math.abs(prev.left - newPosition.left) > 1
            ) {
              return newPosition;
            }
            return prev;
          });
        });
      } else {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          setPosition((prev) => ({ ...prev, opacity: 0 }));
        }, 100);
      }
    });
  }, [editor, calculatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const editorRoot = editor.getRootElement();

      if (
        isVisible &&
        toolbarRef.current &&
        !toolbarRef.current.contains(target) &&
        !editorRoot?.contains(target)
      ) {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      if (isVisible) {
        requestAnimationFrame(() => {
          updateToolbar();
        });
      }
    };

    const handleResize = () => {
      if (isVisible) {
        requestAnimationFrame(() => {
          const nativeSelection = window.getSelection();
          if (nativeSelection && nativeSelection.rangeCount > 0) {
            const domRange = nativeSelection.getRangeAt(0);
            const rect = domRange.getBoundingClientRect();
            const newPosition = calculatePosition(rect);
            setPosition((prev) => {
              if (
                Math.abs(prev.top - newPosition.top) > 1 ||
                Math.abs(prev.left - newPosition.left) > 1
              ) {
                return newPosition;
              }
              return prev;
            });
          }
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [editor, isVisible, updateToolbar, calculatePosition]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(updateToolbar);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateToolbar]);

  return {
    toolbarRef,
    isVisible,
    position,
    activeFormats,
    selectedText,
  };
}
