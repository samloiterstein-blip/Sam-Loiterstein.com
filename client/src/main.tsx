import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initAnalytics } from "./lib/analytics";
import "./index.css";

const rootEl = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Prerender injects HTML into #root at build time; hydrate when present.
if (rootEl.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootEl, app);
} else {
  ReactDOM.createRoot(rootEl).render(app);
}

if (typeof window !== "undefined") {
  initAnalytics();
}
