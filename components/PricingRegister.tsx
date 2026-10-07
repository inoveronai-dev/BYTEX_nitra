import Reveal from "@/components/Reveal";
import { pricingSections, type PricingItem } from "@/lib/pricing";

function PriceBlock({ item }: { item: PricingItem }) {
  return (
    <div className="shrink-0 text-left sm:w-44 sm:text-right md:w-48">
      {item.prices.map((price) => {
        const isNumeric = /\d/.test(price.amount) && price.amount.length < 18;

        return (
          <div key={`${price.amount}-${price.unit ?? ""}`} className="mt-1.5 first:mt-0">
            <p
              className={
                isNumeric
                  ? "font-serif text-xl font-light tracking-tight text-charcoal-deep transition-colors duration-300 group-hover:text-gold sm:text-2xl"
                  : "text-sm font-light leading-snug text-charcoal-deep transition-colors duration-300 group-hover:text-gold sm:text-[0.95rem]"
              }
            >
              {price.amount}
            </p>
            {price.unit ? (
              <p className="mt-0.5 text-xs font-light tracking-wide text-charcoal/55">
                {price.unit}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export default function PricingRegister() {
  return (
    <div className="mt-12 space-y-14 sm:mt-16 sm:space-y-16">
      {pricingSections.map((section, sectionIndex) => (
        <section key={section.id} aria-labelledby={`pricing-${section.id}`}>
          <Reveal delayMs={sectionIndex * 60}>
            <div className="border-b border-gold/25 pb-4">
              <h2
                id={`pricing-${section.id}`}
                className="section-eyebrow"
              >
                {section.title}
              </h2>
              {section.note ? (
                <p className="mt-2 text-sm font-light text-charcoal/60">{section.note}</p>
              ) : null}
            </div>
          </Reveal>

          <ul className="mt-1">
            {section.items.map((item, itemIndex) => (
              <li key={item.title}>
                <Reveal delayMs={80 + sectionIndex * 40 + itemIndex * 35}>
                  <article className="group flex flex-col gap-3 border-b border-black/[0.08] py-5 transition-colors duration-300 hover:bg-black/[0.015] sm:flex-row sm:items-start sm:justify-between sm:gap-10 sm:px-2 sm:py-6">
                    <div className="min-w-0 max-w-2xl flex-1">
                      <h3 className="text-sm font-normal tracking-wide text-charcoal-deep sm:text-base">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm font-light leading-relaxed text-charcoal/70 sm:leading-[1.7]">
                        {item.description}
                      </p>
                    </div>
                    <PriceBlock item={item} />
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
