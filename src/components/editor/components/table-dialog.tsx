import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        <Dialog onOpenChange={onClose} open={isOpen}>
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
              <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium" htmlFor="rows">
                      Rows
                    </Label>
                    <Input
                      className="mt-1.5"
                      id="rows"
                      max="20"
                      min="1"
                      onChange={(e) =>
                        setRows(
                          Math.max(1, Number.parseInt(e.target.value) || 1)
                        )
                      }
                      type="number"
                      value={rows}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium" htmlFor="columns">
                      Columns
                    </Label>
                    <Input
                      className="mt-1.5"
                      id="columns"
                      max="20"
                      min="1"
                      onChange={(e) =>
                        setColumns(
                          Math.max(1, Number.parseInt(e.target.value) || 1)
                        )
                      }
                      type="number"
                      value={columns}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button onClick={onClose} type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    type="submit"
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
