import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './config/env' // Validate environment variables on startup
import './i18n/config' // Interface language (IT/EN/FR) — see src/i18n/languages.ts
import { buildApiUrl } from './config/api'

// Fire-and-forget warm-up: the backend (Cloud Run) and its database (Neon)
// scale to zero when idle. Waking both while the page renders hides most
// of the cold start from the first real API call (e.g. finishing sign-in).
fetch(buildApiUrl('/health')).catch(() => {})

createRoot(document.getElementById("root")!).render(<App />);
