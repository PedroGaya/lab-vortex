import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

import type { User } from "../types";
import type { ReactNode } from "react";

type AuthContextType = {
  user: User | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = (await api.checkAuth()) as {
        message: String;
        user: User;
      };
      if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (data: any) => {
    const response = (await api.login(data)) as any;
    if (response.user) {
      setUser(response.user);
    } else {
      throw new Error("Login failed: No user data received");
    }
  };

  const register = async (data: any) => {
    const response = (await api.register(data)) as any;
    if (!response.user) {
      throw new Error("Registration failed: No user data received");
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const deleteAccount = async () => {
    await api.deleteAccount();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, deleteAccount, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
