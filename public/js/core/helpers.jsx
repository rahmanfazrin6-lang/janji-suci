/* ═══════════════ HELPERS ═══════════════ */
const fmt = n => n ? 'Rp '+Number(n).toLocaleString('id-ID') : 'Rp 0';
const daysUntil = d => d ? Math.ceil((new Date(d)-new Date())/864e5) : null;
const fmtDate = d => d ? new Date(d).toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) : null;
const fmtShort = d => d ? new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'}) : '';

function gcalLink(title, dateStr, details) {
  let start = new Date();
  if (dateStr) start = new Date(dateStr);
  const end = new Date(start.getTime()+60*60*1000);
  const fmt2 = d => d.toISOString().replace(/[-:]|\.\d{3}/g,'');
  const params = new URLSearchParams({
    action:'TEMPLATE', text:title, dates:`${fmt2(start)}/${fmt2(end)}`, details: details||''
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
// Combine ISO date (YYYY-MM-DD) + time (HH:MM) into a precise local datetime string for calendar events
function combineDateTime(dateStr, timeStr) {
  if (!dateStr) return null;
  if (!timeStr) return dateStr;
  return `${dateStr}T${timeStr}:00`;
}

async function callAI(prompt, sys='') {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ model:'claude-sonnet-4-6', max_tokens:1200, ...(sys?{system:sys}:{}), messages:[{role:'user',content:prompt}] })
  });
  const d = await r.json();
  return (d.content||[]).map(b=>b.text||'').join('');
}

