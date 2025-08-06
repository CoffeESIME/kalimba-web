import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { registerSW } from "virtual:pwa-register";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
const updateSW = registerSW({
  onNeedRefresh() {
    // Aquí puedes avisar al usuario que hay una actualización disponible
  },
  onOfflineReady() {
    // Avisar que ya puede usarse offline
  },
});
