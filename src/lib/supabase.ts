import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    !supabaseAnonKey.startsWith("sb_secret_")
);

// Capture recovery/error parameters synchronously BEFORE createClient() parses & clears the URL hash
const initialHash = typeof window !== "undefined" ? window.location.hash : "";
const initialSearch = typeof window !== "undefined" ? window.location.search : "";

const hasRecoveryInUrl =
  initialHash.includes("type=recovery") ||
  (typeof window !== "undefined" &&
    new URLSearchParams(initialSearch).get("type") === "recovery");

let initialAuthErrorMessage: string | null = null;
if (typeof window !== "undefined") {
  const hashParams = new URLSearchParams(initialHash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(initialSearch);
  const rawErr =
    hashParams.get("error_description") ||
    searchParams.get("error_description") ||
    hashParams.get("error") ||
    searchParams.get("error");
  if (rawErr) {
    initialAuthErrorMessage = rawErr.replace(/\+/g, " ");
  }
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

let recoveryTriggered = hasRecoveryInUrl;
const recoveryListeners = new Set<() => void>();

if (supabase) {
  supabase.auth.onAuthStateChange((event) => {
    if (event === "PASSWORD_RECOVERY") {
      recoveryTriggered = true;
      recoveryListeners.forEach((cb) => cb());
    }
  });
}

export function isPasswordRecoveryPending(): boolean {
  return recoveryTriggered;
}

export function subscribePasswordRecovery(cb: () => void): () => void {
  if (recoveryTriggered) {
    cb();
  }
  recoveryListeners.add(cb);
  return () => {
    recoveryListeners.delete(cb);
  };
}

export function clearPasswordRecoveryFlag(): void {
  recoveryTriggered = false;
}

export function getInitialAuthError(): string | null {
  return initialAuthErrorMessage;
}

export function clearInitialAuthError(): void {
  initialAuthErrorMessage = null;
}

