import { Toggle } from "@/components/ui/toggle";
import type { LucideIcon } from "lucide-react";

interface Props {
  onClick: () => void;
  isActive: boolean;
  icon: LucideIcon;
  title: string;
}

export function ToolbarButton({ onClick, isActive, icon: Icon, title }: Props) {
  return (
    <div>
      <Toggle
        pressed={isActive}
        onPressedChange={onClick}
        size="sm"
        variant="outline"
        title={title}
        aria-label={title}
        onMouseDown={(e) => e.preventDefault()}
      >
        <Icon aria-hidden="true" />
      </Toggle>
    </div>
  );
}
