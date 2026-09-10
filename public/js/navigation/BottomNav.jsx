/* ═══════════════ BOTTOM NAV (mobile) ═══════════════ */
function BottomNav({ active, goPage }) {
  const secondarySet = ['panduan','vendor','rundown','seserahan','dokumen','reminder','moodboard','profil'];
  const tabs = [
    { id:'dashboard', label:'Beranda', icon: Ic.home },
    { id:'checklist', label:'Checklist', icon: Ic.check },
    { id:'budget', label:'Budget', icon: Ic.budget },
    { id:'tamu', label:'Tamu', icon: Ic.guest },
    { id:'more', label:'Lainnya', icon: Ic.more },
  ];
  const isMoreActive = secondarySet.includes(active) || active==='more';
  return (
    <div className="lg:hidden bnav">
      {tabs.map(t=>{
        const isActive = t.id==='more' ? isMoreActive : active===t.id;
        return (
          <button key={t.id} className={`bnav-btn ${isActive?'active':'inactive'}`} onClick={()=>goPage(t.id)}>
            {t.icon}<span>{t.label}</span>
            {isActive && <div style={{width:14,height:2.5,borderRadius:99,background:'var(--sage-dark)'}}/>}
          </button>
        );
      })}
    </div>
  );
}

