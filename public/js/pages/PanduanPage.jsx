/* ═══════════════ PANDUAN (GUIDE) PAGE — NEW ═══════════════ */
function PanduanPage({ onBack, goPage, checklist, budgetItems, vendors, guests, rundown, docs, seserahan }) {
  const [openFaq, setOpenFaq] = useState(null);

  // ── Live completion status — dihitung dari data asli aplikasi, bukan statis ──
  const checkDone = (checklist||[]).length > 0;
  const budgetDone = (budgetItems||[]).some(b => Number(b.realisasi) > 0) || (budgetItems||[]).some(b=>Number(b.estimasi)>0);
  const vendorDone = (vendors||[]).some(v => v.name && v.name.trim());
  const tamuDone = (guests||[]).length > 0;
  const rundownDone = (rundown||[]).length > 0;
  const dokumenDone = ((docs||[]).some(d=>d.done)) || ((seserahan||[]).length > 0);

  const steps = [
    { title:'Isi data wedding project saat onboarding', desc:'Nama mempelai, tanggal, budget, venue, dan tema. Ini jadi dasar semua fitur lain.', page:null, done:true },
    { title:'Buka Checklist dan tandai yang sudah beres', desc:'Checklist otomatis dibuat AI sesuai kondisi kalian — tinggal centang, edit, atau tambah item baru.', page:'checklist', done:checkDone },
    { title:'Lengkapi Budget utama dan target pengeluaran', desc:'Bandingkan estimasi vs realisasi tiap kategori supaya tidak over budget.', page:'budget', done:budgetDone },
    { title:'Tambahkan Vendor dan catat status deal', desc:'Simpan kontak, harga, dan status pembayaran tiap vendor (venue, katering, WO, dsb).', page:'vendor', done:vendorDone },
    { title:'Susun daftar Tamu dan pantau RSVP', desc:'Kelompokkan tamu per kategori dan pantau siapa saja yang sudah konfirmasi hadir.', page:'tamu', done:tamuDone },
    { title:'Atur Rundown hari-H', desc:'Susun jadwal acara dari persiapan pagi sampai penutupan, supaya semua tim tahu timeline-nya.', page:'rundown', done:rundownDone },
    { title:'Cek Dokumen legal & Seserahan', desc:'Pastikan berkas KUA lengkap dan hantaran sudah dibeli mendekati hari-H.', page:'dokumen', done:dokumenDone },
  ];
  const stepsDone = steps.filter(s=>s.done).length;
  const stepsPct = Math.round((stepsDone/steps.length)*100);

  const allFeatures = [
    { icon: Ic.home, title:'Dashboard', desc:'Countdown, progress checklist, budget, dan tamu dalam satu layar.', page:'dashboard' },
    { icon: Ic.check, title:'Checklist', desc:'Tugas persiapan otomatis dari AI, lengkap deadline & PIC.', page:'checklist' },
    { icon: Ic.budget, title:'Budget', desc:'Estimasi vs realisasi per kategori, plus import dari Vendor.', page:'budget' },
    { icon: Ic.vendor, title:'Vendor', desc:'Kontak, harga, DP, dan jatuh tempo pelunasan tiap vendor.', page:'vendor' },
    { icon: Ic.guest, title:'Tamu', desc:'Kelola daftar tamu, RSVP, kirim undangan via WhatsApp.', page:'tamu' },
    { icon: Ic.rundown, title:'Rundown', desc:'Susun jadwal hari-H, export tabel JPG/PDF profesional.', page:'rundown' },
    { icon: Ic.gift, title:'Seserahan', desc:'Catat hantaran, harga, dan status pembelian.', page:'seserahan' },
    { icon: Ic.doc, title:'Dokumen', desc:'Checklist berkas legal, upload foto/scan dokumen.', page:'dokumen' },
    { icon: Ic.bell, title:'Reminder', desc:'Pengingat otomatis dari checklist, rundown & jatuh tempo vendor.', page:'reminder' },
    { icon: Ic.mood, title:'Moodboard', desc:'Kumpulkan referensi gaya, palet warna, dan inspirasi visual.', page:'moodboard' },
  ];

  const faqs = [
    { q:'Harus mulai dari mana kalau baru pertama kali pakai?', a:'Mulai dari Setup Wedding Project (data dasar), lalu buka Checklist — di situ sudah ada daftar tugas otomatis yang bisa langsung dicentang satu per satu.' },
    { q:'Apakah checklist & rundown bisa diedit manual?', a:'Bisa. Checklist dan rundown yang dibuat otomatis hanyalah titik awal — kalian bebas menambah, mengedit, atau menghapus item sesuai kebutuhan.' },
    { q:'Kalau budget berubah di tengah jalan, apa yang harus diupdate?', a:'Cukup update target budget di halaman Budget (tombol edit di kartu total), lalu sesuaikan realisasi pengeluaran tiap kategori. Sisa & persentase terpakai otomatis terhitung ulang.' },
    { q:'Bagaimana cara memantau tamu yang belum konfirmasi?', a:'Buka halaman Tamu, gunakan filter status RSVP untuk melihat siapa saja yang belum diundang atau belum merespon.' },
    { q:'Kenapa jatuh tempo vendor muncul di Reminder?', a:'Supaya tidak ada pembayaran vendor yang lupa dilunasi. Setiap vendor dengan status "Deal" dan tanggal jatuh tempo otomatis muncul sebagai reminder, terutama kalau sudah dekat atau lewat tenggat.' },
    { q:'Apa bedanya Checklist dengan Reminder?', a:'Checklist adalah daftar tugas persiapan yang kalian kelola sendiri (centang manual). Reminder adalah rangkuman otomatis dari checklist yang belum selesai, agenda rundown, dan jatuh tempo vendor — supaya semua yang butuh perhatian terkumpul di satu tempat tanpa perlu bolak-balik cek tiap halaman.' },
    { q:'Apakah data akan tersimpan kalau saya tutup browser?', a:'Data tersimpan selama tab/browser ini masih terbuka di perangkat yang sama. Untuk keamanan, sebaiknya jangan reload halaman sembarangan, dan manfaatkan tombol export (JPG/PDF) di Checklist, Budget, Vendor, Tamu, dan Rundown secara berkala sebagai cadangan yang bisa disimpan atau dibagikan kapan saja.' },
    { q:'Bagaimana cara membagikan progress ke keluarga atau WO?', a:'Gunakan tombol export di tiap halaman (Checklist, Budget, Vendor, Tamu, Rundown) untuk membuat file JPG/PDF rapi berlogo Janji Suci, lalu kirim langsung lewat WhatsApp atau email tanpa perlu kasih akses penuh ke aplikasi.' },
  ];

  const proTips = [
    { h:'H-6 sampai H-12 bulan', t:'Kunci venue dan vendor besar (WO, katering, fotografer) lebih awal — vendor favorit biasanya penuh untuk tanggal populer (akhir pekan, musim liburan).' },
    { h:'Sisihkan dana darurat', t:'Alokasikan sekitar 10% dari total budget untuk pengeluaran tak terduga. Hampir semua pernikahan punya biaya tambahan di luar rencana awal.' },
    { h:'Konfirmasi ulang H-7', t:'Hubungi semua vendor deal seminggu sebelum hari-H untuk konfirmasi jam, lokasi, dan detail teknis — jangan asumsikan semua sudah jelas dari kontrak awal.' },
    { h:'Tunjuk satu koordinator hari-H', t:'Pastikan ada satu orang (WO atau keluarga terpercaya) yang pegang rundown final, supaya kalian sebagai mempelai bisa fokus menikmati momennya.' },
  ];

  return (
    <div className="lg:max-w-3xl lg:mx-auto">
      <PageHeader title="Panduan Penggunaan" subtitle="Bingung mulai dari mana? Ikuti alur ini." onBack={onBack}/>

      <div className="card p-6 mb-5 mt-4 relative overflow-hidden" style={{background:'linear-gradient(135deg, var(--sage-light), var(--cream))'}}>
        <div className="absolute -right-4 -top-4 opacity-30"><Wreath size={140}/></div>
        <span className="badge badge-gold mb-3 relative z-10">Selamat Datang</span>
        <h2 className="font-serif text-xl font-bold mb-2 relative z-10" style={{color:'var(--sage-deep)'}}>Supaya persiapan tidak ada yang terlewat</h2>
        <p className="text-sm relative z-10" style={{color:'#5a7a5d',lineHeight:1.7}}>
          Merencanakan pernikahan wajar bikin pusing — banyak yang harus diingat. Panduan ini merangkum urutan pemakaian Janji Suci paling aman, supaya data di setiap halaman saling terhubung dan dashboard menampilkan kondisi persiapan yang akurat.
        </p>
      </div>

      {/* Live progress tracker */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase" style={{color:'var(--sage)'}}>Progress Onboarding</span>
            <h3 className="font-serif text-lg font-bold" style={{color:'var(--sage-deep)'}}>{stepsDone} dari {steps.length} langkah selesai</h3>
          </div>
          <span className="font-serif text-2xl font-bold" style={{color:stepsPct===100?'var(--sage-dark)':'var(--sage)'}}>{stepsPct}%</span>
        </div>
        <div className="prog-track mb-1"><div className="prog-fill" style={{width:`${stepsPct}%`}}/></div>
        {stepsPct===100 && <p className="text-xs mt-2 font-semibold" style={{color:'var(--sage-dark)'}}>🎉 Semua langkah dasar sudah dimulai — tinggal lengkapi detailnya sampai hari-H!</p>}
      </div>

      <p className="text-xs font-bold uppercase tracking-wider mb-3 px-1" style={{color:'var(--sage)'}}>Urutan Penggunaan yang Disarankan</p>
      <div className="card p-5 mb-6">
        <div className="relative">
          <div className="absolute left-[14px] top-2 bottom-2 w-0.5" style={{background:'var(--sage-light)'}}/>
          <div className="space-y-5 relative z-10">
            {steps.map((s,i)=>(
              <div key={i} className="flex gap-4">
                <div className="step-num" style={s.done?{background:'var(--sage-dark)'}:{background:'var(--sage-mid)'}}>
                  {s.done ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                  ) : i+1}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold text-sm" style={{color: s.done?'var(--sage-dark)':'var(--sage-deep)'}}>{s.title}</h4>
                    {s.page && (
                      <button onClick={()=>goPage(s.page)} className="text-[11px] font-bold whitespace-nowrap shrink-0" style={{color:'var(--sage)'}}>{s.done?'Lihat →':'Buka →'}</button>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{color:'#9db09f',lineHeight:1.5}}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-wider mb-3 px-1" style={{color:'var(--sage)'}}>Semua Fitur Janji Suci</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {allFeatures.map(t=>(
          <div key={t.title} className="card p-4 flex gap-3 cursor-pointer" onClick={()=>goPage(t.page)}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{background:'var(--sage-light)',color:'var(--sage-dark)'}}>{t.icon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1" style={{color:'var(--sage-deep)'}}>{t.title}</h3>
              <p className="text-xs" style={{color:'#9db09f',lineHeight:1.5}}>{t.desc}</p>
            </div>
            <span style={{color:'var(--sage-mid)',flexShrink:0,alignSelf:'center'}}>{Ic.chevron}</span>
          </div>
        ))}
      </div>

      <p className="text-xs font-bold uppercase tracking-wider mb-3 px-1" style={{color:'var(--sage)'}}>Pertanyaan Umum</p>
      <div className="space-y-2.5 mb-6">
        {faqs.map((f,i)=>(
          <div key={i} className="card overflow-hidden">
            <button className="w-full text-left px-4 py-3.5 flex justify-between items-center gap-3" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
              <span className="text-sm font-semibold" style={{color:'var(--sage-deep)'}}>{f.q}</span>
              <span className="shrink-0 transition-transform" style={{color:'var(--sage)',transform: openFaq===i?'rotate(90deg)':'none'}}>{Ic.chevron}</span>
            </button>
            {openFaq===i && <div className="px-4 pb-4 anim-fadeup"><p className="text-xs" style={{color:'#7a9482',lineHeight:1.6}}>{f.a}</p></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

