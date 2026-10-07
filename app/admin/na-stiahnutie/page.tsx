"use client";

import { useEffect, useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useAdminList } from "@/components/admin/useAdminList";
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

type DocumentItem = {
  id: number;
  title: string;
  filePath: string | null;
  externalUrl: string | null;
  isActive: boolean;
};

const empty = { title: "", filePath: "", externalUrl: "", isActive: true };

export default function AdminDownloadsPage() {
  const { items, extra, flash, loading, mutate, load } = useAdminList<DocumentItem>(
    "/api/admin/documents"
  );
  const [introBody, setIntroBody] = useState("");
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const intro = extra.intro as { body?: string } | null | undefined;
    if (intro?.body !== undefined) setIntroBody(intro.body);
  }, [extra]);

  async function saveIntro() {
    await mutate("POST", { action: "saveIntro", body: introBody });
  }

  async function saveItem() {
    const payload = {
      title: form.title,
      filePath: form.filePath || null,
      externalUrl: form.externalUrl.trim() || null,
      isActive: form.isActive,
      ...(editId ? { id: editId } : {}),
    };
    const ok = await mutate(editId ? "PATCH" : "POST", payload);
    if (ok !== null) {
      setForm(empty);
      setEditId(null);
    }
  }

  async function remove(id: number) {
    if (!confirm("Naozaj chcete vymazať tento dokument?")) return;
    await mutate("DELETE", { id });
  }

  async function move(id: number, direction: "up" | "down") {
    await adminFetch("/api/admin/documents", {
      method: "PATCH",
      body: JSON.stringify({ action: "reorder", id, direction }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader title="Na stiahnutie" description="Úvod sekcie a dokumenty na stiahnutie." />
      <Flash type={flash?.type || null} message={flash?.message || ""} />

      <Card>
        <h2 className="mb-4 text-lg font-medium">Úvod sekcie</h2>
        <Field label="Text">
          <TextArea value={introBody} onChange={(e) => setIntroBody(e.target.value)} />
        </Field>
        <RowActions>
          <Button type="button" onClick={saveIntro} disabled={loading}>
            {loading ? "Ukladám…" : "Uložiť zmeny"}
          </Button>
        </RowActions>
      </Card>

      <div className="mt-8">
        <Card>
          <h2 className="mb-4 text-lg font-medium">{editId ? "Upraviť dokument" : "Pridať dokument"}</h2>
          <Field label="Názov">
            <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <ImageUploadField
            label="Súbor"
            kind="documents"
            mode="document"
            value={form.filePath}
            onChange={(filePath) => setForm({ ...form, filePath })}
          />
          <Field label="Externá URL (voliteľné, ak nie je súbor)">
            <TextInput
              value={form.externalUrl}
              onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
            />
          </Field>
          <label className="mb-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Aktívne
          </label>
          <RowActions>
            <Button type="button" onClick={saveItem} disabled={loading}>
              {loading ? "Ukladám…" : editId ? "Uložiť zmeny" : "Pridať"}
            </Button>
            {editId ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditId(null);
                  setForm(empty);
                }}
              >
                Zrušiť
              </Button>
            ) : null}
          </RowActions>
        </Card>
      </div>

      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 truncate text-xs text-charcoal/50">
              {item.filePath || item.externalUrl || "—"}
            </p>
            <RowActions>
              <Button type="button" variant="secondary" onClick={() => move(item.id, "up")}>
                Nahor
              </Button>
              <Button type="button" variant="secondary" onClick={() => move(item.id, "down")}>
                Nadol
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setEditId(item.id);
                  setForm({
                    title: item.title,
                    filePath: item.filePath || "",
                    externalUrl: item.externalUrl || "",
                    isActive: item.isActive,
                  });
                }}
              >
                Upraviť
              </Button>
              <Button type="button" variant="danger" onClick={() => remove(item.id)}>
                Vymazať
              </Button>
            </RowActions>
          </Card>
        ))}
      </div>
    </div>
  );
}
