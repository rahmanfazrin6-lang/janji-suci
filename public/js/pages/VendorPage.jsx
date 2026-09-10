/* ═══════════════ VENDOR PAGE ═══════════════ */
const VCATS = ['WO / EO','Katering','Dekorasi','Foto & Video','Busana','Gedung','MC','Musik','Lainnya'];

const VCAT_ICON = {
  'WO / EO': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  ),
  'Katering': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2 L3 9 C3 10.1 3.9 11 5 11 C6.1 11 7 10.1 7 9 L7 2"/>
      <path d="M5 11 L5 22"/>
      <path d="M19 2 C16.79 2 15 4.24 15 7 L15 13 C15 14.1 15.9 15 17 15 L19 15 Z"/>
      <path d="M19 2 L19 22"/>
    </svg>
  ),
  'Dekorasi': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"/>
      <path d="M5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15z"/>
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/>
    </svg>
  ),
  'Foto & Video': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  'Busana': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10a2 2 0 002 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z"/>
    </svg>
  ),
  'Gedung': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/>
    </svg>
  ),
  'MC': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>
    </svg>
  ),
  'Musik': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  'Lainnya': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/>
    </svg>
  ),
};
const VSTATUS = {belum:'Belum Kontak',proses:'Sedang Proses',deal:'Deal ✓'};
const VCOLOR = {belum:{bg:'var(--sage-mist)',color:'#9db09f'},proses:{bg:'var(--gold-light)',color:'#8a6d42'},deal:{bg:'var(--sage-light)',color:'var(--sage-dark)'}};
const PAYSTATUS = {belum_dp:'Belum DP', dp:'DP Terbayar', lunas:'Lunas ✓'};
const PAYCOLOR = {belum_dp:{bg:'var(--rust-light)',color:'var(--rust)'}, dp:{bg:'var(--gold-light)',color:'#8a6d42'}, lunas:{bg:'var(--sage-light)',color:'var(--sage-dark)'}};

const VCAT_COLOR = {
  'WO / EO':      {bg:'var(--sage-light)', color:'var(--sage-dark)'},
  'Katering':     {bg:'#FDEDE3', color:'#B85C2E'},
  'Dekorasi':     {bg:'#FCE8F0', color:'#B23A6B'},
  'Foto & Video': {bg:'#E3EEF4', color:'#3d6a80'},
  'Busana':       {bg:'#F3E8F5', color:'#7d4a8f'},
  'Gedung':       {bg:'#EDE7E0', color:'#6b5b47'},
  'MC':           {bg:'var(--gold-light)', color:'#8a6d42'},
  'Musik':        {bg:'#E0F2ED', color:'#2d7d68'},
  'Lainnya':      {bg:'var(--sage-mist)', color:'#7a9482'},
};

