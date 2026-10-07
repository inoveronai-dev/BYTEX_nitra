"use client";

import { useState } from "react";
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

type PrivacySection = {
  id: number;
  heading: string;
  body: string;
  isActive: boolean;
};

const empty = { heading: "", body: "", isActive: true };

export default function AdminPrivacyPage() {
  const { items, flash, loading, mutate, load } = useAdminList<PrivacySection>(
    "/api/admin/privacy"
  );
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
    if (!confirm("Naozaj chcete vymazať túto sekciu?")) return;
    await mutate("DELETE", { id });
  }

  async function move(id: number, direction: "up" | "down") {
    await adminFetch("/api/admin/privacy", {
      method: "PATCH",
      body: JSON.stringify({ action: "reorder", id, direction }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Ochrana osobných údajov"
        description="Sekcie textu na stránke ochrany údajov."
      />
      <Flash type={flash?.type || null} message={flash?.message || ""} />

      <Card>
        <h2 className="mb-4 text-lg font-medium">{editId ? "Upraviť sekciu" : "Pridať sekciu"}</h2>
        <Field label="Nadpis">
          <TextInput
            value={form.heading}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
          />
        </Field>
        <Field label="Text">
          <TextArea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="min-h-40"
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
            <p className="font-medium">{item.heading}</p>
            <p className="mt-2 line-clamp-4 text-sm text-charcoal/70">{item.body}</p>
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
                    heading: item.heading,
                    body: item.body,
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
