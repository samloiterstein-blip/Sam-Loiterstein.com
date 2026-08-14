import { useEffect, useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { LoginForm } from "@/components/LoginForm";
import { api } from "@/lib/api";

export default function App() {
  const [auth, setAuth] = useState<"loading" | "yes" | "no">("loading");

  const refresh = async () => {
    try {
      const data = await api<{ authenticated: boolean }>("/api/me");
      setAuth(data.authenticated ? "yes" : "no");
    } catch {
      setAuth("no");
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const logout = async () => {
    try {
      await api("/api/logout", { method: "POST" });
    } finally {
      setAuth("no");
    }
  };

  if (auth === "loading") {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-ink-500">
        Loading…
      </div>
    );
  }

  if (auth === "no") {
    return <LoginForm onSuccess={() => setAuth("yes")} />;
  }

  return <Dashboard onLogout={() => void logout()} />;
}
