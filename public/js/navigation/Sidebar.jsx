/* ═══════════════ SIDEBAR (desktop) ═══════════════ */
function Sidebar({ page, goPage, user, onLogout }) {
  const primary = [
    {id:'dashboard', label:'Dashboard', sub:'Ringkasan utama', icon:Ic.home},
    {id:'panduan', label:'Panduan', sub:'Cara mulai', icon:Ic.guide},
    {id:'checklist', label:'Checklist', sub:'Tugas persiapan', icon:Ic.check},
    {id:'budget', label:'Budget', sub:'Biaya & pembayaran', icon:Ic.budget},
    {id:'vendor', label:'Vendor', sub:'Kontak & deal', icon:Ic.vendor},
    {id:'tamu', label:'Tamu', sub:'Undangan & RSVP', icon:Ic.guest},
    {id:'rundown', label:'Rundown', sub:'Agenda hari-H', icon:Ic.rundown},
    {id:'seserahan', label:'Seserahan', sub:'Mahar & hantaran', icon:Ic.gift},
    {id:'dokumen', label:'Dokumen', sub:'File penting', icon:Ic.doc},
    {id:'reminder', label:'Reminder', sub:'Pengingat acara', icon:Ic.bell},
    {id:'moodboard', label:'Moodboard', sub:'Inspirasi & warna', icon:Ic.mood},
  ];
  return (
    <aside className="hidden lg:flex flex-col w-[280px] shrink-0 h-full border-r custom-scroll overflow-y-auto" style={{borderColor:'var(--sage-light)',background:'var(--cream)'}}>
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <RingsIcon size={26} color="var(--sage-dark)"/>
          <span className="font-serif text-lg font-bold tracking-wide" style={{color:'var(--sage-deep)'}}>Janji Suci</span>
        </div>
        <p className="text-xs" style={{color:'#9db09f'}}>Wedding Planner</p>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {primary.map(item=>(
          <div key={item.id} className={`side-link ${page===item.id?'active':''}`} onClick={()=>goPage(item.id)}>
            {item.icon}
            <div className="min-w-0">
              <p className="leading-tight truncate">{item.label}</p>
              <p className="text-[11px] font-normal opacity-70 truncate">{item.sub}</p>
            </div>
          </div>
        ))}
      </nav>
      <div className="px-4 pb-6 pt-4 border-t" style={{borderColor:'var(--sage-light)'}}>
        <div className={`side-link ${page==='profil'?'active':''}`} onClick={()=>goPage('profil')}>
          {Ic.profil}
          <div className="min-w-0"><p className="leading-tight truncate">{user.nama}</p><p className="text-[11px] font-normal opacity-70 truncate">Profil & Pengaturan</p></div>
        </div>
        <div className="side-link mt-1" onClick={onLogout} style={{color:'var(--rust)'}}>{Ic.logout}<p>Keluar</p></div>
      </div>
    </aside>
  );
}

