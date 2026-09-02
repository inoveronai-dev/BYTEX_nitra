const hours = [
  { day: "Pondelok", time: "Nestránkový deň", open: false },
  { day: "Utorok", time: "14:00 – 18:00", open: true },
  { day: "Streda", time: "Nestránkový deň", open: false },
  { day: "Štvrtok", time: "14:00 – 18:00", open: true },
  { day: "Piatok", time: "Nestránkový deň", open: false },
];

export default function Contact() {
  return (
    <section id="kontakt" className="section-cream scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.28em] text-gold uppercase">Kontakt</p>
        <h2 className="font-serif mt-4 text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl lg:text-5xl">
          Úradné hodiny a kontakty
        </h2>

        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="border border-gold/10 bg-cream p-8 sm:p-10">
            <h3 className="text-lg font-semibold tracking-tight text-charcoal">Úradné hodiny</h3>
            <ul className="mt-6 divide-y divide-gold/10">
              {hours.map((row) => (
                <li key={row.day} className="flex items-center justify-between gap-4 py-4">
                  <span className="font-medium text-charcoal">{row.day}</span>
                  <span
                    className={
                      row.open
                        ? "rounded-full bg-gradient-to-r from-amber-500/15 to-yellow-600/10 px-4 py-1.5 text-sm font-semibold text-gold-dark"
                        : "text-sm text-slate/50"
                    }
                  >
                    {row.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="section-dark rounded-2xl p-8 sm:p-10">
            <h3 className="text-lg font-semibold tracking-tight text-white">Klientske centrum</h3>
            <address className="mt-5 not-italic leading-relaxed text-white/80">
              Jurkovičova 385/1
              <br />
              zvonček 050, 11. poschodie
              <br />
              Nitra
            </address>
            <a
              href="https://maps.google.com/?q=Jurkovičova+385/1+Nitra"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-gold-light transition-colors hover:text-amber-400"
            >
              Zobraziť na mape →
            </a>

            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="text-xs font-semibold tracking-[0.2em] text-white/40 uppercase">
                Kontaktná osoba
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                PaedDr. Michal Hudec, PhD.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href="mailto:bytexnitra@gmail.com"
                className="font-medium text-gold-light transition-colors hover:text-amber-400"
              >
                bytexnitra@gmail.com
              </a>
              <a
                href="tel:+421907615135"
                className="font-medium text-gold-light transition-colors hover:text-amber-400"
              >
                +421 907 615 135
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
