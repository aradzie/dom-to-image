import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./fonts.css";
import "./reset.css";

createRoot(document.querySelector("#main") as HTMLElement).render(<App />);
