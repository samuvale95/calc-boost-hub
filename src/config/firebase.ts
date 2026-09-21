// Firebase client configuration.
//
// These values identify the Firebase project — they are not secrets (the
// actual security boundary is Firebase's own auth rules + this app's
// backend verifying the ID token), so it's fine for them to ship in the
// built frontend bundle like any other public config.
//
// See ../../FIREBASE_SETUP.md (backend repo) for how to obtain them and
// set up the project itself.
import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId
);

if (!isFirebaseConfigured && import.meta.env.DEV) {
  console.warn(
    "Firebase non configurato: imposta VITE_FIREBASE_* in .env.local " +
      "(vedi FIREBASE_SETUP.md nel repo backend). L'accesso non funzionerà finché non lo fai."
  );
}

export const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// getAuth() throws synchronously (auth/invalid-api-key) when the config is
// missing/incomplete — guarding it here means the rest of the app (public
// pages, the homepage, everything not behind sign-in) still renders during
// setup or if env vars are misconfigured, instead of a blank crashed page.
// firebaseAuthService checks isFirebaseConfigured before using this.
export const firebaseAuth = isFirebaseConfigured ? getAuth(firebaseApp) : null;

// Where a sign-in email link brings the user back to. Must be an
// authorized domain in the Firebase console (see FIREBASE_SETUP.md).
export const SIGN_IN_REDIRECT_URL = `${window.location.origin}/finish-signin`;
