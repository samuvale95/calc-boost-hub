// Thin wrapper around the Firebase Auth SDK.
//
// The app signs users in primarily with a passwordless "email link"
// (matches the DAND Scale plan, point 5: "evitare password condivisa;
// account personale, link personale"): the user types their email, gets a
// link, clicking it signs them in — no password to create, remember or
// leak. Email+password is offered as a fallback (e.g. corporate mail
// filters that strip/delay magic links) — see signInWithPassword /
// registerWithPassword below.
import {
  createUserWithEmailAndPassword,
  isSignInWithEmailLink,
  onIdTokenChanged,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { firebaseAuth, isFirebaseConfigured, SIGN_IN_REDIRECT_URL } from "@/config/firebase";

// The email is needed again when the link is opened (Firebase can't read
// it back from the link alone, for security). If the link is opened on
// the same device/browser this is transparent; if not, we fall back to
// asking for it again on the /finish-signin page.
const PENDING_EMAIL_KEY = "dand_pending_signin_email";

function requireAuth() {
  if (!firebaseAuth) {
    throw new Error(
      "Firebase non configurato: imposta le variabili VITE_FIREBASE_* (vedi FIREBASE_SETUP.md)."
    );
  }
  return firebaseAuth;
}

export const firebaseAuthService = {
  /** Sends a sign-in link to the given email. */
  async sendSignInLink(email: string): Promise<void> {
    const auth = requireAuth();
    await sendSignInLinkToEmail(auth, email, {
      url: SIGN_IN_REDIRECT_URL,
      handleCodeInApp: true,
    });
    window.localStorage.setItem(PENDING_EMAIL_KEY, email);
  },

  /** True if the current URL is a Firebase sign-in link. */
  isSignInLink(url: string): boolean {
    if (!firebaseAuth) return false;
    return isSignInWithEmailLink(firebaseAuth, url);
  },

  getPendingEmail(): string | null {
    return window.localStorage.getItem(PENDING_EMAIL_KEY);
  },

  /** Completes sign-in from the link. `email` must match the one the link was sent to. */
  async completeSignInWithLink(email: string, url: string): Promise<FirebaseUser> {
    const auth = requireAuth();
    const credential = await signInWithEmailLink(auth, email, url);
    window.localStorage.removeItem(PENDING_EMAIL_KEY);
    return credential.user;
  },

  /**
   * Password fallback — sign-in. Deliberately separate from
   * registerWithPassword rather than "try sign-in, fall back to
   * register on user-not-found": recent Firebase projects have email
   * enumeration protection on by default, which collapses
   * auth/user-not-found and auth/wrong-password into the same
   * auth/invalid-credential error, so that distinction can no longer be
   * made reliably from the error code alone. An explicit
   * sign-in-or-register toggle in the UI (see LoginSection.tsx) is the
   * pattern Firebase itself recommends here.
   */
  async signInWithPassword(email: string, password: string): Promise<FirebaseUser> {
    const auth = requireAuth();
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  },

  /** Password fallback — registration of a brand new account. */
  async registerWithPassword(email: string, password: string): Promise<FirebaseUser> {
    const auth = requireAuth();
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return credential.user;
  },

  async signOut(): Promise<void> {
    if (!firebaseAuth) return;
    await firebaseSignOut(firebaseAuth);
  },

  /** Current Firebase ID token, or null if signed out / not configured. `forceRefresh` bypasses the SDK's cache (use after the backend rejects a token as expired). */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = firebaseAuth?.currentUser;
    if (!user) return null;
    return user.getIdToken(forceRefresh);
  },

  get currentUser(): FirebaseUser | null {
    return firebaseAuth?.currentUser ?? null;
  },

  /**
   * Subscribes to sign-in/out and token refresh events. Returns an
   * unsubscribe function. If Firebase isn't configured, immediately
   * reports "signed out" once instead of subscribing to nothing (so
   * callers relying on this to end a loading state, e.g. AuthContext,
   * don't hang forever).
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    if (!firebaseAuth) {
      callback(null);
      return () => {};
    }
    return onIdTokenChanged(firebaseAuth, callback);
  },

  get isConfigured(): boolean {
    return isFirebaseConfigured;
  },
};
