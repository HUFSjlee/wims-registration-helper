"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { MockUser } from "../lib/mock-auth";
import {
  getMockUser,
  clearMockUser,
  loginMockUser,
  registerMockUser,
} from "../lib/mock-auth";

type AuthContextValue = {
  user: MockUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (user: MockUser, password: string) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<MockUser | null>(() => getMockUser());

  const login = useCallback((email: string, password: string): boolean => {
    const nextUser = loginMockUser(email, password);
    if (!nextUser) return false;
    setUserState(nextUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    clearMockUser();
    setUserState(null);
  }, []);

  const signup = useCallback((newUser: MockUser, password: string): void => {
    registerMockUser(newUser, password);
    setUserState(newUser);
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading: false,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useMockAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useMockAuth must be used within MockAuthProvider");
  return ctx;
}
