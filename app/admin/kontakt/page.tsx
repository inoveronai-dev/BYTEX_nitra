"use client";

import { useCallback, useEffect, useState } from "react";
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

type HourRow = {
  day: string;
  timeText: string;
  isOpen: boolean;
  sortOrder: number;
};

type ContactForm = {
  person: string;
  email: string;
  phone: string;
  phoneHref: string;
  addressLine1: string;
  addressLine2: string;
  facebookUrl: string;
  instagramUrl: string;
  mapEmbedUrl: string;
  clientCentreIntro: string;
  formIntroBeforeEmail: string;
  formIntroAfterEmail: string;
};

type SettingsForm = {
  companyName: string;
  ico: string;
  dic: string;
  copyrightText: string;
};

const emptyContact: ContactForm = {
  person: "",
  email: "",
  phone: "",
  phoneHref: "",
  addressLine1: "",
  addressLine2: "",
  facebookUrl: "",
  instagramUrl: "",
  mapEmbedUrl: "",
  clientCentreIntro: "",
  formIntroBeforeEmail: "",
  formIntroAfterEmail: "",
};

const emptySettings: SettingsForm = {
  companyName: "",
  ico: "",
  dic: "",
  copyrightText: "",
};

export default function AdminContactPage() {
  const [contact, setContact] = useState<ContactForm>(emptyContact);
  const [hours, setHours] = useState<HourRow[]>([]);
  const [settings, setSettings] = useState<SettingsForm>(emptySettings);
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await adminFetch("/api/admin/contact");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Načítanie zlyhalo.");
    if (data.contact) setContact(data.contact as ContactForm);
    if (data.settings) setSettings(data.settings as SettingsForm);
    setHours(
      (data.hours || []).map(
        (h: { day: string; timeText: string; isOpen: boolean; sortOrder: number }) => ({
          day: h.day,
          timeText: h.timeText,
          isOpen: h.isOpen,
          sortOrder: h.sortOrder,
        })
      )
    );
  }, []);

  useEffect(() => {
    load().catch(() => setFlash({ type: "error", message: "Načítanie zlyhalo." }));
  }, [load]);

  function updateHour(index: number, patch: Partial<HourRow>) {
    setHours((prev) => prev.map((h, i) => (i === index ? { ...h, ...patch } : h)));
  }

  function addHour() {
    setHours((prev) => [
      ...prev,
      { day: "", timeText: "", isOpen: true, sortOrder: prev.length },
    ]);
  }

  async function save() {
    setLoading(true);
    setFlash(null);
    try {
      const res = await adminFetch("/api/admin/contact", {
        method: "PUT",
        body: JSON.stringify({
          contact,
          hours: hours.map((h, i) => ({ ...h, sortOrder: i })),
          settings,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Uloženie zlyhalo.");
      setFlash({ type: "success", message: "Zmeny boli uložené." });
      await load();
    } catch (e) {
      setFlash({ type: "error", message: e instanceof Error ? e.message : "Uloženie zlyhalo." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="Kontakt" description="Kontaktné údaje, otváracie hodiny a nastavenia webu." />
      <Flash type={flash?.type || null} message={flash?.message || ""} />

      <Card>
        <h2 className="mb-4 text-lg font-medium">Kontakt</h2>
        <Field label="Kontaktná osoba">
          <TextInput
            value={contact.person}
            onChange={(e) => setContact({ ...contact, person: e.target.value })}
          />
        </Field>
        <Field label="E-mail">
          <TextInput
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
          />
        </Field>
        <Field label="Telefón (zobrazenie)">
          <TextInput
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          />
        </Field>
        <Field label="Telefón (odkaz tel:)">
          <TextInput
            value={contact.phoneHref}
            onChange={(e) => setContact({ ...contact, phoneHref: e.target.value })}
          />
        </Field>
        <Field label="Adresa riadok 1">
          <TextInput
            value={contact.addressLine1}
            onChange={(e) => setContact({ ...contact, addressLine1: e.target.value })}
          />
        </Field>
        <Field label="Adresa riadok 2">
          <TextInput
            value={contact.addressLine2}
            onChange={(e) => setContact({ ...contact, addressLine2: e.target.value })}
          />
        </Field>
        <Field label="Facebook URL">
          <TextInput
            value={contact.facebookUrl}
            onChange={(e) => setContact({ ...contact, facebookUrl: e.target.value })}
          />
        </Field>
        <Field label="Instagram URL">
          <TextInput
            value={contact.instagramUrl}
            onChange={(e) => setContact({ ...contact, instagramUrl: e.target.value })}
          />
        </Field>
        <Field label="Mapa (embed URL)">
          <TextInput
            value={contact.mapEmbedUrl}
            onChange={(e) => setContact({ ...contact, mapEmbedUrl: e.target.value })}
          />
        </Field>
        <Field label="Úvod klientskeho centra">
          <TextArea
            value={contact.clientCentreIntro}
            onChange={(e) => setContact({ ...contact, clientCentreIntro: e.target.value })}
          />
        </Field>
        <Field label="Formulár – text pred e-mailom">
          <TextArea
            value={contact.formIntroBeforeEmail}
            onChange={(e) => setContact({ ...contact, formIntroBeforeEmail: e.target.value })}
          />
        </Field>
        <Field label="Formulár – text po e-maile">
          <TextArea
            value={contact.formIntroAfterEmail}
            onChange={(e) => setContact({ ...contact, formIntroAfterEmail: e.target.value })}
          />
        </Field>
      </Card>

      <div className="mt-6">
        <Card>
          <h2 className="mb-4 text-lg font-medium">Otváracie hodiny</h2>
          {hours.map((h, i) => (
            <div key={i} className="mb-4 grid gap-2 border-b border-black/5 pb-4 sm:grid-cols-3">
              <TextInput
                placeholder="Deň"
                value={h.day}
                onChange={(e) => updateHour(i, { day: e.target.value })}
              />
              <TextInput
                placeholder="Čas"
                value={h.timeText}
                onChange={(e) => updateHour(i, { timeText: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={h.isOpen}
                  onChange={(e) => updateHour(i, { isOpen: e.target.checked })}
                />
                Otvorené
              </label>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={addHour}>
            Pridať deň
          </Button>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <h2 className="mb-4 text-lg font-medium">Nastavenia webu</h2>
          <Field label="Názov spoločnosti">
            <TextInput
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
            />
          </Field>
          <Field label="IČO">
            <TextInput
              value={settings.ico}
              onChange={(e) => setSettings({ ...settings, ico: e.target.value })}
            />
          </Field>
          <Field label="DIČ">
            <TextInput
              value={settings.dic}
              onChange={(e) => setSettings({ ...settings, dic: e.target.value })}
            />
          </Field>
          <Field label="Copyright text">
            <TextInput
              value={settings.copyrightText}
              onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
            />
          </Field>
          <RowActions>
            <Button type="button" onClick={save} disabled={loading}>
              {loading ? "Ukladám…" : "Uložiť zmeny"}
            </Button>
          </RowActions>
        </Card>
      </div>
    </div>
  );
}
