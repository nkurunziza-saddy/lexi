import { Button } from "@/components/ui/button";
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
      <Button
        variant={isActive ? "secondary" : "ghost"}
        size="sm"
        onClick={onClick}
        title={title}
        className="hover:bg-accent/80 transition-all duration-200"
      >
        <Icon className="size-4" />
      </Button>
    </div>
  );
}
