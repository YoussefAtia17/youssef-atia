window.addEventListener('DOMContentLoaded', () => {
    // إخفاء شاشة الـ Opening الملكية بنعومة بعد 2.3 ثانية
    const splash = document.getElementById('royalSplashScreen');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('splash-fade-out');
            setTimeout(() => splash.remove(), 700);
        }, 2300);
    }

    restoreSession();
});

// التأكد من الجلسة المحفوظة عند السيرفر قبل فتح التطبيق
async function restoreSession() {
    // مسح أي بيانات دخول قديمة من النسخة اللي كانت بتحفظ الباسورد في المتصفح
    sessionStorage.removeItem('mrc_user');
    localStorage.removeItem('mrc_user');
    if (typeof db === 'undefined' || !db || !sessionToken) return;
    try {
        const { data: me, error } = await db.rpc('app_me');
        if (error || !me) return clearSession();
        await db.rpc('app_lock_treasury');
        currentUser = me;
        launchApp();
    } catch (err) {
        console.error("Init error:", err);
        clearSession();
    }
}

function setSession(token) {
    sessionToken = token;
    if (token) sessionStorage.setItem('mrc_token', token);
    else sessionStorage.removeItem('mrc_token');
    localStorage.removeItem('mrc_token');
    db = createDbClient(token);
}

function clearSession() {
    setSession(null);
    currentUser = null;
}
async function handleSignIn(e) {
    if (e) e.preventDefault();

    if (typeof db === 'undefined' || !db) {
        alert("❌ لم يتم تحميل ملف الإعدادات (js/config.js)! تأكد من رفع فولدر js على GitHub.");
        return false;
    }

    const identifier = document.getElementById('loginIdentifier').value.trim();
    const pass = document.getElementById('loginPassword').value.trim();
    const submitBtn = document.getElementById('btnSignInSubmit');

    if (SYSTEM_LOCK_EMAILS.includes(identifier.toLowerCase())) {
        alert("❌ هذا سجل نظام داخلي لحفظ كلمات المرور فقط.");
        return false;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "جاري تسجيل الدخول…";
    }

    try {
        const { data: session, error } = await db.rpc('app_login', { p_identifier: identifier, p_password: pass });

        if (error) {
            alert("❌ خطأ في الاتصال بقاعدة البيانات: " + error.message);
            return false;
        }

        if (!session) {
            alert("❌ اسم المستخدم/الإيميل أو كلمة المرور غير صحيحة!");
            return false;
        }

        setSession(session.token);
        currentUser = session.user;
        isTreasuryUnlocked = false;
        isWhatsappUnlocked = false;
        await launchApp();
    } catch (err) {
        alert("❌ حدث خطأ أثناء الدخول: " + err.message);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "دخول للنظام";
        }
    }
    return false;
}

async function logout() {
    if (db && sessionToken) await db.rpc('app_logout');
    clearSession();
    isTreasuryUnlocked = false;
    isWhatsappUnlocked = false;
    selectedEmployeeHistoryId = null;
    selectedWaInstanceId = null;
    document.getElementById('appScreen').classList.add('hidden');
    document.getElementById('authScreen').classList.remove('hidden');
}

