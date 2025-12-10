import type { JSX, Ref, RefObject } from "react";
import { type ChangeEvent, forwardRef } from "react";

type EquationEditorProps = {
  equation: string;
  inline: boolean;
  setEquation: (equation: string) => void;
};

function EquationEditor(
  { equation, setEquation, inline }: EquationEditorProps,
  forwardedRef: Ref<HTMLInputElement | HTMLTextAreaElement>
): JSX.Element {
  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEquation(event.target.value);
  };

  const symbolClass = "text-muted-foreground font-mono text-sm select-none";

  return inline ? (
    <span className="inline-flex items-center gap-1 rounded bg-muted/50 px-2 py-1">
      <span className={symbolClass}>$</span>
      <input
        className="min-w-[100px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        value={equation}
        onChange={onChange}
        autoFocus={true}
        ref={forwardedRef as RefObject<HTMLInputElement>}
        placeholder="E = mc^2"
      />
      <span className={symbolClass}>$</span>
    </span>
  ) : (
    <div className="flex flex-col gap-1 rounded-md bg-muted/50 p-3">
      <span className={symbolClass}>$$</span>
      <textarea
        className="min-h-[80px] w-full resize-y bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground"
        value={equation}
        onChange={onChange}
        ref={forwardedRef as RefObject<HTMLTextAreaElement>}
        placeholder="\\int_{0}^{\\infty} e^{-x^2} dx"
      />
      <span className={symbolClass}>$$</span>
    </div>
  );
}

export default forwardRef(EquationEditor);
