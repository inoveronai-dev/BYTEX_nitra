const benefits = [
  {
    title: "Ústretové jednanie",
    text: "Seriózne a ústretové jednanie so všetkými vlastníkmi (po dohode aj vo vlastnom dome).",
    icon: HandshakeIcon,
  },
  {
    title: "Nonstop servis",
    text: "Nonstop servis 24 hodín denne, 7 dní v týždni.",
    icon: ClockIcon,
  },
  {
    title: "Spolupráca s vlastníkmi",
    text: "Úzka spolupráca s vlastníkmi a spoločné prehodnocovanie investícií.",
    icon: UsersIcon,
  },
  {
    title: "Komfort bývania",
    text: "Sústavná starostlivosť o komfort bývania a predĺženie životnosti objektov.",
    icon: HomeIcon,
  },
  {
    title: "Odborné opravy",
    text: "Pružnejšie vykonávanie opráv odbornými pracovníkmi.",
    icon: WrenchIcon,
  },
  {
    title: "Platforma Resitech",
    text: "Moderná informovanosť, komunikácia a elektronické hlasovanie cez platformu Resitech.",
    icon: DeviceIcon,
  },
];

export default function Benefits() {
  return (
    <section id="vyhody" className="section-cream scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.28em] text-gold uppercase">Výhody</p>
        <h2 className="font-serif mt-4 max-w-2xl text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl lg:text-5xl">
          Prečo BYTEX Nitra
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-slate/70">
          Komplexná správa s dôrazom na kvalitu, transparentnosť a dlhodobý komfort bývania.
        </p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {benefits.map((benefit) => (
            <article
              key={benefit.title}
              className="group border border-gold/10 bg-cream/50 p-8 transition-all duration-300 hover:border-gold/25"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold/25 bg-gradient-to-br from-amber-500/10 to-yellow-600/5 text-gold transition-colors group-hover:border-gold/40 group-hover:from-amber-500/20">
                <benefit.icon />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-charcoal">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate/75">{benefit.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HandshakeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12.5 4.5 10a2.1 2.1 0 0 1 3-3L10 9.5m7 3 2.5-2.5a2.1 2.1 0 0 0-3-3L14 9.5m-4 0 1.2 1.2a2 2 0 0 0 2.8 0L15.2 9.5M8 14.5l1.8 1.8a2 2 0 0 0 2.8 0L16 14.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2m18 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M12 11a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9Z" />
    </svg>
  );
}

function WrenchIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a4.5 4.5 0 0 0-6.3 6.3L3 18v3h3l5.4-5.4a4.5 4.5 0 0 0 6.3-6.3l-2.1 2.1-1.4-1.4 2.1-2.1Z" />
    </svg>
  );
}

function DeviceIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 14h8M12 17.5h.01" />
    </svg>
  );
}
