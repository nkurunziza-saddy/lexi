import { Upload } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImageDialog({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (src: string, alt: string) => void;
}) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim(), alt.trim() || "Image");
    }
    onClose();
    setUrl("");
    setAlt("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onSubmit(result, file.name);
          onClose();
          setUrl("");
          setAlt("");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {isOpen && (
        <Dialog onOpenChange={onClose} open={isOpen}>
          <DialogContent
            aria-describedby="image-dialog"
            className="sm:max-w-md backdrop-blur-md bg-background/95"
          >
            <div>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Insert Image
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label className="text-sm font-medium" htmlFor="image-url">
                      Image URL
                    </Label>
                    <Input
                      className="mt-1.5"
                      id="image-url"
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      value={url}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium" htmlFor="image-alt">
                      Alt Text (optional)
                    </Label>
                    <Input
                      className="mt-1.5"
                      id="image-alt"
                      onChange={(e) => setAlt(e.target.value)}
                      placeholder="Describe the image"
                      value={alt}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button onClick={onClose} type="button" variant="outline">
                      Cancel
                    </Button>
                    <Button
                      className="bg-primary hover:bg-primary/90"
                      disabled={!url.trim()}
                      type="submit"
                    >
                      Insert Image
                    </Button>
                  </div>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/60" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-medium">
                      Or
                    </span>
                  </div>
                </div>

                <div>
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    type="file"
                  />
                  <Button
                    className="w-full hover:bg-accent/80 transition-colors bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    variant="outline"
                  >
                    <Upload className="size-4 mr-2" />
                    Upload from Computer
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
