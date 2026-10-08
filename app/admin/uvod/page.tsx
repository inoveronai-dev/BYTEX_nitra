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

type HeroRow = {
  headlineLinesJson: string;
  imagePath: string | null;
};

type ChangeManagerRow = {
  intro: string;
  quotesJson: string;
  downloadPath: string | null;
  downloadUrl: string | null;
  backgroundImagePath: string | null;
};

function parseLines(json: string) {
  try {
    const arr = JSON.parse(json) as string[];
    return Array.isArray(arr) ? arr.join("\n") : "";
  } catch {
    return "";
  }
}

function linesToArray(text: string) {
  const lines = text.split("\n").map((l) => l.trimEnd());
  return lines.length ? lines : [""];
}

function formatQuotesJson(json: string) {
  try {
    const parsed = JSON.parse(json) as unknown;
    return JSON.stringify(parsed, null, 2);
  } catch {
    return json;
  }
}

function parseQuotesInput(text: string): Array<{ text: string; citation?: string }> {
  const parsed = JSON.parse(text) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Citáty musia byť JSON pole objektov { text, citation? }.");
  }
  return parsed.map((item, index) => {
    if (typeof item === "string") {
      return { text: item };
    }
    if (
      item &&
      typeof item === "object" &&
      typeof (item as { text?: unknown }).text === "string"
    ) {
      const citation = (item as { citation?: unknown }).citation;
      return {
        text: (item as { text: string }).text,
        ...(typeof citation === "string" ? { citation } : {}),
      };
    }
    throw new Error(`Neplatný citát na pozícii ${index + 1}.`);
  });
}

export default function AdminHeroPage() {
  const [headlineText, setHeadlineText] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [cmIntro, setCmIntro] = useState("");
  const [quotesText, setQuotesText] = useState("");
  const [downloadPath, setDownloadPath] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [backgroundImagePath, setBackgroundImagePath] = useState("");
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await adminFetch("/api/admin/hero");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Načítanie zlyhalo.");
    const hero = data.hero as HeroRow | null;
    const cm = data.changeManager as ChangeManagerRow | null;
    if (hero) {
      setHeadlineText(parseLines(hero.headlineLinesJson));
      setImagePath(hero.imagePath || "");
    }
    if (cm) {
      setCmIntro(cm.intro);
      setQuotesText(formatQuotesJson(cm.quotesJson));
      setDownloadPath(cm.downloadPath || "");
      setDownloadUrl(cm.downloadUrl || "");
      setBackgroundImagePath(cm.backgroundImagePath || "");
    }
  }, []);

  useEffect(() => {
    load().catch(() => setFlash({ type: "error", message: "Načítanie zlyhalo." }));
  }, [load]);

  async function save() {
    setLoading(true);
    setFlash(null);
    try {
      const quotes = parseQuotesInput(quotesText);
      const res = await adminFetch("/api/admin/hero", {
        method: "PUT",
        body: JSON.stringify({
          headlineLines: linesToArray(headlineText),
          imagePath: imagePath || null,
          changeManager: {
            intro: cmIntro,
            quotes,
            downloadPath: downloadPath || null,
            downloadUrl: downloadUrl || null,
            backgroundImagePath: backgroundImagePath || null,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Uloženie zlyhalo.");
      setFlash({
        type: "success",
        message: data.message || "Zmeny boli uložené. Web sa aktualizuje.",
      });
    } catch (e) {
      setFlash({ type: "error", message: e instanceof Error ? e.message : "Uloženie zlyhalo." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader title="Úvod" description="Hero sekcia a výzva na zmenu správcu." />
      <Flash type={flash?.type || null} message={flash?.message || ""} />

      <Card>
        <h2 className="mb-4 text-lg font-medium">Hero</h2>
        <Field label="Nadpis (jeden riadok = jeden riadok nadpisu)">
          <TextArea value={headlineText} onChange={(e) => setHeadlineText(e.target.value)} />
        </Field>
        <ImageUploadField
          label="Obrázok hero"
          kind="hero"
          value={imagePath}
          onChange={setImagePath}
        />
      </Card>

      <div className="mt-6">
      <Card>
        <h2 className="mb-4 text-lg font-medium">Zmena správcu (CTA)</h2>
        <Field label="Úvodný text">
          <TextArea value={cmIntro} onChange={(e) => setCmIntro(e.target.value)} />
        </Field>
        <Field label='Citáty (JSON pole: { "text", "citation?" })'>
          <TextArea
            value={quotesText}
            onChange={(e) => setQuotesText(e.target.value)}
            className="min-h-48 font-mono text-xs"
          />
        </Field>
        <ImageUploadField
          label="Súbor na stiahnutie"
          kind="documents"
          mode="document"
          value={downloadPath}
          onChange={setDownloadPath}
        />
        <Field label="Externá URL na stiahnutie (voliteľné)">
          <TextInput value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} />
        </Field>
        <ImageUploadField
          label="Pozadie sekcie"
          kind="hero"
          value={backgroundImagePath}
          onChange={setBackgroundImagePath}
        />
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
