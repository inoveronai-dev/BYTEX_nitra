"use client";

import { useEffect, useState } from "react";
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

type Revision = {
  id: number;
  title: string;
  frequency: string;
  body: string;
  isActive: boolean;
};

const empty = { title: "", frequency: "", body: "", isActive: true };

export default function AdminRevisionsPage() {
  const { items, extra, flash, loading, mutate, load } = useAdminList<Revision>(
    "/api/admin/revisions"
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
    const payload = { ...form, ...(editId ? { id: editId } : {}) };
    const ok = await mutate(editId ? "PATCH" : "POST", payload);
    if (ok !== null) {
      setForm(empty);
      setEditId(null);
    }
  }

  async function remove(id: number) {
    if (!confirm("Naozaj chcete vymazať túto revíziu?")) return;
    await mutate("DELETE", { id });
  }

  async function move(id: number, direction: "up" | "down") {
    await adminFetch("/api/admin/revisions", {
      method: "PATCH",
      body: JSON.stringify({ action: "reorder", id, direction }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader title="Revízie" description="Úvodná text revízií a jednotlivé položky." />
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
          <h2 className="mb-4 text-lg font-medium">{editId ? "Upraviť revíziu" : "Pridať revíziu"}</h2>
          <Field label="Názov">
            <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Frekvencia">
            <TextInput
              value={form.frequency}
              onChange={(e) => setForm({ ...form, frequency: e.target.value })}
            />
          </Field>
          <Field label="Popis">
            <TextArea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
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
            <p className="text-sm text-charcoal/60">{item.frequency}</p>
            <p className="mt-2 line-clamp-3 text-sm text-charcoal/70">{item.body}</p>
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
                    frequency: item.frequency,
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
