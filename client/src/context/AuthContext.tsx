import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { api } from "../services/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  addXPToUser: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  demoLogin: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
  addXPToUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("edumind_token");
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err) {
          localStorage.removeItem("edumind_token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    localStorage.setItem("edumind_token", res.token);
    setUser(res.user);
  };

  const demoLogin = async () => {
    const res = await api.demoLogin();
    localStorage.setItem("edumind_token", res.token);
    setUser(res.user);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    localStorage.setItem("edumind_token", res.token);
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("edumind_token");
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch (e) {}
  };

  const addXPToUser = (amount: number) => {
    setUser((prev) => {
      if (!prev) return null;
      const newXp = prev.xp + amount;
      const newLevel = Math.min(5, Math.floor(newXp / 250) + 1);
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        demoLogin,
        register,
        logout,
        refreshUser,
        addXPToUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
