import type { Localized } from "./types";

export type Project = {
  slug: string;
  title: Localized;
  summary: Localized;
  stack: string[];
  /** Shown as a small badge, e.g. client name or research. */
  badge?: Localized;
  /** Your part when it was a team project. */
  role?: Localized;
  live?: string;
  github?: string;
  /** Used by the filter tabs on the home page. */
  kinds: ProjectKind[];
  /** Sample logins for the live demo, shown with copy buttons on the details page. Demo data only. */
  demoLogins?: { role: Localized; user: string; pass: string }[];
  /** Extra hint shown under the demo logins. */
  demoNote?: Localized;
  /** Repo is private: shows a "private code" note instead of a GitHub link. */
  privateCode?: boolean;
  /** Tailwind gradient: card cover when there is no screenshot, and accent on the details page. */
  cover: string;
  /** Cover screenshot in /public/projects. */
  image?: string;
  /** Short muted clip of the demo in use; plays over the card cover on hover. */
  video?: string;
  /** Extra screenshots shown on the details page. */
  gallery?: string[];
  details: ProjectDetails;
};

export type ProjectKind = "mobile" | "web" | "client" | "product";

export type ProjectDetails = {
  /** Why it exists: the problem or the client's need. */
  context: Localized;
  /** How it works end to end, from the user's side. */
  overview: Localized;
  /** What's inside: each part of the product with a short explanation. */
  modules: { title: Localized; body: Localized }[];
  /** Technical decisions worth calling out. */
  engineering: Localized[];
  /** Headline numbers, e.g. research results. */
  highlights?: { label: Localized; value: string; baseline?: Localized }[];
};

const GH = "https://github.com/YoussefAtia17";

