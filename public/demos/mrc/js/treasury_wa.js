// =========================================================================
// إدارة الخزنة وأرقام واتساب الشركة (Treasury & WhatsApp Senders Module)
// =========================================================================

// 1. حماية وإدارة أرقام واتساب الشركة
function requestWhatsappAccess() {
    if (isWhatsappUnlocked) {
        switchPage('whatsapp');
    } else {
        document.getElementById('waPassInput').value = '';
        openModal('waPasswordModal');
        setTimeout(() => document.getElementById('waPassInput').focus(), 100);
    }
}

async function verifyWhatsappPassword(e) {
    e.preventDefault();
    const entered = document.getElementById('waPassInput').value.trim();
    const { data: isValid, error } = await db.rpc('app_verify_lock', { p_kind: 'whatsapp', p_password: entered });
    if (error) return alert("❌ خطأ: " + error.message);

    if (isValid) {
        isWhatsappUnlocked = true;
        closeModal('waPasswordModal');
        switchPage('whatsapp');
        renderWhatsappInstances();
        showToast("🔓 تم فتح صفحة أرقام الواتساب بنجاح", "success");
    } else {
        alert("❌ باسورد أرقام الواتساب غير صحيح!");
    }
}

function lockWhatsappPage() {
    isWhatsappUnlocked = false;
    selectedWaInstanceId = null;
    switchPage('deals');
    showToast("🔒 تم قفل صفحة أرقام الواتساب", "info");
}

async function saveNewWhatsappPassword(e) {
    e.preventDefault();
    const newPass = document.getElementById('newWaPass').value.trim();
    const { error } = await db.rpc('app_set_lock_password', { p_kind: 'whatsapp', p_password: newPass });
    if (error) return alert("❌ خطأ: " + error.message);

    closeModal('changeWaPassModal');
    showToast("🔑 تم تغيير باسورد أرقام الواتساب بنجاح!", "success");
    await loadAllData();
}

async function saveWhatsappInstance(e) {
    e.preventDefault();
    const instance_name = document.getElementById('waInstanceName').value.trim();
    const phone_number = document.getElementById('waPhoneNumber').value.trim();
    const status = document.getElementById('waStatus').value;

    const { error } = await db.from('whatsapp_instances').insert([{
        instance_name,
        phone_number,
        status
    }]);

    if (error) {
        return alert("❌ خطأ في حفظ رقم الشركة: " + error.message);
    }

    showToast(`📱 تم إضافة خط واتساب الشركة (${esc(instance_name)} - ${esc(phone_number)}) وظهوره في قائمة الديل!`, 'success');
    e.target.reset();
    closeModal('addWhatsappModal');
    await loadAllData();
}

async function toggleWaInstanceStatus(id, currentStatus) {
    const newStatus = currentStatus === 'connected' ? 'disconnected' : 'connected';
    await db.from('whatsapp_instances').update({ status: newStatus }).eq('id', id);
    await loadAllData();
}

function toggleWaCardDeals(waId, event) {
    if (event) event.stopPropagation();
    if (Number(selectedWaInstanceId) === Number(waId)) {
        closeWaDealsHistory();
    } else {
        selectedWaInstanceId = waId;
        renderWhatsappInstances();
    }
}

function closeWaDealsHistory() {
    selectedWaInstanceId = null;
    const box = document.getElementById('selectedWaDealsBox');
    if (box) box.classList.add('hidden');
    renderWhatsappInstances();
}

