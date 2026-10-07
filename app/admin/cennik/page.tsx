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

type PriceRow = { amount: string; unit: string };
type ItemRow = {
  title: string;
  description: string;
  isActive: boolean;
  prices: PriceRow[];
};
type CategoryRow = {
  slug: string;
  title: string;
  note: string;
  isActive: boolean;
  items: ItemRow[];
};

export default function AdminPricingPage() {
  const [note, setNote] = useState("");
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const res = await adminFetch("/api/admin/pricing");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Načítanie zlyhalo.");
    setNote(data.note || "");
    setCategories(
      (data.categories || []).map(
        (c: {
          slug: string;
          title: string;
          note: string | null;
          isActive: boolean;
          items: {
            title: string;
            description: string;
            isActive: boolean;
            prices: { amount: string; unit: string | null }[];
          }[];
        }) => ({
          slug: c.slug,
          title: c.title,
          note: c.note || "",
          isActive: c.isActive ?? true,
          items: (c.items || []).map((i) => ({
            title: i.title,
            description: i.description,
            isActive: i.isActive ?? true,
            prices: (i.prices || []).map((p) => ({
              amount: p.amount,
              unit: p.unit || "",
            })),
          })),
        })
      )
    );
  }, []);

  useEffect(() => {
    load().catch(() => setFlash({ type: "error", message: "Načítanie zlyhalo." }));
  }, [load]);

  function updateCategory(ci: number, patch: Partial<CategoryRow>) {
    setCategories((prev) => prev.map((c, i) => (i === ci ? { ...c, ...patch } : c)));
  }

  function updateItem(ci: number, ii: number, patch: Partial<ItemRow>) {
    setCategories((prev) =>
      prev.map((c, i) =>
        i === ci
          ? {
              ...c,
              items: c.items.map((item, j) => (j === ii ? { ...item, ...patch } : item)),
            }
          : c
      )
    );
  }

  function updatePrice(ci: number, ii: number, pi: number, patch: Partial<PriceRow>) {
    setCategories((prev) =>
      prev.map((c, i) =>
        i === ci
          ? {
              ...c,
              items: c.items.map((item, j) =>
                j === ii
                  ? {
                      ...item,
                      prices: item.prices.map((p, k) => (k === pi ? { ...p, ...patch } : p)),
                    }
                  : item
              ),
            }
          : c
      )
    );
  }

  function addCategory() {
    setCategories((prev) => [
      ...prev,
      {
        slug: `kategoria-${prev.length + 1}`,
        title: "Nová kategória",
        note: "",
        isActive: true,
        items: [],
      },
    ]);
  }

  function addItem(ci: number) {
    setCategories((prev) =>
      prev.map((c, i) =>
        i === ci
          ? {
              ...c,
              items: [
                ...c.items,
                {
                  title: "Nová položka",
                  description: "",
                  isActive: true,
                  prices: [{ amount: "", unit: "" }],
                },
              ],
            }
          : c
      )
    );
  }

  function addPrice(ci: number, ii: number) {
    setCategories((prev) =>
      prev.map((c, i) =>
        i === ci
          ? {
              ...c,
              items: c.items.map((item, j) =>
                j === ii ? { ...item, prices: [...item.prices, { amount: "", unit: "" }] } : item
              ),
            }
          : c
      )
    );
  }

  async function save() {
    setLoading(true);
    setFlash(null);
    try {
      const payload = {
        note,
        categories: categories.map((c) => ({
          slug: c.slug,
          title: c.title,
          note: c.note || null,
          isActive: c.isActive,
          items: c.items.map((item) => ({
            title: item.title,
            description: item.description,
            isActive: item.isActive,
            prices: item.prices.map((p) => ({
              amount: p.amount,
              unit: p.unit.trim() || null,
            })),
          })),
        })),
      };
      const res = await adminFetch("/api/admin/pricing", {
        method: "PUT",
        body: JSON.stringify(payload),
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
      <PageHeader title="Cenník" description="Poznámka, kategórie, položky a ceny." />
      <Flash type={flash?.type || null} message={flash?.message || ""} />

      <Card>
        <Field label="Poznámka pod cenníkom">
          <TextArea value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
        <RowActions>
          <Button type="button" variant="secondary" onClick={addCategory}>
            Pridať kategóriu
          </Button>
          <Button type="button" onClick={save} disabled={loading}>
            {loading ? "Ukladám…" : "Uložiť zmeny"}
          </Button>
        </RowActions>
      </Card>

      <div className="mt-8 space-y-6">
        {categories.map((cat, ci) => (
          <Card key={`${cat.slug}-${ci}`}>
            <h2 className="mb-4 text-lg font-medium">Kategória</h2>
            <Field label="Slug">
              <TextInput
                value={cat.slug}
                onChange={(e) => updateCategory(ci, { slug: e.target.value })}
              />
            </Field>
            <Field label="Názov">
              <TextInput
                value={cat.title}
                onChange={(e) => updateCategory(ci, { title: e.target.value })}
              />
            </Field>
            <Field label="Poznámka kategórie">
              <TextInput
                value={cat.note}
                onChange={(e) => updateCategory(ci, { note: e.target.value })}
              />
            </Field>
            <label className="mb-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={cat.isActive}
                onChange={(e) => updateCategory(ci, { isActive: e.target.checked })}
              />
              Aktívna kategória
            </label>

            <div className="space-y-4 border-t border-black/10 pt-4">
              {cat.items.map((item, ii) => (
                <div key={ii} className="rounded-lg bg-charcoal/[0.03] p-4">
                  <Field label="Položka – názov">
                    <TextInput
                      value={item.title}
                      onChange={(e) => updateItem(ci, ii, { title: e.target.value })}
                    />
                  </Field>
                  <Field label="Popis">
                    <TextArea
                      value={item.description}
                      onChange={(e) => updateItem(ci, ii, { description: e.target.value })}
                      className="min-h-20"
                    />
                  </Field>
                  <label className="mb-3 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={(e) => updateItem(ci, ii, { isActive: e.target.checked })}
                    />
                    Aktívna položka
                  </label>
                  <p className="mb-2 text-sm font-medium text-charcoal-deep">Ceny</p>
                  {item.prices.map((price, pi) => (
                    <div key={pi} className="mb-2 flex flex-wrap gap-2">
                      <TextInput
                        className="max-w-[10rem]"
                        placeholder="Suma"
                        value={price.amount}
                        onChange={(e) => updatePrice(ci, ii, pi, { amount: e.target.value })}
                      />
                      <TextInput
                        className="max-w-[8rem]"
                        placeholder="Jednotka"
                        value={price.unit}
                        onChange={(e) => updatePrice(ci, ii, pi, { unit: e.target.value })}
                      />
                    </div>
                  ))}
                  <Button type="button" variant="ghost" onClick={() => addPrice(ci, ii)}>
                    Pridať cenu
                  </Button>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={() => addItem(ci)}>
                Pridať položku
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
