import { cacheLife } from "next/cache";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { contact } from "@/content/profile";
import { GithubIcon, MailIcon } from "./icons";

// Cached at build time, so this is the date of the deploy the visitor is looking at.
async function buildDate() {
  "use cache";
  cacheLife("max");
  return new Date().toISOString();
}
// Vercel exposes the deployed commit at build time; locally there's none and it's left out.
const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

export async function Footer({ name, dict, locale }: { name: string; dict: Dictionary["footer"]; locale: Locale }) {
  const built = new Date(await buildDate());
  const date = built.toLocaleDateString(locale === "ar" ? "ar-EG-u-nu-latn" : "en-US", { day: "numeric", month: "short", year: "numeric" });
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 font-mono text-xs text-muted sm:flex-row">
        <p>
          <span className="text-accent" dir="ltr">●</span> © {built.getFullYear()} {name} · {dict.rights} · {dict.updated} {date}
          {commit && (
            <>
              {" "}
              <a
                href={`https://github.com/YoussefAtia17/youssef-atia/commit/${process.env.VERCEL_GIT_COMMIT_SHA}`}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:underline"
                dir="ltr"
              >
                ({commit})
              </a>
            </>
          )}
        </p>
        <div className="flex items-center gap-4">
          <a href={contact.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-foreground">
            <GithubIcon className="size-4" />
          </a>
          <a href={`mailto:${contact.email}`} aria-label="Email" className="hover:text-foreground">
            <MailIcon className="size-4" />
          </a>
          <a href="#" className="hover:text-foreground">
            {dict.top} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
