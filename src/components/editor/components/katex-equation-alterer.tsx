import type { JSX } from "react";

import { useCallback, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import KatexRenderer from "./katex-renderer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { XIcon } from "lucide-react";

type Props = {
  initialEquation?: string;
  onClose: () => void;
  onConfirm: (equation: string, inline: boolean) => void;
};

export default function KatexEquationAlterer({
  onConfirm,
  onClose,
  initialEquation = "",
}: Props): JSX.Element {
  const [equation, setEquation] = useState<string>(initialEquation);
  const [inline, setInline] = useState<boolean>(true);

  const handleConfirm = useCallback(() => {
    onConfirm(equation, inline);
  }, [onConfirm, equation, inline]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={inline}
            onChange={() => setInline(!inline)}
            className="size-4 rounded border-input accent-primary"
          />
          <span>Inline equation</span>
        </label>
        <Button size={"icon-sm"} variant={"ghost"} onClick={onClose}>
          <XIcon className="" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Equation</Label>
        {inline ? (
          <Input
            onChange={(e) => setEquation(e.target.value)}
            value={equation}
            placeholder="E = mc^2"
            className="font-mono"
          />
        ) : (
          <textarea
            onChange={(e) => setEquation(e.target.value)}
            value={equation}
            placeholder="\\int_{0}^{\\infty} e^{-x^2} dx"
            className="min-h-[100px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Preview</Label>
        <div className="min-h-[50px] rounded-md border bg-muted/30 p-4">
          <ErrorBoundary
            fallback={
              <span className="text-sm text-destructive">Invalid equation</span>
            }
          >
            <KatexRenderer
              equation={equation}
              inline={false}
              onDoubleClick={() => null}
            />
          </ErrorBoundary>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleConfirm}>Insert Equation</Button>
      </div>
    </div>
  );
}
