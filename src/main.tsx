import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './config/env' // Validate environment variables on startup

createRoot(document.getElementById("root")!).render(<App />);
