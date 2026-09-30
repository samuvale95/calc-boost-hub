# Calc Boost Hub — Frontend

Frontend React per la **Scala DAND** (Dravet Advanced Neurological Assessment).
- **Stack**: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui.
- **Deploy**: Vercel ([https://calc-boost-hub.vercel.app](https://calc-boost-hub.vercel.app)).

## Sviluppo Locale

```bash
# 1. Installa le dipendenze (se non già installate)
npm install

# 2. Avvia il server di sviluppo (Vite)
npm run dev
```

L'app si apre su **`http://localhost:8080`**.

### Configurazione API Backend (.env.local)
- **Backend Cloud (default)**: `VITE_API_BASE_URL=https://dand-api-390615448019.europe-west1.run.app/api/v1`
- **Backend Locale**: `VITE_API_BASE_URL=http://localhost:8000/api/v1`

Per la guida completa al progetto e al backend, consulta il [README principale](../README.md).

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d095c7e7-ac32-4c7a-b8bc-c698bc8d3bd9) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
