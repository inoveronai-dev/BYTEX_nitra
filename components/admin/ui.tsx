"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-light text-charcoal-deep">{title}</h1>
      {description ? <p className="mt-2 max-w-2xl text-sm text-charcoal/60">{description}</p> : null}
    </div>
  );
}

export function Flash({
  type,
  message,
}: {
  type: "success" | "error" | null;
  message: string;
}) {
  if (!type || !message) return null;
  return (
    <p
      className={`mb-4 rounded-md border px-4 py-3 text-sm ${
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
      role="status"
    >
      {message}
    </p>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-sm text-charcoal-deep">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-black/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/25";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className || ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-28 ${props.className || ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className || ""}`} />;
}

export function Button({
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const styles = {
    primary: "bg-charcoal-deep text-white hover:bg-charcoal",
    secondary: "border border-black/15 bg-white text-charcoal-deep hover:border-gold/40",
    danger: "bg-red-700 text-white hover:bg-red-800",
    ghost: "text-charcoal/70 hover:text-charcoal-deep",
  }[variant];
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm transition-colors disabled:opacity-50 ${styles} ${props.className || ""}`}
    />
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">{children}</div>
  );
}

export function RowActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex flex-wrap gap-2">{children}</div>;
}
