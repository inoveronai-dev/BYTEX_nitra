export default function Footer() {
  return (
    <footer className="section-dark border-t border-white/5 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-light uppercase tracking-[0.2em]">
              BYTEX Nitra, s.r.o.
            </p>
            <p className="mt-2 text-sm font-light uppercase tracking-[0.2em]">
              BYTEX Nitra SERVIS, s.r.o.
            </p>
            <p className="mt-6 text-xs font-light tracking-[0.3em] text-gold-light uppercase">
              Správa a servis bytových domov
            </p>
          </div>
          <div className="text-sm font-light leading-relaxed text-white/60">
            <p>
              <a
                href="mailto:bytexnitra@gmail.com"
                className="transition-colors hover:text-gold-light"
              >
                bytexnitra@gmail.com
              </a>
            </p>
            <p className="mt-3">
              <a href="tel:+421907615135" className="transition-colors hover:text-gold-light">
                +421 907 615 135
              </a>
            </p>
            <p className="mt-3 text-white/40">Jurkovičova 385/1, Nitra</p>
          </div>
        </div>
        <p className="mt-14 text-xs text-white/30">
          © {new Date().getFullYear()} BYTEX Nitra. Všetky práva vyhradené.
        </p>
      </div>
    </footer>
  );
}
