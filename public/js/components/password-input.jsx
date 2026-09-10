/* ═══════════════ PASSWORD INPUT — with show/hide eye toggle ═══════════════ */
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{position:'relative'}}>
      <input
        className="inp"
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{paddingRight:'44px'}}
      />
      <button
        type="button"
        onClick={()=>setShow(s=>!s)}
        style={{position:'absolute',right:'4px',top:'50%',transform:'translateY(-50%)',
          width:'38px',height:'38px',display:'flex',alignItems:'center',justifyContent:'center',
          background:'none',border:'none',cursor:'pointer',color:'var(--sage)',borderRadius:'10px'}}
        onMouseEnter={e=>e.currentTarget.style.color='var(--sage-dark)'}
        onMouseLeave={e=>e.currentTarget.style.color='var(--sage)'}
        tabIndex={-1}
        aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
      >
        {show ? (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a19.86 19.86 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a19.86 19.86 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        ) : (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
    </div>
  );
}

function RegisterScreen({ onLogin, onGoLogin }) {
  const [f, setF] = useState({ nama:'', email:'', pass:'', kode:'' });
  const [err, setErr] = useState('');
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const handle = () => {
    if (!f.nama||!f.email||!f.pass) { setErr('Nama, email, dan password wajib diisi.'); return; }
    if (f.pass.length < 6) { setErr('Password minimal 6 karakter.'); return; }
    if (!/[A-Z]/.test(f.pass)) { setErr('Password harus mengandung minimal 1 huruf besar.'); return; }
    setErr('');
    onLogin({ nama: f.nama, email: f.email });
  };
  return (
    <AuthLayout>
      <div className="anim-fadeup flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="mb-6 anim-bloom lg:hidden"><RingsIcon size={52} color="var(--sage-dark)"/></div>
        <span className="badge badge-sage mb-5">JANJI SUCI</span>
        <h1 className="font-serif text-3xl font-bold mb-1" style={{color:'var(--sage-deep)'}}>Buat Akun<br/>Janji Suci</h1>
        <div className="lg:hidden w-full flex justify-center"><SectionDivider/></div>
        <p className="text-sm mb-8" style={{color:'#7a9482',lineHeight:1.6}}>
          Masukkan kode akses yang Anda dapatkan setelah pembelian <strong>Janji Suci</strong>.
        </p>
        <div className="w-full space-y-4">
          <div><label className="lbl">Nama Lengkap</label><input className="inp" placeholder="Nama lengkap" value={f.nama} onChange={e=>set('nama',e.target.value)}/></div>
          <div><label className="lbl">Email</label><input className="inp" type="email" placeholder="nama@email.com" value={f.email} onChange={e=>set('email',e.target.value)}/></div>
          <div>
            <label className="lbl">Password</label>
            <PasswordInput value={f.pass} onChange={e=>set('pass',e.target.value)} placeholder="Minimal 6 karakter, 1 huruf besar"/>
            <p className="mt-1.5 text-xs" style={{color:'#9db09f'}}>Minimal 6 karakter dan mengandung 1 huruf besar (A-Z).</p>
          </div>
          <div>
            <label className="lbl" style={{color:'var(--sage-dark)'}}>Kode Akses</label>
            <input className="inp" placeholder="CONTOH: JS-VIP-001" value={f.kode} onChange={e=>set('kode',e.target.value.toUpperCase())} style={{borderColor:'var(--sage)'}}/>
            <p className="mt-1.5 text-xs" style={{color:'#9db09f'}}>Kode akses hanya bisa digunakan satu kali.</p>
          </div>
          {err && <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{err}</p>}
          <button className="btn-sage" onClick={handle}>Daftar dengan Kode Akses</button>
          <div className="flex justify-between items-center pt-1">
            <button className="btn-ghost text-sm" style={{color:'#7a9482'}} onClick={onGoLogin}>Kembali</button>
            <p className="text-sm" style={{color:'#7a9482'}}>Sudah punya akun? <button className="btn-ghost" style={{color:'var(--sage-dark)'}} onClick={onGoLogin}>Masuk</button></p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

