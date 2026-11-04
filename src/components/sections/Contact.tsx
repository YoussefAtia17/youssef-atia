import type { Dictionary } from "@/i18n/dictionaries";
import { contact } from "@/content/profile";
import { GithubIcon, MailIcon } from "../icons";

export function Contact({ dict }: { dict: Dictionary["contact"] }) {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-border py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">{dict.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{dict.text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-medium text-white transition hover:opacity-90"
          >
            <MailIcon className="size-5" /> {dict.email}
          </a>
          <a
            href={contact.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-medium transition hover:bg-surface"
          >
            <GithubIcon className="size-5" /> {dict.github}
          </a>
        </div>
        <p className="mt-6 text-sm text-muted" dir="ltr">{contact.email}</p>
      </div>
    </section>
  );
}
