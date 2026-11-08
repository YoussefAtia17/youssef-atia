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
  /** Repo is private: shows a "private code" note instead of a GitHub link. */
  privateCode?: boolean;
  /** Tailwind gradient: card cover when there is no screenshot, and accent on the details page. */
  cover: string;
  /** Screenshot in /public/projects. */
  image?: string;
  details: ProjectDetails;
};

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
    slug: "ara-fed",
    title: { en: "ARA-Fed", ar: "ARA-Fed" },
    summary: {
      en: "Adaptive, resource-aware federated learning framework. Smarter client scheduling and loss-adaptive aggregation beat FedAvg, FedProx, SCAFFOLD, FedNova and MOON across vision, NLP and audio on 100 simulated clients (CIFAR-10: 71% vs 52% for FedAvg).",
      ar: "إطار Federated Learning بيتكيّف مع موارد الأجهزة. جدولة أذكى للعملاء وتجميع بيتكيّف مع الـ loss، ونتايجه أحسن من FedAvg وFedProx وSCAFFOLD وFedNova وMOON في الصور والنصوص والصوت على 100 عميل.",
    },
    badge: { en: "Research", ar: "بحث" },
    stack: ["Python", "NumPy", "Matplotlib", "Federated Learning"],
    github: `${GH}/ARA-Fed-Simulation`,
    cover: "from-indigo-500 to-cyan-400",
    details: {
      context: {
        en: "Federated learning lets phones, sensors and hospitals train one shared model without ever uploading their private data. In practice two things hold it back: devices are very different (some are slow or on weak networks, so a training round waits for the slowest one), and each device's data looks nothing like the others' (non-IID), so simply averaging their updates pulls the model in conflicting directions. ARA-Fed is my research answer to both problems.",
        ar: "الـ Federated Learning بيخلّي الموبايلات والحساسات والمستشفيات يدرّبوا موديل واحد مشترك من غير ما حد فيهم يرفع الداتا الخاصة بتاعته. بس في الواقع فيه مشكلتين: الأجهزة مختلفة جدًا (في البطيء وفي اللي على نت ضعيف، فالجولة كلها بتستنى أبطأ جهاز)، والداتا اللي على كل جهاز مختلفة تمامًا عن التانيين (non-IID)، فلما تاخد متوسط التحديثات بتاعتهم ببساطة الموديل بيتشد في اتجاهات متعارضة. ARA-Fed هو الحل اللي قدمته في البحث للمشكلتين دول.",
      },
      overview: {
        en: "Each training round, the server first decides which clients are worth asking, based on their resources and network conditions, instead of picking at random. The selected clients train locally and send back only their model updates. The server then aggregates those updates with weights that adapt to each client's loss, so clients that help the global model count for more and noisy ones count for less. The framework was evaluated on 100 clients with strict Dirichlet (α = 0.5) partitioning, across vision, text and audio, against five state-of-the-art baselines. This repository holds the scripts that reproduce the paper's comparison charts.",
        ar: "في كل جولة تدريب، السيرفر الأول بيقرر مين من العملاء يستاهل يتسأل، على حسب موارد كل جهاز وحالة الشبكة بتاعته، بدل ما يختار عشوائي. العملاء اللي اتختاروا بيدرّبوا عندهم محليًا ويبعتوا التحديثات بتاعة الموديل بس. بعد كده السيرفر بيجمّع التحديثات دي بأوزان بتتغير حسب الـ loss بتاع كل عميل، فالعميل اللي بيفيد الموديل العام بياخد وزن أكبر، واللي داتاه مشوشة بياخد وزن أقل. الإطار اتقيّم على 100 عميل بتقسيم Dirichlet صارم (α = 0.5)، في الصور والنصوص والصوت، قدام 5 من أحدث الطرق. الريبو ده فيه السكريبتات اللي بتطلّع رسومات المقارنة اللي في البحث.",
      },
      modules: [
        {
          title: { en: "Strategic client scheduling", ar: "جدولة ذكية للعملاء" },
          body: {
            en: "Clients are profiled by their available resources, bandwidth and latency, and the scheduler picks the ones that can contribute in time. Fewer stragglers means shorter rounds and less wasted communication.",
            ar: "كل عميل بيتعمله profile بالموارد المتاحة والـ bandwidth والـ latency، والـ scheduler بيختار اللي يقدر يساهم في الوقت. أجهزة بطيئة أقل يعني جولات أقصر واتصال أقل على الفاضي.",
          },
        },
        {
          title: { en: "Loss-adaptive aggregation", ar: "تجميع بيتكيّف مع الـ loss" },
          body: {
            en: "Instead of FedAvg's plain weighted average, the server weighs each update by how it affects the loss. This keeps the global model stable when every client's data is skewed differently.",
            ar: "بدل المتوسط العادي بتاع FedAvg، السيرفر بيدي كل تحديث وزن على حسب تأثيره على الـ loss. ده بيخلّي الموديل العام ثابت حتى لو داتا كل عميل منحازة بشكل مختلف.",
          },
        },
        {
          title: { en: "Multi-modal evaluation", ar: "تقييم على أنواع داتا مختلفة" },
          body: {
            en: "Three simulation scripts cover vision (MNIST, CIFAR-10), NLP (AG News, IMDB) and audio (Speech Commands, UrbanSound8K), plotting test accuracy over 30 communication rounds for every algorithm.",
            ar: "3 سكريبتات محاكاة بتغطي الصور (MNIST وCIFAR-10)، والنصوص (AG News وIMDB)، والصوت (Speech Commands وUrbanSound8K)، وبترسم دقة الاختبار على 30 جولة اتصال لكل خوارزمية.",
          },
        },
        {
          title: { en: "Framework comparison", ar: "مقارنة مع الأدوات التانية" },
          body: {
            en: "A radar chart compares the ARA-Fed simulator with FedML, Flower and LEAF on multi-modal support, network profiling, non-IID granularity, modularity and baseline coverage.",
            ar: "رسم radar بيقارن محاكي ARA-Fed بـ FedML وFlower وLEAF في دعم أنواع الداتا، وقياس الشبكة، ودقة تقسيم الـ non-IID، وسهولة التعديل، وعدد الطرق المدعومة.",
          },
        },
      ],
      engineering: [
        { en: "Benchmarked against FedAvg, FedProx, SCAFFOLD, FedNova and MOON on the same 100-client setup", ar: "اتقارن بـ FedAvg وFedProx وSCAFFOLD وFedNova وMOON على نفس الإعداد بتاع 100 عميل" },
        { en: "Strict Dirichlet α = 0.5 partitioning to model realistic non-IID data", ar: "تقسيم Dirichlet صارم α = 0.5 عشان يمثّل داتا non-IID زي الواقع" },
        { en: "Lightweight on purpose: plain Python, NumPy and Matplotlib, easy to modify and rerun", ar: "خفيف عن قصد: Python وNumPy وMatplotlib بس، سهل تعدّل فيه وتشغّله تاني" },
        { en: "Written up as the paper “Federated Learning for Privacy-Preserving AI: An Optimized Client-Server Aggregation Protocol”", ar: "متكتب كبحث بعنوان «Federated Learning for Privacy-Preserving AI: An Optimized Client-Server Aggregation Protocol»" },
      ],
      highlights: [
        { label: { en: "CIFAR-10 accuracy", ar: "دقة CIFAR-10" }, value: "71.05%", baseline: { en: "FedAvg 51.82%", ar: "FedAvg ‏51.82%" } },
        { label: { en: "AG News accuracy", ar: "دقة AG News" }, value: "88.94%", baseline: { en: "FedAvg 62.23%", ar: "FedAvg ‏62.23%" } },
        { label: { en: "Speech Commands accuracy", ar: "دقة Speech Commands" }, value: "92.78%", baseline: { en: "FedAvg 53.54%", ar: "FedAvg ‏53.54%" } },
      ],
    },
  },
  {
    slug: "royal-palace",
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
    title: { en: "MRC: Deals & Treasury System", ar: "MRC: نظام الصفقات والخزنة" },
    summary: {
      en: "The internal back-office for Royal Palace: customer deals with WhatsApp reminders, staff and payroll, salary advances and bonuses, and a locked treasury with daily and monthly closing.",
      ar: "السيستم الداخلي للقصر الملكي: صفقات العملاء مع رسايل واتساب للتذكير والمتابعة، الموظفين والمرتبات، السلف والبونص، وخزنة مقفولة بباسورد بتقفيل يومي وشهري.",
    },
    badge: { en: "Client · Aser Watch", ar: "عميل · Aser Watch" },
    stack: ["JavaScript", "Tailwind", "Supabase", "PostgreSQL", "SheetJS"],
    live: "/demos/mrc/index.html",
    github: `${GH}/MRC`,
    cover: "from-yellow-500 to-amber-700",
    image: "/projects/mrc.jpg",
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
    slug: "icpc-orientation",
    title: { en: "ICPC × ECU Orientation Challenge", ar: "تحدي ICPC × ECU للـ Orientation" },
    summary: {
      en: "Mobile web game for the ICPC booth: students scan a QR code, beat three timed puzzles, and land on a live multi-wave leaderboard with an admin panel and CSV export.",
      ar: "لعبة ويب للموبايل في بوث ICPC: الطالب يعمل scan للـ QR، يحل 3 ألغاز بتايمر، ويظهر على leaderboard لايف بأكتر من wave، ومعاها لوحة أدمن وتصدير CSV.",
    },
    role: { en: "Database & backend", ar: "الداتابيز والباك إند" },
    stack: ["JavaScript", "Supabase", "PostgreSQL"],
    live: "https://icpc-website.vercel.app",
    cover: "from-sky-500 to-blue-700",
    image: "/projects/icpc-orientation.jpg",
    details: {
      context: {
        en: "At Orientation 2026 the ICPC community at ECU wanted a booth activity that would pull new students in and show them what competitive programming feels like, in a couple of minutes on their own phones. The challenge was crowded Wi-Fi, hundreds of students in waves, and staff who needed to see results live and pick winners on the spot.",
        ar: "في Orientation 2026، مجتمع ICPC في ECU كان عايز نشاط في البوث يجذب الطلاب الجداد ويوريهم إحساس البرمجة التنافسية، في دقيقتين على موبايلاتهم. التحدي كان النت الزحمة، ومئات الطلاب جايين على دفعات (waves)، وفريق البوث محتاج يشوف النتايج لايف ويختار الفايزين في ساعتها.",
      },
      overview: {
        en: "A student scans the poster's QR code, types their name and starts the clock. They play three games in order, from easiest to hardest. When all three are done, the Finish button unlocks, their score goes to the leaderboard for the current wave, and a verification code appears that they show at the booth. Staff watch a hidden leaderboard page on a big screen, start a new wave when the next group arrives, and announce the top three.",
        ar: "الطالب بيعمل scan للـ QR اللي على البوستر، يكتب اسمه، والتايمر يبدأ. بيلعب 3 ألعاب بالترتيب من الأسهل للأصعب. لما يخلّصهم، زرار Finish بيتفتح، والسكور بتاعه بيروح للـ leaderboard بتاع الـ wave الحالية، ويظهرله كود يوريه في البوث. فريق البوث بيتابع صفحة leaderboard مخفية على شاشة كبيرة، ويبدأ wave جديدة لما الدفعة اللي بعدها توصل، ويعلن أول 3.",
      },
      modules: [
        {
          title: { en: "Byte Riddle", ar: "Byte Riddle" },
          body: {
            en: "A one-line clue describes a computer science, AI or tech concept. The first letter is given and players tap letter tiles to spell the answer. Five clues, two tries each.",
            ar: "جملة واحدة بتوصف مفهوم في علوم الحاسب أو الـ AI أو التكنولوجيا. أول حرف بيبقى ظاهر، واللاعب بيدوس على مربعات الحروف يكوّن الإجابة. 5 ألغاز، ومحاولتين لكل واحد.",
          },
        },
        {
          title: { en: "The Maze", ar: "The Maze" },
          body: {
            en: "A generated 14×14 maze with loops, dead ends and at least three routes to the exit. Each tap moves one cell, and every wall hit costs 2 points.",
            ar: "متاهة 14×14 بتتولّد، فيها لفّات وطرق مقفولة و3 طرق على الأقل للخروج. كل ضغطة بتحرّك خانة واحدة، وكل خبطة في حيطة بتخصم نقطتين.",
          },
        },
        {
          title: { en: "Crack The Code", ar: "Crack The Code" },
          body: {
            en: "A hidden 3-digit code and six clues. Pure deduction: exactly one code fits all six.",
            ar: "كود مخفي من 3 أرقام و6 تلميحات. استنتاج بحت: كود واحد بس هو اللي ينطبق على الـ 6.",
          },
        },
        {
          title: { en: "Live multi-wave leaderboard", ar: "Leaderboard لايف بأكتر من wave" },
          body: {
            en: "A hidden /leaderboard page with tabs for each wave and a combined “All Waves” view, plus a top-3 podium with prize labels. New scores appear without refreshing.",
            ar: "صفحة ‎/leaderboard‎ مخفية فيها tab لكل wave وتجميعة لكل الـ waves، ومنصة لأول 3 بأسماء الجوايز. السكور الجديد بيظهر من غير refresh.",
          },
        },
        {
          title: { en: "Admin panel", ar: "لوحة الأدمن" },
          body: {
            en: "Start a new wave, enter a score by hand for a student whose phone lost connection, rename the prizes, export all results to CSV, and clear everything before the event starts.",
            ar: "بدء wave جديدة، إدخال سكور يدوي لطالب النت فصل عنده، تغيير أسماء الجوايز، تصدير كل النتايج CSV، ومسح كل الداتا قبل ما الإيفنت يبدأ.",
          },
        },
      ],
      engineering: [
        { en: "My part: the cloud layer that stores scores and wave settings in Supabase and keeps every booth device in sync", ar: "دوري: طبقة الـ cloud اللي بتخزّن السكورز وإعدادات الـ waves في Supabase وبتخلّي كل أجهزة البوث متزامنة" },
        { en: "Each submission is tagged with the active wave on the server side, so changing waves takes effect for incoming scores immediately", ar: "كل سكور بيتسجل على الـ wave الحالية وقت الإرسال، فتغيير الـ wave بيأثر على السكورز الجاية في ساعتها" },
        { en: "Offline fallback: with no cloud config it runs on localStorage and BroadcastChannel, so several tabs stay in sync for testing or when the network drops", ar: "شغال أوفلاين: من غير إعدادات cloud بيشتغل على localStorage وBroadcastChannel، فكذا tab بيفضلوا متزامنين للتجربة أو لو النت وقع" },
        { en: "Tiny static site (about 120 KB, mostly the logo) so it loads fast on crowded event Wi-Fi, and works even from a USB stick", ar: "موقع static صغير جدًا (حوالي 120 KB أغلبهم اللوجو) عشان يفتح بسرعة على نت الإيفنت الزحمة، وبيشتغل حتى من فلاشة" },
        { en: "Seeded random generator for the maze and code puzzles", ar: "مولّد أرقام عشوائية بـ seed للمتاهة ولغز الكود" },
      ],
    },
  },
  {
    slug: "shop-qr",
    title: { en: "Shop QR Payments", ar: "QR الدفع للمحلات" },
    summary: {
      en: "One QR code per shop that opens all its payment options (InstaPay and mobile wallets) and pre-fills the transfer, with scan and tap analytics and an owner dashboard.",
      ar: "QR لكل محل بيفتح كل وسايل الدفع بتاعته (InstaPay والمحافظ) ويجهّز التحويل جاهز، مع إحصائيات للـ scans والضغطات ولوحة تحكم لصاحب المحل.",
    },
    stack: ["Python", "Flask", "Supabase", "Jinja"],
    live: "https://qr-code-tan-tau.vercel.app/login",
    github: `${GH}/QR-Code`,
    cover: "from-emerald-500 to-teal-600",
    image: "/projects/shop-qr.jpg",
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