function renderWhatsappInstances() {
    const connectedNumbers = state.waInstances.filter(w => w.status === 'connected');
    let waSelectHtml = `<option value="">توزيع تلقائي بين خطوط الشركة (${connectedNumbers.length} متصل)</option>`;
    waSelectHtml += state.waInstances.map(w => `
        <option value="${w.id}">${esc(w.instance_name)} — ${esc(w.phone_number)} ${w.status === 'connected' ? '· متصل' : '· فاصل'}</option>
    `).join('');
    const dealWaSelect = document.getElementById('dealWhatsappInstance');
    if (dealWaSelect) dealWaSelect.innerHTML = waSelectHtml;

    const grid = document.getElementById('waInstancesGrid');
    if (!grid) return;

    if (state.waInstances.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full card empty-state">
                <div class="empty-icon">${icon('chat')}</div>
                <div class="empty-title">لا توجد خطوط واتساب للشركة</div>
                <div class="empty-text">دوس على (إضافة خط) عشان يظهر هنا وفي نافذة الديل.</div>
            </div>`;
        return;
    }

    grid.innerHTML = state.waInstances.map((w, idx) => {
        const isConn = w.status === 'connected';
        const linkedDeals = state.deals.filter(d => Number(d.whatsapp_instance_id) === Number(w.id));
        const isSelected = Number(selectedWaInstanceId) === Number(w.id);

        return `
        <div onclick="toggleWaCardDeals(${w.id}, event)"
             class="wa-card-item entity-card ${isSelected ? 'is-selected' : ''} ${isConn ? '' : 'is-off'}">
            <div class="entity-head">
                <div class="avatar ${isConn ? '!bg-emerald-50 !text-emerald-700' : '!bg-rose-50 !text-rose-600'}">${icon('chat', 'w-4 h-4')}</div>
                <div class="flex-1 min-w-0">
                    <div class="entity-name truncate">${esc(w.instance_name)}</div>
                    <div class="entity-meta cell-mono text-right">${esc(w.phone_number)}</div>
                </div>
                <span class="badge ${isConn ? 'badge-success' : 'badge-danger'}">${isConn ? 'متصل' : 'فاصل'}</span>
            </div>
            <div class="entity-body">
                <div class="kv"><span>رقم الخط</span><b>#${idx + 1}</b></div>
                <div class="kv"><span>الديلز المربوطة</span><b>${linkedDeals.length} ديل</b></div>
                <div class="kv"><span>قيد التواصل منها</span><b>${linkedDeals.filter(d => d.status === 'in_progress').length}</b></div>
            </div>
            <div class="entity-foot" onclick="event.stopPropagation()">
                <button onclick="toggleWaCardDeals(${w.id}, event)" class="toggle-hint">${icon('inbox', 'w-3 h-3')} ${isSelected ? 'الصفقات مفتوحة' : 'عرض الصفقات (' + linkedDeals.length + ')'}</button>
                <div class="flex gap-1">
                    <button onclick="toggleWaInstanceStatus(${w.id}, '${w.status}')" class="btn btn-sm ${isConn ? 'btn-ghost' : 'btn-success'}">
                        ${isConn ? 'تعطيل مؤقت' : 'تفعيل كمتصل'}
                    </button>
                    <button onclick="deleteRow('whatsapp_instances', ${w.id})" class="btn btn-danger-soft btn-sm">${icon('trash')} حذف</button>
                </div>
            </div>
        </div>`;
    }).join('');

    const dealsBox = document.getElementById('selectedWaDealsBox');
    const dealsTbody = document.getElementById('waLinkedDealsTableBody');
    if (selectedWaInstanceId && dealsBox && dealsTbody) {
        const selectedWa = state.waInstances.find(w => Number(w.id) === Number(selectedWaInstanceId));
        if (selectedWa) {
            dealsBox.classList.remove('hidden');
            document.getElementById('selectedWaDealsTitle').textContent = `الصفقات المربوطة بخط ${selectedWa.instance_name} (${selectedWa.phone_number})`;
            const linkedDeals = state.deals.filter(d => Number(d.whatsapp_instance_id) === Number(selectedWaInstanceId));

            if (linkedDeals.length === 0) {
                dealsTbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">${icon('inbox')}</div><div class="empty-title">لا توجد صفقات مربوطة بالخط ده</div><div class="empty-text">اختار الخط من نافذة الديل عشان يتربط هنا.</div></div></td></tr>`;
            } else {
                dealsTbody.innerHTML = linkedDeals.map(d => {
                    const emp = state.employees.find(e => e.id === d.employee_id);
                    const linkedUser = emp ? state.users.find(u => u.id === emp.user_id) : null;

                    const personName = d.assigned_by_name || (emp ? emp.full_name : 'غير محدد');
                    const personRole = d.assigned_by_role || (linkedUser ? linkedUser.role : 'employee');

                    const roleBadge = personRole === 'owner'
                        ? `<span class="badge badge-gold no-dot">${icon('crown', 'w-3 h-3')} ${esc(personName)}</span>`
                        : `<span class="badge badge-primary no-dot">${icon('briefcase', 'w-3 h-3')} ${esc(personName)}</span>`;

                    let statusBadge = `<span class="badge badge-warning">قيد التواصل</span>`;
                    if (d.status === 'completed') statusBadge = `<span class="badge badge-success">تم الشراء</span>`;
                    else if (d.status === 'cancelled') statusBadge = `<span class="badge badge-danger">لم يتم الاتفاق</span>`;

                    return `
                    <tr>
                        <td>
                            <div class="cell-primary">${esc(d.client_name) || '—'}</div>
                            <div class="cell-sub cell-mono text-right">${esc(d.client_phone)}</div>
                        </td>
                        <td class="min-w-[200px]">
                            <div class="cell-primary text-xs">${esc(d.watch_brand) || '—'}</div>
                            <div class="cell-sub clamp-2">${esc(d.deal_details)}</div>
                        </td>
                        <td>
                            ${roleBadge}
                            ${emp && esc(d.assigned_by_name) && esc(emp.full_name) !== esc(d.assigned_by_name) ? `<div class="cell-sub mt-1">مسؤول الديل: ${esc(emp.full_name)}</div>` : ''}
                        </td>
                        <td class="text-xs text-slate-700 whitespace-nowrap">
                            ${d.meeting_time ? new Date(d.meeting_time).toLocaleString('ar-EG') : 'غير محدد'}
                        </td>
                        <td>${statusBadge}</td>
                        <td>
                            <button onclick="openEditDeal('${d.id}')" class="btn btn-secondary btn-sm">${icon('edit')} فتح الديل</button>
                        </td>
                    </tr>`;
                }).join('');
            }
        }
    } else if (dealsBox) {
        dealsBox.classList.add('hidden');
    }
}

