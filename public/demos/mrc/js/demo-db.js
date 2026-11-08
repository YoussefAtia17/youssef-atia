// =========================================================================
// MRC — نسخة تجريبية (Demo)
// قاعدة بيانات وهمية جوه المتصفح بدل Supabase: نفس الجداول ونفس الـ RPCs
// ونفس قواعد السيرفر (الخزنة، الصلاحيات، الأرشفة)، ببيانات تجريبية.
// =========================================================================
(function () {
    // لو المتصفح مانع التخزين (زي بعض الإطارات المقفولة)، نستخدم تخزين في الذاكرة بدل ما الصفحة تقف
    function memStore() { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; }, clear: () => { Object.keys(m).forEach(k => delete m[k]); }, key: i => Object.keys(m)[i] || null, get length() { return Object.keys(m).length; } }; }
    ['localStorage', 'sessionStorage'].forEach(name => {
        let okStore = false;
        try { const st = window[name]; st.setItem('__t', '1'); st.removeItem('__t'); okStore = true; } catch (e) {}
        if (!okStore) { try { Object.defineProperty(window, name, { value: memStore(), configurable: true }); } catch (e) {} }
    });
})();
(function () {
    const KEY = 'mrc_demo_db_v1';
    const DEMO_PASS = 'demo1234';
    const LOCK_PASS = '1234';

    // ---------- تخزين آمن (localStorage لو متاح، وإلا في الذاكرة) ----------
    let memory = null;
    function load() {
        try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch (e) {}
        return memory;
    }
    function save(db) {
        memory = db;
        try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {}
    }

    const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Math.random().toString(36).slice(2) + Date.now());
    const daysAgo = (d, h = 12) => { const t = new Date(); t.setDate(t.getDate() - d); t.setHours(h, (d * 7) % 60, 0, 0); return t.toISOString(); };
    const daysAhead = (d, h = 17) => { const t = new Date(); t.setDate(t.getDate() + d); t.setHours(h, 0, 0, 0); return t.toISOString(); };

    // صورة ساعة مرسومة (SVG) بألوان مختلفة لكل ديل
    function watchImg(dial, strap, accent) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f8fafc"/><rect x="78" y="8" width="44" height="60" rx="8" fill="${strap}"/><rect x="78" y="132" width="44" height="60" rx="8" fill="${strap}"/><circle cx="100" cy="100" r="52" fill="${accent}"/><circle cx="100" cy="100" r="44" fill="${dial}"/><g stroke="${accent}" stroke-width="3" stroke-linecap="round"><line x1="100" y1="62" x2="100" y2="70"/><line x1="100" y1="130" x2="100" y2="138"/><line x1="62" y1="100" x2="70" y2="100"/><line x1="130" y1="100" x2="138" y2="100"/></g><line x1="100" y1="100" x2="100" y2="74" stroke="#f8fafc" stroke-width="4" stroke-linecap="round"/><line x1="100" y1="100" x2="120" y2="110" stroke="#f8fafc" stroke-width="3" stroke-linecap="round"/><circle cx="100" cy="100" r="4" fill="${accent}"/><rect x="152" y="94" width="8" height="12" rx="2" fill="${accent}"/></svg>`;
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    function seed() {
        const ownerId = uid(), u1 = uid(), u2 = uid(), u3 = uid();
        const e0 = uid(), e1 = uid(), e2 = uid(), e3 = uid();
        const db = {
            app_users: [
                { id: ownerId, full_name: 'Owner', email: 'owner@demo.com', phone: '01000000000', role: 'owner', password: DEMO_PASS, created_at: daysAgo(90), archived_at: null },
                { id: u1, full_name: 'Ahmed', email: 'ahmed@demo.com', phone: '01012345678', role: 'employee', password: DEMO_PASS, created_at: daysAgo(80), archived_at: null },
                { id: u2, full_name: 'كريم علاء', email: 'karim@demo.com', phone: '01098765432', role: 'employee', password: DEMO_PASS, created_at: daysAgo(60), archived_at: null },
                { id: u3, full_name: 'مصطفى حسن', email: 'mostafa@demo.com', phone: '01122334455', role: 'employee', password: DEMO_PASS, created_at: daysAgo(120), archived_at: daysAgo(20) }
            ],
            employees: [
                { id: e0, user_id: ownerId, full_name: 'Owner', phone_whatsapp: '01000000000', base_salary: 0, created_at: daysAgo(90), archived_at: null },
                { id: e1, user_id: u1, full_name: 'Ahmed', phone_whatsapp: '01012345678', base_salary: 9000, created_at: daysAgo(80), archived_at: null },
                { id: e2, user_id: u2, full_name: 'كريم علاء', phone_whatsapp: '01098765432', base_salary: 8000, created_at: daysAgo(60), archived_at: null },
                { id: e3, user_id: u3, full_name: 'مصطفى حسن', phone_whatsapp: '01122334455', base_salary: 7500, created_at: daysAgo(120), archived_at: daysAgo(20) }
            ],
            whatsapp_instances: [
                { id: 1, instance_name: 'خط المبيعات 1', phone_number: '01011112222', status: 'active', created_at: daysAgo(90) },
                { id: 2, instance_name: 'خط المبيعات 2', phone_number: '01233334444', status: 'active', created_at: daysAgo(70) },
                { id: 3, instance_name: 'خط احتياطي', phone_number: '01155556666', status: 'disabled', created_at: daysAgo(40) }
            ],
            deals: [],
            employee_financials: [],
            treasury_transactions: [],
            locks: { treasury: LOCK_PASS, whatsapp: LOCK_PASS },
            sessions: {},
            seq: 4
        };

        const deal = (o) => db.deals.push(Object.assign({
            id: uid(), employee_id: e1, whatsapp_instance_id: 1, assigned_by_name: 'Owner', assigned_by_role: 'owner',
            client_location: 'القاهرة', deal_details: '', amount_paid: 0, amount_requested: 0, selling_price_range: null,
            meeting_time: null, reminder_message: null, followup_message: null, followup_interval_days: 15,
            item_image_url: null, item_images: [], status: 'in_progress', created_at: daysAgo(1)
        }, o));
        const imgs = [
            watchImg('#0f3d2e', '#1f2937', '#c8a24a'), watchImg('#0b1f4b', '#334155', '#cbd5e1'),
            watchImg('#111827', '#7c2d12', '#d4af37'), watchImg('#f1f5f9', '#475569', '#94a3b8'),
            watchImg('#1e3a8a', '#0f172a', '#e2e8f0'), watchImg('#3f3f46', '#a16207', '#facc15')
        ];
        deal({ client_name: 'م. شريف عادل', client_phone: '01001234567', watch_brand: 'Rolex (رولكس)', deal_details: 'Submariner موديل 2019، علبة وورق كاملين، حالة ممتازة', amount_requested: 520000, amount_paid: 480000, selling_price_range: '540,000 - 560,000', status: 'completed', item_images: [imgs[0]], created_at: daysAgo(12), employee_id: e1 });
        deal({ client_name: 'أ. منى فؤاد', client_phone: '01112345678', watch_brand: 'Omega (أوميجا)', deal_details: 'Seamaster Aqua Terra، من غير علبة', amount_requested: 145000, amount_paid: 130000, selling_price_range: '150,000 - 160,000', status: 'completed', item_images: [imgs[1]], created_at: daysAgo(6), employee_id: e2, whatsapp_instance_id: 2 });
        deal({ client_name: 'د. هشام رمزي', client_phone: '01223456789', client_location: 'الإسكندرية', watch_brand: 'Cartier (كارتييه)', deal_details: 'Santos Medium، استيل ودهب', amount_requested: 210000, status: 'in_progress', meeting_time: daysAhead(1, 18), reminder_message: 'تذكير بميعاد المعاينة بكرة الساعة 6', item_images: [imgs[2]], created_at: daysAgo(2), employee_id: e1 });
        deal({ client_name: 'أ. ياسر نبيل', client_phone: '01098761234', watch_brand: 'Tudor (تيودور)', deal_details: 'Black Bay 58، ضمان ساري', amount_requested: 95000, status: 'in_progress', followup_message: 'أهلاً أستاذ ياسر، لسه مهتم تبيع الـ Black Bay؟', followup_interval_days: 7, item_images: [imgs[3]], created_at: daysAgo(4), employee_id: e2, whatsapp_instance_id: 2 });
        deal({ client_name: 'م. طارق سليم', client_phone: '01556789012', watch_brand: 'Patek Philippe (باتيك فيليب)', deal_details: 'Calatrava، طلب سعر أعلى من السوق', amount_requested: 1350000, status: 'cancelled', item_images: [imgs[4]], created_at: daysAgo(9), employee_id: e1 });
        deal({ client_name: 'أ. رانيا سمير', client_phone: '01009988776', client_location: 'الجيزة', watch_brand: 'Breitling (بريتلينج)', deal_details: 'Navitimer B01، كرونوغراف', amount_requested: 180000, status: 'in_progress', meeting_time: daysAhead(3, 13), item_images: [imgs[5]], created_at: daysAgo(0), employee_id: e2 });
        deal({ client_name: 'أ. عمرو جلال', client_phone: '01277665544', watch_brand: 'TAG Heuer (تاج هوير)', deal_details: 'Carrera Calibre 5', amount_requested: 62000, amount_paid: 55000, status: 'completed', item_images: [imgs[1]], created_at: daysAgo(35), employee_id: e1 });

        const tr = (type, amount, description, when, extra = {}) => db.treasury_transactions.push(Object.assign({
            id: uid(), transaction_type: type, amount, description, transaction_date: when, related_deal_id: null, related_emp_financial_id: null
        }, extra));
        tr('in', 1500000, 'إيداع رأس مال تشغيل', daysAgo(40, 10));
        tr('out', 55000, 'شراء Carrera Calibre 5 - العميل: أ. عمرو جلال', daysAgo(35, 15));
        tr('in', 68000, 'بيع Carrera Calibre 5', daysAgo(30, 16));
        tr('out', 480000, 'شراء Submariner - العميل: م. شريف عادل', daysAgo(12, 14));
        tr('out', 130000, 'شراء Seamaster - العميل: أ. منى فؤاد', daysAgo(6, 13));
        tr('in', 158000, 'بيع Seamaster Aqua Terra', daysAgo(3, 19));
        tr('out', 3500, 'مصاريف شحن وتأمين', daysAgo(2, 11));
        tr('out', 1200, 'ضيافة ومستلزمات المكتب', daysAgo(0, 10));

        const fin = (empId, type, amount, notes, when) => {
            const id = uid();
            db.employee_financials.push({ id, employee_id: empId, transaction_type: type, amount, notes, approval_status: 'approved', transaction_date: when });
            const name = db.employees.find(e => e.id === empId).full_name;
            tr('out', amount, (type === 'loan' ? 'سحب سلفة: ' : 'صرف بونص (مكافأة): ') + name + (notes ? ' - البيان: ' + notes : ''), when, { related_emp_financial_id: id });
        };
        fin(e1, 'bonus', 2500, 'عمولة صفقة Submariner', daysAgo(11, 17));
        fin(e2, 'loan', 1500, 'سلفة شخصية', daysAgo(5, 12));
        fin(e2, 'bonus', 1000, 'عمولة صفقة Seamaster', daysAgo(3, 20));
        fin(e1, 'loan', 2000, '', daysAgo(1, 13));
        return db;
    }

    let store = load();
    if (!store || !store.app_users) { store = seed(); save(store); }

    const err = (message) => ({ data: null, error: { message } });
    const ok = (data) => ({ data, error: null });
    const balance = () => store.treasury_transactions.reduce((s, t) => s + (t.transaction_type === 'in' ? 1 : -1) * Number(t.amount || 0), 0);
    const strip = (u) => u && ({ id: u.id, full_name: u.full_name, email: u.email, phone: u.phone, role: u.role, created_at: u.created_at, archived_at: u.archived_at });

    function makeClient(token) {
        const session = () => (token && store.sessions[token]) || null;
        const me = () => { const s = session(); return s ? store.app_users.find(u => u.id === s.user_id && !u.archived_at) : null; };
        const isOwner = () => { const u = me(); return !!u && u.role === 'owner'; };

        function canRead(table) {
            if (!me()) return false;
            if (table === 'treasury_transactions') return !!session().treasury_unlocked;
            return true;
        }

        function insertRow(table, row) {
            row = Object.assign({}, row);
            if (table === 'whatsapp_instances') row.id = ++store.seq;
            else row.id = row.id || uid();
            if (table === 'deals') { row.created_at = new Date().toISOString(); row.item_images = row.item_images || []; }
            if (table === 'employee_financials' || table === 'treasury_transactions') row.transaction_date = new Date().toISOString();
            if (table === 'whatsapp_instances') row.created_at = new Date().toISOString();

            if (table === 'treasury_transactions') {
                if (!session().treasury_unlocked) return 'الخزنة مقفولة';
                if (!(Number(row.amount) > 0)) return 'المبلغ لازم يكون أكبر من صفر';
                if (row.transaction_type === 'out' && balance() < Number(row.amount)) return 'رصيد الخزنة غير كافي لإتمام العملية';
                row.related_deal_id = null; row.related_emp_financial_id = null;
            }
            if (table === 'employee_financials') {
                const amt = Number(row.amount);
                if (!(amt > 0)) return 'المبلغ لازم يكون أكبر من صفر';
                if (balance() < amt) return 'رصيد الخزنة غير كافي لإتمام العملية';
                const emp = store.employees.find(e => e.id === row.employee_id);
                store.treasury_transactions.push({
                    id: uid(), transaction_type: 'out', amount: amt, transaction_date: row.transaction_date,
                    description: (row.transaction_type === 'loan' ? 'سحب سلفة: ' : 'صرف بونص (مكافأة): ') + (emp ? emp.full_name : '') + (row.notes ? ' - البيان: ' + row.notes : ''),
                    related_deal_id: null, related_emp_financial_id: row.id
                });
            }
            store[table].push(row);
            return null;
        }

        function query(table) {
            const q = { op: 'select', filters: [], orderBy: null, payload: null, returning: false };
            const run = () => {
                if (!me()) return err('not authenticated');
                const match = r => q.filters.every(([c, v]) => String(r[c]) === String(v));
                if (q.op === 'select') {
                    if (!canRead(table)) return ok([]);
                    let rows = store[table].map(r => table === 'app_users' ? strip(r) : Object.assign({}, r));
                    rows = rows.filter(match);
                    if (q.orderBy) {
                        const [c, asc] = q.orderBy;
                        rows.sort((a, b) => (a[c] > b[c] ? 1 : a[c] < b[c] ? -1 : 0) * (asc ? 1 : -1));
                    }
                    return ok(rows);
                }
                if (q.op === 'insert') {
                    for (const row of q.payload) { const e = insertRow(table, row); if (e) return err(e); }
                    save(store); return ok(null);
                }
                if (q.op === 'update') {
                    if (table === 'employees' && !isOwner()) return err('owner only');
                    store[table].filter(match).forEach(r => Object.assign(r, q.payload));
                    save(store); return ok(null);
                }
                if (q.op === 'delete') {
                    let targets = store[table].filter(match);
                    if (table === 'deals' && !isOwner()) targets = targets.filter(d => !Number(d.amount_paid));
                    const ids = new Set(targets.map(r => r.id));
                    store[table] = store[table].filter(r => !ids.has(r.id));
                    if (table === 'employee_financials') store.treasury_transactions = store.treasury_transactions.filter(t => !ids.has(t.related_emp_financial_id));
                    save(store);
                    return ok(q.returning ? targets.map(r => ({ id: r.id })) : null);
                }
            };
            const api = {
                select() { if (q.op !== 'select') q.returning = true; return api; },
                insert(rows) { q.op = 'insert'; q.payload = rows; return api; },
                update(obj) { q.op = 'update'; q.payload = obj; return api; },
                delete() { q.op = 'delete'; return api; },
                eq(c, v) { q.filters.push([c, v]); return api; },
                order(c, o) { q.orderBy = [c, !o || o.ascending !== false]; return api; },
                then(res, rej) { return new Promise(r => setTimeout(() => r(run()), 120)).then(res, rej); }
            };
            return api;
        }

        const rpcs = {
            app_login({ p_identifier, p_password }) {
                const id = String(p_identifier || '').trim().toLowerCase();
                const u = store.app_users.find(x => !x.archived_at && (x.email.toLowerCase() === id || x.full_name.toLowerCase() === id) && x.password === p_password);
                if (!u) return ok(null);
                const t = uid().replace(/-/g, '') + uid().replace(/-/g, '');
                store.sessions[t] = { user_id: u.id, treasury_unlocked: false };
                save(store);
                return ok({ token: t, user: strip(u) });
            },
            app_me() { return ok(strip(me())); },
            app_logout() { delete store.sessions[token]; save(store); return ok(null); },
            app_lock_treasury() { if (session()) { session().treasury_unlocked = false; save(store); } return ok(null); },
            app_verify_lock({ p_kind, p_password }) {
                if (!me()) return ok(false);
                const good = store.locks[p_kind] === p_password || store.app_users.some(u => u.role === 'owner' && u.password === p_password);
                if (good && p_kind === 'treasury') { session().treasury_unlocked = true; save(store); }
                return ok(good);
            },
            app_set_lock_password({ p_kind, p_password }) {
                if (!isOwner()) return err('owner only');
                if (!p_password) return err('empty password');
                store.locks[p_kind] = p_password; save(store); return ok(null);
            },
            app_update_profile({ p_full_name, p_email, p_phone, p_new_password }) {
                const u = me(); if (!u) return err('not authenticated');
                Object.assign(u, { full_name: p_full_name, email: p_email, phone: p_phone });
                if (p_new_password) u.password = p_new_password;
                store.employees.filter(e => e.user_id === u.id).forEach(e => Object.assign(e, { full_name: p_full_name, phone_whatsapp: p_phone }));
                save(store); return ok(strip(u));
            },
            app_create_user({ p_full_name, p_email, p_phone, p_password, p_role, p_base_salary }) {
                if (!isOwner()) return err('owner only');
                const name = String(p_full_name).trim();
                if (store.app_users.some(u => !u.archived_at && u.full_name.trim().toLowerCase() === name.toLowerCase())) return err('name taken');
                const id = uid();
                store.app_users.push({ id, full_name: name, email: p_email, phone: p_phone, role: p_role, password: p_password, created_at: new Date().toISOString(), archived_at: null });
                store.employees.push({ id: uid(), user_id: id, full_name: name, phone_whatsapp: p_phone, base_salary: Number(p_base_salary) || 0, created_at: new Date().toISOString(), archived_at: null });
                save(store); return ok(id);
            },
            app_archive_employee({ p_emp_id }) {
                if (!isOwner()) return err('owner only');
                const emp = store.employees.find(e => e.id === p_emp_id); if (!emp) return ok(null);
                if (emp.user_id === me().id) return err('cannot delete yourself');
                const u = store.app_users.find(x => x.id === emp.user_id);
                if (u && u.role === 'owner') return err('cannot delete an owner account');
                const now = new Date().toISOString();
                emp.archived_at = now; if (u) u.archived_at = now;
                Object.keys(store.sessions).forEach(k => { if (u && store.sessions[k].user_id === u.id) delete store.sessions[k]; });
                save(store); return ok(null);
            },
            app_restore_employee({ p_emp_id }) {
                if (!isOwner()) return err('owner only');
                const emp = store.employees.find(e => e.id === p_emp_id); if (!emp) return ok(null);
                const u = store.app_users.find(x => x.id === emp.user_id);
                if (u && store.app_users.some(a => a.id !== u.id && !a.archived_at && a.full_name.trim().toLowerCase() === u.full_name.trim().toLowerCase())) return err('name taken');
                emp.archived_at = null; if (u) u.archived_at = null;
                save(store); return ok(null);
            },
            app_delete_user({ p_user_id }) {
                if (!isOwner()) return err('owner only');
                if (p_user_id === me().id) return err('cannot delete yourself');
                store.employees = store.employees.filter(e => e.user_id !== p_user_id);
                store.app_users = store.app_users.filter(u => !(u.id === p_user_id && u.role !== 'owner'));
                save(store); return ok(null);
            }
        };

        return {
            from: query,
            rpc(name, args) {
                const fn = rpcs[name];
                return new Promise(r => setTimeout(() => r(fn ? fn(args || {}) : err('unknown function ' + name)), 150));
            }
        };
    }

    window.demoDb = {
        client: makeClient,
        reset() { store = seed(); save(store); try { sessionStorage.clear(); } catch (e) {} location.reload(); }
    };

    // ---------- نوافذ بديلة لـ alert / confirm (الصفحة بتشتغل في إطار بيمنعهم) ----------
    function ensureDialogCss() {
        if (document.getElementById('demoDialogCss')) return;
        const st = document.createElement('style');
        st.id = 'demoDialogCss';
        st.textContent = `.demo-alert{position:fixed;left:50%;top:18px;transform:translateX(-50%);z-index:9999;max-width:min(92vw,460px);background:#0f172a;color:#fde68a;border:1px solid rgba(245,158,11,.5);padding:12px 16px;border-radius:14px;font:600 13px Cairo,sans-serif;white-space:pre-line;box-shadow:0 10px 30px rgba(0,0,0,.35);direction:rtl}
        #demoBanner{position:fixed;bottom:12px;left:12px;z-index:9998;direction:rtl;font:600 12px Cairo,sans-serif;background:#0f172a;color:#e2e8f0;border:1px solid rgba(245,158,11,.5);border-radius:14px;padding:10px 12px;box-shadow:0 10px 30px rgba(0,0,0,.3);max-width:300px}
        #demoBanner b{color:#fbbf24}#demoBanner button{margin-top:6px;margin-left:6px;background:#f59e0b;color:#0f172a;border:0;border-radius:9px;padding:5px 10px;font:700 12px Cairo,sans-serif;cursor:pointer}
        #demoBanner button.alt{background:#334155;color:#e2e8f0}#demoBanner .x{position:absolute;top:4px;left:8px;cursor:pointer;color:#94a3b8}`;
        document.head.appendChild(st);
    }
    window.alert = function (msg) {
        ensureDialogCss();
        const d = document.createElement('div');
        d.className = 'demo-alert'; d.textContent = String(msg);
        document.body.appendChild(d);
        setTimeout(() => d.remove(), 4200);
    };
    window.confirm = function () { return true; };
    window.prompt = function () { return null; };

    // ---------- شريط النسخة التجريبية + دخول سريع ----------
    function quickLogin(name) {
        const i = document.getElementById('loginIdentifier'), p = document.getElementById('loginPassword');
        if (!i || !p) return;
        i.value = name; p.value = DEMO_PASS;
        const f = document.getElementById('signinForm');
        if (f) f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event('submit', { cancelable: true }));
    }
    window.addEventListener('DOMContentLoaded', () => {
        ensureDialogCss();
        const b = document.createElement('div');
        b.id = 'demoBanner';
        b.innerHTML = `<span class="x" title="إخفاء">✕</span><b>نسخة تجريبية</b> — كل البيانات وهمية.<br>
            دخول المالك: <b>Owner</b> / <b>${DEMO_PASS}</b><br>دخول موظف: <b>Ahmed</b> / <b>${DEMO_PASS}</b><br>باسورد الخزنة والواتساب: <b>${LOCK_PASS}</b><br>
            <button data-a="owner">دخول كمالك</button><button data-a="emp" class="alt">دخول كموظف</button><button data-a="reset" class="alt">إعادة البيانات</button>`;
        b.addEventListener('click', (e) => {
            const a = e.target.getAttribute('data-a');
            if (e.target.classList.contains('x')) b.style.display = 'none';
            if (a === 'reset') window.demoDb.reset();
            if (a === 'owner' || a === 'emp') {
                const go = () => quickLogin(a === 'owner' ? 'Owner' : 'Ahmed');
                if (typeof currentUser !== 'undefined' && currentUser && typeof logout === 'function') {
                    Promise.resolve(logout()).then(() => setTimeout(go, 300));
                } else go();
            }
        });
        document.body.appendChild(b);
    });
})();
