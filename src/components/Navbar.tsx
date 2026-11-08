import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

type Props = { locale: Locale; nav: Dictionary["nav"] };

export function Navbar({ locale, nav }: Props) {
  const links = [
    { href: `/${locale}#about`, label: nav.about },
    { href: `/${locale}#projects`, label: nav.projects },
    { href: `/${locale}#experience`, label: nav.experience },
    { href: `/${locale}#contact`, label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <a href={`/${locale}`} className="font-mono text-sm font-semibold" dir="ltr">
          <span className="text-accent">~/</span>youssef-atia<span className="text-accent">_</span>
        </a>
        <ul className="hidden items-center gap-7 text-sm text-muted md:flex">
          {links.map((l, i) => (
            <li key={l.href}>
              <a href={l.href} className="group transition hover:text-foreground">
                <span className="font-mono text-xs text-accent/80 group-hover:text-accent" dir="ltr">
                  0{i + 1}.
                </span>{" "}
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} label={nav.switchLanguage} />
          <ThemeToggle label={nav.toggleTheme} />
          <MobileMenu links={links} openLabel={nav.openMenu} closeLabel={nav.closeMenu} />
        </div>
      </nav>
    </header>
  );
}