// =========================================================================
// 2. إدارة وحماية الخزنة والتقفيل اليومي والشهري
// =========================================================================
function requestTreasuryAccess() {
    if (isTreasuryUnlocked) {
        switchPage('treasury');
    } else {
        document.getElementById('treasuryPassInput').value = '';
        openModal('treasuryPasswordModal');
        setTimeout(() => document.getElementById('treasuryPassInput').focus(), 100);
    }
}

async function verifyTreasuryPassword(e) {
    e.preventDefault();
    const entered = document.getElementById('treasuryPassInput').value.trim();
    const { data: isValid, error } = await db.rpc('app_verify_lock', { p_kind: 'treasury', p_password: entered });
    if (error) return alert("❌ خطأ: " + error.message);

    if (isValid) {
        isTreasuryUnlocked = true;
        await loadAllData();
        closeModal('treasuryPasswordModal');
        switchPage('treasury');
        renderTreasury();
        showToast("🔓 تم فتح الخزنة بنجاح", "success");
    } else {
        alert("❌ باسورد الخزنة غير صحيح!");
    }
}

async function lockTreasury() {
    isTreasuryUnlocked = false;
    state.treasury = [];
    await db.rpc('app_lock_treasury');
    switchPage('deals');
    showToast("🔒 تم قفل الخزنة", "info");
}

async function saveNewTreasuryPassword(e) {
    e.preventDefault();
    const newPass = document.getElementById('newTreasuryPass').value.trim();
    const { error } = await db.rpc('app_set_lock_password', { p_kind: 'treasury', p_password: newPass });
    if (error) return alert("❌ خطأ: " + error.message);

    closeModal('changeTreasuryPassModal');
    showToast("🔑 تم تغيير باسورد الخزنة بنجاح!", "success");
    await loadAllData();
}

