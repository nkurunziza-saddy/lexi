import { cubicBezier } from "motion/react";
import { nodes } from "./nodes";
import EditorTheme from "@/lib/editor/theme";

export const ANIMATION_CONFIG = {
  spring: {
    type: "spring" as const,
    stiffness: 400,
    damping: 30,
  },
  smooth: {
    duration: 0.2,
    ease: cubicBezier(0.4, 0, 0.2, 1),
  },
};

function onError(error: Error) {
  console.error("Lexical error:", error);
}

export const EDITOR_CONFIG = {
  namespace: "Editor",
  theme: EditorTheme,
  onError,
  nodes,
};
