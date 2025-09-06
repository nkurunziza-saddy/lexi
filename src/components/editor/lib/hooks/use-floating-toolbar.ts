import { useState, useCallback, useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { mergeRegister } from "@lexical/utils";

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

  const updateToolbar = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
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
        if (selection.hasFormat("bold")) formats.add("bold");
        if (selection.hasFormat("italic")) formats.add("italic");
        if (selection.hasFormat("underline")) formats.add("underline");
        if (selection.hasFormat("code")) formats.add("code");
        if (selection.hasFormat("strikethrough")) formats.add("strikethrough");
        if (selection.hasFormat("superscript")) formats.add("superscript");
        if (selection.hasFormat("subscript")) formats.add("subscript");

        setActiveFormats(formats);

        setIsVisible(true);

        requestAnimationFrame(() => {
          const newPosition = calculatePosition(rect);
          setPosition(newPosition);
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
        updateToolbar();
      }
    };

    const handleResize = () => {
      if (isVisible) {
        const nativeSelection = window.getSelection();
        if (nativeSelection && nativeSelection.rangeCount > 0) {
          const domRange = nativeSelection.getRangeAt(0);
          const rect = domRange.getBoundingClientRect();
          const newPosition = calculatePosition(rect);
          setPosition(newPosition);
        }
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
  }, [editor, isVisible, updateToolbar]);

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
