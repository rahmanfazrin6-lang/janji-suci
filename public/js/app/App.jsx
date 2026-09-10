/* ═══════════════ MAIN APP ═══════════════ */
function App() {
  const [screen, setScreen] = useState('register'); // register | login | dashEmpty | setup | loading | app
  const [page, setPage] = useState('dashboard');
  const [lastMobilePrimary, setLastMobilePrimary] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [loadStep, setLoadStep] = useState(0);

  const [checklist, setChecklist] = useState([]);
  const [checkLoading, setCheckLoading] = useState(false);
  const [rundown, setRundown] = useState([]);
  const [runLoading, setRunLoading] = useState(false);
  const [guests, setGuests] = useState([]);
  const [undanganLink, setUndanganLink] = useState('');
  const [vendors, setVendors] = useState([{id:1,name:'',cat:'Katering',contact:'',status:'belum',harga:'',note:''}]);
  const [docs, setDocs] = useState(DOC_DEFAULT);
  const [seserahan, setSeserahan] = useState([]);
  const [moodNotes, setMoodNotes] = useState([]);
  const [moodTags, setMoodTags] = useState([]);
  const [palette, setPalette] = useState([]);
  const [inspirationItems, setInspirationItems] = useState([]);
  const [budgetItems, setBudgetItems] = useState(() => seedBudgetItems());
  const [dismissedReminders, setDismissedReminders] = useState([]);
  const [customReminders, setCustomReminders] = useState([]);

  const handleLogin = (u) => { setUser(u); setScreen('dashEmpty'); };
  const handleLogout = () => { setUser(null); setScreen('register'); setPage('dashboard'); };

  const onUpdateBudget = (newAmount) => {
    setProject(p => ({ ...p, budget: newAmount }));
  };

  const generateChecklist = async (data) => {
    setCheckLoading(true);
    const computeDeadline = (daysBefore) => {
      if (!data.tanggal || daysBefore==null) return '';
      const d = new Date(data.tanggal);
      d.setDate(d.getDate() - Number(daysBefore));
      return isoToDisplay(d.toISOString().slice(0,10));
    };
    try {
      const raw = await callAI(
        `Buatkan checklist persiapan pernikahan untuk ${data.namaW} dan ${data.namaP}, tema "${data.tema||'elegan'}", budget Rp ${Number(data.budget).toLocaleString('id-ID')}, tanggal ${data.tanggal||'belum ditentukan'}.
Kembalikan HANYA JSON array tanpa markdown:
[{"id":1,"category":"KATEGORI","title":"Judul item","urgent":true,"done":false,"daysBefore":90,"pic":"Mempelai Wanita"}]
Buat 20-25 item, kategori: Dokumen, Venue & Dekorasi, Katering, Busana, Dokumentasi, Undangan, Lainnya. urgent:true untuk 5-7 terpenting.
"daysBefore" = berapa hari sebelum hari-H item ini idealnya selesai (realistis, makin penting/besar tugasnya makin jauh dari hari-H, contoh: booking venue 90-120, fitting gaun 30-45, cetak undangan 20-30, konfirmasi vendor 3-7).
"pic" = penanggung jawab realistis (contoh: "Mempelai Wanita", "Mempelai Pria", "Kedua Mempelai", "Orang Tua", "WO").`,
        'Kamu asisten wedding planner Indonesia. Kembalikan HANYA valid JSON array, tanpa teks lain.'
      );
      const parsed = JSON.parse(raw.replace(/```json|```/g,'').trim());
      setChecklist(parsed.map(it=>({
        ...it, deadlineDisplay: computeDeadline(it.daysBefore), note:'',
      })));
    } catch {
      setChecklist([
        {id:1,category:'Dokumen',title:'Urus surat nikah di KUA',urgent:true,done:false,deadlineDisplay:computeDeadline(60),pic:'Kedua Mempelai',note:''},
        {id:2,category:'Dokumen',title:'Persiapkan akta lahir & KTP',urgent:true,done:false,deadlineDisplay:computeDeadline(60),pic:'Kedua Mempelai',note:''},
        {id:3,category:'Venue & Dekorasi',title:'Booking venue & DP',urgent:true,done:false,deadlineDisplay:computeDeadline(100),pic:'Mempelai Pria',note:''},
        {id:4,category:'Venue & Dekorasi',title:'Diskusi tema dekorasi',urgent:false,done:false,deadlineDisplay:computeDeadline(45),pic:'Mempelai Wanita',note:''},
        {id:5,category:'Katering',title:'Survey & pilih katering',urgent:true,done:false,deadlineDisplay:computeDeadline(75),pic:'WO',note:''},
        {id:6,category:'Busana',title:'Pilih & fitting gaun pengantin',urgent:false,done:false,deadlineDisplay:computeDeadline(35),pic:'Mempelai Wanita',note:''},
        {id:7,category:'Dokumentasi',title:'Booking fotografer',urgent:true,done:false,deadlineDisplay:computeDeadline(80),pic:'Kedua Mempelai',note:''},
        {id:8,category:'Undangan',title:'Desain undangan pernikahan',urgent:false,done:false,deadlineDisplay:computeDeadline(25),pic:'Mempelai Wanita',note:''},
      ]);
    }
    setCheckLoading(false);
  };

  const generateRundown = async (data) => {
    setRunLoading(true);
    try {
      const raw = await callAI(
        `Buatkan rundown hari-H pernikahan ${data.namaW} & ${data.namaP} di venue ${data.namaVenue||'venue pernikahan'}. Akad: ${data.jamAkad||'08:00'}, resepsi: ${data.jamResepsi||'11:00'}.
Kembalikan HANYA JSON array tanpa markdown:
[{"time":"HH:MM","title":"Nama agenda","lokasi":"Area/ruangan di venue","pic":"Penanggung jawab/vendor terkait","note":"Catatan singkat"}]
Buat 10-14 item dari persiapan pagi hingga penutupan resepsi. Isi lokasi dengan area realistis (contoh: Ruang Rias, Area Akad, Ballroom Utama, Panggung Pelaminan). Isi pic dengan pihak realistis (contoh: MUA, WO, Keluarga, Fotografer, MC).`,
        'Kamu wedding coordinator Indonesia. Kembalikan HANYA valid JSON array.'
      );
      setRundown(JSON.parse(raw.replace(/```json|```/g,'').trim()));
    } catch {
      setRundown([
        {time:'06:00',title:'Persiapan pagi pengantin',lokasi:'Ruang Rias',pic:'MUA & Keluarga',note:'Makeup & hair do mempelai wanita'},
        {time:'07:30',title:'Tiba di venue & briefing',lokasi:'Lobby Utama',pic:'WO',note:'Koordinasi tim WO dan vendor'},
        {time:data.jamAkad||'08:00',title:'Akad Nikah',lokasi:'Area Akad',pic:'Penghulu & Keluarga',note:'Prosesi ijab kabul'},
        {time:'09:30',title:'Foto keluarga & dokumentasi',lokasi:'Panggung Pelaminan',pic:'Fotografer',note:'Foto bersama keluarga inti'},
        {time:data.jamResepsi||'11:00',title:'Resepsi dimulai',lokasi:'Ballroom Utama',pic:'MC & WO',note:'Pintu tamu dibuka'},
        {time:'12:00',title:'Makan siang & hiburan',lokasi:'Ballroom Utama',pic:'Katering',note:'Katering tersedia'},
        {time:'14:30',title:'Penutupan resepsi',lokasi:'Ballroom Utama',pic:'MC',note:'Terimakasih kepada tamu undangan'},
      ]);
    }
    setRunLoading(false);
  };

  const handleSaveSetup = async (data) => {
    const isFirst = !project;
    setProject(data);
    setScreen('loading');
    setLoadStep(0);
    for (let i=0;i<4;i++) { await new Promise(r=>setTimeout(r,600)); setLoadStep(i); }
    if (isFirst) {
      await Promise.all([generateChecklist(data), generateRundown(data)]);
      setBudgetItems(seedBudgetItems(data.budget));
    }
    setScreen('app'); setPage('dashboard');
  };

  const goPage = (p) => {
    if (p === 'more') { setPage('more'); return; }
    if (['dashboard','checklist','budget','tamu'].includes(p)) setLastMobilePrimary(p);
    setPage(p);
  };

  const pageProps = { onBack: () => goPage('more') };

  const renderPage = () => {
    switch(page) {
      case 'dashboard': return <DashboardPage data={project} checklist={checklist} rundown={rundown} guests={guests} vendors={vendors} docs={docs} seserahan={seserahan} budgetItems={budgetItems} onSetup={()=>setScreen('setup')} goPage={goPage}/>;
      case 'panduan': return <PanduanPage onBack={pageProps.onBack} goPage={goPage} checklist={checklist} budgetItems={budgetItems} vendors={vendors} guests={guests} rundown={rundown} docs={docs} seserahan={seserahan}/>;
      case 'checklist': return <ChecklistPage list={checklist} setList={setChecklist} loading={checkLoading} data={project}/>;
      case 'budget': return <BudgetPage budget={project.budget} budgetItems={budgetItems} setBudgetItems={setBudgetItems} vendors={vendors} data={project} onUpdateBudget={onUpdateBudget}/>;
      case 'vendor': return <VendorPage vendors={vendors} setVendors={setVendors} onBack={pageProps.onBack}/>;
      case 'tamu': return <GuestPage guests={guests} setGuests={setGuests} data={project} undanganLink={undanganLink} setUndanganLink={setUndanganLink}/>;
      case 'rundown': return <RundownPage rundown={rundown} setRundown={setRundown} loading={runLoading} data={project} onBack={pageProps.onBack}/>;
      case 'seserahan': return <SeserahanPage items={seserahan} setItems={setSeserahan} onBack={pageProps.onBack}/>;
      case 'dokumen': return <DocumentsPage docs={docs} setDocs={setDocs} onBack={pageProps.onBack}/>;
      case 'reminder': return <ReminderPage checklist={checklist} setChecklist={setChecklist} rundown={rundown} vendors={vendors} setVendors={setVendors} data={project} dismissed={dismissedReminders} setDismissed={setDismissedReminders} customReminders={customReminders} setCustomReminders={setCustomReminders} onBack={pageProps.onBack}/>;
      case 'moodboard': return <MoodboardPage data={project} notes={moodNotes} setNotes={setMoodNotes} moodTags={moodTags} setMoodTags={setMoodTags} palette={palette} setPalette={setPalette} inspirationItems={inspirationItems} setInspirationItems={setInspirationItems} onBack={pageProps.onBack}/>;
      case 'profil': return <ProfilePage user={user} onBack={pageProps.onBack} onEditSetup={()=>setScreen('setup')} onLogout={handleLogout}/>;
      case 'more': return <MorePage goPage={goPage}/>;
      default: return null;
    }
  };

  if (screen==='register') return <RegisterScreen onLogin={handleLogin} onGoLogin={()=>setScreen('login')}/>;
  if (screen==='login') return <LoginScreen onLogin={handleLogin} onGoRegister={()=>setScreen('register')}/>;
  if (screen==='dashEmpty') return <DashboardEmptyScreen user={user} onSetup={()=>setScreen('setup')} onLogout={handleLogout}/>;
  if (screen==='setup') return <SetupScreen initial={project} onSave={handleSaveSetup} onBack={()=>setScreen(project?'app':'dashEmpty')}/>;
  if (screen==='loading') return <LoadingScreen step={loadStep}/>;

  return (
    <div className="flex h-full w-full absolute inset-0">
      <Sidebar page={page} goPage={goPage} user={user} onLogout={handleLogout}/>
      <div className="flex-1 flex flex-col min-w-0" style={{background:'var(--sage-mist)'}}>
        <main className="flex-1 overflow-y-auto custom-scroll px-5 pt-6 lg:pt-8 lg:px-10 pb-28 lg:pb-10 anim-fadein" key={page}>
          {renderPage()}
        </main>
        <BottomNav active={page} goPage={goPage}/>
      </div>
    </div>
  );
}

