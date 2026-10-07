function FacebookIcon() {
  return (
    <svg className="h-[1.125rem] w-[1.125rem]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M14.5 8.25h2.25V5.5H14.5c-2.07 0-3.75 1.68-3.75 3.75v1.75H8.5V14h2.25v6.5h3.25V14h2.35l.4-3h-2.75V9.75c0-.83.67-1.5 1.5-1.5Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden
    >
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="4.5" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.25" cy="6.75" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer({
  settings,
}: {
  settings?: { companyName: string; ico: string; dic: string; copyrightText: string } | null;
}) {
  const companyName = settings?.companyName || "BYTEX Nitra, s.r.o.";
  const ico = settings?.ico || "55 420 401";
  const dic = settings?.dic || "2122045123";
  const copyrightText = settings?.copyrightText || "© 2026 BYTEX Nitra, s.r.o.";

  return (
    <footer className="relative overflow-hidden border-t border-gold/25 bg-charcoal-deep text-white">
      {/* Subtle brand watermark */}
      <p
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-serif text-[clamp(2.75rem,12vw,7.5rem)] font-light uppercase tracking-[0.18em] text-white/[0.035]"
        aria-hidden
      >
        BYTEX NITRA
      </p>

      <div className="relative mx-auto max-w-6xl px-6 py-8 sm:px-8 sm:py-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-10">
          <div>
            <p className="text-sm font-light tracking-wide text-white/90">
              {companyName}
            </p>
            <p className="mt-1.5 text-xs font-light leading-relaxed text-white/45">
              IČO: {ico}
              <span className="mx-2 text-white/20" aria-hidden>
                ·
              </span>
              DIČ: {dic}
            </p>
          </div>

          <div className="flex flex-col gap-3.5 sm:items-end">
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61556337906214"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-white/55 transition-colors duration-300 hover:text-gold-light"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.instagram.com/bytex.nitra/?fbclid=IwAR2R9Dj4Br3B8hU6H4NV92IdCeWAaFBtK-RDpL0R50C-AOiAd5_RHCNvbVQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-white/55 transition-colors duration-300 hover:text-gold-light"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
            <a
              href="/ochrana-osobnych-udajov"
              className="text-xs font-light text-white/45 transition-colors duration-300 hover:text-gold-light"
            >
              Ochrana osobných údajov
            </a>
          </div>
        </div>

        <p className="mt-6 border-t border-white/8 pt-5 text-xs font-light text-white/35">
          {copyrightText}
        </p>
      </div>
    </footer>
  );
}
