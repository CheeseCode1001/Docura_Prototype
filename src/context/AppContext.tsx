import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type UserRole = "patient" | "doctor" | "admin" | "enterprise" | null;

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface AppContextType {
  page: string;
  params: Record<string, string>;
  history: string[];
  role: UserRole;
  navigate: (page: string, params?: Record<string, string>) => void;
  back: () => void;
  setRole: (role: UserRole) => void;
  toasts: Toast[];
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = window.localStorage.getItem("docura-role");
    return saved === "patient" || saved === "doctor" || saved === "admin" || saved === "enterprise" ? saved : null;
  });
  const [page, setPage] = useState(() => {
    const saved = window.localStorage.getItem("docura-role");
    return saved === "patient" || saved === "doctor" || saved === "admin" || saved === "enterprise" ? `${saved}-dashboard` : "landing";
  });
  const [params, setParams] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const navigate = useCallback((newPage: string, newParams: Record<string, string> = {}) => {
    setHistory((h) => [...h, page]);
    setPage(newPage);
    setParams(newParams);
    window.scrollTo(0, 0);
  }, [page]);

  const back = useCallback(() => {
    setHistory((h) => {
      const prev = [...h];
      const target = prev.pop();
      if (target) { setPage(target); setParams({}); }
      return prev;
    });
  }, []);

  const setRole = useCallback((nextRole: UserRole) => {
    setRoleState(nextRole);
    if (nextRole) window.localStorage.setItem("docura-role", nextRole);
    else window.localStorage.removeItem("docura-role");
  }, []);

  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{ page, params, history, role, navigate, back, setRole, toasts, addToast, removeToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
