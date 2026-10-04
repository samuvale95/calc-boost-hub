# 🔧 Configurazione Variabili d'Ambiente

## 📋 Variabili Richieste

Per far funzionare correttamente l'applicazione, devi creare un file `.env.local` nella root del progetto con le seguenti variabili:

### **File: `.env.local`**

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

## 🚀 Come Configurare

### **1. Crea il file `.env.local`**

```bash
# Nella root del progetto (dove c'è package.json)
touch .env.local
```

### **2. Aggiungi le variabili**

Copia e incolla il contenuto sopra nel file `.env.local`.

### **3. Verifica la posizione del file**

Il file `.env.local` deve essere nella **root del progetto**, allo stesso livello di:
- `package.json`
- `src/`
- `public/`

**Struttura corretta:**
```
calc-boost-hub/
├── .env.local          ← QUI
├── package.json
├── src/
├── public/
└── ...
```

### **4. Verifica la configurazione**

L'applicazione validerà automaticamente le variabili all'avvio. Se mancano variabili richieste, vedrai un errore esplicativo.

### **5. Debug delle variabili**

In modalità sviluppo, apri la console del browser (F12) per vedere i valori delle variabili d'ambiente caricate.

## 🔐 Sicurezza

- ✅ Il file `.env.local` è già ignorato da git (non verrà committato)
- ✅ Le variabili `VITE_*` sono esposte al frontend (normale per Vite)
- ✅ Non committare mai file `.env` con dati sensibili

## 📝 Note

- **API Base URL**: Configurato per localhost:8000 (modifica se necessario)

## 🔄 Aggiornamento

Se devi cambiare le variabili:

1. Modifica il file `.env.local`
2. Riavvia il server di sviluppo
3. Le modifiche saranno applicate automaticamente

## ⚠️ Troubleshooting

### **Errore: "Missing required environment variables"**

Controlla che:
- Il file `.env.local` esista nella root del progetto
- Tutte le variabili richieste siano presenti
- Non ci siano spazi extra o caratteri speciali

---

**Configurazione completata!** 🎉


