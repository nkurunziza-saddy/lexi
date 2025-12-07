import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from "@/components/ui/popover";

export function LinkPopover({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = "",
  trigger,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  initialUrl?: string;
  trigger: React.ReactNode;
}) {
  const [url, setUrl] = useState(initialUrl);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
    }
  }, [isOpen, initialUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
      onClose();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <PopoverTrigger nativeButton={false} render={<div />}>
        {trigger}
      </PopoverTrigger>
      <PopoverPopup className="w-80" side="bottom" align="start">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <Label className="text-sm font-medium" htmlFor="url">
              URL
            </Label>
            <Input
              autoFocus
              className="mt-1.5 focus:ring-2 focus:ring-primary/20 transition-all"
              id="url"
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  onClose();
                }
              }}
              placeholder="https://example.com"
              value={url}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              size="sm"
              type="submit"
            >
              Insert Link
            </Button>
          </div>
        </form>
      </PopoverPopup>
    </Popover>
  );
}
