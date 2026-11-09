"use client";

import { useEffect, useState } from "react";

/** Copies a short value (a demo login) and confirms for a moment. */
export function CopyButton({ value, label, done }: { value: string; label: string; done: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(value).then(() => setCopied(true))}
      aria-label={`${label}: ${value}`}
      className={`shrink-0 rounded-md border px-2 py-1 font-mono text-[11px] transition ${
        copied ? "border-accent/50 bg-accent/10 text-accent" : "border-border text-muted hover:border-accent/50 hover:text-foreground"
      }`}
    >
      <span aria-live="polite">{copied ? `✓ ${done}` : label}</span>
    </button>
  );
}
