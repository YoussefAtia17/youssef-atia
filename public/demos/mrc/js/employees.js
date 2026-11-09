// =========================================================================
// إدارة الأونرز، الموظفين، السلف الفورية، والبونص (مع التصفير الشهري التلقائي من يوم الإضافة)
// =========================================================================

function toggleSalaryFieldByRole(role) {
    document.getElementById('empSalaryWrapper').classList.toggle('hidden', role === 'owner');
}

// فتح نافذة إضافة حساب بخانات فاضية دايماً (من غير بيانات حد سجل قبل كده أو حفظها المتصفح)
function clearAddEmployeeForm() {
    document.getElementById('addEmployeeForm').reset();
    ['empName', 'empPhone', 'empPassword', 'empEmail'].forEach(id => { document.getElementById(id).value = ''; });
    document.getElementById('empSalary').value = 0;
    toggleSalaryFieldByRole(document.getElementById('empRole').value);
}

function openAddEmployeeModal() {
    clearAddEmployeeForm();
    openModal('addEmployeeModal');
    // المتصفح أحياناً بيملا الخانات بعد ما النافذة تفتح، فبنفضّيها تاني
    [50, 300].forEach(ms => setTimeout(() => {
        if (document.activeElement?.closest('#addEmployeeForm')) return;
        clearAddEmployeeForm();
    }, ms));
}

// حساب بداية دورة الشهر الحالية للموظف بناءً على يوم إضافته (created_at)
function getEmployeeCycleStartDate(empCreatedAt) {
    const now = new Date();
    const createdDate = empCreatedAt ? new Date(empCreatedAt) : new Date(now.getFullYear(), now.getMonth(), 1);
    const hireDay = createdDate.getDate(); // اليوم اللي اتضاف فيه الموظف (مثلاً يوم 6)

    // بداية الدورة في الشهر الحالي بنفس يوم الإضافة
    let cycleStart = new Date(now.getFullYear(), now.getMonth(), hireDay, 0, 0, 0);

    // لو النهاردة لسه مجاش يوم الإضافة في الشهر ده، تبقى الدورة الحالية بدأت من الشهر اللي فات في نفس اليوم
    if (now < cycleStart) {
        cycleStart = new Date(now.getFullYear(), now.getMonth() - 1, hireDay, 0, 0, 0);
    }

    return cycleStart;
}

async function ownerCreateEmployee(e) {
    e.preventDefault();
    const role = document.getElementById('empRole').value;
    const full_name = document.getElementById('empName').value.trim();
    const phone_whatsapp = document.getElementById('empPhone').value.trim();
    const password = document.getElementById('empPassword').value.trim();

    if (!full_name || !phone_whatsapp || !password) {
        return alert("⚠️ الاسم، رقم التليفون (الواتساب)، والباسورد خانات إجبارية!");
    }

    const rawEmail = document.getElementById('empEmail').value.trim();
    const email = rawEmail || `${full_name.replace(/\s+/g, '_')}_${Date.now()}@mrc.local`;
    const base_salary = role === 'owner' ? 0 : Number(document.getElementById('empSalary').value || 0);

    // الحساب وكارت الموظف بيتعملوا مع بعض على السيرفر، والباسورد بيتشفر هناك
    const { error } = await db.rpc('app_create_user', {
        p_full_name: full_name, p_email: email, p_phone: phone_whatsapp,
        p_password: password, p_role: role, p_base_salary: base_salary
    });

    if (error) {
        if (error.message.includes('name taken')) return alert(`⚠️ فيه حساب شغال بالاسم (${full_name}) بالفعل! اختار اسم تاني عشان الدخول بالاسم مايتلخبطش.`);
        return alert("❌ خطأ في إنشاء الحساب: " + error.message);
    }

    showToast(`✅ تم إنشاء حساب (${esc(full_name)}) بصلاحية (${role === 'owner' ? '👑 أونر' : '💼 موظف'}) بنجاح!`, 'success');
    e.target.reset();
    closeModal('addEmployeeModal');
    await loadAllData();
}

// الحذف = أرشفة: الموظف بيختفي من القوائم ومايقدرش يدخل، لكن كل معاملاته بتفضل في السجل
async function deleteEmployeeAndUser(empId, userId) {
    if (!confirm("الموظف هيتشال من القائمة ومش هيقدر يسجل دخول.\nكل سلفه وبونصاته وديلزه وحركات الخزنة بتاعته هتفضل محفوظة، وتقدر ترجّعه في أي وقت من (الموظفين المحذوفين).\n\nتكمل؟")) return;
    const { error } = empId
        ? await db.rpc('app_archive_employee', { p_emp_id: empId })
        : await db.rpc('app_delete_user', { p_user_id: userId });
    if (error) return alert("❌ لا يمكن حذف هذا الحساب: " + error.message);
    if (selectedEmployeeHistoryId === empId) selectedEmployeeHistoryId = null;
    showToast("🗂️ تم حذف الموظف من القائمة، ومعاملاته محفوظة في السجل.", "info");
    await loadAllData();
}

