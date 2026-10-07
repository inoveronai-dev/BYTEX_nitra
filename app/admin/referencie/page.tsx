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

type Reference = {
  id: number;
  name: string;
  imagePath: string;
  isActive: boolean;
};

const empty = { name: "", imagePath: "", isActive: true };

export default function AdminReferencesPage() {
  const { items, flash, loading, mutate, load } = useAdminList<Reference>("/api/admin/references");
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);

  async function save() {
    const payload = { ...form, ...(editId ? { id: editId } : {}) };
    const ok = await mutate(editId ? "PATCH" : "POST", payload);
    if (ok !== null) {
      setForm(empty);
      setEditId(null);
    }
  }

  async function remove(id: number) {
    if (!confirm("Naozaj chcete vymazať túto referenciu?")) return;
    await mutate("DELETE", { id });
  }

  async function move(id: number, direction: "up" | "down") {
    await adminFetch("/api/admin/references", {
      method: "PATCH",
      body: JSON.stringify({ action: "reorder", id, direction }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader title="Referencie" description="Logá a názvy referencií." />
      <Flash type={flash?.type || null} message={flash?.message || ""} />

      <Card>
        <h2 className="mb-4 text-lg font-medium">
          {editId ? "Upraviť referenciu" : "Pridať referenciu"}
        </h2>
        <Field label="Názov">
          <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <ImageUploadField
          label="Obrázok"
          kind="references"
          value={form.imagePath}
          onChange={(imagePath) => setForm({ ...form, imagePath })}
        />
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
            <div className="flex gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaSrc(item.imagePath)}
                alt=""
                className="h-16 w-24 rounded object-contain"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="mt-1 text-xs text-charcoal/40">{item.isActive ? "Aktívne" : "Neaktívne"}</p>
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
                    imagePath: item.imagePath,
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
