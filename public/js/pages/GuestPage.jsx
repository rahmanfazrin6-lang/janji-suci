/* ═══════════════ TAMU / GUEST PAGE ═══════════════ */
const GCATS = ['Keluarga Wanita','Keluarga Pria','Teman','Kolega / Kantor','Tetangga','Lainnya'];
const GSTATUS = {belum:'Belum Diundang',diundang:'Sudah Diundang',hadir:'Konfirmasi Hadir',tidak:'Tidak Hadir'};
const GCOLOR = {belum:{bg:'var(--sage-mist)',color:'#9db09f'},diundang:{bg:'var(--gold-light)',color:'#8a6d42'},hadir:{bg:'var(--sage-light)',color:'var(--sage-dark)'},tidak:{bg:'var(--rust-light)',color:'var(--rust)'}};

function buildWaLink(guest, undanganLink, data) {
  const phoneRaw = (guest.contact||'').replace(/\D/g,'');
  const phone = phoneRaw.startsWith('0') ? '62'+phoneRaw.slice(1) : phoneRaw;
  const namaTamu = guest.name || 'Bapak/Ibu/Saudara/i';
  const namaPasangan = `${data?.namaW||'Mempelai Wanita'} & ${data?.namaP||'Mempelai Pria'}`;

  let msg = `Kepada Yth.\nBapak/Ibu/Saudara/i\n${namaTamu}\n\n`;
  msg += `Assalamualaikum Warahmatullahi Wabarakatuh\n\n`;
  msg += `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.\n\n`;
  if (undanganLink) {
    msg += `Berikut link undangan kami, untuk info lengkap dari acara, bisa kunjungi:\n\n${undanganLink}\n\n`;
  }
  msg += `Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.\n\n`;
  msg += `Wassalamualaikum Warahmatullahi Wabarakatuh\n\n`;
  msg += `Terima kasih,\n\nHormat kami,\n${namaPasangan}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

function GuestPage({ guests, setGuests, data, undanganLink, setUndanganLink }) {
  const [exp, setExp] = useState(null);
  const [filter, setFilter] = useState('semua');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list'); // list | meja
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [exporting, setExporting] = useState(false);
  const printRef = useRef(null);

  const add = () => { const id=Date.now(); setGuests(g=>[...g,{id,name:'',cat:'Teman',jumlah:1,contact:'',status:'belum',meja:''}]); setExp(id); };
  const upd = (id,k,v) => setGuests(p=>p.map(x=>x.id===id?{...x,[k]:v}:x));
  const del = id => setGuests(p=>p.filter(x=>x.id!==id));

  const addBulk = () => {
    const lines = bulkText.split('\n').map(l=>l.trim()).filter(Boolean);
    if (lines.length===0) return;
    const newGuests = lines.map((line, i) => {
      const parts = line.split(',').map(p=>p.trim());
      const name = parts[0] || 'Tamu';
      const cat = GCATS.includes(parts[1]) ? parts[1] : 'Lainnya';
      const jumlah = parts[2] && !isNaN(Number(parts[2])) ? Number(parts[2]) : 1;
      const contact = parts[3] || '';
      return { id:Date.now()+i, name, cat, jumlah, contact, status:'belum', meja:'' };
    });
    setGuests(g=>[...g, ...newGuests]);
    setBulkText(''); setShowBulk(false);
  };

  const total = guests.reduce((a,g)=>a+(Number(g.jumlah)||1),0);
  const hadir = guests.filter(g=>g.status==='hadir').reduce((a,g)=>a+(Number(g.jumlah)||1),0);
  const tidak = guests.filter(g=>g.status==='tidak').reduce((a,g)=>a+(Number(g.jumlah)||1),0);
  const respRate = total>0 ? Math.round(((hadir+tidak)/total)*100) : 0;

  const estimasi = Number(data?.tamu)||0;
  const capPct = estimasi>0 ? Math.round(total/estimasi*100) : 0;
  const overCap = estimasi>0 && total>estimasi;

  let filtered = filter==='semua' ? guests : guests.filter(g=>g.status===filter);
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(g=>(g.name||'').toLowerCase().includes(q));
  }

  const byTable = {};
  filtered.forEach(g=>{
    const t = g.meja ? String(g.meja) : 'Belum Ditentukan';
    if (!byTable[t]) byTable[t] = [];
    byTable[t].push(g);
  });
  const tableKeys = Object.keys(byTable).sort((a,b)=>{
    if (a==='Belum Ditentukan') return 1;
    if (b==='Belum Ditentukan') return -1;
    return (Number(a)||0)-(Number(b)||0);
  });

  const exportPdf = async () => {
    if (!printRef.current || guests.length===0) return;
    setExporting(true);
    try {
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      const canvas = await html2canvas(printRef.current, { scale:2, useCORS:true, backgroundColor:'#ffffff' });
      const { jsPDF } = window.jspdf;
      const orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait';
      const pdf = new jsPDF({ orientation, unit:'px', format:[canvas.width, canvas.height] });
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Daftar-Tamu-${(data?.namaW||'Mempelai')}-${(data?.namaP||'Mempelai')}.pdf`.replace(/\s+/g,''));
    } catch(e) {
      console.error(e);
      alert('Gagal membuat file export. Coba lagi sebentar.');
    }
    setExporting(false);
  };

  const GuestCard = (g) => (
    <div key={g.id} className="card overflow-hidden self-start">
      <div className="flex items-center gap-3 px-4 py-3.5 cursor-pointer" onClick={()=>setExp(exp===g.id?null:g.id)}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0" style={{background:'var(--sage-dark)'}}>{g.name?g.name[0].toUpperCase():'?'}</div>
        <div className="flex-1 min-w-0"><p className="font-semibold text-sm truncate" style={{color:'var(--sage-deep)'}}>{g.name||'Tamu baru'}</p><p className="text-xs" style={{color:'#9db09f'}}>{g.cat} • {g.jumlah||1} orang{g.meja?` • Meja ${g.meja}`:''}</p></div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={GCOLOR[g.status]}>{GSTATUS[g.status]}</span>
      </div>
      {exp===g.id && (
        <div className="px-4 pb-4 pt-3 border-t space-y-3 anim-fadeup" style={{borderColor:'var(--sage-mist)'}} onClick={e=>e.stopPropagation()}>
          <div>
            <label className="lbl text-xs">Nama Tamu</label>
            <input className="inp" value={g.name} onChange={e=>upd(g.id,'name',e.target.value)} placeholder="Contoh: Haris"/>
            <div style={{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'8px'}}>
              {['& Isteri','& Suami','& Partner','sekeluarga','& Anak','+1 orang'].map(suffix=>(
                <button key={suffix} type="button"
                  onClick={()=>upd(g.id,'name', ((g.name||'').trim() + ' ' + suffix).trim())}
                  style={{fontSize:'11px',fontWeight:600,padding:'5px 11px',borderRadius:'999px',
                    background:'var(--sage-mist)',color:'var(--sage-dark)',border:'1px solid var(--sage-mid)',cursor:'pointer'}}>
                  + {suffix}
                </button>
              ))}
            </div>
            <p className="text-xs mt-1.5" style={{color:'#9db09f'}}>Ketik nama dulu, lalu klik salah satu tombol di atas untuk menambahkan keterangan — contoh hasil: "Haris & Isteri", "Haji Ridwan sekeluarga".</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="lbl text-xs">Kategori</label><select className="inp" value={g.cat} onChange={e=>upd(g.id,'cat',e.target.value)}>{GCATS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div><label className="lbl text-xs">Jumlah Orang</label><input type="number" className="inp" value={g.jumlah} onChange={e=>upd(g.id,'jumlah',e.target.value)} placeholder="1"/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="lbl text-xs">Kontak WA</label><input className="inp" value={g.contact} onChange={e=>upd(g.id,'contact',e.target.value)} placeholder="08xxxxxxxxxx"/></div>
            <div><label className="lbl text-xs">No. Meja</label><input className="inp" value={g.meja} onChange={e=>upd(g.id,'meja',e.target.value)} placeholder="Opsional"/></div>
          </div>
          <div>
            <label className="lbl text-xs">Status RSVP</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(GSTATUS).map(s=>(
                <button key={s} onClick={()=>upd(g.id,'status',s)} className="py-2 rounded-xl text-xs font-bold transition-all" style={g.status===s?{background:'var(--sage-dark)',color:'white'}:{background:'var(--sage-mist)',color:'#9db09f'}}>{GSTATUS[s]}</button>
              ))}
            </div>
          </div>
          {g.contact && (
            <a href={buildWaLink(g, undanganLink, data)} target="_blank" rel="noopener noreferrer"
              className="btn-sm" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',background:'#25D366',color:'white',textDecoration:'none',padding:'10px',borderRadius:'12px',fontWeight:700}}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.552 4.116 1.52 5.845L0 24l6.335-1.482A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.816 0-3.585-.494-5.126-1.428l-.367-.219-3.797.888.83-3.71-.24-.383A9.71 9.71 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/></svg>
              Kirim Undangan via WhatsApp
            </a>
          )}
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={()=>setExp(null)} className="btn-sage" style={{padding:'11px'}}>✓ Simpan</button>
            <button onClick={()=>del(g.id)} style={{flexShrink:0,padding:'11px 16px',borderRadius:'14px',border:'1.5px solid #f0d3ca',background:'transparent',color:'var(--rust)',fontWeight:600,fontSize:'13px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px',whiteSpace:'nowrap'}}>
              {Ic.trash} Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader title="Tamu & RSVP" subtitle="Kelola daftar tamu & konfirmasi kehadiran" right={
        <div style={{display:'flex',gap:'6px',flexWrap:'wrap',justifyContent:'flex-end'}}>
          <button className="text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap" style={{background:'white',color:'var(--sage-dark)',border:'1.5px solid var(--sage-mid)'}} onClick={()=>setShowBulk(s=>!s)}>📋 Input Massal</button>
          <button className="text-xs font-bold text-white px-3 py-1.5 rounded-xl flex items-center gap-1 whitespace-nowrap" style={{background:'var(--sage-dark)'}} onClick={add}>{Ic.plus} Tambah</button>
        </div>
      }/>

      {/* Link Undangan Digital */}
      <div className="card p-4 mt-4 mb-4" style={{background:'var(--sage-mist)',border:'1px solid var(--sage-light)'}}>
        <label className="lbl text-xs" style={{color:'var(--sage-dark)'}}>Link Undangan Digital <span style={{fontWeight:400,color:'#9db09f'}}>(opsional — otomatis disertakan saat kirim WA)</span></label>
        <input className="inp" value={undanganLink} onChange={e=>setUndanganLink(e.target.value)} placeholder="https://undangan.co/nama-mempelai atau link undangan kalian"/>
      </div>

      {/* Bulk import panel */}
      {showBulk && (
        <div className="card p-5 mb-4 anim-fadeup">
          <span className="text-[10px] font-bold tracking-widest uppercase block mb-2" style={{color:'var(--sage)'}}>Input Massal — Tambah Banyak Tamu Sekaligus</span>
          <p className="text-xs mb-3" style={{color:'#9db09f',lineHeight:1.6}}>Satu tamu per baris, format: <strong>Nama, Kategori, Jumlah, No HP</strong> (kategori, jumlah, dan no HP opsional — boleh diisi nama saja). Nama boleh langsung ditulis lengkap dengan keterangan, contoh: <em>"Haris & Isteri"</em> atau <em>"Haji Ridwan sekeluarga"</em>.</p>
          <textarea className="inp" rows="6" style={{resize:'none',fontFamily:'monospace',fontSize:'12.5px'}} value={bulkText} onChange={e=>setBulkText(e.target.value)}
            placeholder={"Contoh:\nBudi Santoso, Teman, 2, 081234567890\nKeluarga Pak Rahmat, Keluarga Pria, 4\nSiti Aminah"}/>
          <button onClick={addBulk} className="btn-sage" style={{marginTop:'12px'}}>+ Tambahkan Semua</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-4 lg:max-w-md">
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{total}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Diundang</p></div>
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-dark)'}}>{hadir}</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Hadir</p></div>
        <div className="stat-tile"><p className="font-serif text-xl font-bold" style={{color:'var(--sage-deep)'}}>{respRate}%</p><p className="text-[10px] mt-0.5" style={{color:'#7a9482'}}>Respon</p></div>
      </div>

      {/* Capacity indicator vs Setup estimate */}
      {estimasi>0 && (
        <div className="card p-4 mb-4 lg:max-w-md">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold" style={{color:'var(--sage-deep)'}}>Kapasitas Undangan</span>
            <span className="text-xs font-bold" style={{color:overCap?'var(--rust)':'var(--sage-dark)'}}>{total} / {estimasi}</span>
          </div>
          <div className="prog-track"><div className="prog-fill" style={{width:`${Math.min(capPct,100)}%`, background: overCap ? 'linear-gradient(90deg,var(--rust),#d98a72)' : undefined}}/></div>
          {overCap && <p className="text-xs mt-1.5" style={{color:'var(--rust)'}}>⚠ Sudah melebihi estimasi {estimasi} tamu dari Setup — pertimbangkan cek ulang kapasitas venue.</p>}
        </div>
      )}

      {/* Search + view toggle + export */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input className="inp" style={{flex:'1 1 200px'}} value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Cari nama tamu…"/>
        <div style={{display:'flex',borderRadius:'12px',overflow:'hidden',border:'1.5px solid var(--sage-mid)'}}>
          <button onClick={()=>setView('list')} className="text-xs font-semibold px-3 py-2" style={view==='list'?{background:'var(--sage-dark)',color:'white'}:{background:'white',color:'#7a9482'}}>Daftar</button>
          <button onClick={()=>setView('meja')} className="text-xs font-semibold px-3 py-2" style={view==='meja'?{background:'var(--sage-dark)',color:'white'}:{background:'white',color:'#7a9482'}}>Meja</button>
        </div>
        <button disabled={exporting||guests.length===0} onClick={exportPdf}
          className="text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 whitespace-nowrap"
          style={{background:'white',color:'var(--sage-dark)',border:'1.5px solid var(--sage-mid)',opacity:(exporting||guests.length===0)?.5:1,cursor:(exporting||guests.length===0)?'not-allowed':'pointer'}}>
          📄 Export PDF
        </button>
      </div>

      {/* Filter tabs (list view only) */}
      {view==='list' && (
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
          {['semua',...Object.keys(GSTATUS)].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
              style={filter===s?{background:'var(--sage-dark)',color:'white'}:{background:'white',color:'#7a9482',border:'1px solid var(--sage-mid)'}}>
              {s==='semua'?'Semua':GSTATUS[s]}
            </button>
          ))}
        </div>
      )}

      {filtered.length===0 && <div className="card p-8 text-center"><div className="text-4xl mb-3">👥</div><p className="text-sm" style={{color:'#9db09f'}}>Tidak ada tamu yang cocok</p></div>}

      {view==='list' ? (
        <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
          {filtered.map(GuestCard)}
        </div>
      ) : (
        <div>
          {tableKeys.map(t=>(
            <div key={t} className="mb-5">
              <div className="flex justify-between mb-2 px-1">
                <span className="text-xs font-bold uppercase tracking-wider" style={{color:'var(--sage)'}}>{t==='Belum Ditentukan'?t:`Meja ${t}`}</span>
                <span className="text-xs" style={{color:'#9db09f'}}>{byTable[t].reduce((a,g)=>a+(Number(g.jumlah)||1),0)} orang</span>
              </div>
              <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
                {byTable[t].map(GuestCard)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hidden printable guest list for PDF export */}
      <div style={{height:0, overflow:'hidden'}} aria-hidden="true">
        <div ref={printRef} style={{width:'1000px', background:'white', fontFamily:"'DM Sans', sans-serif"}}>
          <div style={{background:'linear-gradient(135deg, #6B8F6E, #47654A)', padding:'36px 44px', color:'white'}}>
            <div style={{fontSize:'11px',fontWeight:700,letterSpacing:'.15em',textTransform:'uppercase',opacity:.85,marginBottom:'8px'}}>JANJI SUCI · WEDDING PLANNER</div>
            <div style={{fontFamily:"'Playfair Display', serif", fontSize:'34px', fontWeight:700, marginBottom:'6px'}}>{data?.namaW||'Mempelai'} &amp; {data?.namaP||'Mempelai'}</div>
            <div style={{fontSize:'14px', opacity:.85}}>{fmtDate(data?.tanggal)||'Tanggal belum diset'}{data?.namaVenue?` · ${data.namaVenue}`:''}</div>
          </div>
          <div style={{padding:'28px 44px 10px'}}>
            <div style={{fontFamily:"'Playfair Display', serif", fontSize:'22px', fontWeight:700, color:'#263A29', marginBottom:'4px'}}>Daftar Tamu &amp; RSVP</div>
            <div style={{width:'56px',height:'3px',background:'#B99A6B',marginBottom:'8px'}}/>
            <div style={{fontSize:'13px',color:'#5a7a5d'}}>Total {total} tamu diundang · {hadir} konfirmasi hadir · Respon {respRate}%</div>
          </div>
          <div style={{padding:'12px 44px 36px'}}>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#263A29'}}>
                  <th style={{padding:'12px 14px',fontSize:'12px',fontWeight:700,color:'white',textAlign:'left',width:'40px'}}>No</th>
                  <th style={{padding:'12px 14px',fontSize:'12px',fontWeight:700,color:'white',textAlign:'left'}}>Nama</th>
                  <th style={{padding:'12px 14px',fontSize:'12px',fontWeight:700,color:'white',textAlign:'left'}}>Kategori</th>
                  <th style={{padding:'12px 14px',fontSize:'12px',fontWeight:700,color:'white',textAlign:'left',width:'70px'}}>Jumlah</th>
                  <th style={{padding:'12px 14px',fontSize:'12px',fontWeight:700,color:'white',textAlign:'left',width:'70px'}}>Meja</th>
                  <th style={{padding:'12px 14px',fontSize:'12px',fontWeight:700,color:'white',textAlign:'left',width:'120px'}}>Status RSVP</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g,i)=>(
                  <tr key={i} style={{background: i%2===0?'#ffffff':'#F0F5EF', borderBottom:'1px solid #E3EEE2'}}>
                    <td style={{padding:'12px 14px',fontSize:'13px',fontWeight:700,color:'#47654A'}}>{i+1}</td>
                    <td style={{padding:'12px 14px',fontSize:'13px',fontWeight:600,color:'#263A29'}}>{g.name||'—'}</td>
                    <td style={{padding:'12px 14px',fontSize:'13px',color:'#5a7a5d'}}>{g.cat}</td>
                    <td style={{padding:'12px 14px',fontSize:'13px',color:'#5a7a5d'}}>{g.jumlah||1}</td>
                    <td style={{padding:'12px 14px',fontSize:'13px',color:'#5a7a5d'}}>{g.meja||'—'}</td>
                    <td style={{padding:'12px 14px',fontSize:'12.5px',color:'#5a7a5d'}}>{GSTATUS[g.status]}</td>
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

