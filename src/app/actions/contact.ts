"use server";

import { contact } from "@/content/profile";

export type ContactField = "name" | "email" | "message";
export type ContactValues = Record<ContactField, string>;
/** Failed states echo the input back so the form can be refilled (React resets it after submit). */
export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "invalid"; fields: ContactField[]; values: ContactValues }
  | { status: "error"; values: ContactValues };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Humans take a few seconds to fill the form; bots submit instantly. */
const MIN_FILL_MS = 3000;

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const get = (key: string) => String(formData.get(key) ?? "").trim();

  // Spam traps: a hidden field only bots fill in, and a too-fast submit.
  // Pretend it worked so bots don't learn to adapt.
  const elapsed = Number(get("elapsed"));
  if (get("website") || (Number.isFinite(elapsed) && elapsed > 0 && elapsed < MIN_FILL_MS)) {
    return { status: "success" };
  }

  const name = get("name");
  const email = get("email");
  const message = get("message");

  const values = { name, email, message };
  const fields: ContactField[] = [];
  if (name.length < 2 || name.length > 100) fields.push("name");
  if (email.length > 200 || !EMAIL_RE.test(email)) fields.push("email");
  if (message.length < 10 || message.length > 5000) fields.push("message");
  if (fields.length) return { status: "invalid", fields, values };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY not set, message not sent:", { name, email, message });
      return { status: "success" };
    }
    console.error("[contact] RESEND_API_KEY is missing");
    return { status: "error", values };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL ?? contact.email],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    });
    if (!res.ok) {
      console.error("[contact] Resend error", res.status, await res.text());
      return { status: "error", values };
    }
    return { status: "success" };
  } catch (err) {
    console.error("[contact] send failed", err);
    return { status: "error", values };
  }
}
