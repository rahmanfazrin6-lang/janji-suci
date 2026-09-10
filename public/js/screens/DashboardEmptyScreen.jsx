/* ═══════════════ SCREEN: DASHBOARD EMPTY ═══════════════ */
function DashboardEmptyScreen({ user, onSetup, onLogout }) {
  return (
    <div style={{display:'flex',flexDirection:'column',minHeight:'100vh',background:'var(--sage-mist)'}}>

      {/* ── Desktop: two-column layout ── */}
      <div style={{display:'none'}} className="lg-flex-layout">
        {/* Left panel — hero */}
        <div style={{flex:'0 0 45%',position:'relative',overflow:'hidden',
          background:'linear-gradient(160deg, var(--sage) 0%, var(--sage-dark) 55%, var(--sage-deep) 100%)',
          display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'48px 48px 52px',minHeight:'100vh'}}>
          <HeroOrnament/>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'0'}}>
              <RingsIcon size={28} color="white"/>
              <span className="font-serif" style={{color:'white',fontSize:'18px',fontWeight:700}}>Janji Suci</span>
            </div>
          </div>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{marginBottom:'32px',opacity:.8}}>
              <Wreath size={160} color="rgba(255,255,255,.55)" accent="#E9D9BC"/>
            </div>
            <p style={{color:'rgba(255,255,255,.7)',fontSize:'13px',marginBottom:'4px'}}>Selamat datang,</p>
            <h1 className="font-serif" style={{color:'white',fontSize:'36px',fontWeight:700,lineHeight:1.2,marginBottom:'12px'}}>
              Halo, {user.nama} 👋
            </h1>
            <p style={{color:'rgba(255,255,255,.65)',fontSize:'14px',lineHeight:1.7,maxWidth:'320px'}}>
              Rencanakan hari bahagia kalian dengan tenang — checklist, budget, vendor, tamu, semua tersusun rapi.
            </p>
          </div>
          <div style={{position:'relative',zIndex:1}}>
            <button onClick={onLogout} style={{color:'rgba(255,255,255,.55)',background:'none',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600}}>Logout</button>
          </div>
        </div>

        {/* Right panel — CTA */}
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          padding:'48px 64px',overflowY:'auto',background:'var(--cream)'}}>
          <div style={{width:'100%',maxWidth:'420px'}}>
            <div style={{textAlign:'center',marginBottom:'32px'}}>
              <div className="anim-float" style={{display:'inline-block',marginBottom:'24px'}}>
                <svg width="100" height="100" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="56" fill="var(--sage-light)" stroke="var(--sage-mid)" strokeWidth="1.5"/>
                  <Bloom cx={60} cy={60} r={44} opacity={.2}/>
                  <Bloom cx={60} cy={60} r={24} color="#B99A6B" opacity={.3}/>
                  <Leaf x={60} y={102} rot={0} size={1.1} opacity={.5}/>
                  <Leaf x={102} y={60} rot={90} size={.9} opacity={.4}/>
                  <Leaf x={18} y={60} rot={-90} size={.9} opacity={.4}/>
                  <circle cx="60" cy="60" r="10" fill="var(--sage-dark)"/>
                  <path d="M55,60 L58,63 L65,56" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <span className="badge badge-gold" style={{marginBottom:'16px'}}>WEDDING PROJECT</span>
              <h2 className="font-serif" style={{fontSize:'28px',fontWeight:700,color:'var(--sage-deep)',lineHeight:1.3,margin:'12px 0 8px'}}>
                Mulai Perjalanan<br/>Pernikahan Kalian
              </h2>
              <p style={{fontSize:'14px',color:'#7a9482',lineHeight:1.7}}>
                Setup wedding project dan biarkan Janji Suci menyiapkan checklist, rundown, budget, dan semua yang kalian butuhkan.
              </p>
            </div>
            <button className="btn-sage" onClick={onSetup} style={{fontSize:'16px',padding:'16px'}}>
              ✦ Setup Wedding Project
            </button>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginTop:'20px'}}>
              {[
                {icon:'✓','text':'Checklist otomatis'},
                {icon:'📅','text':'Rundown hari-H'},
                {icon:'💰','text':'Pantau budget'},
                {icon:'👥','text':'Manajemen tamu'},
              ].map(f=>(
                <div key={f.text} style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 12px',
                  background:'var(--sage-mist)',borderRadius:'12px',fontSize:'13px',color:'var(--sage-dark)',fontWeight:500}}>
                  <span>{f.icon}</span><span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: stacked layout ── */}
      <div className="lg-hidden-layout" style={{display:'flex',flexDirection:'column',minHeight:'100vh'}}>
        {/* Hero header — compact */}
        <div style={{position:'relative',overflow:'hidden',padding:'52px 24px 28px',flexShrink:0,
          background:'linear-gradient(140deg, var(--sage) 0%, var(--sage-dark) 60%, var(--sage-deep) 100%)'}}>
          <HeroOrnament/>
          <div style={{position:'relative',zIndex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'16px'}}>
              <span className="badge" style={{background:'rgba(255,255,255,.18)',color:'white',border:'1px solid rgba(255,255,255,.2)'}}>WEDDING PLANNER</span>
              <button onClick={onLogout} style={{color:'rgba(255,255,255,.65)',background:'none',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600}}>Logout</button>
            </div>
            <p style={{color:'rgba(255,255,255,.7)',fontSize:'12px',marginBottom:'2px'}}>Selamat datang,</p>
            <h1 className="font-serif" style={{color:'white',fontSize:'28px',fontWeight:700}}>Halo, {user.nama} 👋</h1>
          </div>
        </div>

        {/* Content — scrollable */}
        <div style={{flex:1,overflowY:'auto',padding:'24px 20px 40px',display:'flex',flexDirection:'column',alignItems:'center'}}>
          <div className="anim-float" style={{marginBottom:'20px'}}>
            <svg width="90" height="90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="56" fill="white" stroke="#e3eee2" strokeWidth="2"/>
              <Bloom cx={60} cy={60} r={44} opacity={.18}/>
              <Bloom cx={60} cy={60} r={24} color="#B99A6B" opacity={.28}/>
              <Leaf x={60} y={102} rot={0} size={1.1} opacity={.5}/>
              <Leaf x={102} y={60} rot={90} size={.9} opacity={.4}/>
              <Leaf x={18} y={60} rot={-90} size={.9} opacity={.4}/>
              <circle cx="60" cy="60" r="10" fill="var(--sage-dark)"/>
              <path d="M55,60 L58,63 L65,56" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>

          <div className="card" style={{width:'100%',maxWidth:'420px',padding:'28px 24px',textAlign:'center'}}>
            <span className="badge badge-gold" style={{marginBottom:'12px'}}>WEDDING PROJECT</span>
            <h2 className="font-serif" style={{fontSize:'22px',fontWeight:700,color:'var(--sage-deep)',margin:'10px 0 8px'}}>
              Mulai Perjalanan<br/>Pernikahan Kalian
            </h2>
            <p style={{fontSize:'13px',color:'#7a9482',lineHeight:1.7,marginBottom:'20px'}}>
              Setup wedding project dan biarkan Janji Suci menyiapkan checklist, rundown, budget, dan semua yang kalian butuhkan.
            </p>
            <button className="btn-sage" onClick={onSetup}>✦ Setup Wedding Project</button>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginTop:'16px',width:'100%',maxWidth:'420px'}}>
            {[
              {icon:'✓','text':'Checklist otomatis'},
              {icon:'📅','text':'Rundown hari-H'},
              {icon:'💰','text':'Pantau budget'},
              {icon:'👥','text':'Manajemen tamu'},
            ].map(f=>(
              <div key={f.text} style={{display:'flex',alignItems:'center',gap:'8px',padding:'9px 12px',
                background:'white',borderRadius:'12px',fontSize:'12px',color:'var(--sage-dark)',fontWeight:500,
                boxShadow:'0 1px 6px rgba(38,58,41,.06)'}}>
                <span>{f.icon}</span><span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

