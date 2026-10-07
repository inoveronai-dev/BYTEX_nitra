"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/api-client";

export function useAdminList<T>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [extra, setExtra] = useState<Record<string, unknown>>({});
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await adminFetch(endpoint);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Načítanie zlyhalo.");
    setItems(data.items || []);
    const { items: _i, ...rest } = data;
    setExtra(rest);
  }, [endpoint]);

  useEffect(() => {
    load().catch((e) =>
      setFlash({ type: "error", message: e instanceof Error ? e.message : "Načítanie zlyhalo." })
    );
  }, [load]);

  async function mutate(method: string, body: unknown, successMessage = "Zmeny boli uložené.") {
    setLoading(true);
    setFlash(null);
    try {
      const res = await adminFetch(endpoint, { method, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Operácia zlyhala.");
      setFlash({ type: "success", message: successMessage });
      await load();
      return data;
    } catch (e) {
      setFlash({ type: "error", message: e instanceof Error ? e.message : "Operácia zlyhala." });
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { items, setItems, extra, flash, setFlash, loading, load, mutate };
}
