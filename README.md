# Youssef Atia, Portfolio

Personal portfolio in English and Arabic (RTL): projects, experience and a contact form.

**Stack:** Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4, Resend.

## Features

- English / Arabic with right-to-left layout and language detection
- Light and dark mode that follows the OS
- Detailed project pages with generated share images
- Contact form via a Server Action, with a honeypot and timing check against spam
- SEO: canonical and hreflang links, Open Graph, sitemap, robots and JSON-LD

## Run locally

```bash
npm install
cp .env.example .env.local   # add RESEND_API_KEY to send real emails
npm run dev
```

Content lives in `src/content` (projects, profile) and `src/i18n/dictionaries` (UI text).
