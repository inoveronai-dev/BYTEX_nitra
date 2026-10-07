import ContactForm from "@/components/ContactForm";

const hours = [
  { day: "Pondelok", time: "Nestránkový deň", open: false },
  { day: "Utorok", time: "14:00 - 18:00", open: true },
  { day: "Streda", time: "Nestránkový deň", open: false },
  { day: "Štvrtok", time: "14:00 - 18:00", open: true },
  { day: "Piatok", time: "Nestránkový deň", open: false },
];

const mapEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976!2d18.068075!3d48.305988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJurkovi%C4%8Dova+385%2F1%2C+Nitra%2C+949+11!5e0!3m2!1ssk!2sSK!4v1791377097000";

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

export default function Contact() {
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
              Klientske centrum umožňuje klientom rýchle a jednoduché vybavenie požiadaviek
              spojených so správou bytových a nebytových priestorov na jednom mieste. Pracovník
              centra poskytne radu a pomoc, prípadne usmerní majiteľov bytov na ďalší postup na
              kompletné vybavenie Vašej žiadosti.
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
                  PaedDr. Michal Hudec, PhD.
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <a
                    href="mailto:bytexnitra@gmail.com"
                    className="text-sm font-light text-gold transition-colors duration-300 hover:text-gold-dark sm:text-base"
                  >
                    bytexnitra@gmail.com
                  </a>
                  <a
                    href="tel:+421907615135"
                    className="text-sm font-light text-gold transition-colors duration-300 hover:text-gold-dark sm:text-base"
                  >
                    +421 907 615 135
                  </a>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=61556337906214"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.08] text-charcoal/70 transition-colors duration-300 hover:border-gold/40 hover:text-gold"
                    aria-label="Facebook"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href="https://www.instagram.com/bytex.nitra/?fbclid=IwAR2R9Dj4Br3B8hU6H4NV92IdCeWAaFBtK-RDpL0R50C-AOiAd5_RHCNvbVQ"
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
                  Jurkovičova 385/1, 949 11 Nitra
                  <br />
                  Zvonček 050, 11. poschodie
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
                          row.open
                            ? "text-sm font-medium tracking-wide text-gold-dark"
                            : "text-sm font-light text-charcoal/50"
                        }
                      >
                        {row.time}
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
              <ContactForm />
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