async function restoreEmployee(empId) {
    const { error } = await db.rpc('app_restore_employee', { p_emp_id: empId });
    if (error) {
        if (error.message.includes('name taken')) return alert("⚠️ فيه حساب شغال دلوقتي بنفس اسم الموظف ده. غيّر اسم الحساب التاني الأول وبعدين رجّعه.");
        return alert("❌ لا يمكن استرجاع الموظف: " + error.message);
    }
    const emp = state.employees.find(e => e.id === empId);
    showToast(`♻️ تم استرجاع (${esc(emp ? emp.full_name : '')}) بكل معاملاته، ويقدر يسجل دخول تاني.`, "success");
    await loadAllData();
}

function toggleEmployeeCardHistory(empId, event) {
    if (event) event.stopPropagation();
    if (selectedEmployeeHistoryId === empId) {
        closeEmployeeHistory();
    } else {
        selectedEmployeeHistoryId = empId;
        renderEmployees();
    }
}

function closeEmployeeHistory() {
    selectedEmployeeHistoryId = null;
    document.getElementById('selectedEmployeeHistoryBox').classList.add('hidden');
    renderEmployees();
}

function openEmpFinancialModal() {
    const myEmp = state.employees.find(e => e.user_id === currentUser.id);
    const empSelect = document.getElementById('finEmpId');
    if (currentUser.role === 'employee' && myEmp) {
        empSelect.value = myEmp.id;
        empSelect.disabled = true;
        document.getElementById('finType').value = 'loan';
    } else {
        empSelect.disabled = false;
    }
    openModal('empFinancialModal');
}

async function saveEmpFinancial(e) {
    e.preventDefault();
    const employee_id = document.getElementById('finEmpId').value;
    const transaction_type = document.getElementById('finType').value;
    const amount = Number(document.getElementById('finAmount').value);
    const notes = document.getElementById('finNotes').value.trim();

    const currentBalance = getCurrentTreasuryBalance();
    const typeLabel = transaction_type === 'loan' ? 'السلفة' : 'البونص';

    // الرصيد بيتشيّك على السيرفر دايماً، وهنا بس لو الخزنة مفتوحة عشان رسالة أوضح
    if (isTreasuryUnlocked && currentBalance < amount) {
        return alert(`⚠️ الخزنة فاضية أو الرصيد غير كافي لصرف ${typeLabel}!\n\nالمبلغ المطلوب: ${amount.toLocaleString()} ج.م\nالرصيد المتاح في الخزنة حالياً: ${currentBalance.toLocaleString()} ج.م\n\nخش ضيف فلوس في الخزنة الأول.`);
    }

    const { error } = await db
        .from('employee_financials')
        .insert([{
            employee_id,
            transaction_type,
            amount,
            notes,
            approval_status: 'approved'
        }]);

    if (error) return alert("❌ خطأ أثناء التسجيل: " + error.message);


    selectedEmployeeHistoryId = employee_id;
    showToast(`تم تسجيل ${typeLabel} بمبلغ ${amount.toLocaleString()} ج.م وخصمها من الخزنة فوراً!`, "success");
    e.target.reset();
    closeModal('empFinancialModal');
    await loadAllData();
}

