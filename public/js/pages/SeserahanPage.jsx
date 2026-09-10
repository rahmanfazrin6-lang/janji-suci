/* ═══════════════ SESERAHAN (GIFTS) PAGE — NEW ═══════════════ */
const SCATS = ['Pakaian','Kosmetik/Skincare','Aksesoris','Sepatu/Tas','Makanan/Kue','Perlengkapan Ibadah','Lainnya'];
function SeserahanPage({ items, setItems, onBack }) {
  const [exp, setExp] = useState(null);
  const add = () => { const id=Date.now(); setItems(p=>[...p,{id,cat:'Aksesoris',name:'',varian:'',harga:'',qty:1,bayar:'',status:'belum',link:'',buktiUrl:null,buktiName:'',buktiType:''}]); setExp(id); };
  const upd = (id,k,v) => setItems(p=>p.map(x=>x.id===id?{...x,[k]:v}:x));
  const del = id => setItems(p=>p.filter(x=>x.id!==id));

  const handleBuktiUpload = (id, file) => {
    if (!file) return;
    const okTypes = ['image/jpeg','image/jpg','image/png','application/pdf'];
    const okExts = ['.jpg','.jpeg','.png','.pdf'];
    const ext = '.'+file.name.split('.').pop().toLowerCase();
    if (!okTypes.includes(file.type) && !okExts.includes(ext)) {
      alert('File harus berformat JPG, JPEG, PNG, atau PDF.');
      return;
    }
    // Revoke previous blob URL (if any) to avoid memory leaks
    const existing = items.find(x=>x.id===id);
    if (existing && existing.buktiUrl) {
      try { URL.revokeObjectURL(existing.buktiUrl); } catch(e) {}
    }
    // Blob URL — unlike data: URLs, this can be opened/navigated to reliably in a new tab
    const blobUrl = URL.createObjectURL(file);
    setItems(p=>p.map(x=>x.id===id?{...x,buktiUrl:blobUrl,buktiName:file.name,buktiType:file.type}:x));
  };

  const removeBukti = (id) => {
    const existing = items.find(x=>x.id===id);
    if (existing && existing.buktiUrl) {
      try { URL.revokeObjectURL(existing.buktiUrl); } catch(e) {}
    }
    setItems(p=>p.map(x=>x.id===id?{...x,buktiUrl:null,buktiName:'',buktiType:''}:x));
  };

  const totalItems = items.length;
  const totalHarga = items.reduce((a,it)=>a+(Number(it.harga)||0)*(Number(it.qty)||1),0);
  const doneCount = items.filter(it=>it.status==='sudah').length;

  return (
    <div>
      <PageHeader title="Seserahan" subtitle="Kelola daftar hantaran & mahar" onBack={onBack} right={
        <button className="text-xs font-bold text-white px-3 py-1.5 rounded-xl flex items-center gap-1" style={{background:'var(--sage-dark)'}} onClick={add}>{Ic.plus} Tambah</button>
      }/>
      <div className="grid grid-cols-3 gap-2.5 mb-4 mt-4 lg:max-w-md">
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{totalItems}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Item</p></div>
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-dark)'}}>{doneCount}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Sudah Beli</p></div>
        <div className="stat-tile"><p className="font-serif text-sm font-bold mt-1.5" style={{color:'var(--sage-deep)'}}>{fmt(totalHarga)}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Total Nilai</p></div>
      </div>
      {items.length===0 && <div className="card p-8 text-center"><div className="text-4xl mb-3">🎁</div><p className="text-sm" style={{color:'#9db09f'}}>Belum ada item seserahan</p></div>}
      <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
        {items.map(it=>(
          <div key={it.id} className="card overflow-hidden self-start">
            <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer" onClick={()=>setExp(exp===it.id?null:it.id)}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{background:'var(--sage-light)',color:'var(--sage-dark)'}}>{Ic.gift}</div>
              <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate" style={{color:'var(--sage-deep)'}}>{it.name||'Item baru'}</p><p className="text-xs" style={{color:'#9db09f'}}>{it.cat} • {it.qty||1}x • {fmt(it.harga)}</p></div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={it.status==='sudah'?{background:'var(--sage-light)',color:'var(--sage-dark)'}:{background:'var(--sage-mist)',color:'#9db09f'}}>{it.status==='sudah'?'Sudah Beli':'Belum Beli'}</span>
            </div>
            {exp===it.id && (
              <div className="px-4 pb-4 pt-3 border-t space-y-3 anim-fadeup" style={{borderColor:'var(--sage-mist)'}} onClick={e=>e.stopPropagation()}>
                <div><label className="lbl text-xs">Nama Barang</label><input className="inp" value={it.name} onChange={e=>upd(it.id,'name',e.target.value)} placeholder="Contoh: Sepatu"/></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="lbl text-xs">Kategori</label><select className="inp" value={it.cat} onChange={e=>upd(it.id,'cat',e.target.value)}>{SCATS.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div><label className="lbl text-xs">Varian</label><input className="inp" value={it.varian} onChange={e=>upd(it.id,'varian',e.target.value)} placeholder="Warna / ukuran"/></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="lbl text-xs">Harga (Rp)</label>
                    <div style={{position:'relative'}}>
                      <span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',fontSize:'12px',fontWeight:600,color:'var(--sage-dark)',pointerEvents:'none'}}>Rp</span>
                      <input className="inp" style={{paddingLeft:'30px'}} inputMode="numeric" placeholder="0"
                        value={it.harga ? fmtRpInput(String(it.harga)) : ''}
                        onChange={e=>upd(it.id,'harga',parseRpInput(e.target.value))}/>
                    </div>
                  </div>
                  <div><label className="lbl text-xs">Qty</label><input type="number" className="inp" value={it.qty} onChange={e=>upd(it.id,'qty',e.target.value)} placeholder="1"/></div>
                </div>

                {/* Link produk — Shopee, Tokopedia, dll */}
                <div>
                  <label className="lbl text-xs">Link Produk <span style={{fontWeight:400,color:'#9db09f'}}>(opsional)</span></label>
                  <input className="inp" value={it.link||''} onChange={e=>upd(it.id,'link',e.target.value)}
                    placeholder="https://shopee.co.id/... atau https://tokopedia.com/..." inputMode="url"/>
                  {it.link && (
                    <a href={it.link} target="_blank" rel="noopener noreferrer"
                      style={{display:'inline-flex',alignItems:'center',gap:'6px',marginTop:'8px',
                        padding:'7px 14px',borderRadius:'999px',
                        background:'var(--gold-light)',border:'1px solid #ddc9a3',
                        fontSize:'12px',fontWeight:700,color:'#8a6d42',textDecoration:'none'}}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.07 0l-2.83 2.83a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                      Buka Link Produk
                    </a>
                  )}
                </div>

                {/* Bukti transaksi upload */}
                <div>
                  <label className="lbl text-xs">Bukti Transaksi <span style={{fontWeight:400,color:'#9db09f'}}>(opsional — JPG, PNG, atau PDF)</span></label>
                  <label style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 14px',
                    background:'var(--sage-mist)',border:'1.5px dashed var(--sage-mid)',borderRadius:'14px',
                    cursor:'pointer',fontSize:'13px',color:'var(--sage-dark)',fontWeight:600}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"/></svg>
                    {it.buktiName ? 'Ganti file' : 'Upload bukti transaksi'}
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" style={{display:'none'}}
                      onChange={e=>handleBuktiUpload(it.id, e.target.files[0])}/>
                  </label>
                  {it.buktiName && (
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginTop:'8px',padding:'8px 10px',background:'white',border:'1px solid var(--sage-mid)',borderRadius:'12px'}}>
                      {it.buktiType==='application/pdf' ? (
                        <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'var(--rust-light)',color:'var(--rust)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{Ic.doc}</div>
                      ) : (
                        <img src={it.buktiUrl} alt="Bukti" style={{width:'36px',height:'36px',borderRadius:'8px',objectFit:'cover',flexShrink:0}}/>
                      )}
                      <a href={it.buktiUrl} target="_blank" rel="noopener noreferrer" style={{flex:1,minWidth:0,fontSize:'12px',color:'var(--sage-deep)',fontWeight:600,textDecoration:'underline',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                        {it.buktiName}
                      </a>
                      <button onClick={()=>removeBukti(it.id)}
                        style={{background:'none',border:'none',color:'var(--rust)',cursor:'pointer',flexShrink:0}}>{Ic.trash}</button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="lbl text-xs">Status Pembelian</label>
                  <div className="flex gap-2">
                    <button onClick={()=>upd(it.id,'status','belum')} className="flex-1 py-2 rounded-xl text-xs font-bold transition-all" style={it.status==='belum'?{background:'var(--sage-dark)',color:'white'}:{background:'var(--sage-mist)',color:'#9db09f'}}>Belum Beli</button>
                    <button onClick={()=>upd(it.id,'status','sudah')} className="flex-1 py-2 rounded-xl text-xs font-bold transition-all" style={it.status==='sudah'?{background:'var(--sage-dark)',color:'white'}:{background:'var(--sage-mist)',color:'#9db09f'}}>Sudah Beli</button>
                  </div>
                </div>

                {/* Explicit Save / OK + Delete */}
                <div style={{display:'flex',gap:'8px',paddingTop:'4px'}}>
                  <button onClick={()=>setExp(null)} className="btn-sage" style={{padding:'11px'}}>✓ Simpan</button>
                  <button onClick={()=>del(it.id)} style={{flexShrink:0,padding:'11px 16px',borderRadius:'14px',border:'1.5px solid #f0d3ca',background:'transparent',color:'var(--rust)',fontWeight:600,fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}>
                    {Ic.trash} Hapus
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

