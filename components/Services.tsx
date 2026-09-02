const services = [
  {
    title: "Ekonomická činnosť",
    description:
      "Evidencia platieb a tvorba predpisov, upomínanie platieb v omeškaní, vedenie samostatného účtovníctva, založenie a vedenie bankových účtov pre jednotlivé objekty, ročné vyúčtovanie, poistenie nehnuteľnosti.",
  },
  {
    title: "Technická činnosť",
    description:
      "Starostlivosť o stavebný a technický stav budov, periodické revízie, zabezpečenie projektových prác, inžinierskej činnosti a energetických certifikátov, zostavovanie ročných plánov opráv.",
  },
  {
    title: "Prevádzková činnosť",
    description:
      "Kontrola nad všetkými prevádzkovými procesmi, s ktorými sa vlastníci denne priamo stretávajú. Zabezpečenie všetkých služieb spojených s prevádzkou bytových domov (upratovanie, dodávka tepla, TÚV, studenej vody, plynu, elektriny, odvoz a likvidácia odpadu, dezinfekcia, dezinsekcia, deratizácia).",
  },
  {
    title: "Havarijná služba",
    description:
      "Štandardne poskytovaná služba bez poplatku na bytovú jednotku. Službu zabezpečujú a vykonávajú externé spoločnosti s najvýhodnejšou cenou. Zásah vo sfére spoločných častí a spoločných zariadení bytového domu je hradený z fondu opráv a zásah v byte a týkajúci sa výlučne bytu je hradený vlastníkom bytu.",
  },
  {
    title: "Právna činnosť",
    description:
      "Informovanie vlastníkov o aktuálnych zmenách zákonov týkajúcich sa prevádzky objektu, vymáhanie nedoplatkov a zabezpečenie dobrovoľných dražieb, dozor nad užívaním nehnuteľnosti v súlade so zákonom.",
  },
  {
    title: "Upratovacia činnosť",
    description:
      "Ako správca bytových domov spolupracujeme s upratovacou firmou UP Cleaning prostredníctvom ktorej Vám vieme zabezpečiť upratovanie spoločných priestorov v bytovom dome za výhodné ceny.",
  },
];

export default function Services() {
  return (
    <section id="sluzby" className="scroll-mt-24 bg-[#111111] py-24 text-cream sm:py-32 lg:py-40">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <p className="text-xs font-light uppercase tracking-[0.3em] text-gold-light">
          Správa bytových domov
        </p>
        <h2 className="font-serif mt-8 text-3xl font-light tracking-tight text-cream sm:text-4xl lg:text-5xl">
          Komplexné služby správy
        </h2>

        <div className="mt-16">
          {services.map((service) => (
            <article
              key={service.title}
              className="border-t border-white/10 py-10 first:border-t-0 first:pt-0"
            >
              <h3 className="text-sm font-normal uppercase tracking-[0.2em] text-gold-light">
                {service.title}
              </h3>
              <p className="mt-4 max-w-4xl text-sm font-light leading-relaxed text-cream/70 sm:text-base sm:leading-[1.85]">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
