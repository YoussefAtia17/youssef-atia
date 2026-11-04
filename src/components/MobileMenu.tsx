"use client";

import { useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";

type Props = { links: { href: string; label: string }[]; openLabel: string; closeLabel: string };

export function MobileMenu({ links, openLabel, closeLabel }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? closeLabel : openLabel}
        className="grid size-9 place-items-center rounded-full border border-border transition hover:bg-surface"
      >
        {open ? <CloseIcon className="size-4" /> : <MenuIcon className="size-4" />}
      </button>
      {open && (
        <ul
          id="mobile-menu"
          className="absolute inset-x-0 top-16 border-b border-border bg-background px-6 py-4 shadow-lg"
        >
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block py-3 text-lg">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