async function saveTreasuryTransaction(e) {
    e.preventDefault();
    const type = document.getElementById('trType').value;
    const amount = Number(document.getElementById('trAmount').value);
    const desc = document.getElementById('trDesc').value.trim();

    if (type === 'out') {
        const currentBalance = getCurrentTreasuryBalance();
        if (currentBalance < amount) {
            return alert(`⚠️ لا يمكن صرف هذا المبلغ لأن رصيد الخزنة غير كافي!\n\nالمبلغ المراد صرفه: ${amount.toLocaleString()} ج.م\nالرصيد المتاح في الخزنة: ${currentBalance.toLocaleString()} ج.م`);
        }
    }

    const { error } = await db.from('treasury_transactions').insert([{
        transaction_type: type,
        amount: amount,
        description: desc
    }]);
    if (error) return alert("❌ خطأ: " + error.message);
    e.target.reset();
    closeModal('treasuryModal');
    showToast("تم تسجيل الحركة في الخزنة بنجاح!", "success");
    await loadAllData();
}

function renderTreasury() {
    const filter = document.getElementById('treasuryFilter').value;
    let dIn = 0, dOut = 0, mIn = 0, mOut = 0;

    state.treasury.forEach(t => {
        const amt = Number(t.amount || 0);
        const tDate = t.transaction_date || t.created_at;
        const isToday = isSameLocalDay(tDate);
        const isMonth = isSameLocalMonth(tDate);

        if (t.transaction_type === 'in') {
            if (isMonth) mIn += amt;
            if (isToday) dIn += amt;
        } else {
            if (isMonth) mOut += amt;
            if (isToday) dOut += amt;
        }
    });

    document.getElementById('dailyIn').textContent = dIn.toLocaleString() + ' ج.م';
    document.getElementById('dailyOut').textContent = dOut.toLocaleString() + ' ج.م';
    document.getElementById('dailyNet').textContent = (dIn - dOut).toLocaleString() + ' ج.م';

    document.getElementById('monthlyIn').textContent = mIn.toLocaleString() + ' ج.م';
    document.getElementById('monthlyOut').textContent = mOut.toLocaleString() + ' ج.م';
    document.getElementById('monthlyNet').textContent = getCurrentTreasuryBalance().toLocaleString() + ' ج.م';

    const list = state.treasury.filter(t => {
        const tDate = t.transaction_date || t.created_at;
        if (filter === 'today') return isSameLocalDay(tDate);
        if (filter === 'month') return isSameLocalMonth(tDate);
        if (filter === 'in') return t.transaction_type === 'in';
        if (filter === 'out') return t.transaction_type === 'out';
        return true;
    });

    if (list.length === 0) {
        document.getElementById('treasuryTableBody').innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">${icon('vault')}</div><div class="empty-title">لا توجد حركات في التصنيف ده</div><div class="empty-text">غيّر الفلتر أو سجّل حركة خزنة جديدة.</div></div></td></tr>`;
        return;
    }

    document.getElementById('treasuryTableBody').innerHTML = list.map(t => `
        <tr>
            <td>${t.transaction_type === 'in'
                ? `<span class="badge badge-success no-dot">${icon('trendUp', 'w-3.5 h-3.5')} إيداع</span>`
                : `<span class="badge badge-danger no-dot">${icon('trendDown', 'w-3.5 h-3.5')} صرف</span>`}</td>
            <td class="${t.transaction_type === 'in' ? 'amount-in' : 'amount-out'} whitespace-nowrap">${t.transaction_type === 'in' ? '+' : '−'}${Number(t.amount).toLocaleString()} ج.م</td>
            <td class="text-slate-700">${esc(t.description)}</td>
            <td class="text-xs text-slate-500 whitespace-nowrap">${new Date(t.transaction_date || t.created_at).toLocaleString('ar-EG')}</td>
            <td class="${currentUser.role === 'owner' ? '' : 'hidden'}">
                <button onclick="deleteRow('treasury_transactions', '${t.id}')" class="btn btn-danger-soft btn-sm">${icon('trash')} حذف</button>
            </td>
        </tr>
    `).join('');
}