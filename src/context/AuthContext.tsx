import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";

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

  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ------------------------- Fetch current user ------------------------- */
  const fetchCurrentUser = useCallback(async () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<User>(endpoints.auth.me);
      setUser(response.data);
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      // Drop any cached data belonging to a session that no longer exists.
      queryClient.clear();
    } finally {
      setLoading(false);
    }
  }, [queryClient]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  /* -------------------------------- Login ------------------------------- */
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response = await api.post<LoginResponse>(
        endpoints.auth.login,
        credentials,
      );

      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      const userResponse = await api.get<User>(endpoints.auth.me);
      setUser(userResponse.data);

      // 🔑 Force every active query to refetch with the new token.
      await queryClient.invalidateQueries();

      return true;
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
      return false;
    }
  };

  /* ------------------------------- Register ----------------------------- */
  const register = async (data: RegisterRequest): Promise<boolean> => {
    try {
      await api.post(endpoints.auth.register, data);
      return true;
    } catch {
      return false;
    }
  };

  /* -------------------------------- Logout ------------------------------ */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    // 🔑 Wipe the cache so the next session starts from scratch.
    queryClient.clear();
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
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}