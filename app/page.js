'use client'
import { useState, useEffect } from 'react'

const MESSAGES = ['Arrasou! 🌟','Isso sim é vida! 💖','Menos um medo! ✨','Você tá demais! 🦋','Cada passo conta! 🌸','Poderosa! 💅','Incrível você! 🌺','Brilha! ⭐']
const CONFETTI_COLORS = ['#f4c2c2','#dcd0f0','#d4a96a','#fde8e8','#ede8f8','#f0d9b0']

async function api(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const r = await fetch(path, opts)
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Erro')
  return data
}

function daysLeft(deadline) {
  if (!deadline) return null
  const diff = Math.ceil((new Date(deadline) - new Date()) / 86400000)
  return diff
}

function DeadlineBadge({ deadline }) {
  if (!deadline) return null
  const d = daysLeft(deadline)
  const color = d < 0 ? '#e05070' : d <= 7 ? '#d4906a' : '#80a880'
  const label = d < 0 ? `${Math.abs(d)}d atrasada` : d === 0 ? 'Hoje!' : `${d}d`
  return <span style={{fontSize:10,fontWeight:700,color:'white',background:color,padding:'2px 7px',borderRadius:8,flexShrink:0}}>{label}</span>
}

// Watercolor SVG background
function WatercolorBg() {
  return (
    <svg style={{position:'fixed',inset:0,width:'100%',height:'100%',zIndex:-1}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur1"><feGaussianBlur stdDeviation="18"/></filter>
        <filter id="blur2"><feGaussianBlur stdDeviation="28"/></filter>
        <filter id="blur3"><feGaussianBlur stdDeviation="10"/></filter>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
          <feBlend in="SourceGraphic" mode="multiply" result="blend"/>
          <feComposite in="blend" in2="SourceGraphic" operator="in"/>
        </filter>
      </defs>
      {/* Base gradient */}
      <rect width="800" height="900" fill="url(#bgGrad)"/>
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fce8f5"/>
          <stop offset="40%" stopColor="#f0e6fb"/>
          <stop offset="100%" stopColor="#e8f0fb"/>
        </linearGradient>
      </defs>

      {/* Watercolor blobs */}
      <ellipse cx="120" cy="100" rx="180" ry="140" fill="#f7c5d5" opacity="0.45" filter="url(#blur2)"/>
      <ellipse cx="680" cy="80" rx="160" ry="120" fill="#d8c5f0" opacity="0.4" filter="url(#blur2)"/>
      <ellipse cx="400" cy="300" rx="220" ry="160" fill="#fce0ea" opacity="0.3" filter="url(#blur2)"/>
      <ellipse cx="50" cy="500" rx="150" ry="200" fill="#e8d5f5" opacity="0.35" filter="url(#blur2)"/>
      <ellipse cx="750" cy="600" rx="170" ry="150" fill="#f5c8d8" opacity="0.38" filter="url(#blur2)"/>
      <ellipse cx="400" cy="800" rx="250" ry="140" fill="#ddd0f5" opacity="0.3" filter="url(#blur2)"/>

      {/* Floral elements - roses */}
      {/* Top left cluster */}
      <g transform="translate(60,60) rotate(-15)" opacity="0.55" filter="url(#blur3)">
        <circle cx="0" cy="0" r="22" fill="#f0a0b8"/>
        <circle cx="18" cy="-10" r="16" fill="#f5b8c8"/>
        <circle cx="-15" cy="-12" r="14" fill="#e890a8"/>
        <circle cx="5" cy="-22" r="12" fill="#f8c8d5"/>
        <circle cx="0" cy="0" r="10" fill="#e87898"/>
        {/* petals */}
        <ellipse cx="0" cy="-28" rx="8" ry="14" fill="#f9d0dc" opacity="0.8"/>
        <ellipse cx="26" cy="-10" rx="8" ry="14" fill="#f9d0dc" opacity="0.8" transform="rotate(72,26,-10)"/>
        <ellipse cx="16" cy="20" rx="8" ry="14" fill="#f9d0dc" opacity="0.8" transform="rotate(144,16,20)"/>
        <ellipse cx="-16" cy="20" rx="8" ry="14" fill="#f9d0dc" opacity="0.8" transform="rotate(216,-16,20)"/>
        <ellipse cx="-26" cy="-10" rx="8" ry="14" fill="#f9d0dc" opacity="0.8" transform="rotate(288,-26,-10)"/>
      </g>

      {/* Top right flower */}
      <g transform="translate(730,50) rotate(20)" opacity="0.5" filter="url(#blur3)">
        <circle cx="0" cy="0" r="18" fill="#c8a0e0"/>
        <ellipse cx="0" cy="-24" rx="7" ry="13" fill="#dcc0f0" opacity="0.8"/>
        <ellipse cx="22" cy="-8" rx="7" ry="13" fill="#dcc0f0" opacity="0.8" transform="rotate(72,22,-8)"/>
        <ellipse cx="14" cy="18" rx="7" ry="13" fill="#dcc0f0" opacity="0.8" transform="rotate(144,14,18)"/>
        <ellipse cx="-14" cy="18" rx="7" ry="13" fill="#dcc0f0" opacity="0.8" transform="rotate(216,-14,18)"/>
        <ellipse cx="-22" cy="-8" rx="7" ry="13" fill="#dcc0f0" opacity="0.8" transform="rotate(288,-22,-8)"/>
        <circle cx="0" cy="0" r="8" fill="#b080d0"/>
      </g>

      {/* Scattered small flowers */}
      {[[180,180,0.4,'#f5b0c8',12],[600,200,0.35,'#c0a0e8',10],[100,380,0.38,'#f8c8d8',9],[700,350,0.4,'#d0b0f0',11],[250,700,0.42,'#f5a8c0',13],[550,750,0.36,'#c8a8e8',10],[400,150,0.3,'#f0b8d0',8],[680,480,0.38,'#d8b8f5',11],[120,650,0.35,'#f5c0d0',9]].map(([x,y,op,fill,r],i) => (
        <g key={i} transform={`translate(${x},${y})`} opacity={op}>
          <circle cx="0" cy="0" r={r} fill={fill}/>
          <ellipse cx="0" cy={-r-8} rx={r*0.5} ry={r*0.8} fill={fill} opacity="0.7"/>
          <ellipse cx={r+6} cy={-r*0.4} rx={r*0.5} ry={r*0.8} fill={fill} opacity="0.7" transform={`rotate(72,${r+6},${-r*0.4})`}/>
          <ellipse cx={r*0.6} cy={r+5} rx={r*0.5} ry={r*0.8} fill={fill} opacity="0.7" transform={`rotate(144,${r*0.6},${r+5})`}/>
          <ellipse cx={-r*0.6} cy={r+5} rx={r*0.5} ry={r*0.8} fill={fill} opacity="0.7" transform={`rotate(216,${-r*0.6},${r+5})`}/>
          <ellipse cx={-r-6} cy={-r*0.4} rx={r*0.5} ry={r*0.8} fill={fill} opacity="0.7" transform={`rotate(288,${-r-6},${-r*0.4})`}/>
        </g>
      ))}

      {/* Butterflies */}
      {[[300,80,0.3,0.8],[650,280,0.28,1.1],[80,280,0.25,0.9],[720,700,0.3,1.0],[200,820,0.27,0.85],[500,600,0.22,1.2]].map(([x,y,op,sc],i) => (
        <g key={i} transform={`translate(${x},${y}) scale(${sc})`} opacity={op}>
          <ellipse cx="-18" cy="-8" rx="16" ry="12" fill="#e8a0c0" transform="rotate(-20,-18,-8)"/>
          <ellipse cx="-12" cy="10" rx="12" ry="8" fill="#c8a0e0" transform="rotate(-10,-12,10)"/>
          <ellipse cx="18" cy="-8" rx="16" ry="12" fill="#e8a0c0" transform="rotate(20,18,-8)"/>
          <ellipse cx="12" cy="10" rx="12" ry="8" fill="#c8a0e0" transform="rotate(10,12,10)"/>
          <ellipse cx="0" cy="0" rx="2.5" ry="14" fill="#b08090"/>
        </g>
      ))}

      {/* Leaves */}
      {[[80,130,0.3],[720,160,0.28],[40,450,0.25],[760,550,0.3],[300,850,0.28],[500,50,0.25]].map(([x,y,op],i) => (
        <ellipse key={i} cx={x} cy={y} rx="8" ry="22" fill="#a0c890" opacity={op} transform={`rotate(${-30+i*20},${x},${y})`} filter="url(#blur3)"/>
      ))}

      {/* Subtle texture overlay */}
      <rect width="800" height="900" fill="white" opacity="0.08"/>
    </svg>
  )
}

export default function Home() {
  const [screen, setScreen] = useState('onboard') // onboard | app
  const [authMode, setAuthMode] = useState('login') // login | register
  const [items, setItems] = useState([])
  const [slug, setSlug] = useState('')
  const [userName, setUserName] = useState('')
  const [filter, setFilter] = useState('all')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [addText, setAddText] = useState('')
  const [addDeadline, setAddDeadline] = useState('')
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [error, setError] = useState('')
  const [appError, setAppError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confetti, setConfetti] = useState([])
  const [previewItems, setPreviewItems] = useState([])
  const [previewName, setPreviewName] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('checklist_slug')
    const savedName = localStorage.getItem('checklist_name')
    if (saved) loadList(saved).catch(() => {
      localStorage.removeItem('checklist_slug')
      localStorage.removeItem('checklist_name')
    })
  }, [])

  // Load preview when name is typed
  useEffect(() => {
    if (!previewName.trim() || previewName.length < 2) { setPreviewItems([]); return }
    const t = setTimeout(async () => {
      setPreviewLoading(true)
      try {
        const slug = previewName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
        const data = await api('GET', `/api/users/${slug}`)
        setPreviewItems(data.items?.slice(0,3) || [])
      } catch { setPreviewItems([]) }
      setPreviewLoading(false)
    }, 600)
    return () => clearTimeout(t)
  }, [previewName])

  function showToast(msg) {
    setToast(msg); setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2600)
  }
  function showErr(msg) { setError(msg); setTimeout(() => setError(''), 4000) }
  function showAErr(msg) { setAppError(msg); setTimeout(() => setAppError(''), 4000) }

  async function loadList(s) {
    const data = await api('GET', `/api/users/${s}`)
    const loaded = (data.items || []).map(i => ({ ...i, done: i.done === true || i.done === 'true' }))
    setSlug(data.slug); setUserName(data.name); setItems(loaded)
    localStorage.setItem('checklist_slug', data.slug)
    localStorage.setItem('checklist_name', data.name)
    setScreen('app')
  }

  async function handleAuth() {
    if (!name.trim() || !password.trim()) { showErr('Preencha nome e senha 🌸'); return }
    setLoading(true)
    try {
      const user = await api('POST', '/api/auth', { action: authMode, name: name.trim(), password })
      await loadList(user.slug)
    } catch(e) { showErr(e.message) }
    setLoading(false)
  }

  async function handleAdd() {
    if (!addText.trim()) return
    try {
      const item = await api('POST', `/api/users/${slug}`, { text: addText.trim() })
      if (addDeadline) await api('PATCH', `/api/items/${item.id}`, { deadline: addDeadline })
      setItems(prev => [...prev, { ...item, done: false, deadline: addDeadline || null }])
      setAddText(''); setAddDeadline('')
    } catch(e) { showAErr(e.message) }
  }

  async function handleToggle(item) {
    try {
      const updated = await api('PATCH', `/api/items/${item.id}`, { done: !item.done })
      const isDone = updated.done === true || updated.done === 'true'
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, done: isDone } : i))
      if (isDone) {
        showToast(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
        const next = items.map(i => i.id === item.id ? {...i,done:true} : i)
        if (next.length >= 20 && next.every(i=>i.done)) launchConfetti()
      }
    } catch(e) { showAErr(e.message) }
  }

  async function handleDelete(id) {
    try { await api('DELETE', `/api/items/${id}`); setItems(prev => prev.filter(i => i.id !== id)) }
    catch(e) { showAErr(e.message) }
  }

  function launchConfetti() {
    const pieces = Array.from({length:50},(_,i)=>({
      id:i, left:Math.random()*100,
      color:CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)],
      dur:1.5+Math.random()*2, delay:Math.random()*.5
    }))
    setConfetti(pieces); setTimeout(()=>setConfetti([]),4000)
  }

  const filtered = filter==='done' ? items.filter(i=>i.done) : filter==='pending' ? items.filter(i=>!i.done) : items
  const done = items.filter(i=>i.done).length, total = items.length
  const pct = total ? (done/Math.max(total,20))*100 : 0
  const offset = 175.93 - 175.93*pct/100
  let progressMsg = 'Adicione seus sonhos ✨'
  if (total>0&&done===0) progressMsg=`${total} conquista${total>1?'s':''} te esperando!`
  else if (done>0&&done<total) progressMsg=`${total-done} pela frente!`
  else if (total>0&&done===total) progressMsg='🎉 Todas conquistadas! Lenda!'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{min-height:100vh;font-family:'Quicksand',sans-serif;color:#5a3d50;overflow-x:hidden}
        .wrap{position:relative;z-index:1;max-width:500px;margin:0 auto;padding:30px 18px 60px}
        .glass{background:rgba(255,255,255,0.58);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.85);border-radius:26px;box-shadow:0 8px 40px rgba(180,120,160,0.13),0 2px 8px rgba(180,120,160,0.08)}
        .card{padding:28px 22px;margin-top:14px;text-align:center}
        .badge{display:inline-block;background:linear-gradient(135deg,#d4708a,#a870c8);color:white;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:4px 14px;border-radius:20px;margin-bottom:10px;box-shadow:0 2px 10px rgba(180,80,120,.3)}
        h1{font-family:'Playfair Display',serif;font-size:clamp(22px,5.5vw,32px);font-weight:400;font-style:italic;line-height:1.2;margin-bottom:3px;color:#4a3045}
        h1 strong{font-weight:700;font-style:normal;background:linear-gradient(135deg,#c4506a,#9060b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sub{font-size:12px;color:#b090a8;margin-bottom:18px;line-height:1.6}
        .tabs{display:flex;gap:0;margin-bottom:18px;background:rgba(180,140,170,.12);border-radius:14px;padding:3px}
        .tab{flex:1;padding:9px;border:none;border-radius:11px;font-family:'Quicksand',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;background:transparent;color:#b090a8}
        .tab.on{background:white;color:#4a3045;box-shadow:0 2px 8px rgba(180,120,160,.18)}
        input[type=text],input[type=password],input[type=date]{width:100%;padding:12px 15px;border-radius:13px;border:1.5px solid rgba(200,160,190,.4);background:rgba(255,255,255,.7);font-family:'Quicksand',sans-serif;font-size:14px;font-weight:600;color:#4a3045;outline:none;margin-bottom:9px;transition:border-color .2s;display:block}
        input:focus{border-color:#c4708a;box-shadow:0 0 0 3px rgba(196,112,138,.1)}
        input::placeholder{color:#c0a0b8;font-weight:500}
        .bp{width:100%;padding:13px;border-radius:13px;background:linear-gradient(135deg,#d4708a,#a870c8);border:none;color:white;font-family:'Quicksand',sans-serif;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(180,80,130,.28);transition:transform .15s;display:block;margin-bottom:5px}
        .bp:hover{transform:translateY(-1px)}
        .bp:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .bs{width:100%;padding:10px;border-radius:13px;background:rgba(255,255,255,.5);border:1.5px solid rgba(200,160,190,.4);color:#b090a8;font-family:'Quicksand',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;display:block}
        .bs:hover{border-color:#c4708a;color:#4a3045}
        .err{background:rgba(240,160,160,.25);border:1px solid rgba(210,100,110,.3);border-radius:11px;padding:8px 13px;font-size:12px;font-weight:600;color:#a03040;margin-bottom:10px}
        .preview-box{background:rgba(255,255,255,.45);border-radius:13px;padding:10px 13px;margin-top:10px;text-align:left}
        .preview-title{font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#c090b0;margin-bottom:7px}
        .preview-item{font-size:12px;font-weight:600;color:#7a5068;padding:3px 0;display:flex;align-items:center;gap:6px}
        .preview-item::before{content:'🌸';font-size:10px}
        .pc{display:flex;align-items:center;gap:14px;padding:16px 18px;margin-bottom:14px}
        .pcircle{position:relative;flex-shrink:0;width:64px;height:64px}
        .pcircle svg{transform:rotate(-90deg)}
        .pnum{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:11px;font-weight:700;color:#4a3045;text-align:center;line-height:1.1}
        .pnum small{display:block;font-size:9px;color:#c0a0b8}
        .pinfo{flex:1}
        .plbl{font-size:12px;font-weight:700;margin-bottom:6px;color:#4a3045}
        .ptrack{height:6px;background:rgba(200,160,190,.2);border-radius:10px;overflow:hidden}
        .pfill{height:100%;background:linear-gradient(90deg,#d4708a,#a870c8);border-radius:10px;transition:width .6s}
        .pmsg{font-size:11px;color:#c0a0b8;margin-top:4px}
        .ac{display:flex;gap:8px;align-items:flex-start;padding:11px 12px;margin-bottom:14px}
        .ac-fields{flex:1;display:flex;flex-direction:column;gap:5px}
        .ac-fields input{margin-bottom:0;font-size:13px;padding:10px 13px}
        .ab{width:36px;height:36px;border-radius:11px;background:linear-gradient(135deg,#d4708a,#a870c8);border:none;cursor:pointer;color:white;font-size:22px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 3px 10px rgba(180,80,130,.28);transition:transform .15s;margin-top:0}
        .ab:hover{transform:scale(1.08)}
        .fltrs{display:flex;gap:6px;margin-bottom:11px;flex-wrap:wrap}
        .fb{font-family:'Quicksand',sans-serif;font-size:11px;font-weight:700;padding:5px 11px;border-radius:10px;border:1.5px solid transparent;cursor:pointer;transition:all .2s}
        .fb.on{background:linear-gradient(135deg,#d4708a,#a870c8);color:white;box-shadow:0 2px 8px rgba(180,80,130,.25)}
        .fb:not(.on){background:rgba(255,255,255,.5);color:#c0a0b8;border-color:rgba(200,160,190,.4)}
        .fb:not(.on):hover{border-color:#c4708a;color:#4a3045}
        .slbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#c0a0b8;margin-bottom:9px;padding-left:2px}
        .list{display:flex;flex-direction:column;gap:8px}
        .item{display:flex;align-items:center;gap:10px;padding:12px 13px;border-radius:15px;transition:transform .2s;animation:fsi .3s cubic-bezier(.34,1.56,.64,1)}
        @keyframes fsi{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
        .item:hover{transform:translateY(-1px)}
        .item.done{background:rgba(255,230,240,.4)!important;border-color:rgba(220,170,190,.35)!important}
        .chkw{position:relative;flex-shrink:0;width:24px;height:24px;cursor:pointer}
        .chkw input[type=checkbox]{position:absolute;opacity:0;width:0;height:0;margin:0}
        .chkv{width:24px;height:24px;border-radius:50%;border:2px solid #d4a0b8;background:white;display:flex;align-items:center;justify-content:center;transition:all .25s cubic-bezier(.34,1.56,.64,1);font-size:11px}
        .chkw input:checked~.chkv{background:linear-gradient(135deg,#d4708a,#a870c8);border-color:transparent;transform:scale(1.1);box-shadow:0 2px 8px rgba(180,80,130,.35)}
        .item-main{flex:1;min-width:0}
        .itxt{font-size:13px;font-weight:600;line-height:1.4;color:#4a3045;transition:all .3s}
        .done .itxt{text-decoration:line-through;text-decoration-color:#d4708a;color:#b090a8}
        .item-meta{display:flex;align-items:center;gap:5px;margin-top:2px}
        .inum{font-size:9px;font-weight:700;color:#c0a0b8;background:rgba(200,160,190,.25);padding:1px 5px;border-radius:6px;flex-shrink:0}
        .del{width:24px;height:24px;border-radius:8px;border:none;background:transparent;color:#c0a0b8;cursor:pointer;font-size:16px;opacity:0;transition:opacity .2s;flex-shrink:0;display:flex;align-items:center;justify-content:center}
        .item:hover .del{opacity:1}
        .del:hover{background:rgba(220,140,160,.2);color:#c4506a}
        .empty{text-align:center;padding:30px 14px;color:#c0a0b8}
        .empty .em{font-size:34px;margin-bottom:8px}
        .empty p{font-size:12px;font-weight:500}
        .hname{font-size:11px;color:#b090a8;font-weight:600}
        .hslug{display:inline-block;margin-top:3px;font-size:10px;color:#b090a8;background:rgba(200,160,190,.2);padding:2px 9px;border-radius:8px;cursor:pointer;font-family:monospace}
        .hslug:hover{background:rgba(200,160,190,.4)}
        .tw{position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(80px);transition:transform .4s cubic-bezier(.34,1.56,.64,1);z-index:100}
        .tw.show{transform:translateX(-50%) translateY(0)}
        .ti{background:rgba(255,255,255,.88);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.95);border-radius:17px;padding:10px 18px;font-size:12px;font-weight:600;color:#4a3045;box-shadow:0 8px 26px rgba(180,120,160,.2);white-space:nowrap}
        .cw{position:fixed;inset:0;pointer-events:none;z-index:200;overflow:hidden}
        .cp{position:absolute;width:7px;height:7px;border-radius:2px;animation:cf linear forwards}
        @keyframes cf{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
        @media(max-width:420px){.wrap{padding:18px 12px 48px}}
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>

      <WatercolorBg/>

      <svg width="0" height="0" style={{position:'absolute'}}>
        <defs>
          <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'#d4708a'}}/>
            <stop offset="100%" style={{stopColor:'#a870c8'}}/>
          </linearGradient>
        </defs>
      </svg>

      <div className="wrap">

        {/* ── ONBOARD ── */}
        {screen === 'onboard' && (
          <>
            <div style={{textAlign:'center',marginTop:10,marginBottom:18}}>
              <div className="badge">✨ bem-vinda</div>
              <h1>Meus <strong>20</strong><br/>antes dos 20</h1>
            </div>

            <div className="glass card">
              <div style={{fontSize:38,marginBottom:10}}>🌸</div>

              {/* Preview list on home */}
              <div style={{marginBottom:16}}>
                <input type="text" value={previewName} onChange={e=>setPreviewName(e.target.value)}
                  placeholder="Espia a lista de alguém (opcional)..." style={{marginBottom:0}}/>
                {previewLoading && <div style={{fontSize:11,color:'#c0a0b8',marginTop:5}}>Buscando... 🌸</div>}
                {previewItems.length > 0 && (
                  <div className="preview-box">
                    <div className="preview-title">Prévia da lista</div>
                    {previewItems.map(it=>(
                      <div key={it.id} className="preview-item" style={{textDecoration:it.done?'line-through':'none',opacity:it.done?.6:1}}>{it.text}</div>
                    ))}
                    {previewItems.length === 3 && <div style={{fontSize:10,color:'#c0a0b8',marginTop:5}}>e mais conquistas...</div>}
                  </div>
                )}
              </div>

              <div className="sub">Crie sua lista ou entre na sua conta 🦋</div>

              {error && <div className="err">{error}</div>}

              <div className="tabs">
                <button className={`tab${authMode==='login'?' on':''}`} onClick={()=>setAuthMode('login')}>Entrar</button>
                <button className={`tab${authMode==='register'?' on':''}`} onClick={()=>setAuthMode('register')}>Criar conta</button>
              </div>

              <input type="text" value={name} onChange={e=>setName(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleAuth()}
                placeholder="Seu nome" maxLength={40}/>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleAuth()}
                placeholder="Senha" maxLength={50}/>
              <button className="bp" onClick={handleAuth} disabled={loading}>
                {loading ? '...' : authMode==='login' ? 'Entrar na minha lista →' : 'Criar minha lista ✨'}
              </button>
            </div>
          </>
        )}

        {/* ── APP ── */}
        {screen === 'app' && (
          <>
            <div style={{textAlign:'center',marginBottom:18}}>
              <div className="badge">✨ minha jornada</div>
              <h1>Meus <strong>20</strong> antes dos 20</h1>
              <div className="hname">de {userName} 🌸</div>
              <div className="hslug" onClick={()=>navigator.clipboard.writeText(slug).then(()=>showToast('Código copiado! 💖'))}>
                #{slug}
              </div>
            </div>

            {/* Progress */}
            <div className="glass pc">
              <div className="pcircle">
                <svg width="64" height="64" viewBox="0 0 70 70">
                  <circle style={{fill:'none',stroke:'rgba(200,160,190,.2)',strokeWidth:6}} cx="35" cy="35" r="28"/>
                  <circle style={{fill:'none',stroke:'url(#pg)',strokeWidth:6,strokeLinecap:'round',strokeDasharray:175.93,strokeDashoffset:offset,transition:'stroke-dashoffset .6s'}} cx="35" cy="35" r="28"/>
                </svg>
                <div className="pnum">{done}<small>de {total||20}</small></div>
              </div>
              <div className="pinfo">
                <div className="plbl">Progresso das conquistas</div>
                <div className="ptrack"><div className="pfill" style={{width:pct+'%'}}/></div>
                <div className="pmsg">{progressMsg}</div>
              </div>
            </div>

            {/* Add item */}
            <div className="glass ac">
              <div className="ac-fields">
                <input type="text" value={addText} onChange={e=>setAddText(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&handleAdd()}
                  placeholder="Nova conquista..." maxLength={80}/>
                <input type="date" value={addDeadline} onChange={e=>setAddDeadline(e.target.value)}
                  style={{fontSize:12,color:addDeadline?'#4a3045':'#c0a0b8'}}/>
              </div>
              <button className="ab" onClick={handleAdd} style={{alignSelf:'flex-start',marginTop:2}}>+</button>
            </div>

            {/* Filters */}
            <div className="fltrs">
              {[['all','Todas'],['pending','A fazer'],['done','Conquistadas 🎉']].map(([f,l])=>(
                <button key={f} className={`fb${filter===f?' on':''}`} onClick={()=>setFilter(f)}>{l}</button>
              ))}
            </div>

            <div className="slbl">
              {filter==='all'?`sua lista (${total}/20)`:filter==='done'?'conquistadas':'a conquistar'}
            </div>

            {appError && <div className="err">{appError}</div>}

            <div className="list">
              {filtered.length===0 ? (
                <div className="empty">
                  <div className="em">{filter==='done'?'🌸':'🦋'}</div>
                  <p>{filter==='done'?'Nenhuma ainda... bora lá!':'Tudo conquistado! 🎉'}</p>
                </div>
              ) : filtered.map(item=>{
                const pos = items.indexOf(item)+1
                return (
                  <div key={item.id} className={`item glass${item.done?' done':''}`}>
                    <label className="chkw">
                      <input type="checkbox" checked={!!item.done} onChange={()=>handleToggle(item)}/>
                      <div className="chkv">{item.done?'✓':''}</div>
                    </label>
                    <div className="item-main">
                      <div className="itxt">{item.text}</div>
                      <div className="item-meta">
                        <span className="inum">{String(pos).padStart(2,'0')}</span>
                        <DeadlineBadge deadline={item.deadline}/>
                      </div>
                    </div>
                    <button className="del" onClick={()=>handleDelete(item.id)}>×</button>
                  </div>
                )
              })}
            </div>

            <div style={{textAlign:'center',marginTop:20}}>
              <button className="bs" style={{width:'auto',padding:'6px 16px',fontSize:11}}
                onClick={()=>{localStorage.removeItem('checklist_slug');localStorage.removeItem('checklist_name');setScreen('onboard');setItems([]);setSlug('');setName('');setPassword('')}}>
                ← Sair da conta
              </button>
            </div>
          </>
        )}
      </div>

      <div className={`tw${toastVisible?' show':''}`}><div className="ti">{toast}</div></div>
      <div className="cw">
        {confetti.map(p=>(
          <div key={p.id} className="cp" style={{left:p.left+'vw',background:p.color,animationDuration:p.dur+'s',animationDelay:p.delay+'s'}}/>
        ))}
      </div>
    </>
  )
}
