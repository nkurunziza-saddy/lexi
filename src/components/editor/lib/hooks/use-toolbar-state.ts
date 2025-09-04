import { useState } from "react";

export function useToolbarState() {
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
    isTextCode: false,
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
