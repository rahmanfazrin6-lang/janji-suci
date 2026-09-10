/* ═══════════════ PROFIL PAGE ═══════════════ */
function ProfilePage({ user, onBack, onEditSetup, onLogout }) {
  return (
    <div>
      <PageHeader title="Profil & Pengaturan" onBack={onBack}/>
      <div className="mt-4 lg:max-w-lg">
        <div className="card p-6 text-center mb-4">
          <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-serif text-2xl font-bold" style={{background:'linear-gradient(135deg, var(--sage), var(--sage-dark))'}}>
            {user.nama ? user.nama[0].toUpperCase() : 'U'}
          </div>
          <h3 className="font-serif text-lg font-bold" style={{color:'var(--sage-deep)'}}>{user.nama}</h3>
          <p className="text-sm" style={{color:'#9db09f'}}>{user.email}</p>
        </div>
        <div className="card overflow-hidden mb-4">
          <button onClick={onEditSetup} className="w-full flex items-center justify-between px-5 py-4" style={{borderBottom:'1px solid var(--sage-mist)'}}>
            <span className="text-sm font-semibold" style={{color:'var(--sage-deep)'}}>Edit Wedding Project</span>
            <span style={{color:'var(--sage)'}}>{Ic.chevron}</span>
          </button>
          <div className="w-full flex items-center justify-between px-5 py-4">
            <span className="text-sm font-semibold" style={{color:'var(--sage-deep)'}}>Versi Aplikasi</span>
            <span className="text-sm" style={{color:'#9db09f'}}>1.0.0</span>
          </div>
        </div>
        <button onClick={onLogout} className="btn-outline" style={{color:'var(--rust)',borderColor:'#f0d3ca'}}>Keluar dari Akun</button>
      </div>
    </div>
  );
}

