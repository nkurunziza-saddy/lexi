import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
} from "@excalidraw/excalidraw/types";
import { Excalidraw, THEME, exportToBlob } from "@excalidraw/excalidraw";
import {
  type ReactPortal,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Download } from "lucide-react";

export type ExcalidrawInitialElements = ExcalidrawInitialDataState["elements"];

type Props = {
  closeOnClickOutside?: boolean;
  initialElements: ExcalidrawInitialElements;
  initialAppState: AppState;
  initialFiles: BinaryFiles;
  isShown?: boolean;
  onClose: () => void;
  onDelete: () => void;
  onSave: (
    elements: ExcalidrawInitialElements,
    appState: Partial<AppState>,
    files: BinaryFiles
  ) => void;
};

export default function ExcalidrawModal({
  closeOnClickOutside = false,
  onSave,
  initialElements,
  initialAppState,
  initialFiles,
  isShown = false,
  onDelete,
  onClose,
}: Props): ReactPortal | null {
  const { resolvedTheme } = useTheme();
  const excalidrawTheme = resolvedTheme === "dark" ? THEME.DARK : THEME.LIGHT;

  const modalRef = useRef<HTMLDivElement | null>(null);
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [elements, setElements] =
    useState<ExcalidrawInitialElements>(initialElements);
  const [files, setFiles] = useState<BinaryFiles>(initialFiles);

  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!closeOnClickOutside) return;

    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onDelete();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [closeOnClickOutside, onDelete]);

  useLayoutEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onDelete();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onDelete]);

  const handleSave = useCallback(() => {
    if (elements?.some((el) => !el.isDeleted)) {
      const appState = excalidrawAPI?.getAppState();
      const partialState: Partial<AppState> = {
        exportBackground: appState?.exportBackground,
        exportScale: appState?.exportScale,
        exportWithDarkMode: appState?.theme === "dark",
        isBindingEnabled: appState?.isBindingEnabled,
        isLoading: appState?.isLoading,
        name: appState?.name,
        theme: appState?.theme,
        viewBackgroundColor: appState?.viewBackgroundColor,
        viewModeEnabled: appState?.viewModeEnabled,
        zenModeEnabled: appState?.zenModeEnabled,
        zoom: appState?.zoom,
      };
      onSave(elements, partialState, files);
    } else {
      onDelete();
    }
  }, [elements, files, excalidrawAPI, onSave, onDelete]);

  const handleDiscard = useCallback(() => {
    setShowDiscardDialog(true);
  }, []);

  const handleChange = (
    els: ExcalidrawInitialElements,
    _: AppState,
    fls: BinaryFiles
  ) => {
    setElements(els);
    setFiles(fls);
  };

  const handleExport = useCallback(async () => {
    if (!elements?.some((el) => !el.isDeleted)) return;

    try {
      const currentAppState = excalidrawAPI?.getAppState();
      const nonDeletedElements = elements.filter((el) => !el.isDeleted);

      const blob = await exportToBlob({
        elements: nonDeletedElements,
        files,
        appState: {
          ...currentAppState,
          exportBackground: true,
          viewBackgroundColor:
            currentAppState?.viewBackgroundColor || "#ffffff",
        },
        mimeType: "image/png",
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `excalidraw-${Date.now()}.png`;
        link.click();
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to export Excalidraw drawing:", error);
    }
  }, [elements, files, excalidrawAPI]);

  if (!isShown) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative flex h-[90vh] w-[90vw] flex-col rounded-lg border bg-background shadow-2xl outline-none"
      >
        {showDiscardDialog && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-black/50">
            <div className="flex flex-col gap-4 rounded-lg border bg-popover p-6 shadow-lg">
              <p className="text-popover-foreground">
                Are you sure you want to discard the changes?
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDiscardDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setShowDiscardDialog(false);
                    onClose();
                  }}
                >
                  Discard
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden rounded-t-lg">
          <Excalidraw
            onChange={handleChange}
            excalidrawAPI={setExcalidrawAPI}
            theme={excalidrawTheme}
            initialData={{
              appState: initialAppState || { isLoading: false },
              elements: initialElements,
              files: initialFiles,
            }}
          />
        </div>

        <div className="flex justify-between gap-2 border-t bg-muted/30 p-3">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={!elements?.some((el) => !el.isDeleted)}
            >
              <Download className="size-4 mr-1.5" />
              Export PNG
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDiscard}>
              Discard
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
