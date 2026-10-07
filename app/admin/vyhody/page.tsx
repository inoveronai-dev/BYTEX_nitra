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
  Select,
  TextArea,
} from "@/components/admin/ui";
import { adminFetch } from "@/lib/admin/api-client";
import { benefitIconOptions } from "@/lib/admin/nav";

type Benefit = {
  id: number;
  body: string;
  iconKey: string;
  emphasize: boolean;
  isActive: boolean;
};

const empty: {
  body: string;
  iconKey: string;
  emphasize: boolean;
  isActive: boolean;
} = {
  body: "",
  iconKey: benefitIconOptions[0].value,
  emphasize: false,
  isActive: true,
};

export default function AdminBenefitsPage() {
  const { items, flash, loading, mutate, load } = useAdminList<Benefit>("/api/admin/benefits");
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
    if (!confirm("Naozaj chcete vymazať túto výhodu?")) return;
    await mutate("DELETE", { id });
  }

  async function move(id: number, direction: "up" | "down") {
    await adminFetch("/api/admin/benefits", {
      method: "PATCH",
      body: JSON.stringify({ action: "reorder", id, direction }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader title="Výhody" description="Správa výhod zobrazených na webe." />
      <Flash type={flash?.type || null} message={flash?.message || ""} />

      <Card>
        <h2 className="mb-4 text-lg font-medium">{editId ? "Upraviť výhodu" : "Pridať výhodu"}</h2>
        <Field label="Text">
          <TextArea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        </Field>
        <Field label="Ikona">
          <Select
            value={form.iconKey}
            onChange={(e) => setForm({ ...form, iconKey: e.target.value })}
          >
            {benefitIconOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </Field>
        <label className="mb-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.emphasize}
            onChange={(e) => setForm({ ...form, emphasize: e.target.checked })}
          />
          Zvýrazniť
        </label>
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
            <p className="font-medium">{item.body}</p>
            <p className="mt-1 text-xs text-charcoal/50">
              {benefitIconOptions.find((o) => o.value === item.iconKey)?.label || item.iconKey}
              {item.emphasize ? " · zvýraznené" : ""}
              {item.isActive ? "" : " · neaktívne"}
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
                    body: item.body,
                    iconKey: item.iconKey,
                    emphasize: item.emphasize,
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
