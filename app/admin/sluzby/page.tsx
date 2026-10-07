"use client";

import { useCallback, useEffect, useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
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
import { mediaSrc } from "@/lib/cms/media";

type Service = {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  isActive: boolean;
};

const empty = { title: "", description: "", imagePath: "", isActive: true };

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await adminFetch("/api/admin/services");
    const data = await res.json();
    if (res.ok) setItems(data.items || []);
  }, []);

  useEffect(() => {
    load().catch(() => setFlash({ type: "error", message: "Načítanie zlyhalo." }));
  }, [load]);

  async function save() {
    setLoading(true);
    setFlash(null);
    try {
      const res = await adminFetch("/api/admin/services", {
        method: editId ? "PATCH" : "POST",
        body: JSON.stringify(editId ? { ...form, id: editId } : form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Uloženie zlyhalo.");
      setFlash({ type: "success", message: "Zmeny boli uložené." });
      setForm(empty);
      setEditId(null);
      await load();
    } catch (e) {
      setFlash({ type: "error", message: e instanceof Error ? e.message : "Uloženie zlyhalo." });
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Naozaj chcete vymazať túto službu?")) return;
    const res = await adminFetch("/api/admin/services", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      setFlash({ type: "error", message: "Vymazanie zlyhalo." });
      return;
    }
    setFlash({ type: "success", message: "Zmeny boli uložené." });
    await load();
  }

  async function move(id: number, direction: "up" | "down") {
    await adminFetch("/api/admin/services", {
      method: "PATCH",
      body: JSON.stringify({ action: "reorder", id, direction }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader title="Služby" description="Správa služieb na hlavnej stránke." />
      <Flash type={flash?.type || null} message={flash?.message || ""} />

      <Card>
        <h2 className="mb-4 text-lg font-medium">{editId ? "Upraviť službu" : "Pridať službu"}</h2>
        <Field label="Názov">
          <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Popis">
          <TextArea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
        <ImageUploadField
          label="Obrázok"
          kind="services"
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
                className="h-16 w-20 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-charcoal/60">{item.description}</p>
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
                    title: item.title,
                    description: item.description,
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
