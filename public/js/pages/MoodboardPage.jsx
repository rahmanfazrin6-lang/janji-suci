/* ═══════════════ MOODBOARD PAGE ═══════════════ */
const THEME_TAGS = ['Rustic','Elegant','Minimalis','Bohemian','Tradisional/Adat','Modern','Vintage','Garden Party','Beach Wedding','Industrial','Glamour','Klasik','Romantic','Outdoor'];
const INSPIRE_CATS = ['Dekorasi & Venue','Busana Pengantin','Bunga & Florals','Makeup & Hair','Cake & Dessert','Undangan & Souvenir','Lainnya'];

/* Kata kunci pencarian Pinterest kontekstual per kategori papan inspirasi */
const PINTEREST_CAT_QUERY = {
  'Dekorasi & Venue':'wedding venue decoration ideas',
  'Busana Pengantin':'wedding dress inspiration',
  'Bunga & Florals':'wedding flower bouquet ideas',
  'Makeup & Hair':'wedding makeup hairstyle ideas',
  'Cake & Dessert':'wedding cake dessert table ideas',
  'Undangan & Souvenir':'wedding invitation souvenir ideas',
  'Lainnya':'wedding ideas inspiration',
};

/* Template referensi siap pakai — titik awal supaya client tidak bingung mulai dari mana */
const MOOD_TEMPLATES = [
  { id:'sage-green', name:'Sage Green Romance', desc:'Hijau sage lembut dipadu krem dan gold — timeless & elegan.', tags:['Elegant','Romantic','Garden Party'], colors:['#6B8F6E','#AECAB0','#F1E7D6','#B99A6B'], q:'sage green wedding theme decoration' },
  { id:'rustic-garden', name:'Rustic Garden', desc:'Nuansa alami dengan kayu, dedaunan hijau, dan bunga liar.', tags:['Rustic','Garden Party','Outdoor'], colors:['#7C9473','#C9B896','#F3EDE0','#5B6B4F'], q:'rustic garden wedding decoration' },
  { id:'elegant-minimalist', name:'Elegant Minimalist', desc:'Warna netral, garis bersih, kesan mewah namun sederhana.', tags:['Elegant','Minimalis','Modern'], colors:['#EDE7DD','#B8A99A','#3D3D3D','#FFFFFF'], q:'elegant minimalist wedding' },
  { id:'bohemian', name:'Bohemian Dreamy', desc:'Terracotta, macrame, dan sentuhan bebas berjiwa.', tags:['Bohemian','Vintage','Romantic'], colors:['#C97C5D','#E8C4A0','#8A6552','#F5EBDD'], q:'bohemian wedding decoration' },
  { id:'tradisional-adat', name:'Tradisional Adat', desc:'Warna emas dan merah dengan sentuhan budaya Nusantara.', tags:['Tradisional/Adat','Klasik'], colors:['#8B2E2E','#D4AF37','#3B1F1F','#F5E6C8'], q:'pernikahan adat tradisional indonesia' },
  { id:'modern-industrial', name:'Modern Industrial', desc:'Beton, besi, dan monokrom untuk pernikahan urban.', tags:['Modern','Industrial'], colors:['#4A4A4A','#2B2B2B','#D9D2C5','#8C8C8C'], q:'industrial wedding venue decoration' },
  { id:'beach-wedding', name:'Beach Wedding', desc:'Biru laut, pasir putih, dan suasana pantai yang santai.', tags:['Beach Wedding','Outdoor','Romantic'], colors:['#A8C8D8','#F5EFE0','#5C7A8A','#E8DCC8'], q:'beach wedding decoration ideas' },
  { id:'vintage-classic', name:'Vintage Classic', desc:'Mawar pastel, renda, dan nuansa klasik era lampau.', tags:['Vintage','Klasik','Romantic'], colors:['#D9A5A5','#EDD9C4','#8B6F5C','#F7EDE2'], q:'vintage classic wedding theme' },
];

const pinterestUrl = (query) => `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`;

/* Small red "Pinterest-style" glyph — color + generic search mark, no logo reproduction */
const PinMark = ({ size=16 }) => (
  <div style={{width:size,height:size,borderRadius:'50%',background:'#E60023',color:'white',
    display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.62,fontWeight:800,
    fontFamily:'Georgia, serif',flexShrink:0}}>P</div>
);

