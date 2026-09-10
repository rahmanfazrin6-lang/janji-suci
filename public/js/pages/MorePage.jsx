/* ═══════════════ MORE GRID (mobile only) ═══════════════ */
function MorePage({ goPage }) {
  const items = [
    { id:'panduan', label:'Panduan', icon: Ic.guide },
    { id:'vendor', label:'Vendor', icon: Ic.vendor },
    { id:'rundown', label:'Rundown', icon: Ic.rundown },
    { id:'seserahan', label:'Seserahan', icon: Ic.gift },
    { id:'dokumen', label:'Dokumen', icon: Ic.doc },
    { id:'reminder', label:'Reminder', icon: Ic.bell },
    { id:'moodboard', label:'Moodboard', icon: Ic.mood },
    { id:'profil', label:'Profil', icon: Ic.profil },
  ];
  return (
    <div>
      <PageHeader title="Lainnya" subtitle="Semua fitur pendukung wedding project"/>
      <div className="grid grid-cols-3 gap-3 mt-4">
        {items.map(it=>(
          <div key={it.id} className="grid-menu-item" onClick={()=>goPage(it.id)}>
            <div className="w-12 h-12 mx-auto mb-2 rounded-2xl flex items-center justify-center" style={{background:'var(--sage-light)',color:'var(--sage-dark)'}}>{it.icon}</div>
            <p className="text-xs font-semibold leading-tight" style={{color:'var(--sage-deep)'}}>{it.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

