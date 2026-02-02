import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/menu";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

const LAYOUTS = [
  { label: "2 columns (equal width)", value: "1fr 1fr" },
  { label: "2 columns (25% - 75%)", value: "1fr 3fr" },
  { label: "3 columns (equal width)", value: "1fr 1fr 1fr" },
  { label: "3 columns (25% - 50% - 25%)", value: "1fr 2fr 1fr" },
  { label: "4 columns (equal width)", value: "1fr 1fr 1fr 1fr" },
];

export function LayoutDialog({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (template: string) => void;
}) {
  const [layout, setLayout] = useState(LAYOUTS[0].value);
  const selectedLayout = LAYOUTS.find((l) => l.value === layout);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(layout);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md backdrop-blur-md bg-background/95">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Insert Columns
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid gap-2">
            <Label className="text-sm font-medium" htmlFor="layout">
              Column Layout
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="w-full justify-between font-normal h-10 px-3"
                    id="layout"
                  >
                    {selectedLayout?.label}
                    <ChevronDown className="size-4 opacity-50" />
                  </Button>
                }
              />
              <DropdownMenuContent className="w-(--base-ui-menu-trigger-width)">
                {LAYOUTS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setLayout(option.value)}
                    className="flex flex-col items-start gap-1 py-2"
                  >
                    <span className="font-medium text-xs">{option.label}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {option.value}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 px-6"
            >
              Insert Columns
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
