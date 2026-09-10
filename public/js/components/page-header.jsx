/* ═══════════════ PAGE HEADER (mobile back + title, desktop title only) ═══════════════ */
function PageHeader({ title, subtitle, onBack, right }) {
  return (
    <div className="flex items-start justify-between mb-1 lg:mb-2">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{background:'var(--sage-light)',color:'var(--sage-dark)'}}>
            {Ic.back}
          </button>
        )}
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold" style={{color:'var(--sage-deep)'}}>{title}</h1>
          {subtitle && <p className="text-xs lg:text-sm mt-0.5" style={{color:'#9db09f'}}>{subtitle}</p>}
        </div>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}

