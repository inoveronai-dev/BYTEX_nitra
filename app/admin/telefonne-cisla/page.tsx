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
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/ui";
import { adminFetch } from "@/lib/admin/api-client";
import { mediaSrc } from "@/lib/cms/media";

type GroupKey = "emergency" | "service_partner" | "utility";

type ContactRow = {
  id: number;
  groupKey: GroupKey;
  name: string;
  details: string | null;
  logoPath: string | null;
  contactsJson: string;
  isActive: boolean;
};

const groupOptions: { value: GroupKey; label: string }[] = [
  { value: "emergency", label: "Pohotovosť / núdzové" },
  { value: "service_partner", label: "Servisný partner" },
  { value: "utility", label: "Energie a služby" },
];

const empty = {
  groupKey: "emergency" as GroupKey,
  name: "",
  details: "",
  logoPath: "",
  contactsJson: JSON.stringify(
    {
      phone: { label: "mobil:", display: "", href: "tel:" },
      email: { label: "e-mail:", display: "", href: "mailto:" },
    },
    null,
    2
  ),
  isActive: true,
};

export default function AdminContactsPage() {
  const { items, flash, loading, mutate, load, setFlash } = useAdminList<ContactRow>(
    "/api/admin/contacts"
  );
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<number | null>(null);

  async function save() {
    const contactsJson = form.contactsJson;
    try {
      JSON.parse(contactsJson);
    } catch {
      setFlash({ type: "error", message: "Neplatný JSON v kontaktoch." });
      return;
    }
    const payload = {
      groupKey: form.groupKey,
      name: form.name,
      details: form.details.trim() || null,
      logoPath: form.logoPath.trim() || null,
      contactsJson,
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
    if (!confirm("Naozaj chcete vymazať tento kontakt?")) return;
    await mutate("DELETE", { id });
  }

  async function move(id: number, direction: "up" | "down") {
    await adminFetch("/api/admin/contacts", {
      method: "PATCH",
      body: JSON.stringify({ action: "reorder", id, direction }),
    });
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Dôležité telefónne čísla"
        description="Kontakty zoskupené podľa typu."
      />
      <Flash type={flash?.type || null} message={flash?.message || ""} />

      <Card>
        <h2 className="mb-4 text-lg font-medium">{editId ? "Upraviť kontakt" : "Pridať kontakt"}</h2>
        <Field label="Skupina">
          <Select
            value={form.groupKey}
            onChange={(e) => setForm({ ...form, groupKey: e.target.value as GroupKey })}
          >
            {groupOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Názov">
          <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Detaily (voliteľné)">
          <TextInput
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
          />
        </Field>
        <ImageUploadField
          label="Logo (voliteľné)"
          kind="contacts"
          value={form.logoPath}
          onChange={(logoPath) => setForm({ ...form, logoPath })}
        />
        <Field label="Kontakty (JSON)">
          <TextArea
            value={form.contactsJson}
            onChange={(e) => setForm({ ...form, contactsJson: e.target.value })}
            className="min-h-36 font-mono text-xs"
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
            <div className="flex gap-4">
              {item.logoPath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaSrc(item.logoPath)}
                  alt=""
                  className="h-12 w-16 object-contain"
                />
              ) : null}
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-charcoal/50">
                  {groupOptions.find((g) => g.value === item.groupKey)?.label || item.groupKey}
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
                    groupKey: item.groupKey,
                    name: item.name,
                    details: item.details || "",
                    logoPath: item.logoPath || "",
                    contactsJson: item.contactsJson,
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
