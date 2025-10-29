import type React from "react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Validate URL to prevent XSS attacks
function isValidURL(url: string): { valid: boolean; error?: string } {
  if (!url.trim()) {
    return { valid: false, error: "URL cannot be empty" };
  }

  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return {
        valid: false,
        error: "Only http:// and https:// URLs are allowed",
      };
    }
    return { valid: true };
  } catch {
    // If URL constructor fails, try adding https:// prefix
    try {
      const prefixedUrl = `https://${url}`;
      new URL(prefixedUrl);
      return { valid: true };
    } catch {
      return { valid: false, error: "Please enter a valid URL" };
    }
  }
}

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
  const [validation, setValidation] = useState<{
    valid: boolean;
    error?: string;
  }>({ valid: true });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setValidation({ valid: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    // Clear error on input change
    if (validation.error) {
      setValidation({ valid: true });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = isValidURL(url);
    setValidation(validationResult);

    if (validationResult.valid) {
      // Add https:// if no protocol is specified
      const finalUrl =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`;
      onSubmit(finalUrl.trim());
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
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
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="url" className="text-sm font-medium">
                    URL
                  </Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="https://example.com or example.com"
                    autoFocus
                    className={`mt-1.5 focus:ring-2 focus:ring-primary/20 transition-all ${
                      validation.error ? "border-destructive" : ""
                    }`}
                  />
                  {validation.error && (
                    <p className="text-sm text-destructive mt-1">
                      {validation.error}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
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
