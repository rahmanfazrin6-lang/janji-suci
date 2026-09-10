/* ═══════════════ SCREEN: SETUP ═══════════════ */
/* ── helpers for setup inputs ── */
function fmtRpInput(raw) {
  const num = String(raw).replace(/\D/g,'');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
}
function parseRpInput(val) {
  return String(val).replace(/\./g,'');
}
function isoToDisplay(iso) {
  if (!iso || !iso.includes('-')) return iso||'';
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
function displayToIso(disp) {
  if (!disp) return '';
  const digits = disp.replace(/\D/g,'');
  if (digits.length >= 8) {
    const d = digits.slice(0,2), m = digits.slice(2,4), y = digits.slice(4,8);
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
  return '';
}
function autoDate(raw) {
  const digits = raw.replace(/\D/g,'').slice(0,8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return digits.slice(0,2)+'/'+digits.slice(2);
  return digits.slice(0,2)+'/'+digits.slice(2,4)+'/'+digits.slice(4);
}
function autoTime(raw) {
  const digits = raw.replace(/\D/g,'').slice(0,4);
  if (digits.length <= 2) return digits;
  return digits.slice(0,2)+':'+digits.slice(2);
}

