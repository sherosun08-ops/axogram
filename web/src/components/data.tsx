"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";

export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function reload() {
    if (!path) return;
    setLoading(true);
    try {
      setData(await api<T>(path));
      setError("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return { data, error, loading, reload, setData };
}

export function LoadingGrid({ n = 6 }: { n?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="skeleton h-24" />
      ))}
    </div>
  );
}
