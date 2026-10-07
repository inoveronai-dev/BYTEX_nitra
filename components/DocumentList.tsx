import Reveal from "@/components/Reveal";
import { documents } from "@/lib/downloads";

function PdfIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-gold/80"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.25}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 3.75h6.75L19.5 9.5v10.75A1.75 1.75 0 0 1 17.75 22H7A1.75 1.75 0 0 1 5.25 20.25V5.5A1.75 1.75 0 0 1 7 3.75Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.75 3.75V9.5H19.5" />
      <path strokeLinecap="round" d="M8.5 14h7M8.5 17.5h5" />
    </svg>
  );
}

export default function DocumentList() {
  return (
    <ul className="mt-12 border-t border-black/[0.08] sm:mt-14">
      {documents.map((doc, index) => (
        <li key={doc.href}>
          <Reveal delayMs={index * 40}>
            <a
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-3 border-b border-black/[0.08] px-1 py-4 transition-colors duration-300 hover:bg-black/[0.02] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-3 sm:py-5"
            >
              <span className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                <PdfIcon />
                <span className="text-sm font-normal leading-snug tracking-wide text-charcoal-deep sm:text-[0.95rem] sm:leading-normal">
                  {doc.title}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 self-start pl-8 text-xs font-light tracking-[0.18em] text-gold transition-colors duration-300 group-hover:text-gold-dark sm:self-auto sm:pl-0">
                STIAHNUŤ PDF
                <span
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                >
                  →
                </span>
              </span>
            </a>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
