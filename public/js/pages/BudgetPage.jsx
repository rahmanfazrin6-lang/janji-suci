/* ═══════════════ BUDGET PAGE ═══════════════ */
const BUDGET_SEED_DEFS = [
  {cat:'Venue & Dekorasi', label:'Sewa venue', pct:.22},
  {cat:'Venue & Dekorasi', label:'Dekorasi & floral', pct:.08},
  {cat:'Katering', label:'Katering & minuman', pct:.28},
  {cat:'Dokumentasi', label:'Fotografi', pct:.06},
  {cat:'Dokumentasi', label:'Videografi', pct:.05},
  {cat:'Busana', label:'Gaun & jas pengantin', pct:.07},
  {cat:'Busana', label:'Riasan & salon', pct:.04},
  {cat:'Lain-lain', label:'Undangan & souvenir', pct:.04},
  {cat:'Lain-lain', label:'WO & koordinator', pct:.05},
  {cat:'Dana Darurat', label:'Dana cadangan tak terduga', pct:.10},
];
function seedBudgetItems(totalBudget) {
  const total = Number(totalBudget)||0;
  return BUDGET_SEED_DEFS.map((d,i)=>({
    id: Date.now()+i, cat:d.cat, label:d.label,
    estimasi: total>0 ? Math.round(total*d.pct) : 0,
    realisasi: 0, vendorId: null,
  }));
}
const BUDGET_CAT_COLOR = {
  'Venue & Dekorasi': '#6B8F6E',
  'Katering':         '#B85C2E',
  'Dokumentasi':      '#3d6a80',
  'Busana':           '#7d4a8f',
  'Lain-lain':        '#8a6d42',
  'Dana Darurat':     '#B23A6B',
  'Vendor':           '#2d7d68',
};
const budgetColorFor = (cat, idx) => BUDGET_CAT_COLOR[cat] || ['#6B8F6E','#B85C2E','#3d6a80','#7d4a8f','#8a6d42','#B23A6B','#2d7d68'][idx % 7];

