"use client";

import { Input as InputPrimitive } from "@base-ui-components/react/input";

import { cn } from "@/lib/utils";

function Input({
  className,
  size = "default",
  ...props
}: Omit<InputPrimitive.Props, "size"> & {
  size?: "sm" | "default" | "lg" | number;
}) {
  return (
    <span
      data-slot="input-control"
      className={cn(
        "relative inline-flex w-full rounded-sm border border-input bg-background text-sm has-focus-visible:border-ring has-focus-visible:ring-2 has-focus-visible:ring-ring/50 has-disabled:opacity-64 has-aria-invalid:border-destructive/36 has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16",
        className
      )}
    >
      <InputPrimitive
        data-slot="input"
        className={cn(
          "w-full min-w-0 rounded-[inherit] px-2.5 py-1.5 outline-none placeholder:text-muted-foreground/72",
          size === "sm" && "px-2.5 py-1",
          size === "lg" && "py-2",
          props.type === "search" &&
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
          props.type === "file" &&
            "text-muted-foreground file:me-3 file:bg-transparent file:text-sm file:font-medium file:text-foreground"
        )}
        size={typeof size === "number" ? size : undefined}
        {...props}
      />
    </span>
  );
}

export { Input };
