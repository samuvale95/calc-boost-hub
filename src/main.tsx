import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './config/env' // Validate environment variables on startup
import './i18n/config' // Interface language (IT/EN/FR) — see src/i18n/languages.ts

createRoot(document.getElementById("root")!).render(<App />);
