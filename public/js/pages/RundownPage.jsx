/* ═══════════════ RUNDOWN PAGE ═══════════════ */
function RundownPage({ rundown, setRundown, loading, data, onBack }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const [exporting, setExporting] = useState(false);
  const printRef = useRef(null);

  const add = ()=>{ setRundown(r=>[...r,{time:'',title:'',lokasi:'',pic:'',note:''}]); setEditingIdx(rundown.length); };
  const upd = (i,k,v)=>setRundown(r=>r.map((x,idx)=>idx===i?{...x,[k]:v}:x));
  const del = i=>{ setRundown(r=>r.filter((_,idx)=>idx!==i)); setEditingIdx(null); };

  const exportAs = async (type) => {
    if (!printRef.current || rundown.length===0) return;
    setExporting(true);
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const canvas = await html2canvas(printRef.current, { scale:2, useCORS:true, backgroundColor:'#ffffff' });
      const safeName = `Rundown-${(data.namaW||'Mempelai')}-${(data.namaP||'Mempelai')}`.replace(/\s+/g,'');
      if (type==='jpg') {
        const link = document.createElement('a');
        link.download = `${safeName}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
      } else {
        const { jsPDF } = window.jspdf;
        const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait';
        const pdf = new jsPDF({ orientation, unit:'px', format:[canvas.width, canvas.height] });
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${safeName}.pdf`);
      }
    } catch(e) {
      console.error(e);
      alert('Gagal membuat file export. Coba lagi sebentar.');
    }
    setExporting(false);
  };

  const thStyle = { padding:'10px 12px', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', textAlign:'left', color:'white', whiteSpace:'nowrap' };
  const tdStyle = { padding:'10px 12px', fontSize:'13px', color:'var(--sage-deep)', verticalAlign:'top' };
  const editInp = { fontSize:'13px', padding:'8px 10px' };

  return (
    <div>
      <PageHeader title="Rundown Acara" subtitle="Susun jadwal hari-H dalam format tabel" onBack={onBack} right={
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap',justifyContent:'flex-end'}}>
          <button className="text-xs font-bold text-white px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap" style={{background:'var(--sage-dark)'}} onClick={add}>{Ic.plus} Tambah</button>
          <button disabled={exporting||rundown.length===0} onClick={()=>exportAs('jpg')}
            className="text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap"
            style={{background:'white',color:'var(--sage-dark)',border:'1.5px solid var(--sage-mid)',opacity:(exporting||rundown.length===0)?.5:1,cursor:(exporting||rundown.length===0)?'not-allowed':'pointer'}}>
            🖼️ JPG
          </button>
          <button disabled={exporting||rundown.length===0} onClick={()=>exportAs('pdf')}
            className="text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap"
            style={{background:'white',color:'var(--sage-dark)',border:'1.5px solid var(--sage-mid)',opacity:(exporting||rundown.length===0)?.5:1,cursor:(exporting||rundown.length===0)?'not-allowed':'pointer'}}>
            📄 PDF
          </button>
        </div>
      }/>

      {exporting && <p className="text-xs mb-3 mt-2" style={{color:'#9db09f'}}>⏳ Sedang menyiapkan file export…</p>}

      <div className="mt-4">
        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i=><div key={i} className="card p-5"><Shim/><Shim w="75%"/></div>)}</div>
        ) : rundown.length===0 ? (
          <div className="card p-8 text-center"><div className="text-4xl mb-3">📅</div><p className="text-sm" style={{color:'#9db09f'}}>Rundown belum tersedia. Klik "+ Tambah" untuk mulai menyusun.</p></div>
        ) : (
          <div className="card" style={{overflow:'hidden'}}>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',minWidth:'760px'}}>
                <thead>
                  <tr style={{background:'linear-gradient(135deg, var(--sage), var(--sage-dark))'}}>
                    <th style={{...thStyle,width:'40px'}}>No</th>
                    <th style={{...thStyle,width:'90px'}}>Waktu</th>
                    <th style={thStyle}>Kegiatan</th>
                    <th style={thStyle}>Lokasi</th>
                    <th style={thStyle}>PIC</th>
                    <th style={thStyle}>Catatan</th>
                    <th style={{...thStyle,width:'80px'}}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rundown.map((it,i)=>{
                    const isEdit = editingIdx===i;
                    return (
                      <tr key={i} style={{background: i%2===0?'white':'var(--sage-mist)', borderBottom:'1px solid var(--sage-mist)'}}>
                        <td style={{...tdStyle,fontWeight:700,color:'var(--sage-dark)'}}>{i+1}</td>
                        <td style={{...tdStyle,minWidth:'110px'}}>
                          {isEdit ? <TimePicker value={it.time} onChange={v=>upd(i,'time',v)} placeholder="08:00"/> : <span style={{fontWeight:700,color:'var(--sage-dark)'}}>{it.time||'—'}</span>}
                        </td>
                        <td style={{...tdStyle,minWidth:'150px'}}>
                          {isEdit ? <input className="inp" style={editInp} value={it.title} onChange={e=>upd(i,'title',e.target.value)} placeholder="Nama agenda"/> : <span style={{fontWeight:600}}>{it.title||'—'}</span>}
                        </td>
                        <td style={{...tdStyle,minWidth:'130px'}}>
                          {isEdit ? <input className="inp" style={editInp} value={it.lokasi||''} onChange={e=>upd(i,'lokasi',e.target.value)} placeholder="Lokasi"/> : (it.lokasi||'—')}
                        </td>
                        <td style={{...tdStyle,minWidth:'110px'}}>
                          {isEdit ? <input className="inp" style={editInp} value={it.pic||''} onChange={e=>upd(i,'pic',e.target.value)} placeholder="PIC"/> : (it.pic||'—')}
                        </td>
                        <td style={{...tdStyle,color:'#9db09f',minWidth:'160px'}}>
                          {isEdit ? <input className="inp" style={editInp} value={it.note||''} onChange={e=>upd(i,'note',e.target.value)} placeholder="Catatan"/> : (it.note||'—')}
                        </td>
                        <td style={tdStyle}>
                          <div style={{display:'flex',gap:'6px'}}>
                            <button onClick={()=>setEditingIdx(isEdit?null:i)} title={isEdit?'Selesai edit':'Edit baris'}
                              style={{width:'28px',height:'28px',borderRadius:'8px',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',
                                background: isEdit?'var(--sage-dark)':'var(--sage-light)', color: isEdit?'white':'var(--sage-dark)'}}>
                              {isEdit ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                              ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7m-1.5-9.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              )}
                            </button>
                            <button onClick={()=>del(i)} title="Hapus baris"
                              style={{width:'28px',height:'28px',borderRadius:'8px',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--rust-light)',color:'var(--rust)'}}>
                              {Ic.trash}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Tabel cetak tersembunyi — dipakai untuk capture export JPG/PDF, tidak memengaruhi tata letak halaman ── */}
      <div style={{height:0, overflow:'hidden'}} aria-hidden="true">
        <div ref={printRef} style={{width:'1000px', background:'white', fontFamily:"'DM Sans', sans-serif"}}>
          <div style={{background:'linear-gradient(135deg, #6B8F6E, #47654A)', padding:'36px 44px', color:'white'}}>
            <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',opacity:.85,marginBottom:'8px'}}>JANJI SUCI · WEDDING PLANNER</div>
            <div style={{fontFamily:"'Playfair Display', serif", fontSize:'34px', fontWeight:700, marginBottom:'6px'}}>
              {data.namaW||'Mempelai'} &amp; {data.namaP||'Mempelai'}
            </div>
            <div style={{fontSize:'14px', opacity:.85}}>
              {fmtDate(data.tanggal)||'Tanggal belum diset'}{data.namaVenue?` · ${data.namaVenue}`:''}
            </div>
          </div>
          <div style={{padding:'28px 44px 10px'}}>
            <div style={{fontFamily:"'Playfair Display', serif", fontSize:'22px', fontWeight:700, color:'#263A29', marginBottom:'4px'}}>Rundown Acara Pernikahan</div>
            <div style={{width:'56px',height:'3px',background:'#B99A6B',marginBottom:'20px'}}/>
          </div>
          <div style={{padding:'0 44px 36px'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#263A29'}}>
                  <th style={{padding:'12px 14px',fontSize:'12px',fontWeight:700,color:'white',textAlign:'left',width:'50px'}}>No</th>
                  <th style={{padding:'12px 14px',fontSize:'12px',fontWeight:700,color:'white',textAlign:'left',width:'90px'}}>Waktu</th>
                  <th style={{padding:'12px 14px',fontSize:'12px',fontWeight:700,color:'white',textAlign:'left'}}>Kegiatan</th>
                  <th style={{padding:'12px 14px',fontSize:'12px',fontWeight:700,color:'white',textAlign:'left'}}>Lokasi</th>
                  <th style={{padding:'12px 14px',fontSize:'12px',fontWeight:700,color:'white',textAlign:'left'}}>PIC</th>
                  <th style={{padding:'12px 14px',fontSize:'12px',fontWeight:700,color:'white',textAlign:'left'}}>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {rundown.map((it,i)=>(
                  <tr key={i} style={{background: i%2===0?'#ffffff':'#F0F5EF', borderBottom:'1px solid #E3EEE2'}}>
                    <td style={{padding:'12px 14px',fontSize:'13px',fontWeight:700,color:'#47654A'}}>{i+1}</td>
                    <td style={{padding:'12px 14px',fontSize:'13px',fontWeight:700,color:'#47654A'}}>{it.time||'—'}</td>
                    <td style={{padding:'12px 14px',fontSize:'13px',fontWeight:600,color:'#263A29'}}>{it.title||'—'}</td>
                    <td style={{padding:'12px 14px',fontSize:'13px',color:'#5a7a5d'}}>{it.lokasi||'—'}</td>
                    <td style={{padding:'12px 14px',fontSize:'13px',color:'#5a7a5d'}}>{it.pic||'—'}</td>
                    <td style={{padding:'12px 14px',fontSize:'12.5px',color:'#9db09f'}}>{it.note||'—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{padding:'16px 44px 28px', borderTop:'1px solid #E3EEE2', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <span style={{fontSize:'11px',color:'#9db09f'}}>Dibuat dengan Janji Suci — Wedding Planner</span>
            <span style={{fontSize:'11px',color:'#9db09f'}}>{new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