export const featuredProjects: Project[] = [
  {
    slug: "splitter",
    video: "/projects/splitter/preview.mp4",
    kinds: ["mobile", "product"],
    title: { en: "Splitter: AI Bill Splitting", ar: "Splitter: تقسيم الفاتورة بالذكاء الاصطناعي" },
    summary: {
      en: "Mobile app that reads a restaurant receipt with AI, lets everyone tap what they ate, spreads service and tax fairly, and settles group balances in the fewest transfers, with InstaPay payments and spending insights.",
      ar: "تطبيق موبايل بيقرا فاتورة المطعم بالذكاء الاصطناعي، كل واحد يختار اللي أكله، الخدمة والضريبة بتتوزع بالعدل، وحسابات الجروب بتتسوى بأقل عدد تحويلات، مع دفع بإنستاباي وتحليلات للمصاريف.",
    },
    badge: { en: "Product · iOS & Android", ar: "منتج · iOS وAndroid" },
    stack: ["Flutter", "Dart", "Supabase", "AI OCR", "n8n"],
    live: "/demos/splitter.html",
    cover: "from-emerald-400 to-teal-600",
    image: "/projects/splitter/00_cover.webp",
    gallery: ["/projects/splitter/00_features.webp", "/projects/splitter/01_scan.webp", "/projects/splitter/02_split.webp", "/projects/splitter/03_groups.webp", "/projects/splitter/04_insights.webp"],
    details: {
      context: {
        en: "Every outing with friends ends the same way: one person pays, then someone does math on a phone calculator, service and tax get split evenly even though one person only had water, and the money is chased over WhatsApp for days. Splitter turns the receipt itself into the source of truth, so who owes what is exact and settling up takes a tap.",
        ar: "أي خروجة مع الصحاب بتخلص بنفس الشكل: واحد يدفع، وبعدين حد يقعد يحسب على الآلة الحاسبة، والخدمة والضريبة تتقسم بالتساوي حتى لو في واحد مشربش غير مياه، والفلوس تفضل تتلم على واتساب أيام. Splitter بيخلّي الفاتورة نفسها هي المرجع، فكل واحد عليه كام بيبقى مظبوط بالقرش، والتسوية بضغطة.",
      },
      overview: {
        en: "You take a photo of the receipt (or pick one from the gallery). The AI reads the restaurant name, every item with its quantity and price, plus the service charge and tax, and shows them as a list. You pick a friend, then tap the items they had; shared items like a bottle of water can belong to several people, and anything nobody picked is flagged before you continue. The next screen shows what each person owes, with service and tax distributed in proportion to what they ordered. Add the bill to a group, and the group keeps a running balance across all its expenses, works out who pays whom with the fewest transfers, and lets each person pay through InstaPay with reminders for anyone who is late.",
        ar: "بتصوّر الفاتورة (أو تختارها من المعرض). الذكاء الاصطناعي بيقرا اسم المكان وكل صنف بالكمية والسعر، والخدمة والضريبة، ويعرضهم في لستة. تختار صاحبك وتضغط على الأصناف اللي أكلها؛ والحاجات المشتركة زي إزازة المية ممكن تبقى على أكتر من حد، وأي صنف محدش اختاره بيتعلّم عليه قبل ما تكمّل. الشاشة اللي بعدها بتوريك كل واحد عليه كام، والخدمة والضريبة متوزعين بنسبة اللي طلبه. ولو ضفت الفاتورة لجروب، الجروب بيحسب الرصيد على كل المصاريف، ويطلّع مين يدفع لمين بأقل عدد تحويلات، وكل واحد يدفع بإنستاباي، ومع تذكير للي متأخر.",
      },
      modules: [
        {
          title: { en: "AI receipt scanning", ar: "مسح الفاتورة بالذكاء الاصطناعي" },
          body: {
            en: "Camera or gallery input; OCR extracts the venue, items, quantities, prices, service and tax, and the user can correct anything before splitting.",
            ar: "من الكاميرا أو المعرض؛ الـ OCR بيطلّع اسم المكان والأصناف والكميات والأسعار والخدمة والضريبة، والمستخدم يقدر يعدّل أي حاجة قبل التقسيم.",
          },
        },
        {
          title: { en: "Who had what", ar: "مين أكل إيه" },
          body: {
            en: "Pick a person, tap their items. Items can be shared between people, and unclaimed items are highlighted so nothing is left unpaid.",
            ar: "تختار الشخص وتضغط على أصنافه. الصنف ممكن يتقسم على أكتر من حد، والأصناف اللي محدش اختارها بتظهر بلون مختلف عشان مفيش حاجة تتنسي.",
          },
        },
        {
          title: { en: "Fair totals", ar: "حساب عادل" },
          body: {
            en: "Each person's share of service and tax follows the share of items they ordered, with a full breakdown per person.",
            ar: "نصيب كل واحد من الخدمة والضريبة على حسب اللي طلبه، مع تفصيل كامل لكل شخص.",
          },
        },
        {
          title: { en: "Groups & settle-up", ar: "الجروبات والتسوية" },
          body: {
            en: "Groups for recurring circles (flatmates, a trip, Thursday nights) with running balances, a minimum-transfers settlement plan, InstaPay payments and reminders.",
            ar: "جروبات للناس اللي بتتكرر (شقة، رحلة، سهرة الخميس) برصيد متجدد، وخطة تسوية بأقل عدد تحويلات، ودفع بإنستاباي وتذكيرات.",
          },
        },
        {
          title: { en: "Insights", ar: "التحليلات" },
          body: {
            en: "Spending by category and over the last six months, plus smart notes such as “eating out went up 35%” or “Ahmed is late settling up”.",
            ar: "المصاريف بالتصنيف وعلى آخر 6 شهور، وملاحظات ذكية زي «الخروجات زادت 35%» أو «أحمد متأخر في التسوية».",
          },
        },
        {
          title: { en: "Pro plan", ar: "اشتراك Pro" },
          body: {
            en: "A free tier with ads, and a monthly Pro plan with unlimited scans, no ads, deeper insights and PDF/Excel export of balances.",
            ar: "نسخة مجانية بإعلانات، واشتراك Pro شهري فيه مسح فواتير بلا حدود، من غير إعلانات، تحليلات أعمق، وتصدير الحسابات PDF وExcel.",
          },
        },
      ],
      engineering: [
        { en: "Debt simplification: group balances are reduced to the smallest set of transfers that settles everyone", ar: "تبسيط الديون: أرصدة الجروب بتتحوّل لأقل عدد تحويلات يسوّي الكل" },
        { en: "Service and tax distributed proportionally per person, so totals always add up to the receipt", ar: "الخدمة والضريبة بتتوزع بالنسبة على كل شخص، فالمجموع دايمًا بيطابق الفاتورة" },
        { en: "Supabase for auth, groups, expenses and balances; n8n workflows for reminders and notifications", ar: "Supabase للحسابات والجروبات والمصاريف والأرصدة، وworkflows على n8n للتذكيرات والإشعارات" },
        { en: "Arabic-first, right-to-left interface with Egyptian pound formatting", ar: "واجهة عربي من الأول، من اليمين للشمال، وبتنسيق الجنيه المصري" },
      ],
    },
  },
  {
    slug: "playzone",
    video: "/projects/playzone/preview.mp4",
    kinds: ["web", "client"],
    title: { en: "PlayZone: Gaming Café POS", ar: "PlayZone: كاشير محلات البلايستيشن" },
    summary: {
      en: "Cashier and management system for PlayStation, billiards and café shops: a live timer and hourly billing per device, orders and takeaway with stock that updates itself, printable receipts, expenses and daily/monthly profit reports.",
      ar: "برنامج كاشير وإدارة لمحلات البلايستيشن والبلياردو والكافيهات: عدّاد لايف وحساب بالساعة لكل جهاز، طلبات وتيك أواي والمخزن بيتخصم لوحده، فواتير للطباعة، مصروفات، وتقارير ربح يومية وشهرية.",
    },
    badge: { en: "Client · Real shop", ar: "عميل · محل حقيقي" },
    stack: ["JavaScript"],
    live: "/demos/playstation.html",
    cover: "from-orange-500 to-amber-600",
    image: "/projects/playzone/00_cover.webp",
    gallery: ["/projects/playzone/00_features.webp", "/projects/playzone/01_dashboard.webp", "/projects/playzone/02_device_orders.webp", "/projects/playzone/03_takeaway.webp", "/projects/playzone/04_receipt.webp", "/projects/playzone/05_report_day.webp", "/projects/playzone/06_report_month.webp", "/projects/playzone/07_stock.webp", "/projects/playzone/08_expenses.webp"],
    details: {
      context: {
        en: "Gaming cafés run on a notebook and a wall clock: the cashier writes down when each PlayStation started, adds up drinks and snacks by hand, and the owner only finds out at the end of the month whether the place made money. This system was built for a real shop to replace that with one screen where every device, every order and every pound is counted automatically.",
        ar: "محلات البلايستيشن ماشية بكشكول وساعة حيطة: الكاشير يكتب كل جهاز بدأ إمتى، ويجمع المشاريب والسناكس بإيده، وصاحب المحل مبيعرفش هو كسبان ولا لأ غير آخر الشهر. البرنامج ده اتعمل لمحل حقيقي عشان يبدّل ده بشاشة واحدة، كل جهاز وكل طلب وكل جنيه فيها بيتحسب لوحده.",
      },
      overview: {
        en: "The dashboard shows every device (PS5, PS4…) with its hourly rate and a live timer, plus today's income, expenses, net and how many devices are busy. The cashier starts a session, adds orders to it from a categorized menu (hot drinks, cold drinks, shisha, snacks), and ends it: the system prices the play time by the hour, adds the orders and produces a receipt ready to print as PDF. Takeaway orders go through the same menu without a device. Every order deducts from stock, expenses are logged as they happen, and the reports page shows income, expenses and net profit for any day or month.",
        ar: "لوحة التحكم بتعرض كل جهاز (PS5 وPS4…) بسعر الساعة وعدّاد لايف، ومعاهم دخل النهارده والمصروفات والصافي وكام جهاز شغال. الكاشير يبدأ القعدة، ويضيف عليها طلبات من منيو متقسّم (مشروبات سخنة وساقعة، شيشة، سناكس)، ويقفلها: البرنامج يحسب وقت اللعب بالساعة، ويجمع الطلبات، ويطلّع فاتورة جاهزة للطباعة PDF. التيك أواي بيمشي من نفس المنيو من غير جهاز. كل طلب بيتخصم من المخزن، والمصروفات بتتسجل أول بأول، وصفحة التقارير بتوريك الدخل والمصروفات وصافي الربح لأي يوم أو شهر.",
      },
      modules: [
        {
          title: { en: "Device board", ar: "لوحة الأجهزة" },
          body: {
            en: "Each device has its own hourly rate, a start/stop timer and its running orders; busy and free devices are visible at a glance.",
            ar: "كل جهاز ليه سعر ساعة وعدّاد بدء وإنهاء والطلبات اللي عليه، والأجهزة الشغالة والفاضية باينة من أول نظرة.",
          },
        },
        {
          title: { en: "Orders & takeaway", ar: "الطلبات والتيك أواي" },
          body: {
            en: "A categorized menu with prices and stock levels, used both for orders on a device and for takeaway.",
            ar: "منيو متقسّم بالأسعار والكميات المتاحة، بيتستخدم للطلبات على الجهاز وللتيك أواي.",
          },
        },
        {
          title: { en: "Receipts", ar: "الفواتير" },
          body: {
            en: "One receipt with play time, hourly rate, each order and the total, numbered and ready to print as PDF.",
            ar: "فاتورة واحدة فيها وقت اللعب وسعر الساعة وكل طلب والإجمالي، مترقّمة وجاهزة للطباعة PDF.",
          },
        },
        {
          title: { en: "Stock", ar: "المخزن" },
          body: {
            en: "Every sale deducts from stock automatically, so the owner sees what is running low without counting.",
            ar: "كل بيعة بتتخصم من المخزن أوتوماتيك، فصاحب المحل يعرف إيه اللي قرب يخلص من غير ما يعدّ.",
          },
        },
        {
          title: { en: "Expenses & reports", ar: "المصروفات والتقارير" },
          body: {
            en: "Expenses logged during the day; daily and monthly reports with income, expenses and net profit, plus a log of every receipt.",
            ar: "المصروفات بتتسجل خلال اليوم، وتقارير يومية وشهرية بالدخل والمصروفات وصافي الربح، وسجل بكل الفواتير.",
          },
        },
      ],
      engineering: [
        { en: "Billing computed from timestamps, so a session survives a page reload and the price is exact to the minute", ar: "الحساب معمول من وقت البداية والنهاية، فالقعدة مبتضيعش لو الصفحة اتعملها reload والسعر مظبوط بالدقيقة" },
        { en: "Orders, stock and reports share one data model, so a sale updates the receipt, the stock and the day's numbers together", ar: "الطلبات والمخزن والتقارير على نفس الداتا، فأي بيعة بتحدّث الفاتورة والمخزن وأرقام اليوم مع بعض" },
        { en: "Arabic, right-to-left cashier UI built for fast use on a single shop PC", ar: "واجهة كاشير عربي من اليمين للشمال، معمولة للاستخدام السريع على كمبيوتر واحد في المحل" },
      ],
    },
  },
  {
    slug: "royal-palace",
    video: "/projects/royal-palace/preview.mp4",
    kinds: ["mobile", "client"],
    title: { en: "Royal Palace", ar: "القصر الملكي" },
    summary: {
      en: "Native iOS marketplace for luxury Swiss watches: structured listings with admin review, real-time chat with price offers, smart Arabic/English search and push notifications, all on Supabase.",
      ar: "تطبيق iOS لبيع وشراء الساعات السويسرية الفاخرة: إعلانات بمواصفات كاملة ومراجعة من الإدارة، شات لايف فيه عروض أسعار، بحث ذكي بالعربي والإنجليزي، وإشعارات، والباك إند كله على Supabase.",
    },
    badge: { en: "Client · Aser Watch", ar: "عميل · Aser Watch" },
    stack: ["Swift", "SwiftUI", "Supabase", "PostgreSQL", "Edge Functions", "APNs"],
    live: "/demos/watch-app.html",
    privateCode: true,
    cover: "from-amber-500 to-rose-500",
    image: "/projects/royal-palace/00_cover.webp",
    gallery: ["/projects/royal-palace/00_features.webp", "/projects/royal-palace/01_gallery.webp", "/projects/royal-palace/02_details.webp", "/projects/royal-palace/03_chat.webp", "/projects/royal-palace/04_offers.webp", "/projects/royal-palace/05_selling.webp"],
    details: {
      context: {
        en: "Aser Watch deals in pre-owned luxury Swiss watches. Most of that market lives in WhatsApp groups and social posts: no structured details, no way to know if a seller is real, and negotiations scattered across chats. They wanted their own app where collectors can list watches properly, the business can vet every listing, and buyers and sellers can talk and negotiate in one place.",
        ar: "Aser Watch شغالين في الساعات السويسرية الفاخرة المستعملة. أغلب السوق ده عايش على جروبات واتساب وبوستات سوشيال: مفيش مواصفات مترتبة، مفيش طريقة تعرف بيها البائع حقيقي ولا لأ، والفصال متفرق في شاتات كتير. كانوا عايزين تطبيق خاص بيهم، الهواة ينزّلوا فيه ساعاتهم بشكل محترم، والإدارة تراجع كل إعلان، والمشتري والبائع يتكلموا ويتفاوضوا في مكان واحد.",
      },
      overview: {
        en: "Anyone can browse the catalog as a guest. To sell, a user signs in, adds a phone number and creates a listing with photos and the watch's full specs. The listing goes to a review queue, and an admin approves it or rejects it with a reason. Once live, buyers can save it to favorites, open a chat with the seller about that exact piece, and send a price offer that the seller accepts or declines right in the conversation. Both sides get push notifications for new messages, offers and review decisions, in the language their phone is set to. The whole app works in Arabic and English.",
        ar: "أي حد يقدر يتصفح الكتالوج كزائر. عشان يبيع، المستخدم بيسجل دخول، يضيف رقم موبايله، وينزّل إعلان بالصور والمواصفات الكاملة للساعة. الإعلان بيروح لطابور مراجعة، والأدمن يوافق عليه أو يرفضه مع ذكر السبب. أول ما ينزل، المشتري يقدر يحطه في المفضلة، يفتح شات مع البائع على القطعة دي بالذات، ويبعت عرض سعر البائع يقبله أو يرفضه جوه المحادثة. الطرفين بيوصلهم إشعارات للرسايل الجديدة والعروض وقرارات المراجعة، باللغة اللي على موبايلهم. والتطبيق كله شغال عربي وإنجليزي.",
      },
      modules: [
        {
          title: { en: "Catalog & smart search", ar: "الكتالوج والبحث الذكي" },
          body: {
            en: "Browse and filter by brand, condition and specs. The search understands that “رولكس” is “Rolex” and “صبمارينر” is “Submariner”: it turns Arabic and English words into how they sound and compares the sounds, so buyers find watches however they type the name.",
            ar: "تصفح وفلترة بالماركة والحالة والمواصفات. البحث فاهم إن «رولكس» هي «Rolex» و«صبمارينر» هي «Submariner»: بيحوّل الكلام العربي والإنجليزي لشكل نطقه ويقارن النطق، فالمشتري يلاقي الساعة مهما كتب اسمها إزاي.",
          },
        },
        {
          title: { en: "Structured watch listings", ar: "إعلانات بمواصفات الساعة كاملة" },
          body: {
            en: "Like Chrono24, every listing has fixed fields picked from lists: reference number, movement, case material and size, dial color, gender, production year, box & papers, and condition (from unworn to good). Sellers upload several photos, manage their listings and mark pieces as sold or hidden.",
            ar: "زي Chrono24، كل إعلان ليه خانات ثابتة بتتختار من قوايم: الرقم المرجعي، نوع الحركة، خامة الكيس ومقاسه، لون الميناء، رجالي ولا حريمي، سنة الإنتاج، العلبة والأوراق، والحالة (من جديد لم يُلبس لحد مستعمل بحالة كويسة). البائع بيرفع أكتر من صورة، ويدير إعلاناته، ويعلّم القطعة إنها اتباعت أو يخفيها.",
          },
        },
        {
          title: { en: "Admin review", ar: "مراجعة الإدارة" },
          body: {
            en: "New listings wait for approval, and a rejection always comes with a reason. Changing only the price skips review, but any other edit sends the listing back to the queue. A super admin promotes and removes other admins, and only admins can give a listing the verified badge.",
            ar: "الإعلانات الجديدة بتستنى موافقة، والرفض لازم يكون معاه سبب. تعديل السعر بس مش محتاج مراجعة، لكن أي تعديل تاني بيرجّع الإعلان للطابور. فيه أدمن رئيسي بيرقّي وينزّل باقي الأدمنز، والأدمن بس هو اللي يقدر يدي الإعلان علامة التوثيق.",
          },
        },
        {
          title: { en: "Real-time chat & offers", ar: "شات لايف وعروض أسعار" },
          body: {
            en: "One conversation per buyer per listing, delivered live. It has delivered and read ticks, a “typing…” indicator and price offers as a special message type that only the other side can accept or decline. Each person can delete a chat from their own side without touching the other's copy.",
            ar: "محادثة واحدة لكل مشتري على كل إعلان، والرسايل بتوصل لحظيًا. فيها علامات الوصول والقراءة، و«بيكتب…»، وعروض السعر كنوع رسالة خاص الطرف التاني بس هو اللي يقبله أو يرفضه. وكل طرف يقدر يمسح المحادثة من عنده بس من غير ما تتمسح عند التاني.",
          },
        },
        {
          title: { en: "Push notifications", ar: "الإشعارات" },
          body: {
            en: "Events like a new message, a new offer, a review decision or a listing waiting for review are written to an outbox, and an Edge Function delivers them through Apple Push. The app badge shows the number of unread conversations, and every device gets notifications in its own app language.",
            ar: "الأحداث زي رسالة جديدة، عرض سعر، قرار مراجعة، أو إعلان مستني مراجعة، بتتسجل في outbox، وEdge Function بتبعتها عن طريق Apple Push. الرقم اللي على أيقونة التطبيق هو عدد المحادثات اللي فيها رسايل متقرتش، وكل جهاز بيوصله الإشعار بلغة التطبيق اللي عليه.",
          },
        },
        {
          title: { en: "Accounts & profiles", ar: "الحسابات والبروفايل" },
          body: {
            en: "Sign-in, profile photo, name, and a phone number that only its owner can see. Users can delete their account from inside the app, as Apple requires.",
            ar: "تسجيل دخول، صورة بروفايل، اسم، ورقم موبايل محدش يشوفه غير صاحبه. والمستخدم يقدر يمسح حسابه من جوه التطبيق زي ما Apple بتطلب.",
          },
        },
      ],
      engineering: [
        { en: "Security lives in the database: row-level security policies plus column-level privileges, so a user can't verify their own listing, change the seller or promote themselves to admin even with a modified app", ar: "الحماية جوه الداتابيز: RLS policies وصلاحيات على مستوى العمود، فالمستخدم ميقدرش يوثّق إعلانه أو يغيّر البائع أو يرقّي نفسه أدمن حتى لو عدّل في التطبيق" },
        { en: "Business rules run as Postgres functions and triggers: offer status, review decisions, read receipts and last-message updates are decided on the server, not trusted from the app", ar: "قواعد البيزنس شغالة كـ functions وtriggers في Postgres: حالة العرض وقرار المراجعة وعلامات القراءة وآخر رسالة كلها بتتحدد على السيرفر، مش بنثق في اللي جاي من التطبيق" },
        { en: "Reliable push: a database outbox with automatic retry for anything stuck over 5 minutes, so a failed send never blocks the message itself", ar: "إشعارات موثوقة: outbox في الداتابيز بيعيد أي إشعار علِق أكتر من 5 دقايق، فلو الإرسال فشل الرسالة نفسها مبتقفش" },
        { en: "Supabase Realtime for messages and a private broadcast channel per conversation for typing, which only its two members can join", ar: "Supabase Realtime للرسايل، وقناة broadcast خاصة لكل محادثة لـ «بيكتب…» محدش يدخلها غير طرفيها" },
        { en: "Storage buckets where each user can upload only inside their own folder", ar: "Storage buckets كل مستخدم يرفع فيها جوه الفولدر بتاعه بس" },
        { en: "12 versioned SQL migrations and a TypeScript Edge Function, with SwiftUI views, services and models kept separate", ar: "12 SQL migration مترقمين وEdge Function بـ TypeScript، والـ Views والـ Services والـ Models في SwiftUI كل واحد في مكانه" },
      ],
    },
  },
  {
    slug: "mrc",
    video: "/projects/mrc/preview.mp4",
    kinds: ["web", "client"],
    demoLogins: [{ role: { en: "Owner", ar: "المالك" }, user: "owner@demo.com", pass: "demo1234" }],
    demoNote: { en: "Locked pages (treasury, salaries) open with the code 1234.", ar: "الصفحات المقفولة (الخزنة والمرتبات) بتفتح بالكود 1234." },
    title: { en: "MRC: Deals & Treasury System", ar: "MRC: نظام الصفقات والخزنة" },
    summary: {
      en: "The internal back-office for Royal Palace: customer deals with WhatsApp reminders, staff and payroll, salary advances and bonuses, and a locked treasury with daily and monthly closing.",
      ar: "السيستم الداخلي للقصر الملكي: صفقات العملاء مع رسايل واتساب للتذكير والمتابعة، الموظفين والمرتبات، السلف والبونص، وخزنة مقفولة بباسورد بتقفيل يومي وشهري.",
    },
    badge: { en: "Client · Aser Watch", ar: "عميل · Aser Watch" },
    stack: ["JavaScript", "Tailwind", "Supabase", "PostgreSQL", "SheetJS"],
    live: "/demos/mrc/index.html",
    github: `${GH}/MRC-redesign`,
    cover: "from-yellow-500 to-amber-700",
    image: "/projects/mrc/00_cover.webp",
    gallery: [
      "/projects/mrc/00_cover.webp",
      "/projects/mrc/01_login.webp",
      "/projects/mrc/02_treasury.webp",
      "/projects/mrc/03_deal_reminder.webp",
      "/projects/mrc/04_employees.webp",
      "/projects/mrc/05_whatsapp_lines.webp",
    ],
    details: {
      context: {
        en: "Behind the Royal Palace app there is a real team buying and selling watches every day. Deals were tracked in chats and notebooks, cash moved in and out of the safe with no clear record, and salary advances were easy to forget. The owners wanted one Arabic system where every deal, every employee and every pound in the treasury is accounted for.",
        ar: "ورا تطبيق القصر الملكي فيه فريق حقيقي بيشتري ويبيع ساعات كل يوم. الصفقات كانت متسجلة في شاتات ونوت، والفلوس بتدخل وتطلع من الخزنة من غير سجل واضح، والسلف كانت بسهولة تتنسي. الأونرز كانوا عايزين سيستم واحد بالعربي، كل صفقة وكل موظف وكل جنيه في الخزنة يبقى متسجل فيه.",
      },
      overview: {
        en: "Employees and owners log in with their own accounts. An employee records a new deal: the customer, the watch, the meeting time, the amount paid and photos of the piece. The system then prepares the WhatsApp messages to send the customer from the company's business line. Owners see everyone's deals, manage staff, pay advances and bonuses, and run the treasury, which has its own password. At the end of each day or month they open the closing view to see exactly what came in and what went out, and can export everything to Excel.",
        ar: "الموظفين والأونرز بيدخلوا كل واحد بحسابه. الموظف بيسجل ديل جديد: العميل، الساعة، ميعاد المقابلة، المبلغ المدفوع وصور القطعة. وبعدها السيستم بيجهز رسايل الواتساب اللي هتتبعت للعميل من خط البيزنس بتاع الشركة. الأونرز بيشوفوا ديلز الكل، ويديروا الموظفين، ويصرفوا السلف والبونص، ويمسكوا الخزنة اللي ليها باسورد لوحدها. وفي آخر كل يوم أو شهر بيفتحوا صفحة التقفيل ويشوفوا بالظبط إيه اللي دخل وإيه اللي طلع، ويقدروا يصدّروا كل حاجة لملف Excel.",
      },
      modules: [
        {
          title: { en: "Deals", ar: "الصفقات (الديلز)" },
          body: {
            en: "Each deal holds the customer's details, the watch (picked from a searchable list of Swiss brands, or typed in), several photos, the assigned employee and the WhatsApp line to use. A deal is “in progress”, “done” or “didn't close”, and a cancelled deal can be reopened. Deals are searchable from the top bar.",
            ar: "كل ديل فيه بيانات العميل، والساعة (بتتختار من قايمة ماركات سويسرية فيها بحث، أو تتكتب يدوي)، وأكتر من صورة، والموظف المسؤول، وخط الواتساب اللي هيتبعت منه. الديل يا إما «لسه قيد التواصل»، يا «تم الشراء»، يا «مكملش»، والديل الملغي ممكن يرجع يتفتح تاني. وفيه بحث في الديلز من فوق.",
          },
        },
        {
          title: { en: "WhatsApp reminders & follow-ups", ar: "رسايل التذكير والمتابعة على واتساب" },
          body: {
            en: "From the deal data the system writes a meeting reminder and a follow-up message, with a live preview of exactly what the customer will receive. The follow-up repeats every few days while the deal is still in progress. Choosing an employee automatically picks their company WhatsApp line.",
            ar: "من بيانات الديل السيستم بيكتب رسالة تذكير بالميعاد ورسالة متابعة، مع معاينة لايف للرسالة زي ما العميل هيستلمها بالظبط. رسالة المتابعة بتتكرر كل كام يوم طول ما الديل لسه قيد التواصل. ولما تختار الموظف، خط الواتساب بتاعه بيتحدد لوحده.",
          },
        },
        {
          title: { en: "Employees & payroll", ar: "الموظفين والمرتبات" },
          body: {
            en: "Owners create accounts with one of two roles, owner (full admin) or employee. Each employee card shows their salary, advances and bonuses. An instant advance is taken from the treasury and deducted from the salary at once, and only owners can add bonuses. Removing an employee archives them: they can no longer log in, but their history stays and they can be restored.",
            ar: "الأونر بيعمل الحسابات بدورين: أونر (أدمن كامل) أو موظف. كارت كل موظف فيه مرتبه وسلفه والبونص بتاعه. السلفة الفورية بتتسحب من الخزنة وتتخصم من المرتب على طول، والبونص للأونر بس. ومسح الموظف معناه أرشفة: مبقاش يقدر يدخل، لكن كل تاريخه بيفضل موجود وممكن يرجع تاني.",
          },
        },
        {
          title: { en: "Treasury & closing", ar: "الخزنة والتقفيل" },
          body: {
            en: "The treasury is locked behind its own password. Owners record deposits and expenses, and every advance and bonus is logged automatically. Three closing views show today's movements, this month's, or everything, and can be filtered to money in or money out only.",
            ar: "الخزنة مقفولة بباسورد خاص بيها. الأونرز بيسجلوا الإيداع والمصروفات، وأي سلفة أو بونص بيتسجل لوحده. فيه 3 شاشات تقفيل: حركات النهاردة، حركات الشهر، أو كل الحركات، وتقدر تفلتر على اللي دخل بس أو اللي اتصرف بس.",
          },
        },
        {
          title: { en: "Company WhatsApp lines", ar: "أرقام واتساب الشركة" },
          body: {
            en: "A password-protected page lists the company's WhatsApp Business numbers and whether each one is connected or temporarily disconnected, ready for the automatic sending server.",
            ar: "صفحة محمية بباسورد فيها أرقام واتساب البيزنس بتاعة الشركة، وحالة كل رقم: متصل ونشط ولا مفصول مؤقتًا، وجاهزة لسيرفر الإرسال الأوتوماتيك.",
          },
        },
        {
          title: { en: "Excel export", ar: "تصدير Excel" },
          body: {
            en: "One click exports deals, employees, advances and bonuses, and treasury movements to an Excel workbook, one sheet each, with real dates.",
            ar: "بضغطة واحدة الديلز والموظفين والسلف والبونص وحركات الخزنة بيتصدّروا في ملف Excel، كل واحد في شيت لوحده، بالتواريخ مظبوطة.",
          },
        },
      ],
      engineering: [
        { en: "Passwords hashed with bcrypt, and login handled on the server with a session token sent on every request", ar: "الباسوردات متشفرة بـ bcrypt، وتسجيل الدخول بيحصل على السيرفر بـ session token بيتبعت مع كل request" },
        { en: "Row-level security: nobody can read or write anything without a valid session, and the treasury can't be read until it's unlocked for that session", ar: "RLS: محدش يقدر يقرا أو يكتب أي حاجة من غير session صالحة، والخزنة متتقريش غير بعد ما تتفتح للـ session دي" },
        { en: "Treasury integrity enforced by Postgres triggers: balance checks before any withdrawal, and deleting a loan or bonus removes its treasury movements", ar: "سلامة الخزنة بـ triggers في Postgres: تشييك الرصيد قبل أي صرف، ومسح سلفة أو بونص بيمسح حركات الخزنة بتاعتها" },
        { en: "Unique account names enforced in the database, even if the same request is sent twice at the same moment", ar: "مينفعش حسابين بنفس الاسم، ومتأمنة في الداتابيز حتى لو نفس الطلب اتبعت مرتين في نفس اللحظة" },
        { en: "Photos compressed in the browser before upload, and all times shown in local time", ar: "الصور بتتضغط في المتصفح قبل الرفع، وكل المواعيد بتظهر بالتوقيت المحلي" },
        { en: "Arabic, right-to-left interface built with vanilla JavaScript and Tailwind, split into modules (auth, deals, employees, treasury, export)", ar: "واجهة عربي من اليمين للشمال بـ JavaScript عادي وTailwind، ومقسّمة modules (الدخول، الديلز، الموظفين، الخزنة، التصدير)" },
      ],
    },
  },
  {
    slug: "shop-qr",
    video: "/projects/shop-qr/preview.mp4",
    kinds: ["web", "product"],
    demoLogins: [{ role: { en: "Shop owner", ar: "صاحب المحل" }, user: "nour", pass: "demo123" }],
    title: { en: "Shop QR Payments", ar: "QR الدفع للمحلات" },
    summary: {
      en: "One QR code per shop that opens all its payment options (InstaPay and mobile wallets) and pre-fills the transfer, with scan and tap analytics and an owner dashboard.",
      ar: "QR لكل محل بيفتح كل وسايل الدفع بتاعته (InstaPay والمحافظ) ويجهّز التحويل جاهز، مع إحصائيات للـ scans والضغطات ولوحة تحكم لصاحب المحل.",
    },
    stack: ["Python", "Flask", "Supabase", "Jinja"],
    live: "/demos/qr-pay.html",
    github: `${GH}/QR-Code`,
    cover: "from-emerald-500 to-teal-600",
    image: "/projects/shop-qr/00_cover.webp",
    gallery: ["/projects/shop-qr/00_features.webp", "/projects/shop-qr/01_customer.webp", "/projects/shop-qr/02_instapay.webp", "/projects/shop-qr/03_dashboard.webp", "/projects/shop-qr/04_multishop.webp", "/projects/shop-qr/05_sticker.webp"],
    details: {
      context: {
        en: "Small shops in Egypt take payments through InstaPay and mobile wallets, but they usually do it by writing phone numbers on paper by the cashier. Customers copy the number wrong, ask which wallet to use, or type the transfer code by hand. One printed QR code that does all of that is faster for everyone.",
        ar: "المحلات الصغيرة في مصر بتستقبل فلوس على InstaPay والمحافظ، بس غالبًا عن طريق أرقام مكتوبة على ورقة جنب الكاشير. الزبون ينقل الرقم غلط، أو يسأل يحوّل على أنهي محفظة، أو يكتب كود التحويل بإيده. QR واحد مطبوع بيعمل كل ده أسرع للكل.",
      },
      overview: {
        en: "The shop prints its QR code, which opens a page with the shop's name, its InstaPay options and its wallet numbers. The customer picks InstaPay to go straight to the shop's InstaPay link, or taps “Send” next to a wallet number and enters an amount, and the phone dialer opens with the transfer code already filled in. The owner logs in to a dashboard to add or remove wallet numbers and see how many people scanned the code and how many went on to pay.",
        ar: "المحل بيطبع الـ QR بتاعه، وبيفتح صفحة فيها اسم المحل وطرق InstaPay وأرقام المحافظ. الزبون يختار InstaPay يروح على لينك المحل على طول، أو يدوس «ابعت» جنب رقم محفظة ويكتب المبلغ، فتطبيق الاتصال بيفتح وكود التحويل مكتوب جاهز. وصاحب المحل بيدخل لوحة تحكم يضيف أو يمسح أرقام المحافظ، ويشوف كام واحد عمل scan وكام واحد كمّل للدفع.",
      },
      modules: [
        {
          title: { en: "Shop payment page", ar: "صفحة الدفع للمحل" },
          body: {
            en: "Every shop has its own page at /shop/<slug>, in Arabic, showing InstaPay, Vodafone Cash and Etisalat Cash options and a numbered list of its wallet numbers.",
            ar: "كل محل ليه صفحة خاصة على ‎/shop/<slug>‎ بالعربي، فيها خيارات InstaPay وفودافون كاش واتصالات كاش، وقايمة مترقمة بأرقام المحافظ بتاعته.",
          },
        },
        {
          title: { en: "One-tap transfers", ar: "تحويل بضغطة" },
          body: {
            en: "For wallets, the customer enters the amount and the page builds the USSD transfer code with the shop's number and the amount, then opens the dialer. For InstaPay, it redirects to the shop's InstaPay link.",
            ar: "في المحافظ، الزبون بيكتب المبلغ والصفحة بتبني كود الـ USSD بتاع التحويل برقم المحل والمبلغ، وتفتح تطبيق الاتصال. وفي InstaPay بيتحوّل على لينك المحل على طول.",
          },
        },
        {
          title: { en: "Analytics", ar: "الإحصائيات" },
          body: {
            en: "Every time the page opens it counts a scan, and every transfer started counts a click, so the owner can see how many people who scanned actually paid.",
            ar: "كل مرة الصفحة تتفتح بيتحسب scan، وكل تحويل بيبدأ بيتحسب ضغطة، فصاحب المحل يعرف من اللي عملوا scan كام واحد دفع فعلًا.",
          },
        },
        {
          title: { en: "Owner dashboard", ar: "لوحة صاحب المحل" },
          body: {
            en: "A login per shop, then a dashboard with the stats and a form to add or delete wallet numbers. Changes show on the public page instantly.",
            ar: "تسجيل دخول لكل محل، وبعده لوحة فيها الإحصائيات وفورم يضيف أو يمسح أرقام المحافظ. والتغيير بيظهر على الصفحة العامة في ساعتها.",
          },
        },
      ],
      engineering: [
        { en: "Flask with server-rendered Jinja templates: no app to install, the page loads fast on any phone", ar: "Flask بـ Jinja templates من السيرفر: مفيش تطبيق يتنزل، والصفحة بتفتح بسرعة على أي موبايل" },
        { en: "Multi-tenant data in Supabase: shops, wallets and analytics tables linked by shop", ar: "داتا لكذا محل في Supabase: جداول للمحلات والمحافظ والإحصائيات مربوطة بالمحل" },
        { en: "Session-based login protects each shop's dashboard", ar: "تسجيل دخول بالـ sessions بيحمي لوحة كل محل" },
        { en: "Deployed as a serverless Python app on Vercel", ar: "منشور كـ Python serverless app على Vercel" },
      ],
    },
  },
  {
    slug: "eventive",
    kinds: ["web", "product"],
    title: { en: "Eventive", ar: "Eventive" },
    summary: {
      en: "Event RSVP platform: guests browse events, RSVP and manage their bookings, while organizers publish events with photo galleries and see every attendee.",
      ar: "منصة RSVP للإيفنتات: الضيوف يتصفحوا الإيفنتات ويحجزوا ويديروا حجوزاتهم، والمنظمين ينشروا إيفنتات بصور ويشوفوا كل الحضور.",
    },
    stack: ["Python", "Flask", "Supabase", "JavaScript"],
    live: "https://eventive-steel.vercel.app",
    github: `${GH}/Eventive`,
    cover: "from-fuchsia-500 to-purple-700",
    image: "/projects/eventive.jpg",
    details: {
      context: {
        en: "Organizers of small, curated events wanted something that feels more premium than a Google Form: a page that sells the event with photos and video, lets guests confirm in a click, and gives the organizer a clean list of who's coming.",
        ar: "منظمين الإيفنتات الصغيرة المختارة كانوا عايزين حاجة شكلها أفخم من Google Form: صفحة تبيّع الإيفنت بالصور والفيديو، الضيف يأكد حضوره بضغطة، والمنظم ياخد لستة نضيفة بمين جاي.",
      },
      overview: {
        en: "Guests land on an animated page with a video background, create an account and browse upcoming events with cover photos and galleries. They RSVP in one click, see all their bookings under “My Events”, and can cancel. Each action sends them an in-app notification. Organizers use a separate dashboard to publish, edit or delete events, and open an attendee database for each event with every guest's profile.",
        ar: "الضيف بيدخل على صفحة متحركة بخلفية فيديو، يعمل حساب، ويتصفح الإيفنتات الجاية بصور الغلاف والجاليري. بيحجز بضغطة، ويشوف كل حجوزاته في «My Events»، ويقدر يلغي. كل خطوة بيوصله عليها إشعار جوه الموقع. والمنظم ليه داشبورد لوحده ينشر ويعدّل ويمسح الإيفنتات، ويفتح قاعدة بيانات الحضور لكل إيفنت ببروفايل كل ضيف.",
      },
      modules: [
        {
          title: { en: "Event pages", ar: "صفحات الإيفنتات" },
          body: {
            en: "Each event has a cover image, a photo gallery and its details, shown on an animated landing page with light and dark themes.",
            ar: "كل إيفنت ليه صورة غلاف وجاليري صور وتفاصيله، معروضين على صفحة متحركة فيها وضع فاتح وغامق.",
          },
        },
        {
          title: { en: "RSVP & My Events", ar: "الحجز وصفحة My Events" },
          body: {
            en: "Guests confirm attendance in one click (no double bookings), track every event they've booked, and cancel with a confirmation step.",
            ar: "الضيف بيأكد حضوره بضغطة (مينفعش يحجز مرتين)، ويتابع كل الإيفنتات اللي حجزها، ويلغي بعد تأكيد.",
          },
        },
        {
          title: { en: "Profiles & notifications", ar: "البروفايل والإشعارات" },
          body: {
            en: "Guests have a profile with an avatar and a primary and secondary email. They get notifications when a new event is published and when they book or cancel.",
            ar: "الضيف ليه بروفايل بصورة وإيميل أساسي وإيميل تاني. وبيوصله إشعار لما إيفنت جديد ينزل ولما يحجز أو يلغي.",
          },
        },
        {
          title: { en: "Organizer dashboard", ar: "داشبورد المنظم" },
          body: {
            en: "Publish and edit events with cover and gallery uploads, delete an event along with its bookings, and see a database of attendees for each event, with the option to open a profile or remove a guest.",
            ar: "نشر وتعديل الإيفنتات ورفع الغلاف والجاليري، مسح الإيفنت بحجوزاته، وقاعدة بيانات بالحضور لكل إيفنت، تفتح منها بروفايل أي ضيف أو تشيله.",
          },
        },
      ],
      engineering: [
        { en: "Frontend and Flask REST API are fully separated, talking only through JSON endpoints", ar: "الفرونت إند والـ REST API بـ Flask منفصلين تمامًا، وبيتكلموا بس عن طريق JSON endpoints" },
        { en: "Images uploaded to Supabase Storage with unique file names; event data, users, attendees and notifications in Supabase tables", ar: "الصور بتترفع على Supabase Storage بأسماء فريدة، وداتا الإيفنتات والمستخدمين والحضور والإشعارات في جداول Supabase" },
        { en: "Publishing an event fans out a notification to every registered user", ar: "نشر إيفنت بيبعت إشعار لكل المستخدمين المسجلين" },
        { en: "User-generated text escaped before rendering, deployed on Vercel", ar: "أي نص من المستخدم بيتعمله escape قبل ما يظهر، ومنشور على Vercel" },
      ],
    },
  },
];

