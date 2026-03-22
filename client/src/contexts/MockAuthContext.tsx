"use client";

import {
  clearToken,
  getMe,
  login as loginApi,
  signup as signupApi,
  type User,
} from "../lib/api";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type SignupPayload = {
  userType: "PERSONAL" | "BUSINESS";
  name: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  address3: string;
  birth: string;
  gender: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (payload: SignupPayload) => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const me = await getMe();
        if (active) {
          setUserState(me);
        }
      } catch {
        if (active) {
          clearToken();
          setUserState(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      await loginApi({ email, password });
      const me = await getMe();
      setUserState(me);
      return true;
    } catch {
      clearToken();
      setUserState(null);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUserState(null);
  }, []);

  const signup = useCallback(async (payload: SignupPayload): Promise<void> => {
    await signupApi(payload);
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
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
