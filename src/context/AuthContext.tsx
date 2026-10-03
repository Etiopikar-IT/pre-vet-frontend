import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { api } from "../api/api";
import { endpoints } from "../api/endpoints";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (
    credentials: LoginRequest,
  ) => Promise<boolean>;

  register: (
    data: RegisterRequest,
  ) => Promise<boolean>;

  logout: () => void;

  refreshUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const fetchCurrentUser = useCallback(
    async () => {
      const accessToken =
        localStorage.getItem(
          "access_token",
        );

      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response =
          await api.get<User>(
            endpoints.auth.me,
          );

        setUser(response.data);
      } catch {
        localStorage.removeItem(
          "access_token",
        );

        localStorage.removeItem(
          "refresh_token",
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (
    credentials: LoginRequest,
  ): Promise<boolean> => {
    try {
      const response =
        await axios.post<LoginResponse>(
          `${import.meta.env.VITE_API_URL}${endpoints.auth.login}`,
          credentials,
        );

      const {
        access,
        refresh,
      } = response.data;

      localStorage.setItem(
        "access_token",
        access,
      );

      localStorage.setItem(
        "refresh_token",
        refresh,
      );

      const userResponse =
        await api.get<User>(
          endpoints.auth.me,
        );

      setUser(userResponse.data);

      return true;
    } catch {
      localStorage.removeItem(
        "access_token",
      );

      localStorage.removeItem(
        "refresh_token",
      );

      setUser(null);

      return false;
    }
  };

  const register = async (
    data: RegisterRequest,
  ): Promise<boolean> => {
    try {
      await api.post(
        endpoints.auth.register,
        data,
      );

      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(
      "access_token",
    );

    localStorage.removeItem(
      "refresh_token",
    );

    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,

    isAuthenticated: !!user,

    login,
    register,
    logout,

    refreshUser: fetchCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}