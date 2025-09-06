import type { SlashCommand } from "./slash-command-items";

interface SlashCommandMenuItemProps {
  command: SlashCommand;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}

export function SlashCommandMenuItem({
  command,
  isSelected,
  onClick,
  onMouseEnter,
}: SlashCommandMenuItemProps) {
  const Icon = command.icon;
  return (
    <li
      className={`flex items-center group gap-3 p-2 rounded-md cursor-pointer transition-colors ${
        isSelected ? "bg-muted" : "hover:bg-muted/50"
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      role="option"
      aria-selected={isSelected}
      tabIndex={-1}
    >
      <Icon className="size-4 text-popover-foreground/80 group-hover:text-popover-foreground" />
      <span className="text-sm text-popover-foreground/80 group-hover:text-popover-foreground">
        {command.title}
      </span>
    </li>
  );
}
