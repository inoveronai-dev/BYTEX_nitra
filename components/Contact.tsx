import ContactForm from "@/components/ContactForm";

type ContactRow = {
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
  formIntroBeforeEmail?: string;
  formIntroAfterEmail?: string;
} | null | undefined;

type HourRow = { day: string; timeText: string; isOpen: boolean };

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M14.5 8.25h2.25V5.5H14.5c-2.07 0-3.75 1.68-3.75 3.75v1.75H8.5V14h2.25v6.5h3.25V14h2.35l.4-3h-2.75V9.75c0-.83.67-1.5 1.5-1.5Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4} aria-hidden>
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="4.5" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.25" cy="6.75" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Contact({
  contact,
  hours = [],
}: {
  contact?: ContactRow;
  hours?: HourRow[];
  settings?: unknown;
}) {
  const mapEmbedUrl = contact?.mapEmbedUrl || "";
  const person = contact?.person || "";
  const email = contact?.email || "";
  const phone = contact?.phone || "";
  const phoneHref = contact?.phoneHref || "";
  const addressLine1 = contact?.addressLine1 || "";
  const addressLine2 = contact?.addressLine2 || "";
  const facebookUrl = contact?.facebookUrl || "#";
  const instagramUrl = contact?.instagramUrl || "#";
  const intro = contact?.clientCentreIntro || "";

  return (
    <section id="kontakt" className="section-cream scroll-mt-28 py-14 sm:scroll-mt-32 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-12">
          {/* Left: client centre information */}
          <div className="lg:col-span-5">
            <p className="section-eyebrow">Kontakt</p>
            <h2 className="font-serif text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl">
              Klientske centrum
            </h2>
            <p className="mt-4 text-sm font-light leading-relaxed text-charcoal/75 sm:text-[0.95rem] sm:leading-[1.75]">
              {intro}
            </p>

            <div className="mt-7 space-y-0 divide-y divide-black/[0.08] border-t border-black/[0.08]">
              <div className="py-5">
                <h3 className="text-sm font-normal tracking-wide text-charcoal-deep">
                  Správca bytových domov
                </h3>
                <p className="mt-3 text-xs font-light uppercase tracking-[0.22em] text-charcoal/45">
                  Kontaktná osoba
                </p>
                <p className="mt-1.5 text-base font-normal text-charcoal-deep sm:text-lg">
                  {person}
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href={`mailto:${email}`}
                    className="text-sm font-light text-gold transition-colors duration-300 hover:text-gold-dark sm:text-base"
                  >
                    {email}
                  </a>
                  <a
                    href={phoneHref}
                    className="text-sm font-light text-gold transition-colors duration-300 hover:text-gold-dark sm:text-base"
                  >
                    {phone}
                  </a>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] text-charcoal/70 transition-colors duration-300 hover:border-gold/40 hover:text-gold"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] text-charcoal/70 transition-colors duration-300 hover:border-gold/40 hover:text-gold"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                </div>
              </div>

              <div className="py-5">
                <h3 className="text-sm font-normal tracking-wide text-charcoal-deep">
                  Klientske centrum:
                </h3>
                <address className="mt-2 not-italic text-sm font-light leading-relaxed text-charcoal/75 sm:text-[0.95rem] sm:leading-[1.7]">
                  {addressLine1}
                  <br />
                  {addressLine2}
                </address>
              </div>

              <div className="py-5">
                <h3 className="text-xs font-light uppercase tracking-[0.28em] text-gold">
                  STRÁNKOVÉ DNI:
                </h3>
                <ul className="mt-3.5 divide-y divide-black/[0.06]">
                  {hours.map((row) => (
                    <li
                      key={row.day}
                      className="flex items-baseline justify-between gap-4 py-2 first:pt-0 last:pb-0"
                    >
                      <span className="text-sm font-normal text-charcoal-deep">{row.day}:</span>
                      <span
                        className={
                          row.isOpen
                            ? "text-sm font-medium tracking-wide text-gold-dark"
                            : "text-sm font-light text-charcoal/50"
                        }
                      >
                        {row.timeText}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: contact form — sticky only within this grid (stops before map) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="rounded-xl border border-black/[0.07] bg-[#fbfaf7] p-5 sm:p-6 lg:p-7">
              <ContactForm
                introBeforeEmail={contact?.formIntroBeforeEmail}
                introAfterEmail={contact?.formIntroAfterEmail}
                email={email}
              />
            </div>
          </div>
        </div>

        {/* Map intro + full-width map */}
        <div className="mt-10 text-center sm:mt-12">
          <h2 className="font-serif text-3xl font-light tracking-tight sm:text-4xl">
            <span className="text-charcoal-deep">Kde nás</span>{" "}
            <span className="text-gold-eyebrow">nájdete</span>
          </h2>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-black/[0.06] sm:mt-7">
          <iframe
            title="BYTEX Nitra – Jurkovičova 385/1, Nitra"
            src={mapEmbedUrl}
            className="block h-[280px] w-full border-0 sm:h-[340px] lg:h-[400px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
