import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { EmailLink, PartnerEntry, PhoneLink, UtilityEntry } from "@/lib/phones";

type Emergency = {
  title: string;
  image: string;
  phone: PhoneLink;
  email: EmailLink;
} | null;

function isTextLine(
  line: PhoneLink | EmailLink | { kind: "text"; text: string }
): line is { kind: "text"; text: string } {
  return "kind" in line && line.kind === "text";
}

function ContactLine({ line }: { line: PhoneLink | EmailLink }) {
  return (
    <p className="text-sm font-light leading-relaxed text-charcoal/75 sm:text-[0.95rem]">
      {line.label ? <span className="text-charcoal/55">{line.label} </span> : null}
      <a
        href={line.href}
        className="text-gold transition-colors duration-300 hover:text-gold-dark"
      >
        {line.display}
      </a>
    </p>
  );
}

export default function PhoneDirectory({
  emergencyContact = null,
  servicePartners = [],
  utilityCompanies = [],
}: {
  emergencyContact?: Emergency;
  servicePartners?: PartnerEntry[];
  utilityCompanies?: UtilityEntry[];
}) {
  return (
    <div className="mt-12 space-y-16 sm:mt-14 sm:space-y-20">
      {/* Featured emergency */}
      {emergencyContact ? (
      <Reveal>
        <article className="overflow-hidden rounded-2xl border border-gold/20 bg-charcoal-deep text-cream shadow-[0_16px_48px_rgb(0_0_0_/0.18)]">
          <div className="grid md:grid-cols-2">
            <div className="relative min-h-[200px] md:min-h-[280px]">
              <Image
                src={emergencyContact.image}
                alt=""
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#111111]/50" />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-10">
              <p className="section-eyebrow section-eyebrow--on-dark">
                Havarijná služba
              </p>
              <h2 className="font-serif text-2xl font-light tracking-tight text-cream sm:text-3xl">
                {emergencyContact.title}
              </h2>
              <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
                <p className="text-sm font-light text-cream/70 sm:text-base">
                  {emergencyContact.phone.label}{" "}
                  <a
                    href={emergencyContact.phone.href}
                    className="font-normal text-gold-light transition-colors hover:text-amber-300"
                  >
                    {emergencyContact.phone.display}
                  </a>
                </p>
                <p className="text-sm font-light text-cream/70 sm:text-base">
                  {emergencyContact.email.label}{" "}
                  <a
                    href={emergencyContact.email.href}
                    className="font-normal text-gold-light transition-colors hover:text-amber-300"
                  >
                    {emergencyContact.email.display}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </article>
      </Reveal>
      ) : null}

      {/* Service partners */}
      <section aria-labelledby="servisni-partneri">
        <Reveal>
          <div className="border-b border-gold/25 pb-4">
            <h2
              id="servisni-partneri"
              className="section-eyebrow"
            >
              Servisní partneri
            </h2>
          </div>
        </Reveal>

        <ul className="mt-1">
          {servicePartners.map((partner, index) => (
            <li key={partner.name}>
              <Reveal delayMs={40 + index * 35}>
                <article className="group border-b border-black/[0.08] py-5 transition-colors duration-300 hover:bg-black/[0.015] sm:px-2 sm:py-6">
                  <h3 className="text-sm font-normal tracking-wide text-charcoal-deep sm:text-base">
                    {partner.name}
                  </h3>
                  {partner.details ? (
                    <p className="mt-1.5 text-sm font-light text-charcoal/55">{partner.details}</p>
                  ) : null}
                  {partner.website ? (
                    <p className="mt-1.5 text-sm font-light">
                      <a
                        href={partner.website.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold transition-colors duration-300 hover:text-gold-dark"
                      >
                        {partner.website.label}
                      </a>
                    </p>
                  ) : null}
                  <div className="mt-3 space-y-1.5">
                    {partner.contacts.map((contact, contactIndex) => {
                      if ("text" in contact) {
                        return (
                          <p
                            key={`${partner.name}-${contactIndex}`}
                            className="text-sm font-light text-charcoal/75"
                          >
                            {contact.text}{" "}
                            {contact.phone.label ? (
                              <span className="text-charcoal/55">{contact.phone.label} </span>
                            ) : null}
                            <a
                              href={contact.phone.href}
                              className="text-gold transition-colors duration-300 hover:text-gold-dark"
                            >
                              {contact.phone.display}
                            </a>
                          </p>
                        );
                      }

                      return (
                        <p
                          key={`${partner.name}-${contactIndex}`}
                          className="text-sm font-light text-charcoal/75"
                        >
                          {contact.label ? (
                            <span className="text-charcoal/55">{contact.label} </span>
                          ) : null}
                          <a
                            href={contact.phone.href}
                            className="text-gold transition-colors duration-300 hover:text-gold-dark"
                          >
                            {contact.phone.display}
                          </a>
                        </p>
                      );
                    })}
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* External utilities */}
      <section aria-labelledby="externi-dodavatelia">
        <Reveal>
          <div className="border-b border-gold/25 pb-4">
            <h2
              id="externi-dodavatelia"
              className="section-eyebrow"
            >
              Externí dodávatelia
            </h2>
          </div>
        </Reveal>

        <ul className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          {utilityCompanies.map((company, index) => (
            <li key={company.name}>
              <Reveal delayMs={50 + index * 40}>
                <article className="group flex flex-col gap-5 rounded-2xl border border-black/[0.06] bg-white p-5 transition-all duration-300 hover:border-gold/20 hover:shadow-[0_8px_32px_rgb(0_0_0_/0.04)] sm:flex-row sm:items-center sm:gap-8 sm:p-6">
                  <div className="flex h-16 w-full shrink-0 items-center justify-start sm:h-20 sm:w-44">
                    <div className="relative h-14 w-full max-w-[180px] sm:h-16">
                      <Image
                        src={company.image}
                        alt={company.imageAlt}
                        fill
                        className="object-contain object-left"
                        sizes="180px"
                      />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 border-t border-black/[0.06] pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
                    <h3 className="text-sm font-normal tracking-wide text-charcoal-deep sm:text-base">
                      {company.name}
                    </h3>
                    <div className="mt-3 space-y-4">
                      {(Array.isArray(company.groups) ? company.groups : []).map(
                        (group, groupIndex) => (
                        <div key={`${company.name}-${groupIndex}`}>
                          {group?.title ? (
                            <p className="mb-1.5 text-xs font-light uppercase tracking-[0.18em] text-gold">
                              {group.title}
                            </p>
                          ) : null}
                          <div className="space-y-1">
                            {(Array.isArray(group?.lines) ? group.lines : []).map(
                              (line, lineIndex) =>
                              isTextLine(line) ? (
                                <p
                                  key={`${company.name}-text-${lineIndex}`}
                                  className="text-sm font-light text-charcoal/65"
                                >
                                  {line.text}
                                </p>
                              ) : (
                                <ContactLine
                                  key={`${company.name}-line-${lineIndex}`}
                                  line={line}
                                />
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