function VendorPage({ vendors, setVendors, onBack }) {
  const [exp,setExp] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [exporting, setExporting] = useState(false);
  const printRef = useRef(null);

  const add = ()=>{
    const id=Date.now();
    setVendors(v=>[...v,{id,name:'',cat:'Lainnya',contact:'',status:'belum',harga:'',dp:'',statusBayar:'belum_dp',jatuhTempoDisplay:'',fileUrl:null,fileName:'',fileType:'',note:''}]);
    setExp(id);
  };
  const upd = (id,k,v)=>setVendors(p=>p.map(x=>x.id===id?{...x,[k]:v}:x));
  const del = id=>{
    const item = vendors.find(x=>x.id===id);
    if (item && item.fileUrl) { try { URL.revokeObjectURL(item.fileUrl); } catch(e) {} }
    setVendors(p=>p.filter(x=>x.id!==id));
  };

  const handleUpload = (id, file) => {
    if (!file) return;
    const ok = file.type.startsWith('image/') || file.type==='application/pdf';
    if (!ok) { alert('File harus berupa foto (JPG/PNG) atau PDF.'); return; }
    const existing = vendors.find(x=>x.id===id);
    if (existing && existing.fileUrl) { try { URL.revokeObjectURL(existing.fileUrl); } catch(e) {} }
    const blobUrl = URL.createObjectURL(file);
    setVendors(p=>p.map(x=>x.id===id?{...x,fileUrl:blobUrl,fileName:file.name,fileType:file.type}:x));
  };
  const removeFile = (id) => {
    const existing = vendors.find(x=>x.id===id);
    if (existing && existing.fileUrl) { try { URL.revokeObjectURL(existing.fileUrl); } catch(e) {} }
    setVendors(p=>p.map(x=>x.id===id?{...x,fileUrl:null,fileName:'',fileType:''}:x));
  };

  const sisaBayar = (v) => v.statusBayar==='lunas' ? 0 : Math.max((Number(v.harga)||0) - (Number(v.dp)||0), 0);
  const dueInfo = (v) => {
    if (v.statusBayar==='lunas' || !v.jatuhTempoDisplay) return null;
    const iso = displayToIso(v.jatuhTempoDisplay);
    const days = daysUntil(iso);
    if (days===null) return null;
    if (days<0) return {label:`⚠ Lewat jatuh tempo ${Math.abs(days)} hari`, color:'var(--rust)', bg:'var(--rust-light)'};
    if (days<=7) return {label: days===0?'⏰ Jatuh tempo hari ini':`⏰ Jatuh tempo ${days} hari lagi`, color:'#8a6d42', bg:'var(--gold-light)'};
    return {label:`Jatuh tempo ${fmtShort(iso)}`, color:'#9db09f', bg:'var(--sage-mist)'};
  };

  const dealCount = vendors.filter(v=>v.status==='deal').length;
  const totalHarga = vendors.filter(v=>v.status==='deal').reduce((a,v)=>a+(Number(v.harga)||0),0);
  const totalSisa = vendors.filter(v=>v.status==='deal').reduce((a,v)=>a+sisaBayar(v),0);

  const filtered = vendors.filter(v=>{
    const matchSearch = !search.trim() || (v.name||'').toLowerCase().includes(search.toLowerCase()) || (v.cat||'').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter==='semua' || v.status===statusFilter;
    return matchSearch && matchStatus;
  });

  const exportJPG = async () => {
    setExporting(true);
    await new Promise(r=>setTimeout(r,50));
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const canvas = await html2canvas(printRef.current, { scale:2, useCORS:true, backgroundColor:'#ffffff' });
      const link = document.createElement('a');
      link.download = 'daftar-vendor.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch(e) { alert('Gagal membuat JPG. Coba lagi.'); }
    setExporting(false);
  };

  return (
    <div>
      <PageHeader title="Vendor" subtitle="Kelola kontak, harga, dan status pembayaran" onBack={onBack} right={
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={exportJPG} disabled={exporting} className="text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap" style={{background:'white',color:'var(--sage-dark)',border:'1.5px solid var(--sage-mid)'}}>
            {exporting ? '...' : '🖼️ Export JPG'}
          </button>
          <button className="text-xs font-bold text-white px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap" style={{background:'var(--sage-dark)'}} onClick={add}>{Ic.plus} Tambah</button>
        </div>
      }/>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 mt-4 lg:max-w-xl">
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{vendors.length}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Total</p></div>
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-dark)'}}>{dealCount}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Deal</p></div>
        <div className="stat-tile"><p className="font-serif text-sm font-bold mt-1.5" style={{color:'var(--sage-deep)'}}>{fmt(totalHarga)}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Total Harga</p></div>
        <div className="stat-tile"><p className="font-serif text-sm font-bold mt-1.5" style={{color: totalSisa>0?'var(--rust)':'var(--sage-dark)'}}>{fmt(totalSisa)}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Sisa Bayar</p></div>
      </div>

      {/* Search + filter */}
      <input className="inp mb-3" placeholder="🔍 Cari nama atau kategori vendor…" value={search} onChange={e=>setSearch(e.target.value)}/>
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {['semua',...Object.keys(VSTATUS)].map(s=>(
          <button key={s} onClick={()=>setStatusFilter(s)} className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
            style={statusFilter===s?{background:'var(--sage-dark)',color:'white'}:{background:'white',color:'#7a9482',border:'1px solid var(--sage-mid)'}}>
            {s==='semua'?'Semua':VSTATUS[s]}
          </button>
        ))}
      </div>

      {filtered.length===0 && <div className="card p-8 text-center"><div className="text-4xl mb-3">🏢</div><p className="text-sm" style={{color:'#9db09f'}}>Tidak ada vendor yang cocok.</p></div>}

      <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
        {filtered.map(v=>{
          const due = dueInfo(v);
          const sisa = sisaBayar(v);
          return (
          <div key={v.id} className="card overflow-hidden self-start">
            <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer" onClick={()=>setExp(exp===v.id?null:v.id)}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:VCAT_COLOR[v.cat]?.bg||'var(--sage-light)',color:VCAT_COLOR[v.cat]?.color||'var(--sage-dark)'}}>
                {VCAT_ICON[v.cat] || VCAT_ICON['Lainnya']}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{color:'var(--sage-deep)'}}>{v.name||`Vendor (${v.cat})`}</p>
                <p className="text-xs" style={{color:'#9db09f'}}>{v.cat}{v.harga?` • ${fmt(v.harga)}`:''}</p>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'4px'}}>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={VCOLOR[v.status]}>{VSTATUS[v.status]}</span>
                {v.status==='deal' && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={PAYCOLOR[v.statusBayar||'belum_dp']}>{PAYSTATUS[v.statusBayar||'belum_dp']}</span>}
              </div>
            </div>
            {due && (
              <div style={{margin:'0 16px 12px',padding:'7px 12px',borderRadius:'10px',background:due.bg,color:due.color,fontSize:'11px',fontWeight:700}}>{due.label}</div>
            )}
            {exp===v.id && (
              <div className="px-4 pb-4 pt-3 border-t space-y-3 anim-fadeup" style={{borderColor:'var(--sage-mist)'}} onClick={e=>e.stopPropagation()}>
                <div><label className="lbl text-xs">Nama Vendor</label><input className="inp" value={v.name} onChange={e=>upd(v.id,'name',e.target.value)} placeholder="Nama vendor"/></div>
                <div>
                  <label className="lbl text-xs">Kategori</label>
                  <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{background:VCAT_COLOR[v.cat]?.bg||'var(--sage-light)',color:VCAT_COLOR[v.cat]?.color||'var(--sage-dark)'}}>
                      {VCAT_ICON[v.cat] || VCAT_ICON['Lainnya']}
                    </div>
                    <select className="inp" style={{flex:1}} value={v.cat} onChange={e=>upd(v.id,'cat',e.target.value)}>{VCATS.map(c=><option key={c}>{c}</option>)}</select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="lbl text-xs">Kontak</label><input className="inp" value={v.contact} onChange={e=>upd(v.id,'contact',e.target.value)} placeholder="08xxxxxxxxxx"/></div>
                  <div>
                    <label className="lbl text-xs">Harga Total (Rp)</label>
                    <div style={{position:'relative'}}>
                      <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'12px',fontWeight:600,color:'var(--sage-dark)',pointerEvents:'none'}}>Rp</span>
                      <input className="inp" style={{paddingLeft:'30px'}} inputMode="numeric" placeholder="0"
                        value={v.harga ? fmtRpInput(String(v.harga)) : ''}
                        onChange={e=>upd(v.id,'harga',parseRpInput(e.target.value))}/>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="lbl text-xs">Status Kontak</label>
                  <div className="flex gap-2">
                    {Object.keys(VSTATUS).map(s=>(
                      <button key={s} onClick={()=>upd(v.id,'status',s)} className="flex-1 py-2 rounded-xl text-xs font-bold transition-all" style={v.status===s?{background:'var(--sage-dark)',color:'white'}:{background:'var(--sage-mist)',color:'#9db09f'}}>{VSTATUS[s]}</button>
                    ))}
                  </div>
                </div>

                {/* Payment tracking — only relevant once dealing with vendor */}
                {v.status!=='belum' && (
                  <div style={{background:'var(--sage-mist)',borderRadius:'14px',padding:'14px'}}>
                    <span className="text-[10px] font-bold tracking-widest uppercase block mb-3" style={{color:'var(--sage)'}}>Pembayaran</span>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="lbl text-xs">DP Terbayar (Rp)</label>
                        <div style={{position:'relative'}}>
                          <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'12px',fontWeight:600,color:'var(--sage-dark)',pointerEvents:'none'}}>Rp</span>
                          <input className="inp" style={{paddingLeft:'30px'}} inputMode="numeric" placeholder="0"
                            value={v.dp ? fmtRpInput(String(v.dp)) : ''}
                            onChange={e=>upd(v.id,'dp',parseRpInput(e.target.value))}/>
                        </div>
                      </div>
                      <div><label className="lbl text-xs">Jatuh Tempo Pelunasan</label><DateField value={v.jatuhTempoDisplay} onChange={val=>upd(v.id,'jatuhTempoDisplay',val)} placeholder="DD/MM/YYYY"/></div>
                    </div>
                    <div className="mb-3">
                      <label className="lbl text-xs">Status Pembayaran</label>
                      <div className="flex gap-2">
                        {Object.keys(PAYSTATUS).map(s=>(
                          <button key={s} onClick={()=>upd(v.id,'statusBayar',s)} className="flex-1 py-2 rounded-xl text-xs font-bold transition-all" style={(v.statusBayar||'belum_dp')===s?{background:'var(--sage-dark)',color:'white'}:{background:'white',color:'#9db09f'}}>{PAYSTATUS[s]}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs" style={{color:'#7a9482'}}>Sisa yang harus dibayar</span>
                      <span className="text-sm font-bold" style={{color: sisa>0?'var(--rust)':'var(--sage-dark)'}}>{fmt(sisa)}</span>
                    </div>
                  </div>
                )}

                {/* Upload kontrak / invoice */}
                <div>
                  <label className="lbl text-xs">Kontrak / Invoice <span style={{fontWeight:400,color:'#9db09f'}}>(opsional — JPG, PNG, atau PDF)</span></label>
                  <label style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',padding:'10px 14px',
                    background:'var(--sage-mist)',border:'1.5px dashed var(--sage-mid)',borderRadius:'14px',
                    cursor:'pointer',fontSize:'13px',color:'var(--sage-dark)',fontWeight:600}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"/></svg>
                    {v.fileName ? 'Ganti file' : 'Upload kontrak / invoice'}
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" style={{display:'none'}}
                      onChange={e=>handleUpload(v.id, e.target.files[0])}/>
                  </label>
                  {v.fileName && (
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginTop:'8px',padding:'8px 10px',background:'white',border:'1px solid var(--sage-mid)',borderRadius:'12px'}}>
                      {v.fileType==='application/pdf' ? (
                        <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'var(--rust-light)',color:'var(--rust)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{Ic.doc}</div>
                      ) : (
                        <img src={v.fileUrl} alt="" style={{width:'32px',height:'32px',borderRadius:'8px',objectFit:'cover',flexShrink:0}}/>
                      )}
                      <a href={v.fileUrl} target="_blank" rel="noopener noreferrer" style={{flex:1,minWidth:0,fontSize:'12px',color:'var(--sage-deep)',fontWeight:600,textDecoration:'underline',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{v.fileName}</a>
                      <button onClick={()=>removeFile(v.id)} style={{background:'none',border:'none',color:'var(--rust)',cursor:'pointer',flexShrink:0}}>{Ic.trash}</button>
                    </div>
                  )}
                </div>

                <div><label className="lbl text-xs">Catatan</label><textarea className="inp" rows="2" value={v.note} onChange={e=>upd(v.id,'note',e.target.value)} placeholder="Detail paket, request khusus, dsb" style={{resize:'none'}}/></div>

                {v.contact && <a href={`https://wa.me/${v.contact.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="btn-outline block text-center" style={{textDecoration:'none'}}>💬 Chat WhatsApp</a>}

                <div style={{display:'flex',gap:'8px'}}>
                  <button onClick={()=>setExp(null)} className="btn-sage" style={{padding:'11px'}}>✓ Simpan</button>
                  <button onClick={()=>del(v.id)} style={{flexShrink:0,padding:'11px 16px',borderRadius:'14px',border:'1.5px solid #f0d3ca',background:'transparent',color:'var(--rust)',fontWeight:600,fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',whiteSpace:'nowrap'}}>
                    {Ic.trash} Hapus
                  </button>
                </div>
              </div>
            )}
          </div>
          );
        })}
      </div>

      {/* Hidden clean printable table for PDF export */}
      <div style={{height:0, overflow:'hidden'}} aria-hidden="true">
        <div ref={printRef} style={{width:'850px', background:'white', padding:'40px', fontFamily:'DM Sans, sans-serif'}}>
          <div style={{textAlign:'center', marginBottom:'24px', borderBottom:'3px solid #6B8F6E', paddingBottom:'20px'}}>
            <div style={{fontSize:'11px', letterSpacing:'2px', color:'#8a6d42', fontWeight:700, marginBottom:'8px'}}>DAFTAR VENDOR PERNIKAHAN</div>
            <div style={{fontFamily:'Playfair Display, serif', fontSize:'28px', fontWeight:700, color:'#263A29'}}>Janji Suci Wedding Planner</div>
          </div>
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:'12px'}}>
            <thead>
              <tr style={{background:'#47654A', color:'white'}}>
                <th style={{padding:'9px 10px', textAlign:'left'}}>No</th>
                <th style={{padding:'9px 10px', textAlign:'left'}}>Vendor</th>
                <th style={{padding:'9px 10px', textAlign:'left'}}>Kategori</th>
                <th style={{padding:'9px 10px', textAlign:'left'}}>Kontak</th>
                <th style={{padding:'9px 10px', textAlign:'left'}}>Harga</th>
                <th style={{padding:'9px 10px', textAlign:'left'}}>DP</th>
                <th style={{padding:'9px 10px', textAlign:'left'}}>Sisa Bayar</th>
                <th style={{padding:'9px 10px', textAlign:'left'}}>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v,i)=>(
                <tr key={v.id} style={{background: i%2===0 ? '#F0F5EF' : 'white', borderBottom:'1px solid #E3EEE2'}}>
                  <td style={{padding:'9px 10px', fontWeight:700, color:'#47654A'}}>{i+1}</td>
                  <td style={{padding:'9px 10px', fontWeight:600, color:'#263A29'}}>{v.name||'—'}</td>
                  <td style={{padding:'9px 10px', color:'#5a7a5d'}}>{v.cat}</td>
                  <td style={{padding:'9px 10px', color:'#5a7a5d'}}>{v.contact||'—'}</td>
                  <td style={{padding:'9px 10px', color:'#5a7a5d'}}>{fmt(v.harga)}</td>
                  <td style={{padding:'9px 10px', color:'#5a7a5d'}}>{fmt(v.dp)}</td>
                  <td style={{padding:'9px 10px', color:'#5a7a5d'}}>{fmt(sisaBayar(v))}</td>
                  <td style={{padding:'9px 10px', color:'#5a7a5d'}}>{VSTATUS[v.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{marginTop:'20px', textAlign:'center', fontSize:'10px', color:'#9db09f'}}>Dibuat dengan Janji Suci Wedding Planner</div>
        </div>
      </div>
    </div>
  );
}

