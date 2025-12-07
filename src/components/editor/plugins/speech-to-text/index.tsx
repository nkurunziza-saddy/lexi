"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ==================== Type Definitions ====================

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error:
    | "no-speech"
    | "aborted"
    | "audio-capture"
    | "network"
    | "not-allowed"
    | "service-not-allowed"
    | "bad-grammar"
    | "language-not-supported";
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onspeechstart: (() => void) | null;
  onspeechend: (() => void) | null;
  onaudiostart: (() => void) | null;
  onaudioend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

// ==================== Voice Commands ====================

const VOICE_COMMANDS: Record<string, string> = {
  "new line": "\n",
  newline: "\n",
  "new paragraph": "\n\n",
  period: ".",
  "full stop": ".",
  comma: ",",
  "question mark": "?",
  "exclamation mark": "!",
  "exclamation point": "!",
  colon: ":",
  semicolon: ";",
  "open quote": '"',
  "close quote": '"',
  "open parenthesis": "(",
  "close parenthesis": ")",
  dash: "-",
  hyphen: "-",
};

// ==================== Global State Management ====================

let globalIsListening = false;
let globalIsProcessing = false;
const listeners = new Set<
  (state: { isListening: boolean; isProcessing: boolean }) => void
>();

function setGlobalState(isListening: boolean, isProcessing: boolean) {
  globalIsListening = isListening;
  globalIsProcessing = isProcessing;
  listeners.forEach((listener) => listener({ isListening, isProcessing }));
}

