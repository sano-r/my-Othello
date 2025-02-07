import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Othello } from "./components/Othello.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Othello />
  </StrictMode>
);
