import { asc, eq } from "drizzle-orm";
import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { getDb } from "@/lib/db/client";

type Orderable = {
  id: number;
  sortOrder: number;
};

export function reorderByDirection<T extends SQLiteTableWithColumns<any>>(
  table: T,
  id: number,
  direction: "up" | "down",
  whereActiveOnly = false
) {
  const db = getDb();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = (db.select().from(table as any).orderBy(asc((table as any).sortOrder)).all() as Orderable[]).filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r: any) => (whereActiveOnly ? r.isActive !== false : true)
  );

  const index = rows.findIndex((r) => r.id === id);
  if (index < 0) return false;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return true;

  const a = rows[index];
  const b = rows[swapWith];
  const aOrder = a.sortOrder;
  const bOrder = b.sortOrder;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db.update(table as any)
    .set({ sortOrder: bOrder, updatedAt: new Date().toISOString() })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .where(eq((table as any).id, a.id))
    .run();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db.update(table as any)
    .set({ sortOrder: aOrder, updatedAt: new Date().toISOString() })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .where(eq((table as any).id, b.id))
    .run();

  return true;
}
