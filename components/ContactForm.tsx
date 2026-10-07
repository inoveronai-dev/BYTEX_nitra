"use client";

import { useId, useState, type FormEvent } from "react";

const requestOptions = ["Žiadosť", "Porucha", "Zaslanie potvrdenia"] as const;

const defaultIntroBeforeEmail =
  'V prípade otázok nás môžete kontaktovať prostredníctvom emailu "';
const defaultIntroAfterEmail =
  '" alebo vyplnením kontaktného formuláru.';

type FormErrors = Partial<
  Record<"name" | "email" | "address" | "phone" | "requestType" | "message" | "file", string>
>;

const fieldClassName =
  "mt-1.5 w-full rounded-md border border-black/[0.1] bg-white px-3.5 py-2.5 text-sm font-light text-charcoal-deep outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-charcoal/35 focus:border-gold/55 focus:ring-1 focus:ring-gold/25";

const labelClassName = "block text-sm font-normal tracking-wide text-charcoal-deep";

export default function ContactForm({
  introBeforeEmail = defaultIntroBeforeEmail,
  introAfterEmail = defaultIntroAfterEmail,
  email = "bytexnitra@gmail.com",
}: {
  introBeforeEmail?: string;
  introAfterEmail?: string;
  email?: string;
}) {
  const formId = useId();
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "needs-backend">("idle");

  function validate(form: HTMLFormElement): FormErrors {
    const data = new FormData(form);
    const next: FormErrors = {};

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const address = String(data.get("address") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const requestType = String(data.get("requestType") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const file = data.get("file");

    if (!name) next.name = "Vyplňte meno.";
    if (!email) next.email = "Vyplňte e-mail.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Zadajte platný e-mail.";
    if (!address) next.address = "Vyplňte adresu bytového domu.";
    if (!phone) next.phone = "Vyplňte telefónne číslo.";
    if (!requestType) next.requestType = "Vyberte možnosť.";
    if (!message) next.message = "Vyplňte správu.";

    if (file instanceof File && file.size > 0) {
      const maxBytes = 10 * 1024 * 1024;
      if (file.size > maxBytes) next.file = "Maximálna veľkosť súboru je 10 MB.";
    }

    return next;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    // TODO: Connect this form to a backend email/API endpoint when available.
    // There is currently no working form submission handler in this project.
    setStatus("needs-backend");
  }

  return (
    <div>
      <p className="text-sm font-light leading-relaxed text-charcoal/75 sm:leading-[1.7]">
        {introBeforeEmail}
        <a
          href={`mailto:${email}`}
          className="text-gold transition-colors duration-300 hover:text-gold-dark"
        >
          {email}
        </a>
        {introAfterEmail}
      </p>

      <form className="mt-6 space-y-3.5" onSubmit={onSubmit} noValidate>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-name`} className={labelClassName}>
              Meno
            </label>
            <input
              id={`${formId}-name`}
              name="name"
              type="text"
              autoComplete="name"
              className={fieldClassName}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            />
            {errors.name ? (
              <p id={`${formId}-name-error`} className="mt-1 text-xs text-red-700">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor={`${formId}-email`} className={labelClassName}>
              E-mail
            </label>
            <input
              id={`${formId}-email`}
              name="email"
              type="email"
              autoComplete="email"
              className={fieldClassName}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            />
            {errors.email ? (
              <p id={`${formId}-email-error`} className="mt-1 text-xs text-red-700">
                {errors.email}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor={`${formId}-address`} className={labelClassName}>
              Adresa bytového domu
            </label>
            <input
              id={`${formId}-address`}
              name="address"
              type="text"
              autoComplete="street-address"
              className={fieldClassName}
              aria-invalid={Boolean(errors.address)}
              aria-describedby={errors.address ? `${formId}-address-error` : undefined}
            />
            {errors.address ? (
              <p id={`${formId}-address-error`} className="mt-1 text-xs text-red-700">
                {errors.address}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor={`${formId}-phone`} className={labelClassName}>
              Telefónne číslo
            </label>
            <input
              id={`${formId}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              className={fieldClassName}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
            />
            {errors.phone ? (
              <p id={`${formId}-phone-error`} className="mt-1 text-xs text-red-700">
                {errors.phone}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor={`${formId}-requestType`} className={labelClassName}>
            Vybrať z možností
          </label>
          <select
            id={`${formId}-requestType`}
            name="requestType"
            defaultValue=""
            className={`${fieldClassName} appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%23161616%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%221.5%22 d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')] bg-[length:1.1rem] bg-[right_0.75rem_center] bg-no-repeat pr-9`}
            aria-invalid={Boolean(errors.requestType)}
            aria-describedby={errors.requestType ? `${formId}-requestType-error` : undefined}
          >
            <option value="" disabled>
              Vybrať z možností
            </option>
            {requestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.requestType ? (
            <p id={`${formId}-requestType-error`} className="mt-1 text-xs text-red-700">
              {errors.requestType}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-file`} className={labelClassName}>
            Nahrať súbor
          </label>
          <input
            id={`${formId}-file`}
            name="file"
            type="file"
            className="mt-1.5 block w-full text-sm font-light text-charcoal/70 file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-black/[0.1] file:bg-gold/[0.08] file:px-3.5 file:py-2 file:text-sm file:font-normal file:text-gold-dark hover:file:bg-gold/15"
            aria-invalid={Boolean(errors.file)}
            aria-describedby={errors.file ? `${formId}-file-error` : undefined}
          />
          {errors.file ? (
            <p id={`${formId}-file-error`} className="mt-1 text-xs text-red-700">
              {errors.file}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-message`} className={labelClassName}>
            Správa
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={4}
            className={`${fieldClassName} min-h-[6.5rem] resize-y`}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          />
          {errors.message ? (
            <p id={`${formId}-message-error`} className="mt-1 text-xs text-red-700">
              {errors.message}
            </p>
          ) : null}
        </div>

        {status === "needs-backend" ? (
          <p
            className="rounded-md border border-gold/25 bg-gold/5 px-3.5 py-2.5 text-sm font-light leading-relaxed text-charcoal/80"
            role="status"
          >
            Formulár je pripravený, no odosielanie ešte nie je napojené. Prosím napíšte nám na{" "}
            <a
              href={`mailto:${email}`}
              className="text-gold transition-colors hover:text-gold-dark"
            >
              {email}
            </a>
            .
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-charcoal-deep px-7 text-sm font-light tracking-[0.18em] text-cream uppercase transition-colors duration-300 hover:bg-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:ring-offset-2"
        >
          Odoslať
        </button>
      </form>
    </div>
  );
}
