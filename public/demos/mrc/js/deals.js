// =========================================================================
// إدارة الصفقات، الساعات السويسرية (مع الحفظ التلقائي للأنواع اليدوية)، والبحث الذكي
// =========================================================================

let searchTimer;
function handleSearchDeals(q) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => renderDeals(q.trim()), 100);
}

// دالة توحيد الحروف العربية والإنجليزية لضمان دقة البحث 100% للأنواع اليدوية والجاهزة
function normalizeSearchText(str) {
    if (!str) return '';
    return String(str)
        .toLowerCase()
        .trim()
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي');
}

// دمج الماركات السويسرية الأساسية مع أي ماركات يدوية تمت إضافتها سابقاً في الصفقات
function getAllAvailableWatchBrands() {
    const customBrandsFromDeals = state.deals
        .map(d => d.watch_brand ? d.watch_brand.trim() : '')
        .filter(b => b && !SWISS_BRANDS.includes(b));

    return [...new Set([...SWISS_BRANDS, ...customBrandsFromDeals])];
}

function toggleWatchDropdown() {
    const menu = document.getElementById('watchDropdownMenu');
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
        menu.classList.remove('hidden');
        document.getElementById('watchBrandSearchInput').value = '';
        filterWatchBrandsList('');
        setTimeout(() => document.getElementById('watchBrandSearchInput').focus(), 50);
    } else {
        menu.classList.add('hidden');
    }
}

