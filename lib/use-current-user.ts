
"use client";

import { useEffect, useState } from "react";

export type SafePayUser = {
  id: number;
  fullName: string;
  mobile: string;
  email: string | null;
  city: string;
  upiId: string;
};

export function useCurrentUser() {
  const [user, setUser] = useState<SafePayUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/me",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Please log in to continue."
              : "Unable to load your account."
          );
        }

        const data: SafePayUser = await response.json();

        if (!controller.signal.aborted) {
          setUser(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your account."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => controller.abort();
  }, []);

  return { user, loading, error };
}
