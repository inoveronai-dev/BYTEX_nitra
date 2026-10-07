"use client";

import { useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { useAdminList } from "@/components/admin/useAdminList";
import {
  Button,
  Card,
  Field,
  Flash,
  PageHeader,
  RowActions,
  TextInput,
} from "@/components/admin/ui";
import { adminFetch } from "@/lib/admin/api-client";
import { mediaSrc } from "@/lib/cms/media";

type Partner = {
  id: number;
  name: string;
  logoPath: string;
  url: string | null;
  isActive: boolean;
};

const empty = { name: "", logoPath: "", url: "", isActive: true };

export default function AdminPartnersPage() {
  const { items, flash, loading, mutate, load } = useAdminList<Partner>("/api/admin/partners");
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);

  async function save() {
    const payload = {
      name: form.name,
      logoPath: form.logoPath,
      url: form.url.trim() || null,
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
    if (!confirm("Naozaj chcete vymazať tohto partnera?")) return;
    await mutate("DELETE", { id });
  }

  async function move(id: number, direction: "up" | "down") {
    await adminFetch("/api/admin/partners", {
      method: "PATCH",
      body: JSON.stringify({ action: "reorder", id, direction }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader title="Partneri" description="Logá a odkazy partnerov." />
      <Flash type={flash?.type || null} message={flash?.message || ""} />

      <Card>
        <h2 className="mb-4 text-lg font-medium">{editId ? "Upraviť partnera" : "Pridať partnera"}</h2>
        <Field label="Názov">
          <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <ImageUploadField
          label="Logo"
          kind="partners"
          value={form.logoPath}
          onChange={(logoPath) => setForm({ ...form, logoPath })}
        />
        <Field label="URL (voliteľné)">
          <TextInput value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
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
          <Button type="button" onClick={save} disabled={loading}>
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

      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaSrc(item.logoPath)}
                alt=""
                className="h-12 w-24 object-contain"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                {item.url ? (
                  <p className="truncate text-xs text-charcoal/50">{item.url}</p>
                ) : null}
              </div>
            </div>
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
                    name: item.name,
                    logoPath: item.logoPath,
                    url: item.url || "",
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
