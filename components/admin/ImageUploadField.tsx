"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin/api-client";
import { Button, Field } from "@/components/admin/ui";
import { mediaSrc } from "@/lib/cms/media";
import type { UploadKind } from "@/lib/uploads/storage";

export function ImageUploadField({
  label,
  kind,
  value,
  onChange,
  mode = "image",
}: {
  label: string;
  kind: UploadKind;
  value: string;
  onChange: (path: string) => void;
  mode?: "image" | "document";
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("kind", kind);
      form.set("mode", mode);
      const res = await adminFetch("/api/admin/uploads", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Nahrávanie zlyhalo.");
      onChange(data.path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nahrávanie zlyhalo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Field label={label}>
      {mode === "image" && value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={mediaSrc(value)}
          alt=""
          className="mb-3 h-28 w-auto rounded-md border border-black/10 object-cover"
        />
      ) : null}
      {mode === "document" && value ? (
        <p className="mb-2 truncate text-xs text-charcoal/60">{value}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer rounded-md border border-black/15 bg-white px-3 py-2 text-sm hover:border-gold/40">
          {busy ? "Nahrávam…" : value ? "Nahradiť súbor" : "Nahrať súbor"}
          <input
            type="file"
            className="sr-only"
            accept={mode === "image" ? "image/jpeg,image/png,image/webp" : ".pdf,.doc,.docx"}
            disabled={busy}
            onChange={(e) => onFile(e.target.files?.[0] || null)}
          />
        </label>
        {value ? (
          <Button type="button" variant="ghost" onClick={() => onChange("")}>
            Odstrániť
          </Button>
        ) : null}
      </div>
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </Field>
  );
}
