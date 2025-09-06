import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app.tsx";
import { ThemeProvider } from "next-themes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      disableTransitionOnChange
      defaultTheme="dark"
      attribute={"class"}
      key={"lexi-ui"}
    >
      <App />
    </ThemeProvider>
  </StrictMode>
);
