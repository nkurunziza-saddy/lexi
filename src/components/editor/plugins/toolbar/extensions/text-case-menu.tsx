import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { CaseLower, CaseUpper, type LucideIcon } from "lucide-react";
import { useCallback } from "react";
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuTrigger,
} from "@/components/ui/menu";
import type { ToolbarState } from "..";
import { ToolbarButton } from "./toolbar-button";

interface TextCaseOption {
  name: string;
  icon: LucideIcon;
  format: "capitalize" | "uppercase" | "lowercase";
}

const TEXT_CASE_OPTIONS: TextCaseOption[] = [
  { name: "Capitalize", icon: CaseUpper, format: "capitalize" },
  { name: "Uppercase", icon: CaseUpper, format: "uppercase" },
  { name: "Lowercase", icon: CaseLower, format: "lowercase" },
];

export function TextCaseMenu({
  toolbarState,
}: {
  toolbarState: ToolbarState;
}) {
  const [editor] = useLexicalComposerContext();

  const handleCaseChange = useCallback(
    (format: "capitalize" | "uppercase" | "lowercase") => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
      editor.focus();
    },
    [editor]
  );

  const isActive =
    toolbarState.isCapitalized ||
    toolbarState.isUppercase ||
    toolbarState.isLowercase;

  const activeFormat = toolbarState.isCapitalized
    ? "capitalize"
    : toolbarState.isUppercase
      ? "uppercase"
      : toolbarState.isLowercase
        ? "lowercase"
        : null;

  return (
    <Menu>
      <MenuTrigger
        render={
          <ToolbarButton
            icon={CaseUpper}
            isActive={isActive}
            title="Text Case"
          />
        }
      />
      <MenuPopup className="min-w-32">
        {TEXT_CASE_OPTIONS.map((option) => (
          <MenuItem
            key={option.format}
            onClick={() => handleCaseChange(option.format)}
            className={activeFormat === option.format ? "bg-accent" : ""}
          >
            <option.icon className="size-4" />
            <span>{option.name}</span>
          </MenuItem>
        ))}
      </MenuPopup>
    </Menu>
  );
}

