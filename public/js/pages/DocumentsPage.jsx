/* ═══════════════ DOKUMEN PAGE ═══════════════ */
const DOC_CATS = ['Identitas','Surat Resmi','Foto','Keagamaan','Lainnya'];
const DOC_CAT_STYLE = {
  'Identitas':   {bg:'var(--sage-light)', color:'var(--sage-dark)'},
  'Surat Resmi': {bg:'var(--gold-light)', color:'#8a6d42'},
  'Foto':        {bg:'#E3EEF4', color:'#3d6a80'},
  'Keagamaan':   {bg:'#F1E7D6', color:'#8a6d42'},
  'Lainnya':     {bg:'var(--sage-mist)', color:'#7a9482'},
};
const DOC_DEFAULT = [
  {id:1,name:'KTP Mempelai Wanita',cat:'Identitas',done:false,fileUrl:null,fileName:'',fileType:''},
  {id:2,name:'KTP Mempelai Pria',cat:'Identitas',done:false,fileUrl:null,fileName:'',fileType:''},
  {id:3,name:'Kartu Keluarga (KK)',cat:'Identitas',done:false,fileUrl:null,fileName:'',fileType:''},
  {id:4,name:'Akta Kelahiran',cat:'Identitas',done:false,fileUrl:null,fileName:'',fileType:''},
  {id:5,name:'Surat Pengantar RT/RW',cat:'Surat Resmi',done:false,fileUrl:null,fileName:'',fileType:''},
  {id:6,name:'Surat N1–N4 dari Kelurahan',cat:'Surat Resmi',done:false,fileUrl:null,fileName:'',fileType:''},
  {id:7,name:'Surat Izin Orang Tua (jika perlu)',cat:'Surat Resmi',done:false,fileUrl:null,fileName:'',fileType:''},
  {id:8,name:'Pas Foto Ukuran 4x6 (background biru)',cat:'Foto',done:false,fileUrl:null,fileName:'',fileType:''},
  {id:9,name:'Dokumen Pemberkatan / Surat Baptis',cat:'Keagamaan',done:false,fileUrl:null,fileName:'',fileType:''},
  {id:10,name:'Buku Nikah (setelah akad)',cat:'Lainnya',done:false,fileUrl:null,fileName:'',fileType:''},
];