function BudgetPage({ budget, budgetItems, setBudgetItems, vendors, data, onUpdateBudget }) {
  const total = Number(budget)||0;
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newCat, setNewCat] = useState('');
  const [newCatCustom, setNewCatCustom] = useState('');
  const [editBudget, setEditBudget] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState(budget ? fmtRpInput(String(budget)) : '');
  const [exporting, setExporting] = useState(false);
  const printRef = useRef(null);

  const cats = [...new Set(budgetItems.map(i=>i.cat))];
  const totalEstimasi = budgetItems.reduce((a,i)=>a+(Number(i.estimasi)||0),0);
  const totalRealisasi = budgetItems.reduce((a,i)=>a+(Number(i.realisasi)||0),0);
  const pct = total>0 ? Math.min(totalRealisasi/total*100,100) : 0;
  const rem = total-totalRealisasi;

  const upd = (id,k,v) => setBudgetItems(items=>items.map(i=>i.id===id?{...i,[k]:v}:i));
  const delItem = (id) => setBudgetItems(items=>items.filter(i=>i.id!==id));

  const addItem = () => {
    const cat = newCat==='__custom__' ? newCatCustom.trim() : newCat;
    if (!newLabel.trim() || !cat) return;
    setBudgetItems(items=>[...items, {id:Date.now(), cat, label:newLabel.trim(), estimasi:0, realisasi:0, vendorId:null}]);
    setNewLabel(''); setNewCat(''); setNewCatCustom(''); setShowAdd(false);
  };

  const importedVendorIds = budgetItems.filter(i=>i.vendorId).map(i=>i.vendorId);
  const dealVendorsNotImported = (vendors||[]).filter(v=>v.status==='deal' && !importedVendorIds.includes(v.id));
  const importFromVendor = () => {
    if (dealVendorsNotImported.length===0) { alert('Semua vendor yang sudah deal sudah tercatat di Budget.'); return; }
    const newItems = dealVendorsNotImported.map((v,i)=>({
      id:Date.now()+i, cat:'Vendor', label:v.name||v.cat, estimasi:Number(v.harga)||0, realisasi:Number(v.dp)||0, vendorId:v.id,
    }));
    setBudgetItems(items=>[...items, ...newItems]);
  };

  const saveBudget = () => {
    onUpdateBudget(parseRpInput(budgetDraft));
    setEditBudget(false);
  };

  const exportJpg = async () => {
    if (!printRef.current) return;
    setExporting(true);
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const canvas = await html2canvas(printRef.current, { scale:2, useCORS:true, backgroundColor:'#ffffff' });
      const link = document.createElement('a');
      link.download = `Budget-${(data?.namaW||'Mempelai')}-${(data?.namaP||'Mempelai')}.jpg`.replace(/\s+/g,'');
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch(e) { alert('Gagal membuat JPG. Coba lagi.'); }
    setExporting(false);
  };

  return (
    <div>
      <PageHeader title="Budget" subtitle="Pantau pengeluaran pernikahan" right={
        <div style={{display:'flex',gap:'8px'}}>
          <button onClick={exportJpg} disabled={exporting} className="text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap" style={{background:'white',color:'var(--sage-dark)',border:'1.5px solid var(--sage-mid)'}}>
            {exporting ? '...' : '🖼️ Export JPG'}
          </button>
          <button onClick={()=>setShowAdd(s=>!s)} className="text-xs font-bold text-white px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap" style={{background:'var(--sage-dark)'}}>
            {Ic.plus} Item
          </button>
        </div>
      }/>

      {/* Total budget card */}
      <div className="card p-5 mb-4 mt-4">
        <div className="flex justify-between items-end mb-3">
          <div>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <p className="text-xs mb-0.5" style={{color:'#9db09f'}}>Total Budget</p>
              <button onClick={()=>{setEditBudget(e=>!e); setBudgetDraft(budget?fmtRpInput(String(budget)):'');}} style={{background:'none',border:'none',color:'var(--sage)',cursor:'pointer',padding:0}} title="Edit budget">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.5-9.5a2.121 2.121 0 013 3L12 16l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
            </div>
            {!editBudget ? (
              <p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{fmt(total)}</p>
            ) : (
              <div style={{display:'flex',gap:'6px',alignItems:'center',marginTop:'4px'}}>
                <div style={{position:'relative'}}>
                  <span style={{position:'absolute',left:'10px',top:'50%',transform:'translateY(-50%)',fontSize:'11px',fontWeight:600,color:'var(--sage-dark)'}}>Rp</span>
                  <input className="inp" style={{paddingLeft:'28px',padding:'6px 10px 6px 28px',fontSize:'13px',width:'140px'}} value={budgetDraft} inputMode="numeric" onChange={e=>setBudgetDraft(fmtRpInput(e.target.value))}/>
                </div>
                <button onClick={saveBudget} style={{background:'var(--sage-dark)',color:'white',border:'none',borderRadius:'8px',padding:'6px 10px',fontSize:'11px',fontWeight:700,cursor:'pointer'}}>✓</button>
              </div>
            )}
          </div>
          <div className="text-right"><p className="text-xs mb-0.5" style={{color:'#9db09f'}}>Sisa</p>
            <p className="text-lg font-bold" style={{color:rem>=0?'var(--sage-dark)':'var(--rust)'}}>{fmt(Math.abs(rem))}{rem<0?' (over)':''}</p></div>
        </div>
        <div className="prog-track"><div className="prog-fill" style={{width:`${pct}%`,background: pct>90?'linear-gradient(90deg,var(--rust),#d98a72)':undefined}}/></div>
        <p className="text-xs mt-1.5" style={{color:'#9db09f'}}>{fmt(totalRealisasi)} terpakai dari {fmt(totalEstimasi)} estimasi ({Math.round(pct)}%)</p>
      </div>

      {!total && <div className="card p-6 text-center mb-4"><p className="text-sm" style={{color:'#9db09f'}}>Klik ikon ✎ di atas atau set target budget di Setup untuk mulai melacak pengeluaran.</p></div>}

      {/* Import from vendor */}
      {dealVendorsNotImported.length>0 && (
        <div className="card p-4 mb-4" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'12px',flexWrap:'wrap',background:'var(--sage-mist)'}}>
          <p className="text-xs" style={{color:'#5a7a5d',lineHeight:1.5}}>
            📥 Ada <strong>{dealVendorsNotImported.length} vendor</strong> yang sudah deal tapi belum tercatat di Budget.
          </p>
          <button onClick={importFromVendor} className="text-xs font-bold text-white px-3 py-1.5 rounded-xl whitespace-nowrap" style={{background:'var(--sage-dark)'}}>Import dari Vendor</button>
        </div>
      )}

      {/* Add item form */}
      {showAdd && (
        <div className="card p-5 mb-4 anim-fadeup">
          <span className="text-[10px] font-bold tracking-widest uppercase block mb-3" style={{color:'var(--sage)'}}>Tambah Item Budget</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div><label className="lbl text-xs">Nama Item</label><input className="inp" value={newLabel} onChange={e=>setNewLabel(e.target.value)} placeholder="Contoh: Sewa tenda tambahan"/></div>
            <div>
              <label className="lbl text-xs">Kategori</label>
              <select className="inp" value={newCat} onChange={e=>setNewCat(e.target.value)}>
                <option value="">Pilih kategori…</option>
                {cats.map(c=><option key={c} value={c}>{c}</option>)}
                <option value="__custom__">+ Kategori baru…</option>
              </select>
            </div>
          </div>
          {newCat==='__custom__' && (
            <div className="mb-3"><label className="lbl text-xs">Nama Kategori Baru</label><input className="inp" value={newCatCustom} onChange={e=>setNewCatCustom(e.target.value)} placeholder="Contoh: Sound System"/></div>
          )}
          <button onClick={addItem} className="btn-sage">+ Tambah ke Daftar</button>
        </div>
      )}

      {/* Visual breakdown bar */}
      {totalRealisasi>0 && (
        <div className="card p-5 mb-4">
          <span className="text-[10px] font-bold tracking-widest uppercase block mb-3" style={{color:'var(--sage)'}}>Rincian Pengeluaran per Kategori</span>
          <div style={{display:'flex',height:'14px',borderRadius:'999px',overflow:'hidden',marginBottom:'14px'}}>
            {cats.map((cat,idx)=>{
              const catRealisasi = budgetItems.filter(i=>i.cat===cat).reduce((a,i)=>a+(Number(i.realisasi)||0),0);
              const w = totalRealisasi>0 ? (catRealisasi/totalRealisasi*100) : 0;
              if (w<=0) return null;
              return <div key={cat} style={{width:`${w}%`,background:budgetColorFor(cat,idx)}} title={`${cat}: ${fmt(catRealisasi)}`}/>;
            })}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'8px'}}>
            {cats.map((cat,idx)=>{
              const catRealisasi = budgetItems.filter(i=>i.cat===cat).reduce((a,i)=>a+(Number(i.realisasi)||0),0);
              if (catRealisasi<=0) return null;
              const catPct = totalRealisasi>0 ? Math.round(catRealisasi/totalRealisasi*100) : 0;
              return (
                <div key={cat} style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <div style={{width:'10px',height:'10px',borderRadius:'3px',background:budgetColorFor(cat,idx),flexShrink:0}}/>
                  <span style={{fontSize:'11px',color:'var(--sage-deep)',fontWeight:600}}>{cat}</span>
                  <span style={{fontSize:'10px',color:'#9db09f',marginLeft:'auto'}}>{catPct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category groups */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-4">
        {cats.map(cat=>{
          const items = budgetItems.filter(i=>i.cat===cat);
          const catEstimasi = items.reduce((a,i)=>a+(Number(i.estimasi)||0),0);
          const catRealisasi = items.reduce((a,i)=>a+(Number(i.realisasi)||0),0);
          const over = catRealisasi > catEstimasi && catEstimasi>0;
          return (
            <div key={cat} className="mb-4">
              <div className="flex justify-between items-center mb-2 px-1">
                <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{color:'var(--sage)'}}>{cat}</p>
                  {over && <span className="badge badge-rust" style={{fontSize:'8px',padding:'2px 7px'}}>Over Budget</span>}
                </div>
                <span className="text-xs" style={{color:'#9db09f'}}>{fmt(catRealisasi)} / {fmt(catEstimasi)}</span>
              </div>
              <div className="card overflow-hidden">
                {items.map((it,i,arr)=>(
                  <div key={it.id} className="px-4 py-3" style={{borderBottom:i<arr.length-1?'1px solid var(--sage-mist)':'none'}}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium" style={{color:'var(--sage-deep)'}}>{it.label}</span>
                      <button onClick={()=>delItem(it.id)} style={{background:'none',border:'none',color:'var(--rust)',cursor:'pointer',opacity:.7}}>{Ic.trash}</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label style={{fontSize:'10px',color:'#9db09f',display:'block',marginBottom:'3px'}}>Estimasi</label>
                        <div style={{position:'relative'}}>
                          <span style={{position:'absolute',left:'8px',top:'50%',transform:'translateY(-50%)',fontSize:'11px',color:'var(--sage-dark)',fontWeight:600}}>Rp</span>
                          <input inputMode="numeric" placeholder="0" value={it.estimasi?fmtRpInput(String(it.estimasi)):''}
                            onChange={e=>upd(it.id,'estimasi',parseRpInput(e.target.value))}
                            className="inp" style={{padding:'7px 8px 7px 26px',fontSize:'12px'}}/>
                        </div>
                      </div>
                      <div>
                        <label style={{fontSize:'10px',color:'#9db09f',display:'block',marginBottom:'3px'}}>Realisasi</label>
                        <div style={{position:'relative'}}>
                          <span style={{position:'absolute',left:'8px',top:'50%',transform:'translateY(-50%)',fontSize:'11px',color:'var(--sage-dark)',fontWeight:600}}>Rp</span>
                          <input inputMode="numeric" placeholder="0" value={it.realisasi?fmtRpInput(String(it.realisasi)):''}
                            onChange={e=>upd(it.id,'realisasi',parseRpInput(e.target.value))}
                            className="inp" style={{padding:'7px 8px 7px 26px',fontSize:'12px',
                              borderColor: (Number(it.realisasi)||0)>(Number(it.estimasi)||0)&&it.estimasi>0 ? 'var(--rust)':undefined}}/>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {items.length===0 && <p className="text-xs text-center py-4" style={{color:'#9db09f'}}>Belum ada item di kategori ini.</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden printable budget summary for JPG export */}
      <div style={{height:0, overflow:'hidden'}} aria-hidden="true">
        <div ref={printRef} style={{width:'800px', background:'white', fontFamily:"'DM Sans', sans-serif"}}>
          <div style={{background:'linear-gradient(135deg, #6B8F6E, #47654A)', padding:'32px 40px', color:'white'}}>
            <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',opacity:.85,marginBottom:'8px'}}>JANJI SUCI · WEDDING PLANNER</div>
            <div style={{fontFamily:"'Playfair Display', serif",fontSize:'28px',fontWeight:700}}>{data?.namaW||'Mempelai'} & {data?.namaP||'Mempelai'}</div>
            <div style={{fontSize:'12px',opacity:.85,marginTop:'4px'}}>Ringkasan Budget Pernikahan</div>
          </div>
          <div style={{padding:'28px 40px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'20px',paddingBottom:'16px',borderBottom:'2px solid #E3EEE2'}}>
              <div><div style={{fontSize:'11px',color:'#9db09f'}}>Total Budget</div><div style={{fontSize:'18px',fontWeight:700,color:'#263A29'}}>{fmt(total)}</div></div>
              <div><div style={{fontSize:'11px',color:'#9db09f'}}>Total Realisasi</div><div style={{fontSize:'18px',fontWeight:700,color:'#263A29'}}>{fmt(totalRealisasi)}</div></div>
              <div><div style={{fontSize:'11px',color:'#9db09f'}}>Sisa</div><div style={{fontSize:'18px',fontWeight:700,color:rem>=0?'#47654A':'#C06A52'}}>{fmt(Math.abs(rem))}</div></div>
            </div>
            {cats.map(cat=>{
              const items = budgetItems.filter(i=>i.cat===cat);
              return (
                <div key={cat} style={{marginBottom:'18px'}}>
                  <div style={{fontSize:'12px',fontWeight:700,color:'#47654A',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'8px'}}>{cat}</div>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                    <thead><tr style={{background:'#F0F5EF'}}>
                      <th style={{textAlign:'left',padding:'6px 10px',color:'#5a7a5d'}}>Item</th>
                      <th style={{textAlign:'right',padding:'6px 10px',color:'#5a7a5d'}}>Estimasi</th>
                      <th style={{textAlign:'right',padding:'6px 10px',color:'#5a7a5d'}}>Realisasi</th>
                    </tr></thead>
                    <tbody>
                      {items.map(it=>(
                        <tr key={it.id} style={{borderBottom:'1px solid #F0F5EF'}}>
                          <td style={{padding:'6px 10px',color:'#263A29'}}>{it.label}</td>
                          <td style={{padding:'6px 10px',textAlign:'right',color:'#5a7a5d'}}>{fmt(it.estimasi)}</td>
                          <td style={{padding:'6px 10px',textAlign:'right',color:'#263A29',fontWeight:600}}>{fmt(it.realisasi)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}
            <div style={{marginTop:'24px',textAlign:'center',fontSize:'10px',color:'#9db09f'}}>Dibuat dengan Janji Suci Wedding Planner</div>
          </div>
        </div>
      </div>
    </div>
  );
}

