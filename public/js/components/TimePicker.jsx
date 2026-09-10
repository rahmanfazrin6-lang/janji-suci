/* ═══════════════ CUSTOM TIME PICKER — always 24h, never native ═══════════════ */
const HOURS_24 = Array.from({length:24}, (_,i)=>String(i).padStart(2,'0'));
const MINUTES_60 = Array.from({length:60}, (_,i)=>String(i).padStart(2,'0'));

function TimePicker({ value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const hourListRef = useRef(null);
  const minListRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Auto-scroll selected hour/minute into view when popover opens
    setTimeout(() => {
      const [hh, mm] = (value||'').split(':');
      if (hourListRef.current) {
        const idx = HOURS_24.indexOf(hh);
        if (idx >= 0) hourListRef.current.scrollTop = idx * 34 - 68;
      }
      if (minListRef.current) {
        const idx = MINUTES_60.indexOf(mm);
        if (idx >= 0) minListRef.current.scrollTop = idx * 34 - 68;
      }
    }, 10);
  }, [open]);

  const [hh, mm] = (value||'').split(':');

  const setHour = (h) => onChange(`${h}:${mm||'00'}`);
  const setMinute = (m) => onChange(`${hh||'00'}:${m}`);

  const rowStyle = (active) => ({
    padding:'8px 0', textAlign:'center', cursor:'pointer', fontSize:'14px', fontWeight:600,
    background: active ? 'var(--sage-dark)' : 'transparent',
    color: active ? 'white' : 'var(--sage-deep)',
    borderRadius:'8px', margin:'0 4px',
  });

  return (
    <div ref={wrapRef} style={{position:'relative'}}>
      <div style={{position:'relative',display:'flex'}}>
        <input className="inp" placeholder={placeholder} value={value||''} maxLength={5} inputMode="numeric"
          style={{flex:1,borderRadius:'14px 0 0 14px',borderRight:'none'}}
          onChange={e=>onChange(autoTime(e.target.value))}
          onFocus={()=>setOpen(true)}/>
        <button type="button" className="pick-btn" onClick={()=>setOpen(o=>!o)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </button>
      </div>
      {open && (
        <div className="anim-fadeup" style={{position:'absolute',top:'calc(100% + 6px)',left:0,zIndex:50,
          background:'white',borderRadius:'16px',boxShadow:'0 10px 32px rgba(38,58,41,.2)',
          border:'1px solid var(--sage-mid)',overflow:'hidden',width:'176px'}}>
          <div style={{display:'flex',borderBottom:'1px solid var(--sage-mist)',padding:'8px 0 4px'}}>
            <div style={{flex:1,textAlign:'center',fontSize:'10px',fontWeight:700,color:'#9db09f',letterSpacing:'.05em'}}>JAM</div>
            <div style={{flex:1,textAlign:'center',fontSize:'10px',fontWeight:700,color:'#9db09f',letterSpacing:'.05em'}}>MENIT</div>
          </div>
          <div style={{display:'flex'}}>
            <div ref={hourListRef} className="custom-scroll" style={{flex:1,maxHeight:'176px',overflowY:'auto',padding:'4px 0'}}>
              {HOURS_24.map(h=>(
                <div key={h} onClick={()=>setHour(h)} style={rowStyle(h===hh)}>{h}</div>
              ))}
            </div>
            <div ref={minListRef} className="custom-scroll" style={{flex:1,maxHeight:'176px',overflowY:'auto',padding:'4px 0',borderLeft:'1px solid var(--sage-mist)'}}>
              {MINUTES_60.map(m=>(
                <div key={m} onClick={()=>setMinute(m)} style={rowStyle(m===mm)}>{m}</div>
              ))}
            </div>
          </div>
          <button type="button" onClick={()=>setOpen(false)}
            style={{width:'100%',padding:'10px',background:'var(--sage-light)',border:'none',borderTop:'1px solid var(--sage-mist)',
              color:'var(--sage-dark)',fontWeight:700,fontSize:'13px',cursor:'pointer'}}>
            Selesai
          </button>
        </div>
      )}
    </div>
  );
}

