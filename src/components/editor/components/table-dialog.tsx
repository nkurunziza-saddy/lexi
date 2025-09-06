import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TableDialog({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rows: number, columns: number) => void;
}) {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rows, columns);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent
            aria-describedby="table-dialog"
            className="sm:max-w-md backdrop-blur-md bg-background/95"
          >
            <div>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Insert Table
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rows" className="text-sm font-medium">
                      Rows
                    </Label>
                    <Input
                      id="rows"
                      type="number"
                      min="1"
                      max="20"
                      value={rows}
                      onChange={(e) =>
                        setRows(
                          Math.max(1, Number.parseInt(e.target.value) || 1)
                        )
                      }
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="columns" className="text-sm font-medium">
                      Columns
                    </Label>
                    <Input
                      id="columns"
                      type="number"
                      min="1"
                      max="20"
                      value={columns}
                      onChange={(e) =>
                        setColumns(
                          Math.max(1, Number.parseInt(e.target.value) || 1)
                        )
                      }
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90"
                  >
                    Insert Table
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
