import type { Localized } from "./types";

/** One box in a project's architecture diagram, placed on a small grid (columns run left to right). */
export type ArchNode = { id: string; label: Localized; sub?: Localized; col: number; row: number };
/** A connection; `both` sends signals in both directions (requests and responses, live sync). */
export type ArchEdge = { from: string; to: string; both?: boolean };
export type Architecture = { nodes: ArchNode[]; edges: ArchEdge[] };

const L = (en: string, ar = en): Localized => ({ en, ar });
const n = (id: string, col: number, row: number, label: Localized, sub?: Localized): ArchNode => ({ id, col, row, label, sub });

/** How each featured project is wired, drawn from its real stack and engineering notes. */
export const architectures: Record<string, Architecture> = {
  splitter: {
    nodes: [
      n("app", 0, 1, L("Flutter app"), L("iOS · Android")),
      n("ocr", 1, 0, L("AI OCR"), L("reads the receipt", "بيقرا الفاتورة")),
      n("db", 1, 1, L("Supabase"), L("groups · expenses · balances", "جروبات · مصاريف · أرصدة")),
      n("pay", 1, 2, L("InstaPay"), L("settle up", "التسوية")),
      n("n8n", 2, 1, L("n8n workflows"), L("reminders", "تذكيرات")),
      n("users", 3, 1, L("Group members", "أعضاء الجروب"), L("notifications", "إشعارات")),
    ],
    edges: [
      { from: "app", to: "ocr", both: true },
      { from: "app", to: "db", both: true },
      { from: "app", to: "pay" },
      { from: "db", to: "n8n" },
      { from: "n8n", to: "users" },
    ],
  },
  playzone: {
    nodes: [
      n("ui", 0, 1, L("Cashier screen", "شاشة الكاشير"), L("one shop PC", "كمبيوتر المحل")),
      n("timer", 1, 0, L("Device timers", "تايمر الأجهزة"), L("timestamps → bill", "الوقت ← الحساب")),
      n("orders", 1, 2, L("Orders", "الطلبات"), L("café · takeaway", "كافيه · تيك أواي")),
      n("data", 2, 1, L("Shared data", "داتا واحدة"), L("sales · stock", "مبيعات · مخزن")),
      n("receipt", 3, 0, L("Receipts", "الفواتير"), L("printable", "للطباعة")),
      n("reports", 3, 2, L("Reports", "التقارير"), L("daily · monthly profit", "مكسب يومي · شهري")),
    ],
    edges: [
      { from: "ui", to: "timer" },
      { from: "ui", to: "orders" },
      { from: "timer", to: "data" },
      { from: "orders", to: "data" },
      { from: "data", to: "receipt" },
      { from: "data", to: "reports" },
    ],
  },
  "royal-palace": {
    nodes: [
      n("app", 0, 1, L("SwiftUI app"), L("iOS")),
      n("rt", 1, 0, L("Realtime"), L("chat · typing", "شات · بيكتب…")),
      n("db", 1, 1, L("Postgres"), L("RLS · triggers")),
      n("storage", 1, 2, L("Storage"), L("per-user folders", "فولدر لكل مستخدم")),
      n("outbox", 2, 1, L("Push outbox"), L("retries stuck sends", "بيعيد اللي علِق")),
      n("apns", 3, 1, L("APNs"), L("via Edge Function", "عن طريق Edge Function")),
    ],
    edges: [
      { from: "app", to: "rt", both: true },
      { from: "app", to: "db", both: true },
      { from: "app", to: "storage" },
      { from: "db", to: "outbox" },
      { from: "outbox", to: "apns" },
    ],
  },
  mrc: {
    nodes: [
      n("app", 0, 1, L("Back-office app", "سيستم الإدارة"), L("JS · Tailwind")),
      n("auth", 1, 0, L("Server login", "تسجيل دخول"), L("bcrypt · session token")),
      n("db", 1, 1, L("Postgres"), L("RLS on every table", "RLS على كل جدول")),
      n("storage", 1, 2, L("Storage"), L("compressed photos", "صور متضغطة")),
      n("treasury", 2, 1, L("Treasury", "الخزنة"), L("balance-checked triggers", "triggers بتشيّك الرصيد")),
    ],
    edges: [
      { from: "app", to: "auth" },
      { from: "auth", to: "db" },
      { from: "app", to: "db", both: true },
      { from: "app", to: "storage" },
      { from: "db", to: "treasury" },
    ],
  },
  "sys-maher": {
    nodes: [
      n("b1", 0, 0, L("Branch 1", "الفرع ١"), L("React PWA")),
      n("b2", 0, 2, L("Branch 2", "الفرع ٢"), L("React PWA")),
      n("rt", 1, 1, L("Realtime"), L("live sync", "مزامنة لايف")),
      n("db", 2, 1, L("Postgres"), L("triggers move balances", "triggers بتحرّك الأرصدة")),
      n("tg", 3, 0, L("Telegram bot"), L("key events", "الأحداث المهمة")),
      n("close", 3, 2, L("Daily close", "تقفيل اليوم"), L("SQL functions")),
    ],
    edges: [
      { from: "b1", to: "rt", both: true },
      { from: "b2", to: "rt", both: true },
      { from: "rt", to: "db", both: true },
      { from: "db", to: "tg" },
      { from: "db", to: "close" },
    ],
  },
  "scale-x": {
    nodes: [
      n("visitor", 0, 1, L("Visitor", "الزائر"), L("EN · AR")),
      n("site", 1, 0, L("Static site", "موقع static"), L("HTML · CSS · JS")),
      n("form", 1, 2, L("Contact form", "فورم التواصل")),
      n("fn", 2, 2, L("Vercel Function")),
      n("mail", 3, 2, L("Resend"), L("reply-to: visitor", "الرد للزائر")),
    ],
    edges: [
      { from: "visitor", to: "site" },
      { from: "visitor", to: "form" },
      { from: "form", to: "fn" },
      { from: "fn", to: "mail" },
    ],
  },
  "shop-qr": {
    nodes: [
      n("qr", 0, 0, L("Shop QR", "QR المحل"), L("one per shop", "واحد لكل محل")),
      n("owner", 0, 2, L("Shop owner", "صاحب المحل"), L("dashboard", "لوحة التحكم")),
      n("flask", 1, 1, L("Flask on Vercel"), L("Jinja pages")),
      n("db", 2, 1, L("Supabase"), L("shops · wallets · scans", "محلات · محافظ · scans")),
      n("wallet", 2, 0, L("Wallet app", "تطبيق المحفظة"), L("pre-filled transfer", "التحويل جاهز")),
    ],
    edges: [
      { from: "qr", to: "flask" },
      { from: "owner", to: "flask", both: true },
      { from: "flask", to: "db", both: true },
      { from: "flask", to: "wallet" },
    ],
  },
  eventive: {
    nodes: [
      n("fe", 0, 1, L("Frontend"), L("JavaScript")),
      n("api", 1, 1, L("Flask REST API"), L("JSON only", "JSON بس")),
      n("db", 2, 0, L("Supabase tables"), L("events · attendees", "إيفنتات · حضور")),
      n("storage", 2, 2, L("Supabase Storage"), L("event photos", "صور الإيفنتات")),
      n("notify", 3, 1, L("Notifications", "الإشعارات"), L("to every user", "لكل المستخدمين")),
    ],
    edges: [
      { from: "fe", to: "api", both: true },
      { from: "api", to: "db", both: true },
      { from: "api", to: "storage" },
      { from: "db", to: "notify" },
    ],
  },
};
