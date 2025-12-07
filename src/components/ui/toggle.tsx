"use client";

import { Toggle as TogglePrimitive } from "@base-ui-components/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm border text-sm font-medium whitespace-nowrap outline-none select-none hover:bg-accent/50 focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-64 data-pressed:bg-accent data-pressed:text-accent-foreground data-pressed:transition-none dark:hover:bg-accent dark:data-pressed:bg-input/80 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border dark:hover:bg-input/64",
      },
      size: {
        default: "h-8 min-w-8 px-[calc(--spacing(2)-1px)]",
        sm: "h-7 min-w-7 px-[calc(--spacing(1.5)-1px)]",
        lg: "h-9 min-w-9 px-[calc(--spacing(2.5)-1px)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
