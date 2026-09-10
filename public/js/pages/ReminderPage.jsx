/* ═══════════════ REMINDER PAGE — NEW ═══════════════ */
function ReminderPage({ checklist, setChecklist, rundown, vendors, setVendors, data, dismissed, setDismissed, customReminders, setCustomReminders, onBack }) {
  const [filter, setFilter] = useState('semua');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newDateDisplay, setNewDateDisplay] = useState('');
  const [newUrgent, setNewUrgent] = useState(false);

  // ── Fade-out + undo-toast mechanism, so nothing ever just "vanishes" abruptly ──
  const [leavingIds, setLeavingIds] = useState({});
  const [toast, setToast] = useState(null); // { id, label, undo }

  const animateAndRun = (id, commitFn, toastLabel, undoFn) => {
    setLeavingIds(prev => ({...prev, [id]:true}));
    setTimeout(() => {
      commitFn();
      setLeavingIds(prev => { const n={...prev}; delete n[id]; return n; });
      const toastId = Date.now();
      setToast({ id:toastId, label:toastLabel, undo:()=>{ undoFn(); setToast(null); } });
      setTimeout(()=>setToast(curr=>(curr && curr.id===toastId ? null : curr)), 4500);
    }, 280);
  };

  // ── Active (not-yet-done) reminders ──
  const checklistItems = checklist
    .filter(c=>!c.done && !dismissed.includes('c'+c.id))
    .map(c=>({
      id:'c'+c.id, kind:'checklist', title:c.title,
      sub: c.urgent ? 'Prioritas tinggi — sebaiknya segera diselesaikan' : `Kategori: ${c.category}`,
      urgent: !!c.urgent, calDate:null, calDetails:c.category,
      onDone: () => animateAndRun('c'+c.id,
        () => setChecklist(list=>list.map(x=>x.id===c.id?{...x,done:true}:x)),
        `"${c.title}" ditandai selesai`,
        () => setChecklist(list=>list.map(x=>x.id===c.id?{...x,done:false}:x))),
      doneLabel:'✓ Tandai Selesai',
    }))
    .sort((a,b)=>(b.urgent?1:0)-(a.urgent?1:0));

  const rundownItems = rundown
    .map((r,i)=>({r,i}))
    .filter(({i})=>!dismissed.includes('r'+i))
    .sort((a,b)=>(a.r.time||'').localeCompare(b.r.time||''))
    .map(({r,i})=>({
      id:'r'+i, kind:'rundown', title:r.title,
      sub: r.time ? `Pukul ${r.time} · Agenda hari-H` : 'Agenda hari-H',
      urgent:false, calDate: combineDateTime(data.tanggal, r.time), calDetails:r.note||'',
      onDone: () => animateAndRun('r'+i,
        () => setDismissed(d=>[...d,'r'+i]),
        `"${r.title}" disembunyikan dari reminder`,
        () => setDismissed(d=>d.filter(x=>x!=='r'+i))),
      doneLabel:'Sembunyikan',
    }));

  const manualItems = customReminders
    .filter(m=>!m.done)
    .map(m=>({
      id:'m'+m.id, kind:'manual', title:m.title,
      sub: m.note || (m.date ? `Target: ${fmtShort(m.date)}` : 'Reminder pribadi'),
      urgent: !!m.urgent, calDate: m.date||null, calDetails:m.note||'',
      onDone: () => animateAndRun('m'+m.id,
        () => setCustomReminders(list=>list.map(x=>x.id===m.id?{...x,done:true}:x)),
        `"${m.title}" ditandai selesai`,
        () => setCustomReminders(list=>list.map(x=>x.id===m.id?{...x,done:false}:x))),
      onDelete: () => animateAndRun('m'+m.id,
        () => setCustomReminders(list=>list.filter(x=>x.id!==m.id)),
        `"${m.title}" dihapus`,
        () => setCustomReminders(list=>[...list, m])),
      doneLabel:'✓ Selesai',
    }));

  // ── Completed / hidden reminders — kept as history, always restorable ──
  const doneChecklistItems = checklist.filter(c=>c.done).map(c=>({
    id:'c'+c.id, kind:'checklist', title:c.title, sub:`Kategori: ${c.category}`,
    onUndo: () => animateAndRun('done-c'+c.id,
      () => setChecklist(list=>list.map(x=>x.id===c.id?{...x,done:false}:x)),
      `"${c.title}" dikembalikan ke aktif`,
      () => setChecklist(list=>list.map(x=>x.id===c.id?{...x,done:true}:x))),
  }));
  const doneRundownItems = rundown.map((r,i)=>({r,i})).filter(({i})=>dismissed.includes('r'+i)).map(({r,i})=>({
    id:'r'+i, kind:'rundown', title:r.title, sub:r.time?`Pukul ${r.time}`:'Agenda hari-H',
    onUndo: () => animateAndRun('done-r'+i,
      () => setDismissed(d=>d.filter(x=>x!=='r'+i)),
      `"${r.title}" dikembalikan ke aktif`,
      () => setDismissed(d=>[...d,'r'+i])),
  }));
  const doneManualItems = customReminders.filter(m=>m.done).map(m=>({
    id:'m'+m.id, kind:'manual', title:m.title, sub:m.note||'Reminder pribadi',
    onUndo: () => animateAndRun('done-m'+m.id,
      () => setCustomReminders(list=>list.map(x=>x.id===m.id?{...x,done:false}:x)),
      `"${m.title}" dikembalikan ke aktif`,
      () => setCustomReminders(list=>list.map(x=>x.id===m.id?{...x,done:true}:x))),
  }));
  const doneAll = [...doneChecklistItems, ...doneRundownItems, ...doneManualItems];

  // ── Vendor payment due-date reminders — the #1 real risk (vendor cancel/deprioritize if final payment is late) ──
  const vendorItems = (vendors||[])
    .filter(v => v.status==='deal' && v.statusBayar!=='lunas' && v.jatuhTempoDisplay && !dismissed.includes('v'+v.id))
    .map(v => {
      const iso = displayToIso(v.jatuhTempoDisplay);
      const dueDays = daysUntil(iso);
      const overdue = dueDays!==null && dueDays<0;
      const soon = dueDays!==null && dueDays>=0 && dueDays<=7;
      const sisa = Math.max((Number(v.harga)||0) - (Number(v.dp)||0), 0);
      const prevStatus = v.statusBayar || 'belum_dp';
      const sub = overdue ? `⚠ Lewat jatuh tempo ${Math.abs(dueDays)} hari — sisa ${fmt(sisa)}`
        : dueDays===0 ? `Jatuh tempo hari ini — sisa ${fmt(sisa)}`
        : `Jatuh tempo ${fmtShort(iso)} — sisa ${fmt(sisa)}`;
      return {
        id:'v'+v.id, kind:'vendor', title:`Pelunasan ${v.name || v.cat}`,
        sub, urgent: overdue || soon, calDate: iso, calDetails: `Sisa pembayaran ke ${v.name||v.cat}: ${fmt(sisa)}`,
        onDone: () => animateAndRun('v'+v.id,
          () => setVendors(list=>list.map(x=>x.id===v.id?{...x,statusBayar:'lunas'}:x)),
          `Pembayaran ${v.name||v.cat} ditandai lunas`,
          () => setVendors(list=>list.map(x=>x.id===v.id?{...x,statusBayar:prevStatus}:x))),
        doneLabel:'✓ Tandai Lunas',
      };
    })
    .sort((a,b)=>(b.urgent?1:0)-(a.urgent?1:0));

  const allItems = [...checklistItems, ...rundownItems, ...manualItems, ...vendorItems];
  const urgentCount = checklistItems.filter(x=>x.urgent).length + manualItems.filter(x=>x.urgent).length + vendorItems.filter(x=>x.urgent).length;
  const days = daysUntil(data.tanggal);

  const filterTabs = [
    {id:'semua', label:'Semua', count:allItems.length},
    {id:'prioritas', label:'Prioritas Tinggi', count:urgentCount},
    {id:'checklist', label:'Checklist', count:checklistItems.length},
    {id:'rundown', label:'Rundown Hari-H', count:rundownItems.length},
    {id:'vendor', label:'Pembayaran Vendor', count:vendorItems.length},
    {id:'manual', label:'Manual', count:manualItems.length},
    {id:'selesai', label:'✓ Selesai', count:doneAll.length},
  ];

  const addManual = () => {
    if (!newTitle.trim()) return;
    setCustomReminders(list=>[...list, {
      id:Date.now(), title:newTitle.trim(), note:newNote.trim(),
      date: newDateDisplay ? displayToIso(newDateDisplay) : null, urgent:newUrgent, done:false,
    }]);
    setNewTitle(''); setNewNote(''); setNewDateDisplay(''); setNewUrgent(false); setShowAddForm(false);
  };

  const KIND_STYLE = {
    checklist: {bg:'var(--sage-light)', color:'var(--sage-dark)', label:'Checklist'},
    rundown:   {bg:'var(--gold-light)', color:'#8a6d42', label:'Rundown'},
    manual:    {bg:'#E3EEF4', color:'#3d6a80', label:'Manual'},
    vendor:    {bg:'#F3E8F5', color:'#7d4a8f', label:'Vendor'},
  };

  const renderCard = (it) => {
    const leaving = !!leavingIds[it.id];
    return (
      <div key={it.id} className="card p-4" style={{
        transition:'opacity .28s ease, transform .28s ease',
        opacity: leaving?0:1, transform: leaving?'scale(.96)':'scale(1)',
        pointerEvents: leaving?'none':'auto',
      }}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={it.urgent?{background:'var(--rust-light)',color:'var(--rust)'}:{background:KIND_STYLE[it.kind].bg,color:KIND_STYLE[it.kind].color}}>{Ic.bell}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="badge" style={{background:KIND_STYLE[it.kind].bg,color:KIND_STYLE[it.kind].color,border:'1px solid rgba(0,0,0,.06)'}}>{KIND_STYLE[it.kind].label}</span>
              {it.urgent && <span className="badge badge-rust">Prioritas</span>}
            </div>
            <h4 className="font-semibold text-sm" style={{color:'var(--sage-deep)'}}>{it.title}</h4>
            <p className="text-xs mt-0.5" style={{color:'#9db09f'}}>{it.sub}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <a href={gcalLink(it.title, it.calDate, it.calDetails)} target="_blank" rel="noopener noreferrer"
            className="btn-sm flex-1 flex items-center justify-center gap-1.5 text-center" style={{background:'var(--sage-dark)',color:'white',textDecoration:'none'}}>
            {Ic.cal} Tambah ke Calendar
          </a>
          <button onClick={it.onDone} className="btn-sm" style={{background:'var(--sage-mist)',color:'#7a9482',whiteSpace:'nowrap'}}>{it.doneLabel}</button>
          {it.onDelete && (
            <button onClick={it.onDelete} className="btn-sm" style={{background:'var(--rust-light)',color:'var(--rust)'}} title="Hapus permanen">{Ic.trash}</button>
          )}
        </div>
      </div>
    );
  };

  const renderDoneCard = (it) => {
    const leaving = !!leavingIds['done-'+it.id];
    return (
      <div key={it.id} className="card p-4 flex items-center justify-between gap-3" style={{
        transition:'opacity .28s ease, transform .28s ease',
        opacity: leaving?0:1, transform: leaving?'scale(.96)':'scale(1)',
        pointerEvents: leaving?'none':'auto',
      }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{background:'var(--sage-light)',color:'var(--sage-dark)'}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{color:'var(--sage-deep)', textDecoration:'line-through', opacity:.65}}>{it.title}</p>
            <p className="text-xs" style={{color:'#9db09f'}}>{it.sub}</p>
          </div>
        </div>
        <button onClick={it.onUndo} className="btn-sm shrink-0" style={{background:'var(--sage-mist)',color:'var(--sage-dark)',whiteSpace:'nowrap'}}>↺ Batalkan</button>
      </div>
    );
  };

  const EmptyState = ({ text }) => (
    <div className="card p-8 text-center">
      <div className="text-4xl mb-3">🔔</div>
      <p className="text-sm" style={{color:'#9db09f'}}>{text||'Tidak ada reminder di sini.'}</p>
    </div>
  );

  return (
    <div>
      <PageHeader title="Reminder" subtitle="Pengingat otomatis dari checklist & rundown, plus reminder pribadi kalian" onBack={onBack}
        right={
          <button onClick={()=>setShowAddForm(s=>!s)} className="text-xs font-bold text-white px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap" style={{background:'var(--sage-dark)'}}>
            {Ic.plus} Reminder Manual
          </button>
        }/>

      {/* Ringkasan */}
      <div className="grid grid-cols-3 gap-2.5 mt-4 mb-4 lg:max-w-md">
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{allItems.length}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Reminder Aktif</p></div>
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--rust)'}}>{urgentCount}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Prioritas Tinggi</p></div>
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{days!==null && days>=0 ? days : '—'}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Hari Menuju Hari‑H</p></div>
      </div>

      {/* Penjelasan fitur — supaya client tidak bingung */}
      <div className="card p-4 mb-4" style={{background:'var(--sage-mist)',border:'1px solid var(--sage-light)'}}>
        <div style={{display:'flex',gap:'10px'}}>
          <div style={{width:'26px',height:'26px',borderRadius:'50%',background:'white',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:'var(--sage-dark)'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <p style={{fontSize:'11.5px',color:'#5a7a5d',lineHeight:1.7}}>
            Klik <strong>"Tandai Selesai"</strong> untuk mencentang checklist aslinya (sinkron ke halaman Checklist), atau <strong>"Tandai Lunas"</strong> pada pengingat vendor untuk update status pembayaran di halaman Vendor. Kartu akan memudar sebentar lalu pindah ke tab <strong>"✓ Selesai"</strong> — <strong>tidak hilang permanen</strong>, kalau salah klik ada tombol <strong>"Urungkan"</strong> yang muncul di bawah layar, atau buka tab Selesai kapan saja untuk mengembalikannya. Klik <strong>"Tambah ke Calendar"</strong> untuk simpan ke Google Calendar pribadi.
          </p>
        </div>
      </div>

      {/* Form tambah reminder manual */}
      {showAddForm && (
        <div className="card p-5 mb-4 anim-fadeup">
          <span className="text-[10px] font-bold tracking-widest uppercase block mb-3" style={{color:'var(--sage)'}}>Tambah Reminder Manual</span>
          <div className="space-y-3">
            <div><label className="lbl text-xs">Judul</label><input className="inp" value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Contoh: Follow up MUA soal jadwal fitting"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="lbl text-xs">Catatan (opsional)</label><input className="inp" value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Detail tambahan"/></div>
              <div><label className="lbl text-xs">Tanggal (opsional)</label><DateField value={newDateDisplay} onChange={setNewDateDisplay} placeholder="DD/MM/YYYY"/></div>
            </div>
            <div>
              <label className="lbl text-xs">Tingkat Prioritas</label>
              <div className="flex gap-2">
                <button onClick={()=>setNewUrgent(false)} className="flex-1 py-2 rounded-xl text-xs font-bold transition-all" style={!newUrgent?{background:'var(--sage-dark)',color:'white'}:{background:'var(--sage-mist)',color:'#9db09f'}}>Biasa</button>
                <button onClick={()=>setNewUrgent(true)} className="flex-1 py-2 rounded-xl text-xs font-bold transition-all" style={newUrgent?{background:'var(--rust)',color:'white'}:{background:'var(--sage-mist)',color:'#9db09f'}}>Prioritas Tinggi</button>
              </div>
            </div>
            <button onClick={addManual} className="btn-sage">+ Tambah Reminder</button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {filterTabs.map(t=>(
          <button key={t.id} onClick={()=>setFilter(t.id)} className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
            style={filter===t.id?{background:'var(--sage-dark)',color:'white'}:{background:'white',color:'#7a9482',border:'1px solid var(--sage-mid)'}}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="lg:max-w-2xl">
        {filter==='semua' && (
          allItems.length===0 ? <EmptyState text="Tidak ada reminder aktif saat ini. Kerja bagus! 🎉"/> : (
            <>
              {allItems.filter(x=>x.urgent).length>0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2 px-1" style={{color:'var(--rust)'}}>⚡ Prioritas Tinggi</p>
                  <div className="space-y-3">{allItems.filter(x=>x.urgent).map(renderCard)}</div>
                </div>
              )}
              {checklistItems.filter(x=>!x.urgent).length>0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2 px-1" style={{color:'var(--sage)'}}>📋 Checklist Berjalan</p>
                  <div className="space-y-3">{checklistItems.filter(x=>!x.urgent).map(renderCard)}</div>
                </div>
              )}
              {rundownItems.length>0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2 px-1" style={{color:'#8a6d42'}}>🕒 Agenda Hari‑H</p>
                  <div className="space-y-3">{rundownItems.map(renderCard)}</div>
                </div>
              )}
              {vendorItems.filter(x=>!x.urgent).length>0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2 px-1" style={{color:'#7d4a8f'}}>💳 Pembayaran Vendor</p>
                  <div className="space-y-3">{vendorItems.filter(x=>!x.urgent).map(renderCard)}</div>
                </div>
              )}
              {manualItems.length>0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2 px-1" style={{color:'#3d6a80'}}>📌 Reminder Manual</p>
                  <div className="space-y-3">{manualItems.map(renderCard)}</div>
                </div>
              )}
            </>
          )
        )}
        {filter==='prioritas' && (
          <div className="space-y-3">{allItems.filter(x=>x.urgent).length===0 ? <EmptyState text="Tidak ada reminder prioritas tinggi saat ini."/> : allItems.filter(x=>x.urgent).map(renderCard)}</div>
        )}
        {filter==='checklist' && (
          <div className="space-y-3">{checklistItems.length===0 ? <EmptyState text="Semua checklist sudah selesai! 🎉"/> : checklistItems.map(renderCard)}</div>
        )}
        {filter==='rundown' && (
          <div className="space-y-3">{rundownItems.length===0 ? <EmptyState text="Belum ada agenda rundown."/> : rundownItems.map(renderCard)}</div>
        )}
        {filter==='vendor' && (
          <div className="space-y-3">{vendorItems.length===0 ? <EmptyState text="Tidak ada pembayaran vendor yang perlu diperhatikan saat ini."/> : vendorItems.map(renderCard)}</div>
        )}
        {filter==='manual' && (
          <div className="space-y-3">{manualItems.length===0 ? <EmptyState text="Belum ada reminder manual. Tambahkan lewat tombol di atas."/> : manualItems.map(renderCard)}</div>
        )}
        {filter==='selesai' && (
          <div className="space-y-3">{doneAll.length===0 ? <EmptyState text="Belum ada riwayat reminder yang selesai."/> : doneAll.map(renderDoneCard)}</div>
        )}
      </div>

      {/* Toast — konfirmasi aksi + tombol urungkan, supaya tidak ada yang hilang tanpa jejak */}
      {toast && (
        <div className="anim-fadeup" style={{
          position:'fixed', bottom:'22px', left:'50%', transform:'translateX(-50%)', zIndex:200,
          background:'var(--sage-deep)', color:'white', padding:'13px 18px', borderRadius:'14px',
          display:'flex', alignItems:'center', gap:'16px', boxShadow:'0 10px 30px rgba(0,0,0,.28)',
          maxWidth:'92vw',
        }}>
          <span style={{fontSize:'13px',display:'flex',alignItems:'center',gap:'8px'}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            {toast.label}
          </span>
          <button onClick={toast.undo} style={{background:'none',border:'none',color:'#E9D9BC',fontWeight:700,fontSize:'13px',cursor:'pointer',whiteSpace:'nowrap'}}>Urungkan</button>
        </div>
      )}
    </div>
  );
}

