import {
  useState,
} from "react";

import { AxiosError } from "axios";

import { api } from "../api/api";

interface UseUpdateState<TResponse> {
  data: TResponse | null;
  loading: boolean;
  error: string | null;

  update: (
    url: string,
    payload: unknown,
  ) => Promise<TResponse | null>;

  reset: () => void;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (data?.detail) {
      return data.detail;
    }

    if (data && typeof data === "object") {
      return Object.values(data)
        .flat()
        .join(" ");
    }

    return error.message;
  }

  return "Something went wrong.";
};

export function useUpdate<TResponse>(): UseUpdateState<TResponse> {
  const [data, setData] = useState<TResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  const update = async (
    url: string,
    payload: unknown,
  ): Promise<TResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.patch<TResponse>(
        url,
        payload,
      );

      setData(response.data);

      return response.data;
    } catch (error) {
      const message = getErrorMessage(error);

      setError(message);

      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    data,
    loading,
    error,
    update,
    reset,
  };
}