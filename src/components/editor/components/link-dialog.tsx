import type React from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LinkDialog({
  isOpen,
  onClose,
  onSubmit,
  initialUrl = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  initialUrl?: string;
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
    }
    onClose();
  };

  return (
    <>
      {isOpen && (
        <Dialog onOpenChange={onClose} open={isOpen}>
          <DialogContent
            aria-describedby="link-dialog"
            className="sm:max-w-md backdrop-blur-md bg-background/95"
          >
            <div>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Insert Link
                </DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <div>
                  <Label className="text-sm font-medium" htmlFor="url">
                    URL
                  </Label>
                  <Input
                    autoFocus
                    className="mt-1.5 focus:ring-2 focus:ring-primary/20 transition-all"
                    id="url"
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    value={url}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button onClick={onClose} type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    type="submit"
                  >
                    Insert Link
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
