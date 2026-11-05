"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { sendContactMessage, type ContactField, type ContactState } from "@/app/actions/contact";
import type { Dictionary } from "@/i18n/dictionaries";

type Labels = Dictionary["contact"]["form"];

const field =
  "mt-2 block w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-2 focus:ring-accent/30 aria-[invalid=true]:border-red-500";

export function ContactForm({ t }: { t: Labels }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, { status: "idle" });
  const [dismissed, setDismissed] = useState<ContactState | null>(null);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, [dismissed]);

  const submit = (formData: FormData) => {
    formData.set("elapsed", String(Date.now() - mountedAt.current));
    action(formData);
  };

  if (state.status === "success" && dismissed !== state) {
    return (
      <div role="status" className="rounded-2xl border border-border bg-surface/50 p-8 text-center">
        <p className="text-xl font-semibold">{t.successTitle}</p>
        <p className="mt-2 text-muted">{t.successText}</p>
        <button type="button" onClick={() => setDismissed(state)} className="mt-6 text-sm font-medium text-accent hover:underline">
          {t.again}
        </button>
      </div>
    );
  }

  const values = "values" in state ? state.values : undefined;
  const invalid = (f: ContactField) => state.status === "invalid" && state.fields.includes(f);

  return (
    <form action={submit} className="space-y-5 rounded-2xl border border-border bg-surface/40 p-6 text-start sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          {t.name}
          <input name="name" defaultValue={values?.name} autoComplete="name" required minLength={2} maxLength={100} aria-invalid={invalid("name")} className={field} />
          {invalid("name") && <span className="mt-1 block text-xs text-red-500">{t.errors.name}</span>}
        </label>
        <label className="block text-sm font-medium">
          {t.email}
          <input name="email" defaultValue={values?.email} type="email" autoComplete="email" required maxLength={200} dir="ltr" aria-invalid={invalid("email")} className={`${field} rtl:text-end`} />
          {invalid("email") && <span className="mt-1 block text-xs text-red-500">{t.errors.email}</span>}
        </label>
      </div>
      <label className="block text-sm font-medium">
        {t.message}
        <textarea name="message" defaultValue={values?.message} rows={6} required minLength={10} maxLength={5000} placeholder={t.placeholder} aria-invalid={invalid("message")} className={`${field} resize-y`} />
        {invalid("message") && <span className="mt-1 block text-xs text-red-500">{t.errors.message}</span>}
      </label>

      {/* Honeypot: hidden from people and screen readers, bots fill it in. */}
      <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {pending ? t.sending : t.send}
        </button>
        <p aria-live="polite" className="text-sm text-red-500">
          {state.status === "error" && t.errors.send}
        </p>
      </div>
    </form>
  );
}
