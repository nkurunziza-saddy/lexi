import * as React from "react";
import { Button as BaseButton } from "@base-ui-components/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm border text-sm font-medium whitespace-nowrap outline-none focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-64 pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border-border bg-background hover:bg-accent/50",
        secondary:
          "border-secondary bg-secondary text-secondary-foreground hover:bg-secondary/90",
        destructive:
          "border-destructive bg-destructive text-white hover:bg-destructive/90",
        "destructive-outline":
          "border-border bg-transparent text-destructive-foreground hover:border-destructive/32 hover:bg-destructive/4",
        ghost: "border-transparent hover:bg-accent data-pressed:bg-accent",
        link: "border-transparent underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-8 px-3 py-1.5",
        xs: "min-h-6 gap-1 rounded-sm px-2 py-1 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-7 gap-1.5 px-2.5 py-1",
        lg: "min-h-9 px-4 py-2",
        xl: "min-h-10 px-5 py-2.5 text-base [&_svg:not([class*='size-'])]:size-4.5",
        icon: "size-8",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<typeof BaseButton> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <BaseButton
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
