import type { Dictionary } from "@/i18n/dictionaries";
import { contact } from "@/content/profile";
import { GithubIcon, MailIcon } from "./icons";

// Cached at build time; the site is redeployed often enough for the year to stay current.
async function currentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer({ name, dict }: { name: string; dict: Dictionary["footer"] }) {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted sm:flex-row">
        <p>
          © {await currentYear()} {name}. {dict.rights}
        </p>
        <div className="flex items-center gap-4">
          <a href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-foreground">
            <GithubIcon className="size-5" />
          </a>
          <a href={`mailto:${contact.email}`} aria-label="Email" className="hover:text-foreground">
            <MailIcon className="size-5" />
          </a>
          <a href="#" className="hover:text-foreground">
            {dict.top} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