function filterWatchBrandsList(query = '') {
    const qRaw = query.trim();
    const qNorm = normalizeSearchText(qRaw);
    const container = document.getElementById('watchBrandsListItems');
    const allBrands = getAllAvailableWatchBrands();

    const filtered = allBrands.filter(b => normalizeSearchText(b).includes(qNorm));

    // إذا كتب المستخدم نوعاً جديداً في خانة بحث القائمة، نضبطه تلقائياً كقيمة مختارة حتى لو لم يضغط على الزر
    if (qRaw) {
        document.getElementById('watchBrandSelect').value = 'custom';
        document.getElementById('watchBrandCustom').value = qRaw;
        document.getElementById('selectedWatchBrandLabel').textContent = `⌚ ${qRaw}`;
        updateWhatsAppPreview();
    }

    let html = `<div onclick="selectWatchBrandOption('')" class="px-3 py-2.5 hover:bg-slate-50 cursor-pointer text-slate-500">-- بدون تحديد ماركة --</div>`;
    html += filtered.map(b => {
        const safeBrand = b.replace(/'/g, "\\'");
        const isCustomSaved = !SWISS_BRANDS.includes(b);
        return `
        <div onclick="selectWatchBrandOption('${safeBrand}')" class="px-3 py-2.5 hover:bg-slate-50 cursor-pointer text-slate-800 flex justify-between items-center">
            <span>${b}</span>
            ${isCustomSaved ? '<span class="badge badge-gold no-dot !text-[10px] !py-0">مضاف يدوياً</span>' : ''}
        </div>`;
    }).join('');

    const safeQuery = qRaw.replace(/'/g, "\\'");
    html += `
        <div onclick="selectWatchBrandOption('custom', '${safeQuery}')" class="px-3 py-2.5 bg-amber-50 hover:bg-amber-100 cursor-pointer text-amber-800 font-semibold">
            + نوع آخر (إضافة يدوية)${qRaw ? `: "${qRaw}"` : '...'}
        </div>`;

    container.innerHTML = html;
}

function selectWatchBrandOption(val, prefillCustom = '') {
    document.getElementById('watchBrandSelect').value = val;
    document.getElementById('watchDropdownMenu').classList.add('hidden');
    const customInput = document.getElementById('watchBrandCustom');
    const label = document.getElementById('selectedWatchBrandLabel');

    if (val === 'custom') {
        customInput.classList.remove('hidden');
        if (prefillCustom) {
            customInput.value = prefillCustom;
            label.textContent = `⌚ ${prefillCustom} (يدوي)`;
        } else {
            label.textContent = '➕ نوع آخر (اكتبه في الخانة بالأسفل)';
        }
        setTimeout(() => customInput.focus(), 50);
    } else {
        label.textContent = val || '-- اختر أو اكتب ماركة الساعة --';
        customInput.classList.add('hidden');
        customInput.value = '';
    }
    updateWhatsAppPreview();
}

function getSelectedWatchBrand() {
    const sel = document.getElementById('watchBrandSelect').value;
    const customVal = document.getElementById('watchBrandCustom').value.trim();
    const searchInputVal = document.getElementById('watchBrandSearchInput')
        ? document.getElementById('watchBrandSearchInput').value.trim()
        : '';

    // الأولوية للخانة اليدوية إذا كانت مكتوبة، ثم الاختيار، ثم نص البحث داخل القائمة
    if (sel === 'custom' || customVal) {
        return customVal || searchInputVal;
    }
    return sel || searchInputVal;
}

// طول ما الرسالة متولدة تلقائياً بتتحدث لوحدها مع تغيير الميعاد/اسم العميل/الساعة،
// ولو اتعدلت بالإيد بتفضل زي ما هي لحد ما يدوس (توليد نص تلقائي)
let reminderIsAuto = true;

function formatMeetingParts(mt) {
    if (!mt) return null;
    const d = new Date(mt);
    if (isNaN(d)) return null;
    return {
        day: d.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        time: d.toLocaleTimeString('ar-EG', { hour: 'numeric', minute: '2-digit' })
    };
}

function buildReminderMessage() {
    const client = document.getElementById('clientName').value.trim() || 'عميلنا العزيز';
    const brand = getSelectedWatchBrand();
    const when = formatMeetingParts(document.getElementById('meetingTime').value);
    const lines = [
        `أهلاً بحضرتك أستاذ ${client} 👋`,
        '',
        'بنأكد مع حضرتك ميعادنا في *ساعات النخبة - DEMO* ⌚',
        '',
        `🗓️ *اليوم:* ${when ? when.day : 'هيتحدد قريب'}`,
        `⏰ *الساعة:* ${when ? when.time : 'هتتحدد قريب'}`
    ];
    if (brand) lines.push(`⌚ *بخصوص:* ${brand}`);
    lines.push('', 'لو حابب تغيّر الميعاد ابعتلنا هنا في أي وقت 🙏', 'في انتظار حضرتك، وشكراً لثقتك فينا ✨');
    return lines.join('\n');
}

// ===== رسالة المتابعة: بتتبعت كل كام يوم للعميل طول ما الديل لسه قيد التواصل =====
let followupIsAuto = true;

function buildFollowupMessage() {
    const client = document.getElementById('clientName').value.trim() || 'عميلنا العزيز';
    const brand = getSelectedWatchBrand();
    const lines = [
        `أهلاً بحضرتك أستاذ ${client} 👋`,
        '',
        'معاك *ساعات النخبة - DEMO* ⌚',
        brand ? `حبينا نطمن على حضرتك ونتابع معاك بخصوص *${brand}*` : 'حبينا نطمن على حضرتك ونتابع معاك بخصوص طلبك',
        '',
        'لو لسه مهتم أو عندك أي استفسار، إحنا تحت أمرك في أي وقت 🙏',
        'وشكراً لثقتك فينا ✨'
    ];
    return lines.join('\n');
}

function getFollowupIntervalDays() {
    const days = Math.round(Number(document.getElementById('followupIntervalDays').value));
    return days >= 1 ? Math.min(days, 365) : 15;
}

function fillDefaultFollowupText() {
    followupIsAuto = true;
    updateFollowupPreview();
}

function onFollowupTyped() {
    followupIsAuto = false;
    updateFollowupPreview();
}

function updateFollowupPreview() {
    const box = document.getElementById('followupMessage');
    if (followupIsAuto) box.value = buildFollowupMessage();
    const msg = box.value.trim() || buildFollowupMessage();
    document.getElementById('followupPreviewText').innerHTML = esc(msg).replace(/\*([^*\n]+)\*/g, '<b>$1</b>');
    const days = getFollowupIntervalDays();
    const status = document.getElementById('dealStatus').value;
    const hint = status === 'in_progress'
        ? `🔁 هتتبعت كل ${days} يوم طول ما الديل قيد التواصل، وبتقف أول ما يتقفل.`
        : '⏸️ الديل مقفول، فرسالة المتابعة مش هتتبعت.';
    document.getElementById('followupModeHint').textContent = hint + (followupIsAuto ? ' ✨ النص بيتحدث تلقائياً مع اسم العميل ونوع الساعة.' : ' ✍️ نص متعدل يدوياً.');
}

function fillDefaultReminderText() {
    reminderIsAuto = true;
    updateWhatsAppPreview();
}

function onReminderTyped() {
    reminderIsAuto = false;
    updateWhatsAppPreview();
}

function updateWhatsAppPreview() {
    const customVal = document.getElementById('watchBrandCustom').value.trim();
    if (customVal && document.getElementById('watchBrandSelect').value === 'custom') {
        document.getElementById('selectedWatchBrandLabel').textContent = `⌚ ${customVal} (يدوي)`;
    }

    const reminderBox = document.getElementById('reminderMessage');
    if (reminderIsAuto) reminderBox.value = buildReminderMessage();

    // نفس تنسيق واتساب: *كلام* بيظهر Bold
    const msg = reminderBox.value.trim() || buildReminderMessage();
    document.getElementById('waPreviewText').innerHTML = esc(msg).replace(/\*([^*\n]+)\*/g, '<b>$1</b>');
    updateFollowupPreview();
    const hint = document.getElementById('reminderModeHint');
    if (hint) hint.textContent = reminderIsAuto
        ? '✨ الرسالة بتتحدث تلقائياً مع الميعاد واسم العميل'
        : '✍️ رسالة متعدلة يدوياً — دوس (توليد نص تلقائي) عشان ترجع للشكل المنظم بالميعاد';
}

// المبلغ المدفوع مستقل عن الحالة: ممكن تدفع جزء والديل لسه قيد التواصل
function onAmountPaidChange(val) {}

function onDealStatusChange(status) {
    const paidInput = document.getElementById('amountPaid');
    updateFollowupPreview();
    if (status === 'cancelled') {
        paidInput.value = 0;
        paidInput.disabled = true;
    } else if (status === 'in_progress') {
        paidInput.disabled = false;
    } else if (status === 'completed') {
        paidInput.disabled = false;
        if (Number(paidInput.value) <= 0) paidInput.focus();
    }
}

async function reopenCancelledDeal(dealId) {
    const d = state.deals.find(x => x.id === dealId);
    if (!d) return;

    const { error } = await db.from('deals').update({ status: 'in_progress' }).eq('id', dealId);
    if (error) return alert("❌ خطأ: " + error.message);

    showToast(`🔄 تم الرجوع لديل العميل (${esc(d.client_name)}) وفتحه من جديد!`, "info");
    await loadAllData();
    openEditDeal(dealId);
}

// آخر 10 أرقام عشان 010... و +2010... و 2010... يتطابقوا
function normalizePhone(phone) {
    return String(phone || '').replace(/\D/g, '').slice(-10);
}

// لما تختار الموظف المسؤول، خط واتساب الشركة المسجل برقمه بيتختار لوحده
function onDealEmployeeChange() {
    const emp = state.employees.find(e => e.id === document.getElementById('dealEmployee').value);
    const empPhone = normalizePhone(emp?.phone_whatsapp);
    if (!empPhone) return;
    const line = state.waInstances.find(w => normalizePhone(w.phone_number) === empPhone);
    if (line) document.getElementById('dealWhatsappInstance').value = line.id;
}

function openNewDealModal() {
    renderWhatsappInstances();
    document.getElementById('dealForm').reset();
    document.getElementById('editDealId').value = "";
    document.getElementById('oldAmountPaid').value = "0";
    document.getElementById('amountPaid').disabled = false;
    document.getElementById('dealStatus').value = 'in_progress';
    document.getElementById('dealWhatsappInstance').value = '';
    if (document.getElementById('watchBrandSearchInput')) {
        document.getElementById('watchBrandSearchInput').value = '';
    }
    selectWatchBrandOption('');
    document.getElementById('dealModalTitle').textContent = "تسجيل ديل / ساعة جديدة";
    dealImages = [];
    renderDealImagesPreview();

    const myEmp = state.employees.find(e => e.user_id === currentUser.id);
    if (myEmp) document.getElementById('dealEmployee').value = myEmp.id;
    onDealEmployeeChange();

    reminderIsAuto = true;
    followupIsAuto = true;
    document.getElementById('followupIntervalDays').value = 15;
    updateWhatsAppPreview();
    openModal('dealModal');
}

function openEditDeal(dealId) {
    renderWhatsappInstances();
    const d = state.deals.find(x => x.id === dealId);
    if (!d) return;

    document.getElementById('editDealId').value = d.id;
    document.getElementById('oldAmountPaid').value = d.amount_paid || 0;
    document.getElementById('dealModalTitle').textContent = `تخليص / تعديل ديل العميل: ${d.client_name}`;

    document.getElementById('clientName').value = d.client_name || '';
    document.getElementById('clientPhone').value = d.client_phone || '';
    document.getElementById('clientLocation').value = d.client_location || '';

    if (document.getElementById('watchBrandSearchInput')) {
        document.getElementById('watchBrandSearchInput').value = '';
    }

    const savedBrand = d.watch_brand || '';
    if (!savedBrand || SWISS_BRANDS.includes(savedBrand)) {
        selectWatchBrandOption(savedBrand);
    } else {
        selectWatchBrandOption('custom', savedBrand);
    }

    const myEmp = state.employees.find(e => e.user_id === currentUser.id);
    document.getElementById('dealEmployee').value = d.employee_id || (myEmp ? myEmp.id : '');
    document.getElementById('dealWhatsappInstance').value = d.whatsapp_instance_id || '';

    document.getElementById('dealDetails').value = d.deal_details || '';
    document.getElementById('amountRequested').value = d.amount_requested || 0;
    document.getElementById('sellingPriceRange').value = d.selling_price_range || '';
    document.getElementById('amountPaid').value = d.amount_paid || 0;
    document.getElementById('dealStatus').value = d.status || 'in_progress';
    document.getElementById('amountPaid').disabled = (d.status === 'cancelled');
    document.getElementById('reminderMessage').value = d.reminder_message || '';
    reminderIsAuto = !d.reminder_message;
    document.getElementById('followupMessage').value = d.followup_message || '';
    document.getElementById('followupIntervalDays').value = d.followup_interval_days || 15;
    followupIsAuto = !d.followup_message;

    if (d.meeting_time) {
        const dt = new Date(d.meeting_time);
        dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
        document.getElementById('meetingTime').value = dt.toISOString().slice(0, 16);
    } else {
        document.getElementById('meetingTime').value = '';
    }

    dealImages = [...getDealImages(d)];
    renderDealImagesPreview();

    updateWhatsAppPreview();
    openModal('dealModal');
}

async function saveDeal(e) {
    e.preventDefault();
    const editId = document.getElementById('editDealId').value;
    let newPaid = Number(document.getElementById('amountPaid').value || 0);
    let status = document.getElementById('dealStatus').value;

    if (status === 'completed' && newPaid <= 0) {
        document.getElementById('amountPaid').focus();
        return alert("⚠️ طالما اخترت (تم الشراء وتخليص الديل)، لازم تكتب في خانة (أنا دفعتله كام) المبلغ اللي اشتريت بيه!");
    }
    if (status === 'cancelled') {
        newPaid = 0;
    }

    const myEmp = state.employees.find(emp => emp.user_id === currentUser.id);
    const selectedEmpId = document.getElementById('dealEmployee').value || (myEmp ? myEmp.id : null);
    const selectedWaId = document.getElementById('dealWhatsappInstance').value;
    const watchBrand = getSelectedWatchBrand();

    const dealPayload = {
        employee_id: selectedEmpId,
        whatsapp_instance_id: selectedWaId ? Number(selectedWaId) : null,
        assigned_by_name: currentUser.full_name,
        assigned_by_role: currentUser.role,
        client_name: document.getElementById('clientName').value.trim(),
        client_phone: document.getElementById('clientPhone').value.trim(),
        client_location: document.getElementById('clientLocation').value.trim(),
        watch_brand: watchBrand || null,
        deal_details: document.getElementById('dealDetails').value.trim(),
        amount_paid: newPaid,
        amount_requested: Number(document.getElementById('amountRequested').value || 0),
        selling_price_range: document.getElementById('sellingPriceRange').value.trim() || null,
        meeting_time: document.getElementById('meetingTime').value || null,
        reminder_message: document.getElementById('reminderMessage').value.trim() || null,
        followup_message: document.getElementById('followupMessage').value.trim() || null,
        followup_interval_days: getFollowupIntervalDays(),
        item_image_url: dealImages[0] || null,
        item_images: dealImages,
        status: status
    };

    const writeDeal = payload => editId
        ? db.from('deals').update(payload).eq('id', editId)
        : db.from('deals').insert([payload]);

    let { error } = await writeDeal(dealPayload);
    // لو أعمدة المتابعة لسه ما اتضافتش في الداتابيز، الديل يتحفظ من غيرها بدل ما يقف
    let followupSkipped = false;
    if (error && /followup/.test(error.message)) {
        delete dealPayload.followup_message;
        delete dealPayload.followup_interval_days;
        followupSkipped = true;
        ({ error } = await writeDeal(dealPayload));
    }
    if (error) {
        delete dealPayload.assigned_by_name;
        delete dealPayload.assigned_by_role;
        ({ error } = await writeDeal(dealPayload));
        if (error) return alert((editId ? "❌ خطأ أثناء تحديث الديل: " : "❌ خطأ أثناء حفظ الديل: ") + error.message);
    }
    if (followupSkipped) showToast("⚠️ الديل اتحفظ، بس رسالة المتابعة ما اتحفظتش لأن الداتابيز لسه محتاجة تتحدث.", "info");

    showToast("✅ تم حفظ وتحديث بيانات الديل بنجاح!", "success");
    dealImages = [];
    document.getElementById('dealForm').reset();
    renderDealImagesPreview();
    closeModal('dealModal');
    await loadAllData();
    // إعادة تطبيق فلتر البحث الحالي بعد الحفظ مباشرة
    const currentSearch = document.getElementById('dealSearchInput') ? document.getElementById('dealSearchInput').value.trim() : '';
    renderDeals(currentSearch);
}

// آخر قائمة ديلز اتعرضت (بعد البحث والفلتر) — هي اللي بتتصدّر في الـ Excel
let lastRenderedDeals = [];

function getDealEmployeeName(d) {
    const emp = state.employees.find(e => e.id === d.employee_id);
    return emp ? emp.full_name : '';
}

function renderDealEmployeeFilter() {
    const select = document.getElementById('dealEmployeeFilter');
    if (!select) return '';
    const current = select.value;
    const countFor = id => state.deals.filter(d => d.employee_id === id).length;
    const active = state.employees.filter(e => !e.archived_at);
    const archived = state.employees.filter(e => e.archived_at && countFor(e.id) > 0);
    select.innerHTML = `<option value="">كل الموظفين (${state.deals.length})</option>`
        + active.map(e => `<option value="${e.id}">${esc(e.full_name)} (${countFor(e.id)})</option>`).join('')
        + archived.map(e => `<option value="${e.id}">${esc(e.full_name)} - محذوف (${countFor(e.id)})</option>`).join('')
        + `<option value="none">بدون موظف (${state.deals.filter(d => !d.employee_id).length})</option>`;
    if ([...select.options].some(o => o.value === current)) select.value = current;
    return select.value;
}

function renderDeals(query = '') {
    const tbody = document.getElementById('dealsTableBody');
    let list = state.deals;

    const empFilter = renderDealEmployeeFilter();
    if (empFilter === 'none') list = list.filter(d => !d.employee_id);
    else if (empFilter) list = list.filter(d => d.employee_id === empFilter);

    if (query) {
        // تقسيم جملة البحث إلى كلمات وتوحيد الحروف العربية والإنجليزية للبحث في كل خانات الديل
        const qWords = normalizeSearchText(query).split(/\s+/).filter(Boolean);
        list = list.filter(d => {
            const searchableContent = normalizeSearchText([
                d.client_name,
                d.client_phone,
                d.watch_brand,
                d.deal_details,
                d.client_location,
                d.selling_price_range,
                getDealEmployeeName(d),
                d.assigned_by_name
            ].join(' '));

            return qWords.every(word => searchableContent.includes(word));
        });
    }

    lastRenderedDeals = list;
    const summary = document.getElementById('dealsSummary');
    if (summary) {
        const by = s => list.filter(d => d.status === s).length;
        const paid = list.reduce((s, d) => s + Number(d.amount_paid || 0), 0);
        const filtered = list.length !== state.deals.length;
        const tile = (label, value, dot, unit = '') => `
            <div class="stat">
                <div class="stat-label"><span class="stat-dot" style="background:${dot}"></span>${label}</div>
                <div class="stat-value">${value}${unit ? `<small>${unit}</small>` : ''}</div>
            </div>`;
        summary.innerHTML =
            tile(filtered ? 'نتيجة الفلتر' : 'كل الديلز', list.length, 'var(--ink-400)', 'ديل') +
            tile('قيد التواصل', by('in_progress'), 'var(--gold-500)') +
            tile('تم الشراء', by('completed'), 'var(--success-600)') +
            tile('لم يتم الاتفاق', by('cancelled'), 'var(--danger-600)') +
            tile('إجمالي المدفوع', paid.toLocaleString(), 'var(--primary-500)', 'ج.م');
    }

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">
            <div class="empty-state">
                <div class="empty-icon">${icon('search')}</div>
                <div class="empty-title">لا توجد صفقات مطابقة</div>
                <div class="empty-text">جرّب كلمة بحث تانية أو غيّر فلتر الموظف.</div>
            </div></td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(d => {
        const emp = state.employees.find(e => e.id === d.employee_id);
        const waInst = state.waInstances.find(w => Number(w.id) === Number(d.whatsapp_instance_id));
        let badge = '';
        let rowBgClass = '';
        let actionButtons = '';
        const deleteBtn = `<button onclick="deleteRow('deals', '${d.id}')" class="btn btn-danger-soft btn-sm btn-icon" title="حذف" aria-label="حذف">${icon('trash')}</button>`;

        if (d.status === 'completed') {
            badge = `<span class="badge badge-success">تم الشراء</span>`;
            actionButtons = `
                <div class="cell-actions">
                    <button onclick="openEditDeal('${d.id}')" class="btn btn-secondary btn-sm">${icon('edit')} تعديل الديل</button>
                    ${deleteBtn}
                </div>`;
        } else if (d.status === 'cancelled') {
            rowBgClass = 'row-muted';
            badge = `<span class="badge badge-danger">لم يتم الاتفاق</span>`;
            actionButtons = `
                <div class="cell-actions">
                    <button onclick="reopenCancelledDeal('${d.id}')" class="btn btn-secondary btn-sm">${icon('undo')} الرجوع للديل</button>
                    <button onclick="openEditDeal('${d.id}')" class="btn btn-ghost btn-sm">${icon('edit')} تعديل البيانات</button>
                    ${deleteBtn}
                </div>`;
        } else {
            badge = `<span class="badge badge-warning">قيد التواصل</span>`;
            actionButtons = `
                <div class="cell-actions">
                    <button onclick="openEditDeal('${d.id}')" class="btn btn-primary btn-sm">${icon('edit')} تخليص / تعديل</button>
                    ${deleteBtn}
                </div>`;
        }

        const images = getDealImages(d);
        const imageHtml = images.length
            ? `<div onclick="viewDealImage('${d.id}')" class="thumb" title="تكبير الصور">
                 <img src="${esc(images[0])}" alt="">
                 ${images.length > 1 ? `<span class="count">${images.length}</span>` : ''}
               </div>`
            : `<span class="text-slate-300">${icon('image', 'w-5 h-5')}</span>`;

        return `
        <tr class="${rowBgClass}">
            <td>
                <div class="client-cell">
                    <div class="avatar">${initialOf(d.client_name)}</div>
                    <div>
                        <div class="cell-primary">${esc(d.client_name) || '—'}</div>
                        ${esc(d.client_phone) ? `<a href="https://wa.me/2${esc(d.client_phone)}" target="_blank" class="wa-link">${icon('phone')}${esc(d.client_phone)}</a>` : ''}
                    </div>
                </div>
            </td>
            <td class="min-w-[130px]">
                <div class="cell-primary">${esc(d.watch_brand) || '—'}</div>
                <div class="cell-sub flex items-center gap-1">${icon('pin', 'w-3 h-3')} ${esc(d.client_location) || 'غير محدد'}</div>
            </td>
            <td class="min-w-[140px] max-w-[200px]"><div class="clamp-2 text-slate-600">${esc(d.deal_details) || '<span class="text-slate-400">—</span>'}</div></td>
            <td>
                <dl class="price-list">
                    <dt>طالب</dt><dd>${Number(d.amount_requested || 0).toLocaleString()}</dd>
                    <dt>رينج البيع</dt><dd>${esc(d.selling_price_range) || '—'}</dd>
                    <dt>دفعتله</dt><dd class="text-emerald-700">${Number(d.amount_paid || 0).toLocaleString()}</dd>
                </dl>
            </td>
            <td class="min-w-[160px] max-w-[200px]">
                <div class="flex items-center gap-1.5 text-slate-900 font-medium text-xs">${icon('clock', 'w-3.5 h-3.5 text-slate-400')} ${d.meeting_time ? new Date(d.meeting_time).toLocaleString('ar-EG') : 'غير محدد'}</div>
                <div class="cell-sub">خط الإرسال: ${waInst ? `${esc(waInst.instance_name)} <span class="cell-mono">(${esc(waInst.phone_number)})</span>` : 'توزيع تلقائي'}</div>
                ${esc(d.reminder_message) ? `<div class="msg-chip reminder" title="${esc(d.reminder_message)}">${icon('chat')}<span class="truncate">${esc(d.reminder_message)}</span></div>` : ''}
                ${d.followup_message && d.status === 'in_progress' ? `<div class="msg-chip followup" title="${esc(d.followup_message)}">${icon('repeat')} متابعة كل ${Number(d.followup_interval_days) || 15} يوم</div>` : ''}
            </td>
            <td>${imageHtml}</td>
            <td>
                ${badge}
                <div class="cell-sub mt-1.5">${emp ? esc(emp.full_name) : '<span class="text-amber-700">بدون موظف</span>'}</div>
            </td>
            <td>${actionButtons}</td>
        </tr>`;
    }).join('');
}