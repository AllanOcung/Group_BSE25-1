import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

type User = { id: string; name: string; email?: string; role?: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axios.defaults.headers.common["Authorization"];
    localStorage.setItem("token", token ?? "");
    localStorage.setItem("user", JSON.stringify(user ?? null));
  }, [token, user]);

  const login = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
    } finally { setLoading(false); }
  };

  const register = async (payload: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", payload);
      setToken(res.data.token);
      setUser(res.data.user);
    } finally { setLoading(false); }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Correct named export for use in NavBar and other components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