async function launchApp() {
    document.getElementById('authScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.remove('hidden');

    document.getElementById('currentUserName').textContent = currentUser.full_name;
    const roleNames = { owner: 'أونر · صلاحية كاملة', employee: 'موظف' };
    document.getElementById('currentUserRoleBadge').textContent = roleNames[currentUser.role] || 'موظف';

    document.querySelectorAll('.owner-only').forEach(el => el.classList.toggle('hidden', currentUser.role !== 'owner'));

    switchPage('deals');
    await loadAllData();
}

async function loadAllData() {
    if (!db || !currentUser) return;
    try {
        const [empRes, dealRes, finRes, trRes, usrRes, waRes] = await Promise.all([
            db.from('employees').select('*').order('created_at', { ascending: false }),
            db.from('deals').select('*').order('created_at', { ascending: false }),
            db.from('employee_financials').select('*').order('transaction_date', { ascending: false }),
            db.from('treasury_transactions').select('*').order('transaction_date', { ascending: false }),
            db.from('app_users').select(APP_USER_COLUMNS).order('created_at', { ascending: false }),
            db.from('whatsapp_instances').select('*').order('id', { ascending: true })
        ]);

        state.employees = empRes.data || [];
        state.deals = dealRes.data || [];
        state.empFinancials = finRes.data || [];
        state.treasury = trRes.data || [];
        state.users = usrRes.data || [];
        state.waInstances = waRes.data || [];

        renderAll();
    } catch (err) {
        console.error("Error loading data:", err);
    }
}

function renderAll() {
    if (!currentUser) return;
    if (typeof renderWhatsappInstances === 'function') renderWhatsappInstances();
    if (typeof renderDeals === 'function') {
        const searchInput = document.getElementById('dealSearchInput');
        renderDeals(searchInput ? searchInput.value : '');
    }
    if (typeof renderEmployees === 'function') renderEmployees();
    if (typeof renderTreasury === 'function') renderTreasury();
    if (typeof renderUsers === 'function') renderUsers();
}

function openProfileModal() {
    document.getElementById('profName').value = currentUser.full_name || '';
    document.getElementById('profEmail').value = (currentUser.email && !currentUser.email.endsWith('@mrc.local')) ? currentUser.email : '';
    document.getElementById('profPhone').value = currentUser.phone || '';
    document.getElementById('profPassword').value = '';
    openModal('profileModal');
}

async function saveProfileSettings(e) {
    e.preventDefault();
    const full_name = document.getElementById('profName').value.trim();
    const rawEmail = document.getElementById('profEmail').value.trim();
    const email = rawEmail || currentUser.email || `${full_name.replace(/\s+/g, '_')}_${Date.now()}@mrc.local`;
    const phone = document.getElementById('profPhone').value.trim();
    const newPassword = document.getElementById('profPassword').value.trim();

    if (!phone) return alert("⚠️ رقم التليفون / الواتساب مطلوب!");

    const { data: updatedUser, error } = await db.rpc('app_update_profile', {
        p_full_name: full_name, p_email: email, p_phone: phone, p_new_password: newPassword || null
    });

    if (error) return alert("❌ خطأ أثناء حفظ الإعدادات: " + error.message);

    currentUser = updatedUser;
    document.getElementById('currentUserName').textContent = updatedUser.full_name;
    closeModal('profileModal');
    showToast("✅ تم حفظ بياناتك وكلمة المرور الجديدة في قاعدة البيانات!", "success");
    await loadAllData();
}

function renderUsers() {
    const visibleUsers = state.users.filter(u => !SYSTEM_LOCK_EMAILS.includes(u.email) && !u.archived_at);
    document.getElementById('usersTableBody').innerHTML = visibleUsers.map(u => `
        <tr>
            <td>
                <div class="flex items-center gap-2.5">
                    <div class="avatar ${u.role === 'owner' ? 'gold' : ''}">${initialOf(u.full_name)}</div>
                    <span class="cell-primary">${esc(u.full_name)}</span>
                </div>
            </td>
            <td>${esc(u.email) && !esc(u.email).endsWith('@mrc.local') ? esc(u.email) : '<span class="text-xs text-slate-400">يدخل بالاسم فقط</span>'}</td>
            <td class="cell-mono text-right">${esc(u.phone) || '—'}</td>
            <td>${u.role === 'owner' ? `<span class="badge badge-gold no-dot">${icon('crown', 'w-3 h-3')} أونر</span>` : `<span class="badge badge-primary no-dot">${icon('briefcase', 'w-3 h-3')} موظف</span>`}</td>
            <td class="text-xs text-slate-500 whitespace-nowrap">${new Date(u.created_at).toLocaleString('ar-EG')}</td>
            <td>${u.role !== 'owner' ? `<button onclick="deleteEmployeeAndUser('', '${u.id}')" class="btn btn-danger-soft btn-sm">${icon('trash')} حذف الحساب</button>` : '<span class="text-slate-300">—</span>'}</td>
        </tr>
    `).join('');
}