function renderEmployees() {
    const activeEmployees = state.employees.filter(e => !e.archived_at);
    const archivedEmployees = state.employees.filter(e => e.archived_at);
    const opts = activeEmployees.map(e => `<option value="${e.id}">${esc(e.full_name)}</option>`).join('');
    // المحذوفين بيظهروا (من غير ما يتختاروا) عشان الديلز القديمة تفضل محتفظة باسم مسؤولها
    const archivedOpts = archivedEmployees.map(e => `<option value="${e.id}" disabled>${esc(e.full_name)} (محذوف)</option>`).join('');
    document.getElementById('dealEmployee').innerHTML = `<option value="">-- اختر المسؤول --</option>` + opts + archivedOpts;
    document.getElementById('finEmpId').innerHTML = opts;

    const sortedList = [...activeEmployees].sort((a, b) => {
        const uA = state.users.find(u => u.id === a.user_id);
        const uB = state.users.find(u => u.id === b.user_id);
        const roleA = uA ? uA.role : 'employee';
        const roleB = uB ? uB.role : 'employee';
        return roleA === 'owner' && roleB !== 'owner' ? -1 : 1;
    });

    document.getElementById('employeesCardsContainer').innerHTML = sortedList.map(emp => {
        const linkedUser = state.users.find(u => u.id === emp.user_id);
        const isOwnerCard = linkedUser && linkedUser.role === 'owner';

        // حساب بداية الدورة الشهرية للموظف من يوم إضافته
        const cycleStart = getEmployeeCycleStartDate(emp.created_at);
        const nextResetDate = new Date(cycleStart);
        nextResetDate.setMonth(nextResetDate.getMonth() + 1);
        const hireDay = cycleStart.getDate();

        const allRecs = state.empFinancials.filter(f => f.employee_id === emp.id);
        // فلترة السلف والبونص الخاصة بدورة الشهر الحالية فقط (تتصفر تلقائياً كل شهر في يوم إضافته)
        const currentCycleRecs = allRecs.filter(f => new Date(f.transaction_date || f.created_at) >= cycleStart);

        const loans = currentCycleRecs.filter(f => f.transaction_type === 'loan').reduce((s, f) => s + Number(f.amount), 0);
        const bonus = currentCycleRecs.filter(f => f.transaction_type === 'bonus').reduce((s, f) => s + Number(f.amount), 0);
        const net = Number(emp.base_salary) + bonus - loans;
        const isSelected = selectedEmployeeHistoryId === emp.id;

        const historyHint = isSelected ? 'السجل مفتوح' : `السجل (${allRecs.length})`;

        if (isOwnerCard) {
            return `
            <div onclick="toggleEmployeeCardHistory('${emp.id}', event)"
                 class="emp-card-item entity-card owner ${isSelected ? 'is-selected' : ''}">
                <div class="entity-head">
                    <div class="avatar gold">${icon('crown', 'w-4 h-4')}</div>
                    <div class="flex-1 min-w-0">
                        <div class="entity-name truncate">${esc(emp.full_name)}</div>
                        <div class="entity-meta cell-mono text-right">${esc(emp.phone_whatsapp) || 'غير مسجل'}</div>
                    </div>
                    <span class="badge badge-gold no-dot">أونر</span>
                </div>
                <div class="entity-body">
                    <div class="kv"><span>الصلاحية</span><b class="!text-amber-300">تحكم كامل</b></div>
                    <div class="kv"><span>مكافآت الدورة الحالية</span><b>${bonus.toLocaleString()} ج.م</b></div>
                    <div class="kv"><span>مسحوبات الدورة الحالية</span><b>${loans.toLocaleString()} ج.م</b></div>
                </div>
                <div class="entity-foot">
                    <span class="toggle-hint">${icon('calendar', 'w-3 h-3')} ${historyHint}</span>
                    ${currentUser.role === 'owner' && emp.user_id !== currentUser.id ? `
                        <button onclick="event.stopPropagation(); deleteEmployeeAndUser('${emp.id}', '${emp.user_id || ''}')" class="btn btn-sm !text-rose-300 hover:!bg-rose-500/15">${icon('trash')} حذف</button>
                    ` : ''}
                </div>
            </div>`;
        }

        return `
        <div onclick="toggleEmployeeCardHistory('${emp.id}', event)"
             class="emp-card-item entity-card ${isSelected ? 'is-selected' : ''}">
            <div class="entity-head">
                <div class="avatar">${initialOf(emp.full_name)}</div>
                <div class="flex-1 min-w-0">
                    <div class="entity-name truncate">${esc(emp.full_name)}</div>
                    <div class="entity-meta cell-mono text-right">${esc(emp.phone_whatsapp) || 'غير مسجل'}</div>
                </div>
                <span class="badge badge-primary no-dot">موظف · يوم ${hireDay}</span>
            </div>
            <div class="entity-body">
                <div class="kv"><span>المرتب الأساسي</span><b>${Number(emp.base_salary).toLocaleString()} ج.م</b></div>
                <div class="kv"><span>+ البونص (الدورة الحالية)</span><b class="!text-emerald-700">${bonus.toLocaleString()} ج.م</b></div>
                <div class="kv"><span>− السلف (الدورة الحالية)</span><b class="!text-rose-700">${loans.toLocaleString()} ج.م</b></div>
                <div class="kv total"><span>صافي المرتب</span><b>${net.toLocaleString()} ج.م</b></div>
            </div>
            <div class="entity-foot">
                <span class="toggle-hint">${icon('calendar', 'w-3 h-3')} ${historyHint}</span>
                <span class="flex items-center gap-1">${icon('refresh', 'w-3 h-3')} يتصفر ${nextResetDate.toLocaleDateString('ar-EG')}</span>
                ${currentUser.role === 'owner' ? `<button onclick="event.stopPropagation(); deleteEmployeeAndUser('${emp.id}', '${emp.user_id || ''}')" class="btn btn-danger-soft btn-sm">${icon('trash')} حذف</button>` : ''}
            </div>
        </div>`;
    }).join('');

    renderArchivedEmployees(archivedEmployees);

    const historyBox = document.getElementById('selectedEmployeeHistoryBox');
    if (selectedEmployeeHistoryId) {
        const selectedEmp = state.employees.find(e => e.id === selectedEmployeeHistoryId);
        if (selectedEmp) {
            const cycleStart = getEmployeeCycleStartDate(selectedEmp.created_at);
            historyBox.classList.remove('hidden');
            document.getElementById('selectedEmpHistoryTitle').textContent = `سجل السلف والبونص — ${selectedEmp.full_name}${selectedEmp.archived_at ? ' (محذوف)' : ''}`;
            const empRecs = state.empFinancials.filter(f => f.employee_id === selectedEmployeeHistoryId);

            if (empRecs.length === 0) {
                document.getElementById('empFinancialsTableBody').innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">${icon('inbox')}</div><div class="empty-title">لا توجد سلف أو مكافآت</div><div class="empty-text">أي سلفة أو بونص هيتسجل هنا.</div></div></td></tr>`;
            } else {
                document.getElementById('empFinancialsTableBody').innerHTML = empRecs.map(f => {
                    const fDate = new Date(f.transaction_date || f.created_at);
                    const isCurrentCycle = fDate >= cycleStart;
                    return `
                        <tr class="${isCurrentCycle ? '' : 'row-muted'}">
                            <td>${f.transaction_type === 'loan' ? `<span class="badge badge-danger no-dot">${icon('trendDown', 'w-3.5 h-3.5')} سلفة مخصومة</span>` : `<span class="badge badge-success no-dot">${icon('gift', 'w-3.5 h-3.5')} بونص</span>`}</td>
                            <td class="${f.transaction_type === 'loan' ? 'amount-out' : 'amount-in'}">${f.transaction_type === 'loan' ? '−' : '+'}${Number(f.amount).toLocaleString()} ج.م</td>
                            <td>${esc(f.notes) || '—'}</td>
                            <td class="text-xs text-slate-500 whitespace-nowrap">${fDate.toLocaleString('ar-EG')}</td>
                            <td>
                                ${isCurrentCycle
                                    ? '<span class="badge badge-primary">الدورة الحالية</span>'
                                    : '<span class="badge badge-neutral">دورة سابقة</span>'}
                            </td>
                            <td class="${currentUser.role === 'owner' ? '' : 'hidden'}">
                                <button onclick="deleteRow('employee_financials', '${f.id}')" class="btn btn-danger-soft btn-sm">${icon('trash')} حذف</button>
                            </td>
                        </tr>
                    `;
                }).join('');
            }
        }
    } else {
        historyBox.classList.add('hidden');
    }
}
function renderArchivedEmployees(archivedEmployees) {
    const box = document.getElementById('archivedEmployeesBox');
    if (!box) return;
    if (currentUser.role !== 'owner' || archivedEmployees.length === 0) {
        box.classList.add('hidden');
        box.innerHTML = '';
        return;
    }
    box.classList.remove('hidden');
    box.innerHTML = `
        <details class="card">
            <summary class="cursor-pointer px-5 py-3.5 font-semibold text-slate-700 flex items-center gap-2">${icon('archive', 'w-4 h-4 text-slate-400')} الموظفين المحذوفين (${archivedEmployees.length}) <span class="text-xs font-normal text-slate-400">— معاملاتهم محفوظة</span></summary>
            <div class="px-5 pb-4 space-y-2">
                ${archivedEmployees.map(emp => {
                    const recsCount = state.empFinancials.filter(f => f.employee_id === emp.id).length;
                    const dealsCount = state.deals.filter(d => d.employee_id === emp.id).length;
                    return `
                    <div class="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <div class="flex items-center gap-3">
                            <div class="avatar !bg-slate-200 !text-slate-500">${initialOf(emp.full_name)}</div>
                            <div>
                                <div class="font-semibold text-slate-800">${esc(emp.full_name)}</div>
                                <div class="text-[11px] text-slate-500">${esc(emp.phone_whatsapp) || 'غير مسجل'} · ${recsCount} سلفة/بونص · ${dealsCount} ديل · اتحذف ${new Date(emp.archived_at).toLocaleDateString('ar-EG')}</div>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="toggleEmployeeCardHistory('${emp.id}', event)" class="btn btn-secondary btn-sm">${icon('calendar')} السجل</button>
                            <button onclick="restoreEmployee('${emp.id}')" class="btn btn-secondary btn-sm">${icon('undo')} استرجاع</button>
                        </div>
                    </div>`;
                }).join('')}
            </div>
        </details>`;
}
