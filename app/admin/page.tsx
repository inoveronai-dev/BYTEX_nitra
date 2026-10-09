import Link from "next/link";
import { AnalyticsSummary } from "@/components/admin/AnalyticsSummary";
import { PageHeader, Card } from "@/components/admin/ui";
import { adminNav } from "@/lib/admin/nav";
import documentsJson from "@/content/documents.json";
import referencesJson from "@/content/references.json";
import servicesJson from "@/content/services.json";

export default function AdminDashboardPage() {
  const serviceCount = servicesJson.length;
  const refCount = referencesJson.length;
  const docCount = documentsJson.items.length;

  return (
    <div>
      <PageHeader
        title="Prehľad"
        description="Spravujte obsah webu BYTEX Nitra. Uloženie vytvorí commit na GitHub a Vercel web aktualizuje (zvyčajne do 1–2 minút)."
      />
      <AnalyticsSummary />
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-wider text-charcoal/45">Služby</p>
          <p className="mt-2 font-serif text-3xl">{serviceCount}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-charcoal/45">Referencie</p>
          <p className="mt-2 font-serif text-3xl">{refCount}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-wider text-charcoal/45">Dokumenty</p>
          <p className="mt-2 font-serif text-3xl">{docCount}</p>
        </Card>
      </div>
      <Card>
        <p className="mb-4 text-sm text-charcoal/60">Rýchle odkazy</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {adminNav.slice(1).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-black/10 px-3 py-2.5 text-sm hover:border-gold/40"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
