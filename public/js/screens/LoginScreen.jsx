/* ═══════════════ SCREEN: LOGIN ═══════════════ */
function LoginScreen({ onLogin, onGoRegister }) {
  const [f, setF] = useState({ email:'', pass:'' });
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const handle = () => onLogin({ nama: 'Mempelai', email: f.email || 'user@email.com' });
  return (
    <AuthLayout>
      <div className="anim-fadeup flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="mb-6 anim-bloom lg:hidden"><RingsIcon size={52} color="var(--sage-dark)"/></div>
        <span className="badge badge-sage mb-5">JANJI SUCI</span>
        <h1 className="font-serif text-3xl font-bold mb-1" style={{color:'var(--sage-deep)'}}>Masuk ke<br/>Dashboard</h1>
        <div className="lg:hidden w-full flex justify-center"><SectionDivider/></div>
        <p className="text-sm mb-8" style={{color:'#7a9482',lineHeight:1.6}}>Login untuk pengguna yang sudah memiliki akses aktif Janji Suci.</p>
        <div className="w-full space-y-4">
          <div><label className="lbl">Email</label><input className="inp" type="email" placeholder="nama@email.com" value={f.email} onChange={e=>set('email',e.target.value)}/></div>
          <div><label className="lbl">Password</label><PasswordInput value={f.pass} onChange={e=>set('pass',e.target.value)} placeholder="Masukkan password"/></div>
          <button className="btn-sage" onClick={handle}>Masuk</button>
          <div className="flex justify-between items-center pt-1">
            <button className="btn-ghost text-sm" style={{color:'#7a9482'}} onClick={onGoRegister}>Kembali</button>
            <p className="text-sm" style={{color:'#7a9482'}}>Belum punya akses? <button className="btn-ghost" style={{color:'var(--sage-dark)'}} onClick={onGoRegister}>Aktivasi</button></p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

