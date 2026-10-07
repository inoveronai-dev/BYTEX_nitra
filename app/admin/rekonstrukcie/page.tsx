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
  TextArea,
  TextInput,
} from "@/components/admin/ui";
import { adminFetch } from "@/lib/admin/api-client";
import { mediaSrc } from "@/lib/cms/media";

type Reconstruction = {
  id: number;
  slug: string;
  title: string;
  yearStatus: string;
  investment: string;
  beforeImagePath: string;
  afterImagePath: string;
  beforeText: string;
  afterText: string;
  factsJson: string;
  isActive: boolean;
};

type FormState = {
  slug: string;
  title: string;
  yearStatus: string;
  investment: string;
  beforeImagePath: string;
  afterImagePath: string;
  beforeText: string;
  afterText: string;
  factsText: string;
  isActive: boolean;
};

const empty: FormState = {
  slug: "",
  title: "",
  yearStatus: "",
  investment: "",
  beforeImagePath: "",
  afterImagePath: "",
  beforeText: "",
  afterText: "",
  factsText: "",
  isActive: true,
};

function factsFromJson(json: string) {
  try {
    const arr = JSON.parse(json) as string[];
    return Array.isArray(arr) ? arr.join("\n") : "";
  } catch {
    return "";
  }
}

function factsToArray(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function AdminReconstructionsPage() {
  const { items, flash, loading, mutate, load } = useAdminList<Reconstruction>(
    "/api/admin/reconstructions"
  );
  const [form, setForm] = useState<FormState>(empty);
  const [editId, setEditId] = useState<number | null>(null);

  async function save() {
    const { factsText, ...rest } = form;
    const payload = {
      ...rest,
      facts: factsToArray(factsText),
      ...(editId ? { id: editId } : {}),
    };
    const ok = await mutate(editId ? "PATCH" : "POST", payload);
    if (ok !== null) {
      setForm(empty);
      setEditId(null);
    }
  }

  async function remove(id: number) {
    if (!confirm("Naozaj chcete vymazať túto rekonštrukciu?")) return;
    await mutate("DELETE", { id });
  }

  async function move(id: number, direction: "up" | "down") {
    await adminFetch("/api/admin/reconstructions", {
      method: "PATCH",
      body: JSON.stringify({ action: "reorder", id, direction }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader title="Rekonštrukcie" description="Projekty pred a po rekonštrukcii." />
      <Flash type={flash?.type || null} message={flash?.message || ""} />

      <Card>
        <h2 className="mb-4 text-lg font-medium">
          {editId ? "Upraviť rekonštrukciu" : "Pridať rekonštrukciu"}
        </h2>
        <Field label="Slug (URL)">
          <TextInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </Field>
        <Field label="Názov">
          <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </Field>
        <Field label="Rok / stav">
          <TextInput
            value={form.yearStatus}
            onChange={(e) => setForm({ ...form, yearStatus: e.target.value })}
          />
        </Field>
        <Field label="Investícia">
          <TextInput
            value={form.investment}
            onChange={(e) => setForm({ ...form, investment: e.target.value })}
          />
        </Field>
        <ImageUploadField
          label="Obrázok pred"
          kind="reconstructions"
          value={form.beforeImagePath}
          onChange={(beforeImagePath) => setForm({ ...form, beforeImagePath })}
        />
        <ImageUploadField
          label="Obrázok po"
          kind="reconstructions"
          value={form.afterImagePath}
          onChange={(afterImagePath) => setForm({ ...form, afterImagePath })}
        />
        <Field label="Text pred">
          <TextArea
            value={form.beforeText}
            onChange={(e) => setForm({ ...form, beforeText: e.target.value })}
          />
        </Field>
        <Field label="Text po">
          <TextArea
            value={form.afterText}
            onChange={(e) => setForm({ ...form, afterText: e.target.value })}
          />
        </Field>
        <Field label="Fakty (jeden riadok = jeden bod)">
          <TextArea
            value={form.factsText}
            onChange={(e) => setForm({ ...form, factsText: e.target.value })}
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
            <div className="flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaSrc(item.beforeImagePath)}
                alt=""
                className="h-14 w-20 rounded object-cover"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaSrc(item.afterImagePath)}
                alt=""
                className="h-14 w-20 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-charcoal/60">
                  {item.yearStatus} · {item.investment}
                </p>
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
                    slug: item.slug,
                    title: item.title,
                    yearStatus: item.yearStatus,
                    investment: item.investment,
                    beforeImagePath: item.beforeImagePath,
                    afterImagePath: item.afterImagePath,
                    beforeText: item.beforeText,
                    afterText: item.afterText,
                    factsText: factsFromJson(item.factsJson),
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
