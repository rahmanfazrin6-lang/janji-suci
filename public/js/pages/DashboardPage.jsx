/* ═══════════════ DASHBOARD PAGE ═══════════════ */
function DashboardPage({ data, checklist, rundown, guests, vendors, docs, seserahan, budgetItems, onSetup, goPage }) {
  const days = daysUntil(data.tanggal);
  const done = checklist.filter(c=>c.done).length, total = checklist.length;
  const pct = total>0 ? Math.round(done/total*100) : 0;
  const urgent = checklist.filter(c=>!c.done&&c.urgent).slice(0,3);
  const name = `${data.namaW||'Mempelai'} & ${data.namaP||'Mempelai'}`;
  const totalGuests = guests.reduce((a,g)=>a+(Number(g.jumlah)||1),0);
  const confirmedGuests = guests.filter(g=>g.status==='hadir').reduce((a,g)=>a+(Number(g.jumlah)||1),0);

  const vendorList = vendors || [];
  const dealCount = vendorList.filter(v=>v.status==='deal').length;
  const belumLunasCount = vendorList.filter(v=>v.status==='deal' && v.statusBayar!=='lunas').length;

  const docList = docs || [];
  const docsPct = docList.length ? Math.round(docList.filter(d=>d.done).length/docList.length*100) : 0;

  const seserahanList = seserahan || [];
  const seserahanPct = seserahanList.length ? Math.round(seserahanList.filter(s=>s.status==='sudah').length/seserahanList.length*100) : 0;

  const quickActions = [
    { label:'Tambah Tamu', page:'tamu', icon: Ic.guest },
    { label:'Catat Budget', page:'budget', icon: Ic.budget },
    { label:'Checklist', page:'checklist', icon: Ic.check },
    { label:'Panduan', page:'panduan', icon: Ic.guide },
  ];

  const allModules = [
    { label:'Panduan', page:'panduan', icon: Ic.guide },
    { label:'Checklist', page:'checklist', icon: Ic.check },
    { label:'Budget', page:'budget', icon: Ic.budget },
    { label:'Vendor', page:'vendor', icon: Ic.vendor },
    { label:'Tamu', page:'tamu', icon: Ic.guest },
    { label:'Rundown', page:'rundown', icon: Ic.rundown },
    { label:'Seserahan', page:'seserahan', icon: Ic.gift },
    { label:'Dokumen', page:'dokumen', icon: Ic.doc },
    { label:'Reminder', page:'reminder', icon: Ic.bell },
    { label:'Moodboard', page:'moodboard', icon: Ic.mood },
    { label:'Profil', page:'profil', icon: Ic.profil },
  ];

  return (
    <div className="pb-4">
      <div className="relative overflow-hidden px-6 lg:px-10 pt-14 lg:pt-10 pb-14 lg:pb-10 lg:rounded-[28px] lg:mx-0 shrink-0" style={{background:'linear-gradient(140deg, var(--sage) 0%, var(--sage-dark) 60%, var(--sage-deep) 100%)'}}>
        <HeroOrnament/>
        <div className="relative z-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <span className="badge mb-3 inline-block" style={{background:'rgba(255,255,255,.18)',color:'white',border:'1px solid rgba(255,255,255,.2)'}}>Wedding Planner</span>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-white leading-snug mb-1">{name}</h1>
            <p className="text-white/60 text-xs lg:text-sm mb-4">{fmtDate(data.tanggal)||'Tanggal belum diset'}{data.namaVenue?` • ${data.namaVenue}`:''}</p>
            <div className="flex flex-wrap gap-2">
              {data.warna && <span className="badge" style={{background:'rgba(255,255,255,.15)',color:'white',border:'1px solid rgba(255,255,255,.15)'}}>{data.warna}</span>}
              {data.tema && <span className="badge" style={{background:'rgba(255,255,255,.15)',color:'white',border:'1px solid rgba(255,255,255,.15)'}}>{data.tema}</span>}
            </div>
          </div>
          <div className="rounded-2xl py-7 px-8 text-center mt-6 lg:mt-0 shrink-0" style={{background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.14)'}}>
            {days!==null ? <>
              <div className="font-serif text-5xl italic text-white mb-0.5">{days>0?days:'🎉'}</div>
              <div className="text-[9px] font-bold tracking-[.2em] uppercase text-white/60 mb-1">{days>0?'HARI LAGI':'HARI INI!'}</div>
              <div className="text-white/60 text-xs">Menuju hari bahagia</div>
            </> : <div className="text-white/50 text-sm py-2">Atur tanggal di Setup</div>}
          </div>
        </div>
      </div>

      <div className="px-5 lg:px-0 -mt-5 lg:mt-6 relative z-20 space-y-3 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
        {/* Quick actions + stats — satu card bersih */}
        <div className="anim-fadeup lg:col-span-3" style={{background:'white',borderRadius:'22px',padding:'20px',boxShadow:'0 2px 16px rgba(38,58,41,.06)',border:'1px solid rgba(107,143,110,.1)'}}>
          {/* Quick action row */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'6px',marginBottom:'16px',paddingBottom:'16px',borderBottom:'1px solid var(--sage-mist)'}}>
            {quickActions.map(qa=>(
              <button key={qa.label} onClick={()=>goPage(qa.page)}
                style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'7px',
                  padding:'10px 6px',borderRadius:'14px',border:'none',background:'none',
                  cursor:'pointer',transition:'background .15s'}}
                onMouseEnter={e=>e.currentTarget.style.background='var(--sage-mist)'}
                onMouseLeave={e=>e.currentTarget.style.background='none'}>
                <div style={{width:'42px',height:'42px',borderRadius:'50%',display:'flex',
                  alignItems:'center',justifyContent:'center',background:'var(--sage-light)',
                  color:'var(--sage-dark)',flexShrink:0}}>
                  {qa.icon}
                </div>
                <span style={{fontSize:'11px',fontWeight:600,textAlign:'center',lineHeight:1.3,
                  color:'var(--sage-deep)',display:'block'}}>
                  {qa.label}
                </span>
              </button>
            ))}
          </div>
          {/* Stats row */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px'}}>
            {[
              {val:`${pct}%`, label:'Checklist'},
              {val:confirmedGuests, label:'Tamu Hadir'},
              {val:totalGuests, label:'Diundang'},
            ].map(s=>(
              <div key={s.label} style={{background:'var(--sage-mist)',borderRadius:'12px',padding:'12px',textAlign:'center'}}>
                <p className="font-serif" style={{fontSize:'22px',fontWeight:700,color:'var(--sage-deep)',lineHeight:1}}>{s.val}</p>
                <p style={{fontSize:'10px',color:'#7a9482',marginTop:'4px'}}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 anim-fadeup lg:col-span-2">
          <div className="flex justify-between items-end mb-3">
            <div><span className="text-[10px] font-bold tracking-widest uppercase" style={{color:'var(--sage)'}}>Progress Checklist</span>
              <h3 className="font-serif text-xl font-bold mt-0.5" style={{color:'var(--sage-deep)'}}>{pct}% Selesai</h3></div>
            <span className="font-bold text-xl" style={{color:'var(--sage)'}}>{done}/{total}</span>
          </div>
          <div className="prog-track"><div className="prog-fill" style={{width:`${pct}%`}}/></div>
          <p className="text-xs mt-2" style={{color:'#9db09f'}}>{total-done} item belum selesai</p>
        </div>

        {data.budget && (
          <div className="card p-5 anim-fadeup">
            <span className="text-[10px] font-bold tracking-widest uppercase block mb-0.5" style={{color:'var(--sage)'}}>Target Budget</span>
            <p className="font-serif text-xl font-bold mb-3" style={{color:'var(--sage-deep)'}}>{fmt(data.budget)}</p>
            <div className="flex gap-3">
              <div className="flex-1 rounded-xl p-3 text-center" style={{background:'var(--sage-mist)'}}><p className="text-xs mb-0.5" style={{color:'#9db09f'}}>Tamu</p><p className="font-bold" style={{color:'var(--sage-dark)'}}>{data.tamu||'—'}</p></div>
              <div className="flex-1 rounded-xl p-3 text-center" style={{background:'var(--sage-mist)'}}><p className="text-xs mb-0.5" style={{color:'#9db09f'}}>Per Tamu</p><p className="font-bold text-sm" style={{color:'var(--sage-dark)'}}>{data.budget&&data.tamu?fmt(Math.round(data.budget/data.tamu)):'—'}</p></div>
            </div>
          </div>
        )}

        {/* Vendor & Pembayaran — deal & pelunasan sekilas */}
        <div className="card p-5 anim-fadeup cursor-pointer" onClick={()=>goPage('vendor')}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{color:'var(--sage)'}}>Vendor &amp; Pembayaran</span>
            <span style={{color:'var(--sage-mid)'}}>{Ic.chevron}</span>
          </div>
          <p className="text-xs mb-4" style={{color:'#9db09f'}}>Kontrol status deal dan pelunasan vendor.</p>
          <div className="flex gap-3">
            <div className="flex-1 rounded-xl p-3 text-center" style={{background:'var(--sage-mist)'}}>
              <p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{dealCount}<span className="text-sm font-normal" style={{color:'#9db09f'}}>/{vendorList.length}</span></p>
              <p className="text-xs mt-0.5" style={{color:'#9db09f'}}>Vendor Deal</p>
            </div>
            <div className="flex-1 rounded-xl p-3 text-center" style={{background: belumLunasCount>0 ? 'var(--rust-light)' : 'var(--sage-mist)'}}>
              <p className="font-serif text-xl font-bold" style={{color: belumLunasCount>0?'var(--rust)':'var(--sage-deep)'}}>{belumLunasCount}</p>
              <p className="text-xs mt-0.5" style={{color: belumLunasCount>0?'var(--rust)':'#9db09f'}}>Belum Lunas</p>
            </div>
          </div>
        </div>

        {/* Dokumen & Seserahan — kelengkapan sekilas */}
        <div className="card p-5 anim-fadeup">
          <span className="text-[10px] font-bold tracking-widest uppercase block mb-3" style={{color:'var(--sage)'}}>Dokumen &amp; Seserahan</span>
          <div className="flex gap-3">
            <button onClick={()=>goPage('dokumen')} className="flex-1 rounded-xl p-3 text-center" style={{background:'var(--sage-mist)',border:'none',cursor:'pointer'}}>
              <p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{docsPct}%</p>
              <p className="text-xs mt-0.5" style={{color:'#9db09f'}}>Dokumen Lengkap</p>
            </button>
            <button onClick={()=>goPage('seserahan')} className="flex-1 rounded-xl p-3 text-center" style={{background:'var(--sage-mist)',border:'none',cursor:'pointer'}}>
              <p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{seserahanPct}%</p>
              <p className="text-xs mt-0.5" style={{color:'#9db09f'}}>Seserahan Siap</p>
            </button>
          </div>
        </div>

        {urgent.length>0 && (
          <div className="card p-5 anim-fadeup lg:col-span-2">
            <span className="badge badge-rust mb-3">Perlu Perhatian</span>
            <h3 className="font-serif text-lg font-bold mb-1" style={{color:'var(--sage-deep)'}}>Ada {urgent.length} hal yang perlu dicek</h3>
            <p className="text-xs mb-4" style={{color:'#9db09f'}}>Prioritaskan agar persiapan tetap terkendali.</p>
            <div className="space-y-3">
              {urgent.map((it,i)=>(
                <div key={i} className="pl-3 py-0.5" style={{borderLeft:'3px solid var(--rust)'}}>
                  <p className="font-semibold text-sm" style={{color:'var(--sage-deep)'}}>{it.title}</p>
                  <p className="text-xs mt-0.5" style={{color:'#9db09f'}}>{it.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {rundown.length>0 && (
          <div className="card p-5 anim-fadeup">
            <span className="text-[10px] font-bold tracking-widest uppercase block mb-0.5" style={{color:'var(--sage)'}}>Rundown Hari‑H</span>
            <h3 className="font-serif text-lg font-bold mb-4" style={{color:'var(--sage-deep)'}}>Agenda Utama</h3>
            <div className="space-y-3">
              {rundown.slice(0,4).map((it,i)=>(
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-xs font-bold text-white px-2.5 py-1 rounded-lg shrink-0" style={{background:'var(--sage-dark)'}}>{it.time}</span>
                  <div><p className="font-semibold text-sm leading-tight" style={{color:'var(--sage-deep)'}}>{it.title}</p>{it.note && <p className="text-xs mt-0.5" style={{color:'#9db09f'}}>{it.note}</p>}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card p-5 anim-fadeup lg:col-span-3">
          <span className="text-[10px] font-bold tracking-widest uppercase block mb-3" style={{color:'var(--sage)'}}>Info Pernikahan</span>
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            {[['Akad / Pemberkatan',data.jamAkad||'—'],['Resepsi',data.jamResepsi||'—'],['Venue',data.namaVenue||'—'],['WO',data.wo||'—'],['Kontak',data.kontak||'—']].map(([l,v])=>(
              <div key={l} className="flex justify-between items-center py-2.5" style={{borderBottom:'1px solid var(--sage-mist)'}}>
                <span className="text-sm" style={{color:'#9db09f'}}>{l}</span>
                <span className="text-sm font-semibold text-right max-w-[60%]" style={{color:'var(--sage-deep)'}}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="btn-outline lg:col-span-3" onClick={onSetup}>✎ Edit Setup Wedding</button>
      </div>
    </div>
  );
}