export function useSpeechToTextState() {
  const [state, setState] = useState({
    isListening: globalIsListening,
    isProcessing: globalIsProcessing,
  });

  useEffect(() => {
    setState({
      isListening: globalIsListening,
      isProcessing: globalIsProcessing,
    });

    const listener = (newState: {
      isListening: boolean;
      isProcessing: boolean;
    }) => {
      setState(newState);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return state;
}

// ==================== Text Processing Utilities ====================

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatTranscript(
  transcript: string,
  isStartOfSentence: boolean
): string {
  let result = transcript.trim();

  const lowerResult = result.toLowerCase();
  for (const [command, replacement] of Object.entries(VOICE_COMMANDS)) {
    if (lowerResult === command) {
      return replacement;
    }
  }

  if (isStartOfSentence && result.length > 0) {
    result = capitalizeFirstLetter(result);
  }

  return result;
}

function isAtSentenceStart(text: string): boolean {
  if (!text || text.length === 0) return true;
  const trimmed = text.trimEnd();
  if (trimmed.length === 0) return true;
  const lastChar = trimmed[trimmed.length - 1];
  return [".", "!", "?", "\n"].includes(lastChar);
}

// ==================== Main Plugin Component ====================

export default function SpeechToTextPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRunningRef = useRef(false);
  const shouldBeListeningRef = useRef(false);
  const isRestartingRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeouts = useCallback(() => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  const insertTextIntoEditor = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      editor.update(() => {
        let selection = $getSelection();

        if (!selection || !$isRangeSelection(selection)) {
          const root = $getRoot();
          let lastChild = root.getLastChild();

          if (!lastChild) {
            const paragraph = $createParagraphNode();
            root.append(paragraph);
            lastChild = paragraph;
          }

          lastChild.selectEnd();
          selection = $getSelection();
        }

        if (!$isRangeSelection(selection)) {
          console.warn("Could not get a valid selection");
          return;
        }

        let isStartOfSentence = true;
        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();

        if ($isTextNode(anchorNode)) {
          const textContent = anchorNode.getTextContent();
          const offset = anchor.offset;
          const textBefore = textContent.slice(0, offset);
          isStartOfSentence = isAtSentenceStart(textBefore);
        } else {
          const root = $getRoot();
          const allText = root.getTextContent();
          isStartOfSentence = isAtSentenceStart(allText);
        }

        const formattedText = formatTranscript(text, isStartOfSentence);
        const textToInsert = formattedText + " ";

        selection.insertText(textToInsert);
      });
    },
    [editor]
  );

  const handleEditorCommand = useCallback(
    (command: string): boolean => {
      const lowerCommand = command.toLowerCase().trim();

      if (lowerCommand === "undo") {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
        setStatusMessage("Undo");
        setTimeout(() => setStatusMessage(""), 1500);
        return true;
      }

      if (lowerCommand === "redo") {
        editor.dispatchCommand(REDO_COMMAND, undefined);
        setStatusMessage("Redo");
        setTimeout(() => setStatusMessage(""), 1500);
        return true;
      }

      return false;
    },
    [editor]
  );

  const startRecognition = useCallback(() => {
    if (!recognitionRef.current) return false;

    if (isRunningRef.current) {
      console.debug("Recognition already running, skipping start");
      return true;
    }

    try {
      recognitionRef.current.start();
      isRunningRef.current = true;
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.includes("already started")) {
        console.debug("Recognition was already started");
        isRunningRef.current = true;
        return true;
      }
      console.error("Failed to start recognition:", error);
      isRunningRef.current = false;
      return false;
    }
  }, []);

  const stopRecognition = useCallback(() => {
    if (!recognitionRef.current) return;

    shouldBeListeningRef.current = false;
    clearTimeouts();

    try {
      recognitionRef.current.stop();
    } catch {}
  }, [clearTimeouts]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser");
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }

      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setInterimText(interimTranscript);

      if (finalTranscript.trim()) {
        setIsProcessing(true);
        setGlobalState(true, true);

        const trimmedTranscript = finalTranscript.trim();

        if (!handleEditorCommand(trimmedTranscript)) {
          insertTextIntoEditor(trimmedTranscript);
        }

        setInterimText("");
        setIsProcessing(false);
        setGlobalState(globalIsListening, false);
      }

      silenceTimeoutRef.current = setTimeout(() => {
        if (shouldBeListeningRef.current && recognitionRef.current) {
          console.debug("Silence timeout - restarting recognition");
          isRestartingRef.current = true;
          try {
            recognitionRef.current.stop();
          } catch {}
        }
      }, 8000);
    };

    recognition.onspeechstart = () => {
      setStatusMessage("Listening...");
    };
    recognition.onspeechend = () => {
      setStatusMessage("");
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.debug("Speech recognition error:", event.error);

      switch (event.error) {
        case "aborted":
          return;

        case "no-speech":
          setStatusMessage("No speech detected");
          setTimeout(() => setStatusMessage(""), 2000);
          return;

        case "audio-capture":
          setStatusMessage("Microphone error");
          setTimeout(() => setStatusMessage(""), 2000);
          return;

        case "network":
          setStatusMessage("Network error");
          setTimeout(() => setStatusMessage(""), 2000);
          return;

        case "not-allowed":
        case "service-not-allowed":
          setStatusMessage("Microphone access denied");
          shouldBeListeningRef.current = false;
          isRunningRef.current = false;
          setIsListening(false);
          setGlobalState(false, false);
          setTimeout(() => setStatusMessage(""), 3000);
          return;

        default:
          setStatusMessage(`Error: ${event.error}`);
          setTimeout(() => setStatusMessage(""), 3000);
      }
    };

    recognition.onend = () => {
      console.debug("Recognition ended");
      isRunningRef.current = false;

      setInterimText("");

      if (shouldBeListeningRef.current) {
        isRestartingRef.current = true;

        restartTimeoutRef.current = setTimeout(() => {
          isRestartingRef.current = false;

          if (shouldBeListeningRef.current && recognitionRef.current) {
            try {
              recognitionRef.current.start();
              isRunningRef.current = true;
              console.debug("Recognition restarted");
            } catch (error) {
              console.debug("Failed to restart recognition:", error);
              if (
                error instanceof Error &&
                error.message.includes("already started")
              ) {
                isRunningRef.current = true;
              } else {
                shouldBeListeningRef.current = false;
                setIsListening(false);
                setGlobalState(false, false);
              }
            }
          }
        }, 300);
      } else {
        setIsListening(false);
        setGlobalState(false, false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      clearTimeouts();
      shouldBeListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
      isRunningRef.current = false;
    };
  }, [insertTextIntoEditor, handleEditorCommand, clearTimeouts]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    const currentlyRunning =
      isRunningRef.current || shouldBeListeningRef.current;

    if (!currentlyRunning) {
      clearTimeouts();
      isRestartingRef.current = false;
      shouldBeListeningRef.current = true;

      const started = startRecognition();
      if (started) {
        setIsListening(true);
        setGlobalState(true, false);
        setStatusMessage("Starting...");
        setTimeout(() => setStatusMessage(""), 1500);
      } else {
        shouldBeListeningRef.current = false;
        setIsListening(false);
        setGlobalState(false, false);
        setStatusMessage("Failed to start");
        setTimeout(() => setStatusMessage(""), 2000);
      }
    } else {
      stopRecognition();
      setInterimText("");
      setStatusMessage("");
      setIsListening(false);
      setGlobalState(false, false);
    }
  }, [clearTimeouts, startRecognition, stopRecognition]);

  useEffect(() => {
    const handleToggle = () => {
      toggleListening();
    };

    window.addEventListener("toggle-speech-to-text", handleToggle);
    return () => {
      window.removeEventListener("toggle-speech-to-text", handleToggle);
    };
  }, [toggleListening]);

  useEffect(() => {
    const listener = (state: {
      isListening: boolean;
      isProcessing: boolean;
    }) => {
      setIsListening(state.isListening);
      setIsProcessing(state.isProcessing);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (!isSupported) {
    return null;
  }

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {(statusMessage || interimText) && (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg max-w-xs">
          {statusMessage && (
            <div className="text-sm text-muted-foreground">{statusMessage}</div>
          )}
          {interimText && (
            <div className="text-sm text-muted-foreground/70 italic">
              {interimText}...
            </div>
          )}
        </div>
      )}

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              onClick={toggleListening}
              size="icon"
              variant={isListening ? "default" : "outline"}
              className={`rounded-full shadow-lg transition-all duration-300 ${
                isListening
                  ? "bg-destructive hover:bg-destructive/90 scale-110"
                  : "bg-background hover:bg-accent"
              } ${isProcessing ? "ring-2 ring-primary ring-offset-2" : ""}`}
              aria-label={isListening ? "Stop recording" : "Start recording"}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          }
        />
        <TooltipContent side="left">
          <p>
            {isListening ? "Stop speech-to-text" : "Start speech-to-text"}
            {isListening && (
              <span className="block text-xs text-muted-foreground mt-1">
                Say &quot;undo&quot; or &quot;redo&quot; for commands
              </span>
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    </div>,
    document.body
  );
}