/** Older projects with no repo or images: shown as a compact list. */
export const earlierProjects: Pick<Project, "slug" | "title" | "summary" | "stack">[] = [
  {
    slug: "smart-home",
    title: { en: "Smart Home with AI & IoT", ar: "بيت ذكي بالـ AI والـ IoT" },
    summary: {
      en: "Raspberry Pi 5 + Arduino R4: face recognition, RFID and fingerprint access, gas/flame/smoke/motion sensors, and an AI voice assistant automated with n8n.",
      ar: "Raspberry Pi 5 وArduino R4: تعرّف على الوجه، دخول بالـ RFID والبصمة، حساسات غاز ولهب ودخان وحركة، ومساعد صوتي بالـ AI متوصل بـ n8n.",
    },
    stack: ["Python", "Raspberry Pi", "Arduino", "n8n", "Supabase"],
  },
  {
    slug: "moneyphi",
    title: { en: "MoneyPhi", ar: "MoneyPhi" },
    summary: {
      en: "AI-powered expense tracker with Gemini predictions, investment suggestions and Chart.js dashboards.",
      ar: "تطبيق لتتبع المصاريف بالـ AI: توقعات بـ Gemini، اقتراحات استثمار، ورسوم بيانية بـ Chart.js.",
    },
    stack: ["JavaScript", "Gemini API", "Chart.js"],
  },
  {
    slug: "crypto-exchange",
    title: { en: "Cryptocurrency Exchange Platform", ar: "منصة تداول عملات رقمية" },
    summary: {
      en: "Web platform for exchanging cryptocurrencies (Oct 2024 to Jan 2025).",
      ar: "منصة ويب لتبادل العملات الرقمية (أكتوبر 2024 لحد يناير 2025).",
    },
    stack: ["Web"],
  },
];
