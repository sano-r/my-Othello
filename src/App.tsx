import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Othello } from "./components/Othello.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">オセロゲーム</h1>
      <Othello />
    </div>
  </StrictMode>
);
