/* ═══════════════ REUSABLE DATE FIELD — DD/MM/YYYY text + native picker button ═══════════════ */
function DateField({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const openPicker = () => {
    if (!ref.current) return;
    try { ref.current.showPicker(); }
    catch(e) { ref.current.click(); }
  };
  return (
    <div style={{position:'relative',display:'flex'}}>
      <input className="inp" placeholder={placeholder||'DD/MM/YYYY'} value={value||''} maxLength={10} inputMode="numeric"
        style={{flex:1,borderRadius:'14px 0 0 14px',borderRight:'none'}}
        onChange={e=>onChange(autoDate(e.target.value))}/>
      <input ref={ref} type="date" className="hidden-picker"
        onChange={e=>{ if(e.target.value) onChange(isoToDisplay(e.target.value)); }}/>
      <button type="button" className="pick-btn" onClick={openPicker}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </button>
    </div>
  );
}

function SetupScreen({ initial, onSave, onBack }) {
  const [namaW, setNamaW] = useState(initial?.namaW||'');
  const [namaP, setNamaP] = useState(initial?.namaP||'');
  const [tanggal, setTanggal] = useState(initial?.tanggal ? isoToDisplay(initial.tanggal) : '');
  const [budget, setBudget] = useState(initial?.budget ? fmtRpInput(initial.budget) : '');
  const [jamAkad, setJamAkad] = useState(initial?.jamAkad||'');
  const [jamResepsi, setJamResepsi] = useState(initial?.jamResepsi||'');
  const [namaVenue, setNamaVenue] = useState(initial?.namaVenue||'');
  const [alamat, setAlamat] = useState(initial?.alamat||'');
  const [tamu, setTamu] = useState(initial?.tamu ? fmtRpInput(initial.tamu) : '');
  const [warna, setWarna] = useState(initial?.warna||'');
  const [tema, setTema] = useState(initial?.tema||'');
  const [wo, setWo] = useState(initial?.wo||'');

  // Ref to trigger native date picker (time now uses custom TimePicker component)
  const refTanggal = useRef(null);

  const openPicker = (ref) => {
    if (!ref.current) return;
    try { ref.current.showPicker(); }
    catch(e) { ref.current.click(); }
  };

  const IcCal = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );

  const handleSave = () => {
    onSave({
      namaW, namaP,
      tanggal: displayToIso(tanggal),
      budget: parseRpInput(budget),
      jamAkad, jamResepsi,
      namaVenue, alamat,
      tamu: parseRpInput(tamu),
      warna, tema, wo,
      kontak: '',
    });
  };

  const lbl = {fontSize:'13px',fontWeight:600,color:'#3d5140',display:'block',marginBottom:'5px'};
  const hint = {fontSize:'11px',color:'#9db09f',marginBottom:'5px',display:'block',lineHeight:1.4};

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:'var(--cream)'}}>
      {/* Sticky top bar */}
      <div className="setup-topbar" style={{flexShrink:0,display:'flex',justifyContent:'space-between',alignItems:'center',
        padding:'16px 32px',borderBottom:'1px solid var(--sage-light)',
        background:'rgba(252,250,244,.96)',backdropFilter:'blur(8px)',zIndex:20}}>
        <span className="badge badge-sage">JANJI SUCI SETUP</span>
        <button className="btn-ghost" style={{color:'#9db09f',fontSize:'13px'}} onClick={onBack}>Tutup</button>
      </div>

      {/* Scrollable form body */}
      <div style={{flex:1,overflowY:'auto',padding:'28px 32px 32px'}} className="custom-scroll setup-body">
        <div style={{maxWidth:'720px',margin:'0 auto'}}>
          <h1 className="font-serif" style={{fontSize:'28px',fontWeight:700,color:'var(--sage-deep)',marginBottom:'4px'}}>
            Setup Wedding Project
          </h1>
          <SectionDivider/>
          <p style={{fontSize:'14px',color:'#7a9482',lineHeight:1.7,marginBottom:'28px'}}>
            Lengkapi data awal wedding project. Setelah disimpan, Janji Suci akan otomatis membuat checklist, timeline, dan rundown dasar.
          </p>

          <div className="setup-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>

            {/* Nama Wanita */}
            <div>
              <label style={lbl}>Nama Mempelai Wanita</label>
              <input className="inp" placeholder="Contoh: Aisyah" value={namaW} onChange={e=>setNamaW(e.target.value)}/>
            </div>

            {/* Nama Pria */}
            <div>
              <label style={lbl}>Nama Mempelai Pria</label>
              <input className="inp" placeholder="Contoh: Ahmad" value={namaP} onChange={e=>setNamaP(e.target.value)}/>
            </div>

            {/* Tanggal */}
            <div>
              <label style={lbl}>Tanggal Pernikahan</label>
              <span style={hint}>Ketik DD/MM/YYYY atau klik ikon kalender</span>
              <div style={{position:'relative',display:'flex'}}>
                <input className="inp" placeholder="09/07/2026" value={tanggal} maxLength={10} inputMode="numeric"
                  style={{flex:1,borderRadius:'14px 0 0 14px',borderRight:'none'}}
                  onChange={e=>setTanggal(autoDate(e.target.value))}/>
                <input ref={refTanggal} type="date" className="hidden-picker"
                  onChange={e=>{ if(e.target.value) setTanggal(isoToDisplay(e.target.value)); }}/>
                <button type="button" className="pick-btn" onClick={()=>openPicker(refTanggal)}>
                  <IcCal/>
                </button>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label style={lbl}>Target Budget</label>
              <span style={hint}>Ketik angka, titik ribuan otomatis muncul</span>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',left:'14px',top:'50%',transform:'translateY(-50%)',
                  fontSize:'13px',fontWeight:600,color:'var(--sage-dark)'}}>Rp</span>
                <input className="inp" style={{paddingLeft:'34px'}} placeholder="150.000.000"
                  value={budget} inputMode="numeric"
                  onChange={e=>setBudget(fmtRpInput(e.target.value))}/>
              </div>
            </div>

            {/* Jam Akad */}
            <div>
              <label style={lbl}>Jam Akad / Pemberkatan</label>
              <span style={hint}>Ketik HH:MM (24 jam) atau klik ikon jam untuk pilih</span>
              <TimePicker value={jamAkad} onChange={setJamAkad} placeholder="08:00"/>
            </div>

            {/* Jam Resepsi */}
            <div>
              <label style={lbl}>Jam Resepsi</label>
              <span style={hint}>Ketik HH:MM (24 jam) atau klik ikon jam untuk pilih</span>
              <TimePicker value={jamResepsi} onChange={setJamResepsi} placeholder="11:00"/>
            </div>

            {/* Venue */}
            <div>
              <label style={lbl}>Nama Venue</label>
              <input className="inp" placeholder="Nama gedung atau tempat pernikahan" value={namaVenue} onChange={e=>setNamaVenue(e.target.value)}/>
            </div>

            {/* Tamu */}
            <div>
              <label style={lbl}>Estimasi Jumlah Tamu</label>
              <input className="inp" placeholder="500" value={tamu} inputMode="numeric"
                onChange={e=>setTamu(fmtRpInput(e.target.value))}/>
            </div>

            {/* Warna */}
            <div>
              <label style={lbl}>Warna Utama</label>
              <input className="inp" placeholder="Contoh: sage green, putih gading" value={warna} onChange={e=>setWarna(e.target.value)}/>
            </div>

            {/* Tema */}
            <div>
              <label style={lbl}>Tema Pernikahan</label>
              <input className="inp" placeholder="Contoh: rustic garden, elegant botanical" value={tema} onChange={e=>setTema(e.target.value)}/>
            </div>

            {/* WO */}
            <div>
              <label style={lbl}>Nama WO <span style={{fontWeight:400,color:'#9db09f'}}>(opsional)</span></label>
              <input className="inp" placeholder="Nama Wedding Organizer" value={wo} onChange={e=>setWo(e.target.value)}/>
            </div>

            {/* Alamat — full width */}
            <div className="full-width" style={{gridColumn:'1 / -1'}}>
              <label style={lbl}>Alamat Venue</label>
              <textarea className="inp" rows="3" placeholder="Alamat lengkap venue pernikahan"
                value={alamat} onChange={e=>setAlamat(e.target.value)} style={{resize:'none'}}/>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA — always visible */}
      <div className="setup-footer" style={{flexShrink:0,padding:'16px 32px 24px',borderTop:'1px solid var(--sage-light)',
        background:'var(--cream)',zIndex:20}}>
        <div className="setup-footer-inner" style={{maxWidth:'720px',margin:'0 auto',display:'flex',gap:'12px',alignItems:'center'}}>
          <button className="btn-sage" style={{flex:1}} onClick={handleSave}>
            Simpan &amp; Buat Dashboard
          </button>
          <button onClick={onBack} style={{flexShrink:0,padding:'13px 20px',borderRadius:'14px',
            border:'1.5px solid var(--sage-mid)',background:'transparent',
            color:'var(--sage-dark)',fontWeight:600,fontSize:'14px',cursor:'pointer',whiteSpace:'nowrap'}}>
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

