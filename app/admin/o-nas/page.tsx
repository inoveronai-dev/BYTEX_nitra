"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  Field,
  Flash,
  PageHeader,
  RowActions,
  TextArea,
  TextInput,
} from "@/components/admin/ui";
import { adminFetch } from "@/lib/admin/api-client";

export default function AdminAboutPage() {
  const [eyebrow, setEyebrow] = useState("");
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await adminFetch("/api/admin/about");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Načítanie zlyhalo.");
    const item = data.item as { eyebrow: string; heading: string; body: string } | null;
    if (item) {
      setEyebrow(item.eyebrow);
      setHeading(item.heading);
      setBody(item.body);
    }
  }, []);

  useEffect(() => {
    load().catch(() => setFlash({ type: "error", message: "Načítanie zlyhalo." }));
  }, [load]);

  async function save() {
    setLoading(true);
    setFlash(null);
    try {
      const res = await adminFetch("/api/admin/about", {
        method: "PUT",
        body: JSON.stringify({ eyebrow, heading, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Uloženie zlyhalo.");
      setFlash({ type: "success", message: "Zmeny boli uložené." });
    } catch (e) {
      setFlash({ type: "error", message: e instanceof Error ? e.message : "Uloženie zlyhalo." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="O nás" description="Text sekcie O nás na hlavnej stránke." />
      <Flash type={flash?.type || null} message={flash?.message || ""} />

      <Card>
        <Field label="Eyebrow (malý nadpis)">
          <TextInput value={eyebrow} onChange={(e) => setEyebrow(e.target.value)} />
        </Field>
        <Field label="Nadpis">
          <TextInput value={heading} onChange={(e) => setHeading(e.target.value)} />
        </Field>
        <Field label="Text">
          <TextArea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-40" />
        </Field>
        <RowActions>
          <Button type="button" onClick={save} disabled={loading}>
            {loading ? "Ukladám…" : "Uložiť zmeny"}
          </Button>
        </RowActions>
      </Card>
    </div>
  );
}
