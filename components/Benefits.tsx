const benefits = [
  "Seriózne a ústretové jednanie so všetkými vlastníkmi objektov - po dohode aj vo vlastnom bytovom dome.",
  "Pracujeme pre Vás nonstop 24 hodín denne a 7 dní v týždni.",
  "Úzka spolupráca s vlastníkmi bytov a spoločné prehodnocovanie potrebných investícií.",
  "Sústavná starostlivosť o komfort bývania.",
  "Pružnejšie a efektívnejšie vykonávanie jednotlivých opráv v dome odbornými pracovníkmi.",
  "Predĺženie životnosti objektov pravidelnými kontrolami a z nich vyplývajúcimi údržbárskymi a servisnými prácami.",
  "Informovanosť, komunikácia, oznamy, tlačivá, elektronické hlasovanie cez platformu Resitech.",
];

export default function Benefits() {
  return (
    <section id="vyhody" className="section-cream scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <p className="text-center text-xs font-light uppercase tracking-[0.3em] text-gold">
          Výhody
        </p>
        <h2 className="font-serif mx-auto mt-8 max-w-2xl text-center text-3xl font-light tracking-tight text-charcoal-deep sm:text-4xl lg:text-5xl">
          Prečo BYTEX Nitra
        </h2>

        <ul className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {benefits.map((benefit, index) => (
            <li key={benefit} className="flex gap-5">
              <span
                className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center text-gold"
                aria-hidden
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path strokeLinecap="round" d="M12 2v20M2 12h20" />
                </svg>
              </span>
              <p className="text-sm font-light leading-relaxed text-charcoal/80 sm:text-base sm:leading-[1.8]">
                <span className="sr-only">{index + 1}. </span>
                {benefit}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
