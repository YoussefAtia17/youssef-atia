import type { Localized } from "./types";

export const contact = {
  email: "youssefatiav@gmail.com",
  github: "https://github.com/YoussefAtia17",
  cv: "/Resume.pdf",
  /** International format, digits only (e.g. 2010xxxxxxxx). Leave empty to hide the WhatsApp buttons. */
  whatsapp: "201098504605",
};

export const whatsappUrl = contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : null;

/** Big opening line of the About section. The middle part is highlighted. */
export const lead: { en: [string, string, string]; ar: [string, string, string] } = {
  en: ["I build software that ", "real businesses run on", ", from the database to the app in your hand."],
  ar: ["ببني سوفتوير ", "بيشتغل عليه بيزنس حقيقي", "، من الداتابيز لحد الأبلكيشن اللي في إيدك."],
};

export const bio: Localized = {
  en: "Most of what I build starts with a real problem: a gaming shop that needs a cashier system, an event that needs a live leaderboard, friends arguing over a restaurant bill. I design the data, build the backend and the app, and ship it to the people who actually use it.",
  ar: "أغلب اللي ببنيه بيبدأ بمشكلة حقيقية: محل بلايستيشن محتاج سيستم كاشير، إيفنت محتاج leaderboard لايف، أو صحاب بيتخانقوا على حساب المطعم. بصمّم الداتا، وببني الباك إند والأبلكيشن، وبسلّمه للناس اللي هتستخدمه فعلًا.",
};

/** What I bring, in three lines. */
export const pillars: { key: "backend" | "mobile" | "ai"; title: Localized; text: Localized }[] = [
  {
    key: "backend",
    title: { en: "Backend & data", ar: "باك إند وداتا" },
    text: {
      en: "Postgres schemas, auth and row-level security, built so the data stays right when real users hit it.",
      ar: "داتابيز Postgres بصلاحيات وحماية على مستوى كل صف، عشان الداتا تفضل مظبوطة لما المستخدمين الحقيقيين يدخلوا.",
    },
  },
  {
    key: "mobile",
    title: { en: "iOS & mobile", ar: "iOS وموبايل" },
    text: {
      en: "Native SwiftUI and Flutter apps with clean flows in Arabic and English.",
      ar: "تطبيقات SwiftUI و Flutter بتجربة نضيفة بالعربي والإنجليزي.",
    },
  },
  {
    key: "ai",
    title: { en: "AI & automation", ar: "AI وأتمتة" },
    text: {
      en: "Gemini, OCR and n8n workflows that take the boring manual steps off people's hands.",
      ar: "أدوات زي Gemini و n8n وقراءة الصور بالـ AI، بتشيل الخطوات اليدوية المملة من على الناس.",
    },
  },
];

export const skillGroups: { title: Localized; items: string[] }[] = [
  { title: { en: "Languages", ar: "لغات البرمجة" }, items: ["Python", "JavaScript", "TypeScript", "Swift", "C++", "SQL", "Dart"] },
  { title: { en: "Web & Mobile", ar: "ويب وموبايل" }, items: ["HTML", "CSS", "Tailwind", "Flask", "FastAPI", "SwiftUI", "Flutter"] },
  { title: { en: "Data & Backend", ar: "داتا وباك إند" }, items: ["Supabase", "PostgreSQL", "MySQL", "Firebase"] },
  { title: { en: "AI & Automation", ar: "AI وأتمتة" }, items: ["NumPy", "Gemini API", "Ollama", "n8n"] },
  { title: { en: "Tools & Hardware", ar: "أدوات وهاردوير" }, items: ["Git", "Docker", "Vercel", "Raspberry Pi", "Arduino"] },
];

export type TimelineItem = { title: Localized; place: Localized; date: Localized; text?: Localized };

export const experience: TimelineItem[] = [
  {
    title: { en: "Programming Teaching Assistant", ar: "مساعد مدرّس برمجة" },
    place: { en: "iSchool · Part-time", ar: "iSchool · دوام جزئي" },
    date: { en: "Jul 2026", ar: "يوليو 2026" },
    text: {
      en: "Supported instructors in programming classes and helped students debug and finish their projects.",
      ar: "ساعدت المدرّسين في حصص البرمجة وساعدت الطلاب يصلّحوا الأخطاء ويخلّصوا مشاريعهم.",
    },
  },
  {
    title: { en: "Event Organizer: GIS Event", ar: "منظّم فعالية GIS" },
    place: { en: "Egyptian Chinese University", ar: "الجامعة المصرية الصينية" },
    date: { en: "Mar 2024", ar: "مارس 2024" },
    text: {
      en: "Helped organize and coordinate a Geographic Information Systems event.",
      ar: "شاركت في تنظيم وتنسيق فعالية عن نظم المعلومات الجغرافية.",
    },
  },
  {
    title: { en: "Member: Programming & Tech Community", ar: "عضو في مجتمع البرمجة والتكنولوجيا" },
    place: { en: "Egyptian Chinese University", ar: "الجامعة المصرية الصينية" },
    date: { en: "Ongoing", ar: "مستمر" },
  },
];

export const education: TimelineItem = {
  title: { en: "B.Sc. Computer Science", ar: "بكالوريوس علوم الحاسب" },
  place: { en: "Egyptian Chinese University (ECU)", ar: "الجامعة المصرية الصينية (ECU)" },
  date: { en: "Expected 2028", ar: "التخرج المتوقع 2028" },
};

export const certifications: { name: string; issuer: string }[] = [
  { name: "Data Preparation in Excel", issuer: "DataCamp" },
  { name: "Data Management and Analysis", issuer: "Huawei" },
  { name: "Marketing", issuer: "HP LIFE" },
  { name: "OOP & Data Structures", issuer: "Programming Advices" },
];
