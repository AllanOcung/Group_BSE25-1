import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import App from "./App.tsx";
import "./index.css";

// Initialize Sentry for error tracking
Sentry.init({
     dsn: "https://4392697f7d9d9464ca0ad1e123b74c99@o4510237949952000.ingest.de.sentry.io/4510238724259920",
     integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration(),
     ],
     // Performance Monitoring
     tracesSampleRate: 1.0, // Capture 100% of transactions (reduce in production, e.g., 0.1 = 10%)
     // Session Replay
     replaysSessionSampleRate: 0.1, // Sample 10% of sessions
     replaysOnErrorSampleRate: 1.0, // Capture 100% of sessions with errors
     // Send user IP and other default PII data
     sendDefaultPii: true,
     // Environment
     environment: import.meta.env.MODE, // 'development' or 'production'
});

createRoot(document.getElementById("root")!).render(<App />);
