/* ═══════════════ SCREEN: LOADING ═══════════════ */
function LoadingScreen({ step }) {
  const msgs = ['Menyiapkan wedding project…','Membuat checklist pernikahan…','Menyusun rundown hari‑H…','Menata halaman dashboard…'];
  const pct = ((step+1)/msgs.length)*100;
  return (
    <div className="flex flex-col items-center justify-center h-full w-full absolute inset-0" style={{background:'var(--cream)'}}>
      <div className="mb-8 anim-float" style={{position:'relative',width:'100px',height:'100px'}}>
        {/* Outer soft ring */}
        <svg width="100" height="100" viewBox="0 0 100 100" style={{position:'absolute',inset:0}}>
          <circle cx="50" cy="50" r="48" fill="none" stroke="var(--sage-light)" strokeWidth="2"/>
        </svg>
        {/* Spinning gradient arc */}
        <svg width="100" height="100" viewBox="0 0 100 100" style={{position:'absolute',inset:0}} className="anim-spin">
          <defs>
            <linearGradient id="loadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--sage)" stopOpacity="0"/>
              <stop offset="100%" stopColor="var(--sage-dark)" stopOpacity="1"/>
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#loadGrad)" strokeWidth="2.5" strokeDasharray="120 180" strokeLinecap="round"/>
        </svg>
        {/* Small gold accent dot orbiting */}
        <svg width="100" height="100" viewBox="0 0 100 100" style={{position:'absolute',inset:0,animationDuration:'1.1s'}} className="anim-spin">
          <circle cx="50" cy="4" r="3" fill="var(--gold)"/>
        </svg>
        {/* Center — Janji Suci logo */}
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{width:'66px',height:'66px',borderRadius:'50%',background:'white',
            boxShadow:'0 4px 18px rgba(38,58,41,.12)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <RingsIcon size={32} color="var(--sage-dark)"/>
          </div>
        </div>
      </div>
      <span className="badge badge-sage mb-4">JANJI SUCI</span>
      <h2 className="font-serif text-2xl font-bold italic mb-2" style={{color:'var(--sage-deep)'}}>Mempersiapkan hari bahagia…</h2>
      <div className="w-56 prog-track my-4"><div className="prog-fill" style={{width:`${pct}%`}}/></div>
      <p className="text-sm" style={{color:'#9db09f',animation:'pulse 2s ease infinite'}}>{msgs[Math.min(step,msgs.length-1)]}</p>
    </div>
  );
}

