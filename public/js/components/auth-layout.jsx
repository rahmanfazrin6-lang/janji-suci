/* ═══════════════ AUTH LAYOUT (split-screen desktop, single column mobile) ═══════════════ */
function AuthLayout({ children }) {
  return (
    <div className="flex h-full w-full absolute inset-0">
      {/* Left branding panel - desktop only */}
      <div className="hidden lg:flex lg:w-[42%] relative flex-col justify-between p-12 overflow-hidden"
        style={{background:'linear-gradient(160deg, var(--sage) 0%, var(--sage-dark) 55%, var(--sage-deep) 100%)'}}>
        <HeroOrnament/>
        <div className="relative z-10 flex items-center gap-3">
          <RingsIcon size={34} color="white"/>
          <span className="text-white font-serif text-xl font-bold tracking-wide">Janji Suci</span>
        </div>
        <div className="relative z-10">
          <div className="mb-6 opacity-90"><Wreath size={180} color="rgba(255,255,255,.6)" accent="#E9D9BC"/></div>
          <h2 className="font-serif text-3xl font-bold text-white leading-snug mb-3">
            Rencanakan hari<br/>bahagia kalian<br/>dengan tenang.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Checklist, budget, vendor, tamu, dan rundown — semua tersusun rapi dalam satu dashboard yang elegan.
          </p>
        </div>
        <p className="relative z-10 text-white/50 text-xs">© 2026 Janji Suci Wedding Planner</p>
      </div>
      {/* Right form panel */}
      <div className="flex-1 relative overflow-y-auto custom-scroll" style={{background:'var(--cream)'}}>
        <div className="lg:hidden"><AuthOrnament/><AuthOrnamentBL/></div>
        <div className="flex flex-col items-center justify-center min-h-full px-7 py-12 lg:px-16 relative z-10">
          <div className="w-full lg:max-w-[420px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

