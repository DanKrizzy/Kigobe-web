import { useCallback, useEffect, useState } from "react";
import {
  DATA_CHANGED_EVENT,
  STORAGE_KEYS,
  defaultAdminCredentials,
  getAdminCredentials,
  readStore,
  writeStore,
  type AdminCredentials,
} from "@/data/siteData";

export type AdminSession = {
  username: string;
  loggedInAt: string;
};

const SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8 hours

function readSession(): AdminSession | null {
  const session = readStore<AdminSession | null>(STORAGE_KEYS.session, null);
  if (!session) return null;
  const started = new Date(session.loggedInAt).getTime();
  if (Number.isNaN(started) || Date.now() - started > SESSION_DURATION_MS) {
    writeStore(STORAGE_KEYS.session, null);
    return null;
  }
  return session;
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(() => readSession());

  useEffect(() => {
    const refresh = () => setSession(readSession());
    window.addEventListener(DATA_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    const creds = getAdminCredentials();
    if (username.trim() === creds.username && password === creds.password) {
      const next: AdminSession = { username: creds.username, loggedInAt: new Date().toISOString() };
      writeStore(STORAGE_KEYS.session, next);
      setSession(next);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    writeStore(STORAGE_KEYS.session, null);
    setSession(null);
  }, []);

  return { session, isAuthenticated: Boolean(session), login, logout };
}

export function useAdminCredentials() {
  const [credentials, setCredentials] = useState<AdminCredentials>(() => getAdminCredentials());

  useEffect(() => {
    const refresh = () => setCredentials(getAdminCredentials());
    window.addEventListener(DATA_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, refresh);
  }, []);

  const updateCredentials = useCallback((next: AdminCredentials) => {
    writeStore(STORAGE_KEYS.adminCredentials, next);
    setCredentials(next);
  }, []);

  const resetCredentials = useCallback(() => {
    writeStore(STORAGE_KEYS.adminCredentials, defaultAdminCredentials);
    setCredentials(defaultAdminCredentials);
  }, []);

  return { credentials, updateCredentials, resetCredentials };
}
