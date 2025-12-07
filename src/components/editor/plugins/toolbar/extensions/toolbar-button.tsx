import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, type buttonVariants } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

interface ToggleProps {
  onClick: () => void;
  isActive: boolean;
  icon: LucideIcon;
  title: string;
}

export function ToolbarToggleButton({
  onClick,
  isActive,
  icon: Icon,
  title,
}: ToggleProps) {
  return (
    <Toggle
      onMouseDown={(e) => e.preventDefault()}
      onPressedChange={onClick}
      pressed={isActive}
      size="sm"
      title={title}
    >
      <Icon className="size-4" />
    </Toggle>
  );
}

type ToolbarButtonProps = React.ComponentProps<typeof Button> &
  Partial<VariantProps<typeof buttonVariants>> & {
    isActive?: boolean;
    icon?: LucideIcon;
    children?: React.ReactNode;
  };

export const ToolbarButton = React.forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps
>(
  (
    {
      className,
      isActive = false,
      children,
      icon: Icon,
      variant,
      size = "icon-sm",
      ...props
    },
    ref
  ) => {
    return (
      <Button
        className={cn("h-7 w-7 px-[calc(--spacing(1.5)-1px)]", className)}
        ref={ref}
        size={size}
        variant={variant ?? (isActive ? "secondary" : "ghost")}
        {...props}
      >
        {children}
        {Icon && <Icon className="size-4" />}
      </Button>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";