function DocumentsPage({ docs, setDocs, onBack }) {
  const [exp, setExp] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState(DOC_CATS[0]);

  const toggle = id => setDocs(p=>p.map(d=>d.id===id?{...d,done:!d.done}:d));

  const addDoc = () => {
    if (!newName.trim()) return;
    setDocs(p=>[...p, {id:Date.now(), name:newName.trim(), cat:newCat, done:false, fileUrl:null, fileName:'', fileType:''}]);
    setNewName(''); setShowAddForm(false);
  };

  const del = (id) => {
    const item = docs.find(d=>d.id===id);
    if (item && item.fileUrl) { try { URL.revokeObjectURL(item.fileUrl); } catch(e) {} }
    setDocs(p=>p.filter(d=>d.id!==id));
  };

  const handleUpload = (id, file) => {
    if (!file) return;
    const ok = file.type.startsWith('image/') || file.type==='application/pdf';
    if (!ok) { alert('File harus berupa foto (JPG/PNG) atau PDF.'); return; }
    const existing = docs.find(d=>d.id===id);
    if (existing && existing.fileUrl) { try { URL.revokeObjectURL(existing.fileUrl); } catch(e) {} }
    const blobUrl = URL.createObjectURL(file);
    setDocs(p=>p.map(d=>d.id===id?{...d,fileUrl:blobUrl,fileName:file.name,fileType:file.type}:d));
  };
  const removeFile = (id) => {
    const existing = docs.find(d=>d.id===id);
    if (existing && existing.fileUrl) { try { URL.revokeObjectURL(existing.fileUrl); } catch(e) {} }
    setDocs(p=>p.map(d=>d.id===id?{...d,fileUrl:null,fileName:'',fileType:''}:d));
  };

  const done = docs.filter(d=>d.done).length;
  const withFile = docs.filter(d=>d.fileUrl).length;
  const pct = docs.length ? Math.round(done/docs.length*100) : 0;
  const R = 30, CIRC = 2*Math.PI*R;

  return (
    <div>
      <PageHeader title="Dokumen Legal" subtitle="Checklist berkas administrasi nikah" onBack={onBack} right={
        <button onClick={()=>setShowAddForm(s=>!s)} className="text-xs font-bold text-white px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap" style={{background:'var(--sage-dark)'}}>
          {Ic.plus} Tambah Dokumen
        </button>
      }/>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mt-4 mb-4 lg:max-w-md">
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{docs.length}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Total Dokumen</p></div>
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-dark)'}}>{done}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Lengkap</p></div>
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'#3d6a80'}}>{withFile}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Ada Scan/Foto</p></div>
      </div>

      {/* Progress ring card */}
      <div className="card p-5 mb-4" style={{display:'flex',alignItems:'center',gap:'20px'}}>
        <div style={{position:'relative',width:'72px',height:'72px',flexShrink:0}}>
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={R} fill="none" stroke="var(--sage-light)" strokeWidth="7"/>
            <circle cx="36" cy="36" r={R} fill="none" stroke="var(--sage)" strokeWidth="7" strokeLinecap="round"
              strokeDasharray={CIRC} strokeDashoffset={CIRC*(1-pct/100)}
              transform="rotate(-90 36 36)" style={{transition:'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)'}}/>
          </svg>
          <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span className="font-serif" style={{fontSize:'17px',fontWeight:700,color:'var(--sage-deep)'}}>{pct}%</span>
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg font-bold" style={{color:'var(--sage-deep)'}}>Kelengkapan Dokumen</h3>
          <p className="text-xs" style={{color:'#9db09f'}}>{done} dari {docs.length} dokumen sudah lengkap</p>
        </div>
      </div>

      {/* Add doc form */}
      {showAddForm && (
        <div className="card p-5 mb-4 anim-fadeup">
          <span className="text-[10px] font-bold tracking-widest uppercase block mb-3" style={{color:'var(--sage)'}}>Tambah Dokumen Baru</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div><label className="lbl text-xs">Nama Dokumen</label><input className="inp" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Contoh: Surat Keterangan Domisili" onKeyDown={e=>e.key==='Enter'&&addDoc()}/></div>
            <div><label className="lbl text-xs">Kategori</label><select className="inp" value={newCat} onChange={e=>setNewCat(e.target.value)}>{DOC_CATS.map(c=><option key={c}>{c}</option>)}</select></div>
          </div>
          <button onClick={addDoc} className="btn-sage">+ Tambah ke Daftar</button>
        </div>
      )}

      {/* Grouped by category */}
      {DOC_CATS.map(cat=>{
        const items = docs.filter(d=>d.cat===cat);
        if (items.length===0) return null;
        const catDone = items.filter(d=>d.done).length;
        return (
          <div key={cat} className="mb-5">
            <div className="flex justify-between mb-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wider" style={{color:DOC_CAT_STYLE[cat].color}}>{cat}</span>
              <span className="text-xs" style={{color:'#9db09f'}}>{catDone}/{items.length}</span>
            </div>
            <div className="space-y-2.5">
              {items.map(d=>(
                <div key={d.id} className="card overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer" onClick={()=>setExp(exp===d.id?null:d.id)}>
                    <input type="checkbox" className="chk" checked={d.done} onChange={()=>toggle(d.id)} onClick={e=>e.stopPropagation()}/>
                    <p className={`text-sm font-medium flex-1 min-w-0 truncate ${d.done?'line-through':''}`} style={{color:d.done?'#9db09f':'var(--sage-deep)'}}>{d.name}</p>
                    {d.fileUrl && (
                      <div style={{width:'30px',height:'30px',borderRadius:'8px',overflow:'hidden',flexShrink:0,border:'1px solid var(--sage-mid)'}}>
                        {d.fileType==='application/pdf' ? (
                          <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--rust-light)',color:'var(--rust)'}}>{Ic.doc}</div>
                        ) : (
                          <img src={d.fileUrl} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                        )}
                      </div>
                    )}
                    <span style={{color:'var(--sage)',flexShrink:0,transform:exp===d.id?'rotate(90deg)':'none',transition:'transform .2s'}}>{Ic.chevron}</span>
                  </div>
                  {exp===d.id && (
                    <div className="px-4 pb-4 pt-3 border-t space-y-3 anim-fadeup" style={{borderColor:'var(--sage-mist)'}} onClick={e=>e.stopPropagation()}>
                      <div>
                        <label className="lbl text-xs">Foto/Scan Dokumen <span style={{fontWeight:400,color:'#9db09f'}}>(opsional — JPG, PNG, atau PDF)</span></label>
                        <label style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',padding:'10px 14px',
                          background:'var(--sage-mist)',border:'1.5px dashed var(--sage-mid)',borderRadius:'14px',
                          cursor:'pointer',fontSize:'13px',color:'var(--sage-dark)',fontWeight:600}}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"/></svg>
                          {d.fileName ? 'Ganti file' : 'Upload foto atau scan'}
                          <input type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" style={{display:'none'}}
                            onChange={e=>handleUpload(d.id, e.target.files[0])}/>
                        </label>
                        {d.fileName && (
                          <div style={{display:'flex',alignItems:'center',gap:'10px',marginTop:'8px',padding:'8px 10px',background:'white',border:'1px solid var(--sage-mid)',borderRadius:'12px'}}>
                            {d.fileType==='application/pdf' ? (
                              <div style={{width:'32px',height:'32px',borderRadius:'8px',background:'var(--rust-light)',color:'var(--rust)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{Ic.doc}</div>
                            ) : (
                              <img src={d.fileUrl} alt="" style={{width:'32px',height:'32px',borderRadius:'8px',objectFit:'cover',flexShrink:0}}/>
                            )}
                            <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" style={{flex:1,minWidth:0,fontSize:'12px',color:'var(--sage-deep)',fontWeight:600,textDecoration:'underline',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.fileName}</a>
                            <button onClick={()=>removeFile(d.id)} style={{background:'none',border:'none',color:'var(--rust)',cursor:'pointer',flexShrink:0}}>{Ic.trash}</button>
                          </div>
                        )}
                      </div>
                      <button onClick={()=>del(d.id)} className="text-xs font-semibold flex items-center gap-1" style={{color:'var(--rust)'}}>{Ic.trash} Hapus dokumen ini</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {docs.length===0 && (
        <div className="card p-8 text-center"><div className="text-4xl mb-3">📄</div><p className="text-sm" style={{color:'#9db09f'}}>Belum ada dokumen. Tambahkan lewat tombol "+ Tambah Dokumen" di atas.</p></div>
      )}
    </div>
  );
}

