/* ═══════════════ CHECKLIST PAGE ═══════════════ */
const CHECKLIST_CATS = ['Dokumen','Venue & Dekorasi','Katering','Busana','Dokumentasi','Undangan','Lainnya'];
const CHECKLIST_CAT_COLOR = {
  'Dokumen':          '#3d6a80',
  'Venue & Dekorasi': '#6B8F6E',
  'Katering':         '#B85C2E',
  'Busana':           '#7d4a8f',
  'Dokumentasi':      '#B23A6B',
  'Undangan':         '#8a6d42',
  'Lainnya':          '#5a7a5d',
};
const checklistCatColor = (cat, idx) => CHECKLIST_CAT_COLOR[cat] || ['#6B8F6E','#B85C2E','#3d6a80','#7d4a8f','#8a6d42','#B23A6B'][idx%6];

function ChecklistPage({ list, setList, loading, data }) {
  const [exp, setExp] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState('');
  const [newCatCustom, setNewCatCustom] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('semua');
  const [exporting, setExporting] = useState(false);
  const printRef = useRef(null);

  const cats = [...new Set(list.map(c=>c.category))];
  const done = list.filter(c=>c.done).length;
  const urgentOpen = list.filter(c=>c.urgent && !c.done).length;

  const toggle = id => setList(p=>p.map(c=>c.id===id?{...c,done:!c.done}:c));
  const upd = (id,k,v) => setList(p=>p.map(c=>c.id===id?{...c,[k]:v}:c));
  const delItem = id => setList(p=>p.filter(c=>c.id!==id));

  const addItem = () => {
    const cat = newCat==='__custom__' ? newCatCustom.trim() : newCat;
    if (!newTitle.trim() || !cat) return;
    setList(p=>[...p, {id:Date.now(), category:cat, title:newTitle.trim(), urgent:false, done:false, deadlineDisplay:'', note:'', pic:''}]);
    setNewTitle(''); setNewCat(''); setNewCatCustom(''); setShowAdd(false);
  };

  const deadlineInfo = (item) => {
    if (!item.deadlineDisplay) return null;
    const iso = displayToIso(item.deadlineDisplay);
    if (!iso) return null;
    const d = daysUntil(iso);
    if (d === null) return null;
    if (d < 0) return { text:`Terlambat ${Math.abs(d)} hari`, color:'var(--rust)' };
    if (d === 0) return { text:'Jatuh tempo hari ini', color:'var(--rust)' };
    if (d <= 7) return { text:`H-${d}`, color:'#8a6d42' };
    return { text:`H-${d}`, color:'#9db09f' };
  };

  const matchSearch = (item) => !search.trim() || item.title.toLowerCase().includes(search.trim().toLowerCase());
  const matchFilter = (item) => {
    if (filter==='belum') return !item.done;
    if (filter==='selesai') return item.done;
    if (filter==='prioritas') return item.urgent && !item.done;
    return true;
  };

  const exportJpg = async () => {
    if (!printRef.current) return;
    setExporting(true);
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const canvas = await html2canvas(printRef.current, { scale:2, useCORS:true, backgroundColor:'#ffffff' });
      const link = document.createElement('a');
      link.download = `Checklist-${(data?.namaW||'Mempelai')}-${(data?.namaP||'Mempelai')}.jpg`.replace(/\s+/g,'');
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch(e) { alert('Gagal membuat JPG. Coba lagi.'); }
    setExporting(false);
  };

  if (loading) return (
    <div>
      <Shim h="32px" w="200px"/><Shim h="16px" w="150px" mb="20px"/>
      <div className="lg:grid lg:grid-cols-2 lg:gap-4">
        {[1,2,3,4].map(i=><div key={i} className="card p-5 mb-3"><Shim/><Shim w="80%"/><Shim h="10px" w="50%"/></div>)}
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Checklist" subtitle="Tandai, atur deadline, dan kelola tugas persiapan" right={
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <button onClick={exportJpg} disabled={exporting} className="text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap" style={{background:'white',color:'var(--sage-dark)',border:'1.5px solid var(--sage-mid)'}}>
            {exporting ? '...' : '🖼️ JPG'}
          </button>
          <button onClick={()=>setShowAdd(s=>!s)} className="text-xs font-bold text-white px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap" style={{background:'var(--sage-dark)'}}>
            {Ic.plus} Item
          </button>
        </div>
      }/>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mt-4 mb-4 lg:max-w-md">
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{done}/{list.length}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Selesai</p></div>
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--rust)'}}>{urgentOpen}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Prioritas</p></div>
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{list.length ? Math.round(done/list.length*100) : 0}%</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Progress</p></div>
      </div>

      {/* Visual breakdown by category */}
      {list.length>0 && (
        <div className="card p-5 mb-4">
          <span className="text-[10px] font-bold tracking-widest uppercase block mb-3" style={{color:'var(--sage)'}}>Progress per Kategori</span>
          <div style={{display:'flex',height:'14px',borderRadius:'999px',overflow:'hidden',marginBottom:'14px'}}>
            {cats.map((cat,idx)=>{
              const w = list.length>0 ? (list.filter(c=>c.category===cat).length/list.length*100) : 0;
              const catDone = list.filter(c=>c.category===cat && c.done).length;
              const catTotal = list.filter(c=>c.category===cat).length;
              return <div key={cat} style={{width:`${w}%`,background:checklistCatColor(cat,idx),opacity:catTotal>0?(0.35+0.65*(catDone/catTotal)):0.35}} title={`${cat}: ${catDone}/${catTotal}`}/>;
            })}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:'8px'}}>
            {cats.map((cat,idx)=>{
              const catDone = list.filter(c=>c.category===cat && c.done).length;
              const catTotal = list.filter(c=>c.category===cat).length;
              return (
                <div key={cat} style={{display:'flex',alignItems:'center',gap:'6px'}}>
                  <div style={{width:'10px',height:'10px',borderRadius:'3px',background:checklistCatColor(cat,idx),flexShrink:0}}/>
                  <span style={{fontSize:'11px',color:'var(--sage-deep)',fontWeight:600}}>{cat}</span>
                  <span style={{fontSize:'10px',color:'#9db09f',marginLeft:'auto'}}>{catDone}/{catTotal}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add item form */}
      {showAdd && (
        <div className="card p-5 mb-4 anim-fadeup">
          <span className="text-[10px] font-bold tracking-widest uppercase block mb-3" style={{color:'var(--sage)'}}>Tambah Item Checklist</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div><label className="lbl text-xs">Judul Tugas</label><input className="inp" value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Contoh: Cetak nomor meja" onKeyDown={e=>e.key==='Enter'&&addItem()}/></div>
            <div>
              <label className="lbl text-xs">Kategori</label>
              <select className="inp" value={newCat} onChange={e=>setNewCat(e.target.value)}>
                <option value="">Pilih kategori…</option>
                {CHECKLIST_CATS.map(c=><option key={c} value={c}>{c}</option>)}
                {cats.filter(c=>!CHECKLIST_CATS.includes(c)).map(c=><option key={c} value={c}>{c}</option>)}
                <option value="__custom__">+ Kategori baru…</option>
              </select>
            </div>
          </div>
          {newCat==='__custom__' && (
            <div className="mb-3"><label className="lbl text-xs">Nama Kategori Baru</label><input className="inp" value={newCatCustom} onChange={e=>setNewCatCustom(e.target.value)} placeholder="Contoh: Adat & Seserahan"/></div>
          )}
          <button onClick={addItem} className="btn-sage">+ Tambah ke Checklist</button>
        </div>
      )}

      {/* Search + filter */}
      <div className="mb-4">
        <input className="inp mb-3" value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Cari tugas…"/>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {[
            {id:'semua', label:'Semua'},
            {id:'belum', label:'Belum Selesai'},
            {id:'prioritas', label:'Prioritas'},
            {id:'selesai', label:'Selesai'},
          ].map(f=>(
            <button key={f.id} onClick={()=>setFilter(f.id)} className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
              style={filter===f.id?{background:'var(--sage-dark)',color:'white'}:{background:'white',color:'#7a9482',border:'1px solid var(--sage-mid)'}}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-4 lg:items-start">
        {list.length===0 && <div className="card p-8 text-center lg:col-span-2"><div className="text-4xl mb-3">📋</div><p className="text-sm" style={{color:'#9db09f'}}>Checklist belum tersedia</p></div>}
        {cats.map(cat=>{
          const items = list.filter(c=>c.category===cat).filter(matchSearch).filter(matchFilter);
          const cd = list.filter(c=>c.category===cat && c.done).length;
          const total = list.filter(c=>c.category===cat).length;
          if (items.length===0) return null;
          return (
            <div key={cat} className="mb-4">
              <div className="flex justify-between mb-2 px-1">
                <span className="text-xs font-bold uppercase tracking-wider" style={{color:'var(--sage)'}}>{cat}</span>
                <span className="text-xs" style={{color:'#9db09f'}}>{cd}/{total}</span>
              </div>
              <div className="space-y-2.5">
                {items.map(it=>{
                  const dl = deadlineInfo(it);
                  return (
                    <div key={it.id} className="card overflow-hidden">
                      <div onClick={()=>setExp(exp===it.id?null:it.id)} className="flex items-center gap-3 px-4 py-3.5 cursor-pointer">
                        <input type="checkbox" className="chk" checked={it.done} onChange={()=>toggle(it.id)} onClick={e=>e.stopPropagation()}/>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium leading-snug truncate ${it.done?'line-through':''}`} style={{color: it.done?'#9db09f':'var(--sage-deep)'}}>{it.title}</p>
                          <div style={{display:'flex',gap:'8px',alignItems:'center',flexWrap:'wrap',marginTop:'2px'}}>
                            {it.urgent && !it.done && <span className="text-[10px] font-bold" style={{color:'var(--rust)'}}>⚡ Prioritas</span>}
                            {dl && !it.done && <span className="text-[10px] font-bold" style={{color:dl.color}}>📅 {dl.text}</span>}
                            {it.pic && <span className="text-[10px]" style={{color:'#9db09f'}}>👤 {it.pic}</span>}
                          </div>
                        </div>
                        <span style={{color:'var(--sage)',flexShrink:0,transform:exp===it.id?'rotate(90deg)':'none',transition:'transform .2s'}}>{Ic.chevron}</span>
                      </div>
                      {exp===it.id && (
                        <div className="px-4 pb-4 pt-3 border-t space-y-3 anim-fadeup" style={{borderColor:'var(--sage-mist)'}} onClick={e=>e.stopPropagation()}>
                          <div><label className="lbl text-xs">Judul Tugas</label><input className="inp" value={it.title} onChange={e=>upd(it.id,'title',e.target.value)}/></div>
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="lbl text-xs">Deadline</label><DateField value={it.deadlineDisplay||''} onChange={v=>upd(it.id,'deadlineDisplay',v)} placeholder="DD/MM/YYYY"/></div>
                            <div><label className="lbl text-xs">PIC <span style={{fontWeight:400,color:'#9db09f'}}>(opsional)</span></label><input className="inp" value={it.pic||''} onChange={e=>upd(it.id,'pic',e.target.value)} placeholder="Contoh: Ibu, WO"/></div>
                          </div>
                          <div><label className="lbl text-xs">Catatan <span style={{fontWeight:400,color:'#9db09f'}}>(opsional)</span></label><textarea className="inp" rows="2" value={it.note||''} onChange={e=>upd(it.id,'note',e.target.value)} placeholder="Detail tambahan" style={{resize:'none'}}/></div>
                          <div>
                            <label className="lbl text-xs">Prioritas</label>
                            <div className="flex gap-2">
                              <button onClick={()=>upd(it.id,'urgent',false)} className="flex-1 py-2 rounded-xl text-xs font-bold transition-all" style={!it.urgent?{background:'var(--sage-dark)',color:'white'}:{background:'var(--sage-mist)',color:'#9db09f'}}>Biasa</button>
                              <button onClick={()=>upd(it.id,'urgent',true)} className="flex-1 py-2 rounded-xl text-xs font-bold transition-all" style={it.urgent?{background:'var(--rust)',color:'white'}:{background:'var(--sage-mist)',color:'#9db09f'}}>Prioritas Tinggi</button>
                            </div>
                          </div>
                          <div style={{display:'flex',gap:'8px'}}>
                            <button onClick={()=>setExp(null)} className="btn-sage" style={{padding:'11px'}}>✓ Simpan</button>
                            <button onClick={()=>delItem(it.id)} style={{flexShrink:0,padding:'11px 16px',borderRadius:'14px',border:'1.5px solid #f0d3ca',background:'transparent',color:'var(--rust)',fontWeight:600,fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}>{Ic.trash} Hapus</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden printable checklist for JPG export */}
      <div style={{height:0, overflow:'hidden'}} aria-hidden="true">
        <div ref={printRef} style={{width:'800px', background:'white', fontFamily:"'DM Sans', sans-serif"}}>
          <div style={{background:'linear-gradient(135deg, #6B8F6E, #47654A)', padding:'32px 40px', color:'white'}}>
            <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',opacity:.85,marginBottom:'8px'}}>JANJI SUCI · WEDDING PLANNER</div>
            <div style={{fontFamily:"'Playfair Display', serif",fontSize:'28px',fontWeight:700}}>{data?.namaW||'Mempelai'} & {data?.namaP||'Mempelai'}</div>
            <div style={{fontSize:'12px',opacity:.85,marginTop:'4px'}}>Checklist Persiapan Pernikahan — {done}/{list.length} Selesai</div>
          </div>
          <div style={{padding:'28px 40px'}}>
            {cats.map(cat=>{
              const items = list.filter(c=>c.category===cat);
              return (
                <div key={cat} style={{marginBottom:'18px'}}>
                  <div style={{fontSize:'12px',fontWeight:700,color:'#47654A',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:'8px'}}>{cat}</div>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                    <thead><tr style={{background:'#F0F5EF'}}>
                      <th style={{textAlign:'left',padding:'6px 10px',color:'#5a7a5d',width:'30px'}}>✓</th>
                      <th style={{textAlign:'left',padding:'6px 10px',color:'#5a7a5d'}}>Tugas</th>
                      <th style={{textAlign:'left',padding:'6px 10px',color:'#5a7a5d'}}>Deadline</th>
                      <th style={{textAlign:'left',padding:'6px 10px',color:'#5a7a5d'}}>PIC</th>
                    </tr></thead>
                    <tbody>
                      {items.map(it=>(
                        <tr key={it.id} style={{borderBottom:'1px solid #F0F5EF'}}>
                          <td style={{padding:'6px 10px',color:it.done?'#47654A':'#9db09f',fontWeight:700}}>{it.done?'✓':'○'}</td>
                          <td style={{padding:'6px 10px',color:'#263A29',textDecoration:it.done?'line-through':'none'}}>{it.title}{it.urgent && !it.done ? ' ⚡':''}</td>
                          <td style={{padding:'6px 10px',color:'#5a7a5d'}}>{it.deadlineDisplay||'—'}</td>
                          <td style={{padding:'6px 10px',color:'#5a7a5d'}}>{it.pic||'—'}</td>
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

