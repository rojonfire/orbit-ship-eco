import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initAnalytics } from "./lib/analytics";
import { captureOrigin } from "./lib/attribution";

initAnalytics();
captureOrigin();

createRoot(document.getElementById("root")!).render(<App />);
