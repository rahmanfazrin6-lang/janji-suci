const { useState, useEffect, useRef } = React;

/* ═══════════════ ORNAMENTS ═══════════════ */
const Leaf = ({ x, y, rot=0, size=1, opacity=.18, color='#6B8F6E' }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${size})`} opacity={opacity}>
    <path d="M0,0 Q9,-20 0,-36 Q-9,-20 0,0Z" fill={color}/>
    <line x1="0" y1="0" x2="0" y2="-32" stroke={color} strokeWidth="1" strokeOpacity=".5"/>
  </g>
);
const Bloom = ({ cx, cy, r=18, opacity=.15, color='#B99A6B' }) => (
  <g opacity={opacity}>
    {[0,60,120,180,240,300].map(a=>(
      <ellipse key={a} cx={cx} cy={cy} rx={r*.35} ry={r*.7} fill={color} transform={`rotate(${a} ${cx} ${cy})`}/>
    ))}
    <circle cx={cx} cy={cy} r={r*.22} fill={color}/>
  </g>
);
const Sprig = ({ x, y, rot=0, len=44, opacity=.2, color='#6B8F6E' }) => (
  <g transform={`translate(${x},${y}) rotate(${rot})`} opacity={opacity}>
    <line x1="0" y1="0" x2="0" y2={-len} stroke={color} strokeWidth="1.5"/>
    {[-1,1].map((s,i)=>[.2,.42,.64,.86].map((t,j)=>(
      <path key={`${i}${j}`} d={`M0,${-len*t} Q${s*13*(1-t+.3)},${-len*t-11} ${s*11*(1-t+.2)},${-len*t-22}`} fill="none" stroke={color} strokeWidth="1"/>
    )))}
  </g>
);
const Wreath = ({ size=200, opacity=1, color='#6B8F6E', accent='#B99A6B' }) => {
  const n = 16, R = size*.36, cx = size/2, cy = size/2;
  const sprigs = Array.from({length:n}).map((_,i)=>{
    const a = (i/n)*360;
    const rad = a*Math.PI/180;
    const px = cx + R*Math.cos(rad), py = cy + R*Math.sin(rad);
    return <Sprig key={i} x={px} y={py} rot={a+90} len={size*.11} color={i%5===0?accent:color} opacity={.85}/>;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} opacity={opacity}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth="1" strokeOpacity=".25" strokeDasharray="2 6"/>
      {sprigs}
    </svg>
  );
};
const RingsIcon = ({ size=40, color='#6B8F6E' }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="15" cy="22" r="10" stroke={color} strokeWidth="2.2"/>
    <circle cx="25" cy="22" r="10" stroke={color} strokeWidth="2.2"/>
  </svg>
);
const AuthOrnament = () => (
  <svg style={{position:'absolute',top:0,right:0,width:160,height:160,opacity:.9}} viewBox="0 0 160 160">
    <Leaf x={130} y={130} rot={-40} size={1.2} opacity={.22}/>
    <Leaf x={145} y={95} rot={-70} size={.8} color="#47654A" opacity={.18}/>
    <Leaf x={110} y={150} rot={-20} size={.9} opacity={.16}/>
    <Bloom cx={148} cy={22} r={28} opacity={.2}/>
    <Sprig x={90} y={160} rot={-55} len={60} opacity={.14}/>
    <Bloom cx={115} cy={80} r={16} opacity={.12}/>
  </svg>
);
const AuthOrnamentBL = () => (
  <svg style={{position:'absolute',bottom:0,left:0,width:120,height:120,opacity:.85}} viewBox="0 0 120 120">
    <Leaf x={10} y={60} rot={130} size={1} opacity={.18}/>
    <Leaf x={30} y={100} rot={100} size={.8} color="#47654A" opacity={.15}/>
    <Sprig x={5} y={110} rot={15} len={50} opacity={.14}/>
    <Bloom cx={60} cy={110} r={20} opacity={.16}/>
  </svg>
);
const HeroOrnament = () => (
  <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'hidden'}} viewBox="0 0 390 260" preserveAspectRatio="xMidYMid slice">
    <Leaf x={20} y={220} rot={60} size={1.4} color="#fff" opacity={.12}/>
    <Leaf x={50} y={200} rot={80} size={1} color="#fff" opacity={.1}/>
    <Sprig x={340} y={240} rot={-30} len={80} color="#fff" opacity={.1}/>
    <Leaf x={360} y={180} rot={-60} size={1.2} color="#fff" opacity={.12}/>
    <Bloom cx={370} cy={30} r={36} color="#fff" opacity={.08}/>
    <Bloom cx={30} cy={30} r={28} color="#E9D9BC" opacity={.14}/>
    <Sprig x={15} y={60} rot={40} len={55} color="#fff" opacity={.1}/>
  </svg>
);
const SectionDivider = () => (
  <div className="divider-orn my-3">
    <div className="line"/>
    <svg width="12" height="12" viewBox="0 0 12 12"><Bloom cx={6} cy={6} r={6} opacity={1}/></svg>
    <div className="line"/>
  </div>
);

