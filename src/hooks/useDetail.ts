import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { AxiosError } from "axios";

import { api } from "../api/api";

interface UseDetailState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (typeof data === "string") {
      return data;
    }

    if (data?.detail) {
      return data.detail;
    }

    if (data && typeof data === "object") {
      return Object.values(data).flat().join(" ");
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
};

export function useDetail<T>(
  url: string,
  id: string | number | undefined,
): UseDetailState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // If no id is provided, don't fetch at all.
    if (id === undefined || id === null || id === "") {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<T>(`${url}${id}/`);
      setData(response.data);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [url, id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}