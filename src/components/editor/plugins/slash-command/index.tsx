import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  LexicalTypeaheadMenuPlugin,
  useBasicTypeaheadTriggerMatch,
  MenuOption,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { TextNode } from "lexical";
import { useCallback, useMemo, useState } from "react";
import { SLASH_COMMANDS, type SlashCommand } from "./slash-command-items";
import { createPortal } from "react-dom";
import { SlashCommandMenuItem } from "./slash-command-menu-item";

class SlashCommandOption extends MenuOption {
  command: SlashCommand;

  constructor(command: SlashCommand) {
    super(command.title);
    this.command = command;
  }
}

export default function SlashCommandPlugin() {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState<string | null>(null);

  const triggerFn = useBasicTypeaheadTriggerMatch("/", { minLength: 0 });

  const options = useMemo(() => {
    const filteredCommands = query
      ? SLASH_COMMANDS.filter(
          (cmd) =>
            cmd.title.toLowerCase().includes(query.toLowerCase()) ||
            cmd.keywords.some((keyword) =>
              keyword.toLowerCase().includes(query.toLowerCase())
            )
        )
      : SLASH_COMMANDS;

    return filteredCommands.map((cmd) => new SlashCommandOption(cmd));
  }, [query]);

  const onSelectOption = useCallback(
    (
      option: SlashCommandOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        option.command.action(editor);
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQuery}
      onSelectOption={onSelectOption}
      triggerFn={triggerFn}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) => {
        const anchorElement = anchorElementRef.current;

        if (!anchorElement || options.length === 0) {
          return null;
        }

        const rect = anchorElement.getBoundingClientRect();

        return createPortal(
          <div
            className="mt-1 absolute z-50 w-44 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 shadow-md"
            style={{
              top: rect.bottom + window.scrollY + 1,
              left: rect.left + window.scrollX,
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {options.map((option, i) => (
              <SlashCommandMenuItem
                isSelected={selectedIndex === i}
                onClick={() => {
                  setHighlightedIndex(i);
                  selectOptionAndCleanUp(option);
                }}
                onMouseEnter={() => {
                  setHighlightedIndex(i);
                }}
                key={option.key}
                command={option.command}
              />
            ))}
          </div>,
          document.body
        );
      }}
    />
  );
}