function MoodboardPage({ data, notes, setNotes, moodTags, setMoodTags, palette, setPalette, inspirationItems, setInspirationItems, onBack }) {
  const [customTag, setCustomTag] = useState('');
  const [draft, setDraft] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newLink, setNewLink] = useState('');
  const [addCat, setAddCat] = useState(INSPIRE_CATS[0]);
  const [filterCat, setFilterCat] = useState('semua');
  const [pinQuery, setPinQuery] = useState('');

  const toggleTag = (tag) => setMoodTags(prev => prev.includes(tag) ? prev.filter(t=>t!==tag) : [...prev, tag]);
  const addCustomTag = () => {
    const t = customTag.trim();
    if (!t) return;
    if (!moodTags.includes(t)) setMoodTags(prev=>[...prev, t]);
    setCustomTag('');
  };

  const addColor = (hex) => setPalette(p=>[...p, {id:Date.now(), color:hex, label:`Warna ${p.length+1}`}]);
  const updateColorLabel = (id, label) => setPalette(p=>p.map(c=>c.id===id?{...c,label}:c));
  const removeColor = (id) => setPalette(p=>p.filter(c=>c.id!==id));

  const applyTemplate = (tpl) => {
    const newSwatches = tpl.colors.map((c,i)=>({id:Date.now()+i, color:c, label:`${tpl.name} ${i+1}`}));
    setPalette(p=>[...p, ...newSwatches]);
    setMoodTags(prev => Array.from(new Set([...prev, ...tpl.tags])));
  };

  const runPinSearch = () => { if (pinQuery.trim()) window.open(pinterestUrl(pinQuery.trim()+' pernikahan'), '_blank'); };

  const addNote = () => { if(!draft.trim()) return; setNotes(n=>[...n,{id:Date.now(),text:draft.trim()}]); setDraft(''); };
  const delNote = id => setNotes(n=>n.filter(x=>x.id!==id));

  const handleImageUpload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('File harus berupa gambar (JPG, PNG, dsb).'); return; }
    const blobUrl = URL.createObjectURL(file);
    setInspirationItems(items=>[...items, {id:Date.now(), cat:addCat, type:'image', src:blobUrl, note:newNote.trim(), fileName:file.name}]);
    setNewNote('');
  };

  const addLinkItem = () => {
    const url = newLink.trim();
    if (!url) return;
    setInspirationItems(items=>[...items, {id:Date.now(), cat:addCat, type:'link', src:url, note:newNote.trim(), fileName:''}]);
    setNewLink(''); setNewNote('');
  };

  const removeInspiration = (id) => {
    const item = inspirationItems.find(x=>x.id===id);
    if (item && item.type==='image' && item.src) { try { URL.revokeObjectURL(item.src); } catch(e) {} }
    setInspirationItems(items=>items.filter(x=>x.id!==id));
  };

  const hostnameOf = (url) => { try { return new URL(url).hostname.replace('www.',''); } catch(e) { return 'Link'; } };

  const filtered = filterCat==='semua' ? inspirationItems : inspirationItems.filter(x=>x.cat===filterCat);
  const catCounts = INSPIRE_CATS.reduce((acc,c)=>{ acc[c]=inspirationItems.filter(x=>x.cat===c).length; return acc; },{});

  return (
    <div>
      <PageHeader title="Moodboard & Inspirasi" subtitle="Kumpulkan gaya, warna, dan referensi visual pernikahan kalian" onBack={onBack}/>

      {/* Jelajahi Pinterest — quick search */}
      <div className="card p-5 mt-4 mb-4" style={{background:'linear-gradient(135deg, var(--sage-light), var(--cream))'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
          <PinMark size={34}/>
          <div>
            <h3 className="font-serif" style={{fontWeight:700,fontSize:'16px',color:'var(--sage-deep)'}}>Jelajahi Pinterest</h3>
            <p style={{fontSize:'11px',color:'#7a9482'}}>Cari lebih banyak inspirasi supaya tidak bingung mulai dari mana</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input className="inp flex-1" placeholder='Contoh: "dekorasi pelaminan outdoor"' value={pinQuery}
            onChange={e=>setPinQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&runPinSearch()}/>
          <button onClick={runPinSearch} style={{padding:'0 18px',borderRadius:'14px',background:'#E60023',color:'white',
            border:'none',fontWeight:700,fontSize:'13px',cursor:'pointer',whiteSpace:'nowrap',flexShrink:0}}>
            Cari
          </button>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:'6px',marginTop:'10px'}}>
          {['Dekorasi pelaminan','Gaun pengantin','Buket bunga','Undangan digital','Cake pernikahan','Seserahan','Makeup pengantin'].map(q=>(
            <button key={q} onClick={()=>window.open(pinterestUrl(q+' pernikahan'),'_blank')}
              style={{fontSize:'10px',padding:'5px 11px',borderRadius:'999px',background:'white',border:'1px solid var(--sage-mid)',color:'var(--sage-dark)',fontWeight:600,cursor:'pointer'}}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Referensi & Template Gaya */}
      <div className="card p-5 mb-4">
        <span className="text-[10px] font-bold tracking-widest uppercase block mb-1" style={{color:'var(--sage)'}}>Referensi &amp; Template Gaya</span>
        <p className="text-xs mb-4" style={{color:'#9db09f'}}>Belum ada gambaran? Pilih salah satu titik awal ini lalu sesuaikan</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',gap:'12px'}}>
          {MOOD_TEMPLATES.map(tpl=>(
            <div key={tpl.id} style={{border:'1px solid var(--sage-mist)',borderRadius:'18px',padding:'14px',display:'flex',flexDirection:'column',gap:'10px'}}>
              <div style={{display:'flex',gap:'4px'}}>
                {tpl.colors.map((c,i)=><div key={i} style={{flex:1,height:'34px',borderRadius:'8px',background:c}}/>)}
              </div>
              <div>
                <h4 className="font-serif" style={{fontWeight:700,fontSize:'14px',color:'var(--sage-deep)'}}>{tpl.name}</h4>
                <p style={{fontSize:'11px',color:'#9db09f',lineHeight:1.5,marginTop:'2px'}}>{tpl.desc}</p>
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:'4px'}}>
                {tpl.tags.map(t=>(
                  <span key={t} style={{fontSize:'9px',fontWeight:700,padding:'3px 8px',borderRadius:'999px',background:'var(--sage-light)',color:'var(--sage-dark)'}}>{t}</span>
                ))}
              </div>
              <div style={{display:'flex',gap:'8px',marginTop:'2px'}}>
                <button onClick={()=>applyTemplate(tpl)}
                  style={{flex:1,padding:'9px',borderRadius:'10px',background:'var(--sage-dark)',color:'white',fontSize:'11px',fontWeight:700,border:'none',cursor:'pointer'}}>
                  ✦ Gunakan
                </button>
                <a href={pinterestUrl(tpl.q)} target="_blank" rel="noopener noreferrer"
                  style={{flex:1,padding:'9px',borderRadius:'10px',background:'#FBEAEC',color:'#E60023',fontSize:'11px',fontWeight:700,
                    textAlign:'center',textDecoration:'none',display:'flex',alignItems:'center',justifyContent:'center',gap:'5px'}}>
                  <PinMark size={13}/> Lihat
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tema & Gaya */}
      <div className="card p-5 mb-4">
        <span className="text-[10px] font-bold tracking-widest uppercase block mb-1" style={{color:'var(--sage)'}}>Tema &amp; Gaya</span>
        <p className="text-xs mb-3" style={{color:'#9db09f'}}>Pilih gaya yang paling menggambarkan visi pernikahan kalian</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {THEME_TAGS.map(tag=>{
            const active = moodTags.includes(tag);
            return (
              <button key={tag} onClick={()=>toggleTag(tag)}
                style={active?{background:'var(--sage-dark)',color:'white',border:'1px solid var(--sage-dark)'}:{background:'white',color:'#7a9482',border:'1px solid var(--sage-mid)'}}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all">
                {tag}
              </button>
            );
          })}
          {moodTags.filter(t=>!THEME_TAGS.includes(t)).map(tag=>(
            <button key={tag} onClick={()=>toggleTag(tag)}
              style={{background:'var(--sage-dark)',color:'white',border:'1px solid var(--sage-dark)'}}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5">
              {tag} <span style={{opacity:.7}}>×</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="inp flex-1" placeholder="Tambah gaya custom…" value={customTag} onChange={e=>setCustomTag(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCustomTag()}/>
          <button onClick={addCustomTag} className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0" style={{background:'var(--sage-dark)'}}>{Ic.plus}</button>
        </div>
      </div>

      {/* Palet Warna */}
      <div className="card p-5 mb-4">
        <span className="text-[10px] font-bold tracking-widest uppercase block mb-1" style={{color:'var(--sage)'}}>Palet Warna</span>
        <p className="text-xs mb-4" style={{color:'#9db09f'}}>Susun kombinasi warna khas pernikahan kalian</p>
        <div className="flex flex-wrap gap-4">
          {palette.map(p=>(
            <div key={p.id} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
              <div style={{position:'relative'}}>
                <div title={p.color} style={{width:'52px',height:'52px',borderRadius:'14px',background:p.color,border:'2px solid white',boxShadow:'0 2px 10px rgba(38,58,41,.14)'}}/>
                <button onClick={()=>removeColor(p.id)}
                  style={{position:'absolute',top:'-6px',right:'-6px',width:'18px',height:'18px',borderRadius:'50%',background:'var(--rust)',color:'white',fontSize:'11px',lineHeight:1,display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid white',cursor:'pointer'}}>×</button>
              </div>
              <input value={p.label} onChange={e=>updateColorLabel(p.id,e.target.value)}
                style={{width:'64px',fontSize:'10px',textAlign:'center',border:'none',background:'transparent',color:'var(--sage-dark)',fontWeight:600,outline:'none'}}/>
            </div>
          ))}
          <label style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px',cursor:'pointer'}}>
            <div style={{width:'52px',height:'52px',borderRadius:'14px',border:'2px dashed var(--sage-mid)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--sage)'}}>
              {Ic.plus}
            </div>
            <span style={{fontSize:'10px',color:'#9db09f',fontWeight:600}}>Tambah</span>
            <input type="color" defaultValue="#6B8F6E" style={{display:'none'}} onChange={e=>addColor(e.target.value)}/>
          </label>
        </div>
        {palette.length===0 && <p className="text-xs mt-3" style={{color:'#c3d1c4'}}>Klik "Tambah" untuk mulai menyusun palet warna kalian.</p>}
      </div>

      {/* Papan Inspirasi */}
      <div className="card p-5 mb-4">
        <span className="text-[10px] font-bold tracking-widest uppercase block mb-1" style={{color:'var(--sage)'}}>Papan Inspirasi</span>
        <p className="text-xs mb-4" style={{color:'#9db09f'}}>Kumpulkan foto atau link referensi per kategori</p>

        <div style={{background:'var(--sage-mist)',borderRadius:'16px',padding:'14px'}} className="mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
            <div>
              <label className="lbl text-xs">Kategori</label>
              <select className="inp" value={addCat} onChange={e=>setAddCat(e.target.value)}>{INSPIRE_CATS.map(c=><option key={c}>{c}</option>)}</select>
              <a href={pinterestUrl(PINTEREST_CAT_QUERY[addCat])} target="_blank" rel="noopener noreferrer"
                style={{display:'inline-flex',alignItems:'center',gap:'5px',marginTop:'6px',fontSize:'11px',fontWeight:600,color:'#c8232c',textDecoration:'none'}}>
                <PinMark size={12}/> Cari "{addCat}" di Pinterest
              </a>
            </div>
            <div>
              <label className="lbl text-xs">Catatan <span style={{fontWeight:400,color:'#9db09f'}}>(opsional)</span></label>
              <input className="inp" value={newNote} onChange={e=>setNewNote(e.target.value)} placeholder="Contoh: Dekorasi meja tamu"/>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <label style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',padding:'11px 16px',
              background:'white',border:'1.5px dashed var(--sage-mid)',borderRadius:'14px',
              cursor:'pointer',fontSize:'13px',color:'var(--sage-dark)',fontWeight:600,flex:1}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"/></svg>
              Upload Gambar
              <input type="file" accept="image/*" style={{display:'none'}} onChange={e=>handleImageUpload(e.target.files[0])}/>
            </label>
            <div style={{display:'flex',gap:'6px',flex:1}}>
              <input className="inp" style={{flex:1}} placeholder="atau tempel link Pinterest/Instagram…" value={newLink} onChange={e=>setNewLink(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addLinkItem()}/>
              <button onClick={addLinkItem} type="button" style={{width:'46px',flexShrink:0,borderRadius:'14px',border:'1.5px solid var(--sage-mid)',background:'white',color:'var(--sage-dark)',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>{Ic.plus}</button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          <button onClick={()=>setFilterCat('semua')} className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
            style={filterCat==='semua'?{background:'var(--sage-dark)',color:'white'}:{background:'white',color:'#7a9482',border:'1px solid var(--sage-mid)'}}>
            Semua ({inspirationItems.length})
          </button>
          {INSPIRE_CATS.map(c=>(
            <button key={c} onClick={()=>setFilterCat(c)} className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
              style={filterCat===c?{background:'var(--sage-dark)',color:'white'}:{background:'white',color:'#7a9482',border:'1px solid var(--sage-mid)'}}>
              {c} ({catCounts[c]})
            </button>
          ))}
        </div>

        {filtered.length===0 ? (
          <div style={{textAlign:'center',padding:'32px 16px'}}>
            <div style={{fontSize:'36px',marginBottom:'8px'}}>🖼️</div>
            <p className="text-sm" style={{color:'#9db09f'}}>Belum ada inspirasi di kategori ini</p>
          </div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(140px, 1fr))',gap:'12px'}}>
            {filtered.map(item=>(
              <div key={item.id} style={{position:'relative',borderRadius:'16px',overflow:'hidden',background:'white',border:'1px solid var(--sage-mist)'}}>
                {item.type==='image' ? (
                  <img src={item.src} alt={item.note||'Inspirasi'} style={{width:'100%',height:'120px',objectFit:'cover',display:'block'}}/>
                ) : (
                  <a href={item.src} target="_blank" rel="noopener noreferrer" style={{height:'120px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'6px',background:'var(--sage-light)',textDecoration:'none',color:'var(--sage-dark)'}}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.07 0l2.83-2.83a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.07 0l-2.83 2.83a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                    <span style={{fontSize:'10px',fontWeight:700,padding:'0 10px',textAlign:'center',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'100%'}}>{hostnameOf(item.src)}</span>
                  </a>
                )}
                <div style={{padding:'8px 10px'}}>
                  <span className="badge" style={{background:'var(--sage-light)',color:'var(--sage-dark)',fontSize:'8px',padding:'2px 8px',marginBottom:'4px',display:'inline-block'}}>{item.cat}</span>
                  {item.note && <p style={{fontSize:'11px',color:'var(--sage-deep)',fontWeight:500,lineHeight:1.3}}>{item.note}</p>}
                </div>
                <button onClick={()=>removeInspiration(item.id)}
                  style={{position:'absolute',top:'6px',right:'6px',width:'24px',height:'24px',borderRadius:'50%',
                    background:'rgba(255,255,255,.92)',color:'var(--rust)',border:'none',cursor:'pointer',
                    display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 1px 4px rgba(0,0,0,.15)'}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catatan Tambahan */}
      <div className="card p-5 mb-4">
        <span className="text-[10px] font-bold tracking-widest uppercase block mb-3" style={{color:'var(--sage)'}}>Catatan Tambahan</span>
        <div className="flex gap-2 mb-4">
          <input className="inp flex-1" placeholder="Tambah ide atau catatan lain…" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addNote()}/>
          <button onClick={addNote} className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0" style={{background:'var(--sage-dark)'}}>{Ic.plus}</button>
        </div>
        {notes.length===0 && <p className="text-sm text-center py-4" style={{color:'#9db09f'}}>Belum ada catatan.</p>}
        <div className="space-y-2">
          {notes.map(n=>(
            <div key={n.id} className="flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{background:'var(--sage-mist)'}}>
              <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 15l4-4a2 2 0 012.5-.3l1.8 1.2a2 2 0 002.4-.2L19 8"/></svg>
              <p className="text-sm flex-1" style={{color:'var(--sage-deep)'}}>{n.text}</p>
              <button onClick={()=>delNote(n.id)} style={{color:'var(--rust)'}}>{Ic.trash}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

