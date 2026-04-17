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
  return Math.ceil((new Date(deadline) - new Date()) / 86400000)
}

function DeadlineBadge({ deadline }) {
  if (!deadline) return null
  const d = daysLeft(deadline)
  const color = d < 0 ? '#e05070' : d <= 7 ? '#d4906a' : '#80a880'
  const label = d < 0 ? `${Math.abs(d)}d atrasada` : d === 0 ? 'Hoje!' : `${d}d`
  return <span style={{fontSize:10,fontWeight:700,color:'white',background:color,padding:'2px 7px',borderRadius:8,flexShrink:0}}>{label}</span>
}

function WelcomePop({ onClose }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])
  function close() { setVisible(false); setTimeout(onClose, 400) }
  return (
    <div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:20,
      background:'rgba(120,60,100,0.3)',backdropFilter:'blur(8px)',
      opacity:visible?1:0,transition:'opacity .4s'}}>
      <div style={{background:'rgba(255,255,255,0.95)',backdropFilter:'blur(30px)',
        border:'1.5px solid rgba(255,220,235,0.9)',borderRadius:28,
        padding:'36px 28px',maxWidth:300,width:'100%',textAlign:'center',
        boxShadow:'0 20px 60px rgba(180,80,140,0.25)',
        transform:visible?'scale(1) translateY(0)':'scale(0.85) translateY(30px)',
        transition:'transform .4s cubic-bezier(.34,1.56,.64,1)'}}>
        <img src="https://pngimg.com/uploads/butterfly/butterfly_PNG194.png" 
          alt="" style={{width:80,marginBottom:8,filter:'hue-rotate(300deg) saturate(1.5)'}}
          onError={e=>{e.target.style.display='none'}}/>
        <div style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:28,color:'#7a2858',lineHeight:1.3,marginBottom:8}}>
          Oi, <strong style={{fontStyle:'normal',background:'linear-gradient(135deg,#d4508a,#9050c8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Juju!</strong>
        </div>
        <div style={{fontSize:14,fontWeight:600,color:'#9a6080',lineHeight:1.7,marginBottom:22}}>
          Pode contar comigo viu 🦋<br/>
          <span style={{fontSize:12,color:'#c0a0b8'}}>Cada sonho que você escrever aqui,<br/>vou guardar com muito carinho 💖</span>
        </div>
        <button onClick={close} style={{width:'100%',padding:'13px',borderRadius:16,
          background:'linear-gradient(135deg,#d4508a,#9050c8)',border:'none',color:'white',
          fontFamily:"'Quicksand',sans-serif",fontSize:14,fontWeight:700,cursor:'pointer',
          boxShadow:'0 4px 18px rgba(180,60,130,.35)'}}>
          Vamos lá! ✨
        </button>
      </div>
    </div>
  )
}

// Decorative elements using real PNG images from CDNs
const DECOS = [
  // Butterflies
  { src:'https://pngimg.com/uploads/butterfly/butterfly_PNG194.png', x:'2%',  y:'3%',  w:90,  rot:-15, op:0.55, hue:300 },
  { src:'https://pngimg.com/uploads/butterfly/butterfly_PNG194.png', x:'78%', y:'2%',  w:75,  rot:20,  op:0.5,  hue:240 },
  { src:'https://pngimg.com/uploads/butterfly/butterfly_PNG194.png', x:'85%', y:'55%', w:65,  rot:-10, op:0.45, hue:320 },
  { src:'https://pngimg.com/uploads/butterfly/butterfly_PNG194.png', x:'1%',  y:'60%', w:70,  rot:15,  op:0.45, hue:280 },
  { src:'https://pngimg.com/uploads/butterfly/butterfly_PNG194.png', x:'40%', y:'88%', w:55,  rot:-20, op:0.4,  hue:310 },
  { src:'https://pngimg.com/uploads/butterfly/butterfly_PNG194.png', x:'60%', y:'30%', w:45,  rot:30,  op:0.35, hue:260 },
  // Roses
  { src:'https://pngimg.com/uploads/rose/rose_PNG66.png',            x:'70%', y:'80%', w:100, rot:10,  op:0.5,  hue:0   },
  { src:'https://pngimg.com/uploads/rose/rose_PNG66.png',            x:'0%',  y:'78%', w:85,  rot:-15, op:0.45, hue:20  },
  { src:'https://pngimg.com/uploads/rose/rose_PNG66.png',            x:'75%', y:'12%', w:70,  rot:20,  op:0.4,  hue:330 },
  { src:'https://pngimg.com/uploads/rose/rose_PNG66.png',            x:'30%', y:'5%',  w:60,  rot:-8,  op:0.38, hue:350 },
  // Stars/sparkles
  { src:'https://pngimg.com/uploads/star/star_PNG1602.png',          x:'20%', y:'15%', w:30,  rot:0,   op:0.5,  hue:300 },
  { src:'https://pngimg.com/uploads/star/star_PNG1602.png',          x:'88%', y:'38%', w:25,  rot:45,  op:0.45, hue:260 },
  { src:'https://pngimg.com/uploads/star/star_PNG1602.png',          x:'5%',  y:'42%', w:22,  rot:20,  op:0.4,  hue:320 },
  { src:'https://pngimg.com/uploads/star/star_PNG1602.png',          x:'55%', y:'72%', w:28,  rot:10,  op:0.45, hue:280 },
  { src:'https://pngimg.com/uploads/star/star_PNG1602.png',          x:'15%', y:'88%', w:24,  rot:30,  op:0.4,  hue:310 },
]

function CoquetteBg() {
  return (
    <>
      {/* Gradient base */}
      <div style={{position:'fixed',inset:0,zIndex:-2,
        background:'linear-gradient(145deg,#fdeaf5 0%,#f5e6fc 35%,#ece8ff 65%,#fde8f2 100%)'}}/>
      {/* Soft blobs */}
      <div style={{position:'fixed',inset:0,zIndex:-1,overflow:'hidden',pointerEvents:'none'}}>
        {[
          {w:350,h:300,top:'-80px',left:'-60px',bg:'rgba(255,180,210,0.25)',blur:80},
          {w:300,h:280,top:'10%',right:'-80px',bg:'rgba(200,160,240,0.22)',blur:70},
          {w:280,h:260,bottom:'15%',left:'-50px',bg:'rgba(220,180,255,0.2)',blur:75},
          {w:320,h:280,bottom:'-60px',right:'-40px',bg:'rgba(255,170,210,0.22)',blur:80},
          {w:200,h:200,top:'45%',left:'40%',bg:'rgba(255,200,230,0.15)',blur:60},
        ].map((b,i)=>(
          <div key={i} style={{position:'absolute',width:b.w,height:b.h,top:b.top,left:b.left,bottom:b.bottom,right:b.right,
            background:b.bg,borderRadius:'50%',filter:`blur(${b.blur}px)`}}/>
        ))}
      </div>
      {/* Decorative images */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        {DECOS.map((d,i)=>(
          <img key={i} src={d.src} alt="" style={{
            position:'absolute',left:d.x,top:d.y,width:d.w,
            opacity:d.op,transform:`rotate(${d.rot}deg)`,
            filter:`hue-rotate(${d.hue}deg) saturate(1.4) brightness(0.95)`,
            objectFit:'contain',
          }} onError={e=>e.target.style.display='none'}/>
        ))}
      </div>
      {/* Dot pattern */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',
        backgroundImage:'radial-gradient(circle,rgba(200,140,190,0.15) 1px,transparent 1px)',
        backgroundSize:'25px 25px'}}/>
    </>
  )
}

export default function Home() {
  const [showPop, setShowPop] = useState(false)
  const [screen, setScreen] = useState('onboard')
  const [authMode, setAuthMode] = useState('login')
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

  useEffect(() => {
    const seen = sessionStorage.getItem('pop_seen')
    if (!seen) { setShowPop(true); sessionStorage.setItem('pop_seen','1') }
    const saved = localStorage.getItem('checklist_slug')
    if (saved) loadList(saved).catch(() => localStorage.removeItem('checklist_slug'))
  }, [])

  function showToast(msg) { setToast(msg); setToastVisible(true); setTimeout(()=>setToastVisible(false),2600) }
  function showErr(msg) { setError(msg); setTimeout(()=>setError(''),4000) }
  function showAErr(msg) { setAppError(msg); setTimeout(()=>setAppError(''),4000) }

  async function loadList(s) {
    const data = await api('GET', `/api/users/${s}`)
    const loaded = (data.items||[]).map(i=>({...i,done:i.done===true||i.done==='true'}))
    setSlug(data.slug); setUserName(data.name); setItems(loaded)
    localStorage.setItem('checklist_slug', data.slug)
    setScreen('app')
  }

  async function handleAuth() {
    if (!name.trim()||!password.trim()) { showErr('Preencha nome e senha 🌸'); return }
    setLoading(true)
    try { const user = await api('POST','/api/auth',{action:authMode,name:name.trim(),password}); await loadList(user.slug) }
    catch(e) { showErr(e.message) }
    setLoading(false)
  }

  async function handleAdd() {
    if (!addText.trim()) return
    try {
      const item = await api('POST',`/api/users/${slug}`,{text:addText.trim()})
      if (addDeadline) await api('PATCH',`/api/items/${item.id}`,{deadline:addDeadline})
      setItems(prev=>[...prev,{...item,done:false,deadline:addDeadline||null}])
      setAddText(''); setAddDeadline('')
    } catch(e) { showAErr(e.message) }
  }

  async function handleToggle(item) {
    try {
      const updated = await api('PATCH',`/api/items/${item.id}`,{done:!item.done})
      const isDone = updated.done===true||updated.done==='true'
      setItems(prev=>prev.map(i=>i.id===item.id?{...i,done:isDone}:i))
      if (isDone) {
        showToast(MESSAGES[Math.floor(Math.random()*MESSAGES.length)])
        const next = items.map(i=>i.id===item.id?{...i,done:true}:i)
        if (next.length>=20&&next.every(i=>i.done)) launchConfetti()
      }
    } catch(e) { showAErr(e.message) }
  }

  async function handleDelete(id) {
    try { await api('DELETE',`/api/items/${id}`); setItems(prev=>prev.filter(i=>i.id!==id)) }
    catch(e) { showAErr(e.message) }
  }

  function launchConfetti() {
    const p = Array.from({length:55},(_,i)=>({id:i,left:Math.random()*100,
      color:CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)],
      dur:1.5+Math.random()*2,delay:Math.random()*.5}))
    setConfetti(p); setTimeout(()=>setConfetti([]),4000)
  }

  const filtered = filter==='done'?items.filter(i=>i.done):filter==='pending'?items.filter(i=>!i.done):items
  const done=items.filter(i=>i.done).length, total=items.length
  const pct=total?(done/Math.max(total,20))*100:0
  const offset=175.93-175.93*pct/100
  let progressMsg='Adicione seus sonhos ✨'
  if(total>0&&done===0) progressMsg=`${total} conquista${total>1?'s':''} te esperando!`
  else if(done>0&&done<total) progressMsg=`${total-done} pela frente!`
  else if(total>0&&done===total) progressMsg='🎉 Todas conquistadas! Lenda!'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{min-height:100vh;font-family:'Quicksand',sans-serif;color:#4a2848;overflow-x:hidden}
        .wrap{position:relative;z-index:1;max-width:500px;margin:0 auto;padding:30px 18px 60px}
        .glass{background:rgba(255,255,255,0.65);backdrop-filter:blur(26px);-webkit-backdrop-filter:blur(26px);border:1.5px solid rgba(255,240,248,0.9);border-radius:24px;box-shadow:0 8px 32px rgba(160,80,140,0.13)}
        .card{padding:28px 22px;margin-top:12px;text-align:center}
        .badge{display:inline-block;background:linear-gradient(135deg,#d4508a,#9050c8);color:white;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:4px 14px;border-radius:20px;margin-bottom:10px;box-shadow:0 2px 10px rgba(160,60,120,.3)}
        h1{font-family:'Playfair Display',serif;font-size:clamp(22px,5.5vw,32px);font-weight:400;font-style:italic;line-height:1.2;margin-bottom:3px;color:#3a1838}
        h1 strong{font-weight:700;font-style:normal;background:linear-gradient(135deg,#c4408a,#8040b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sub{font-size:12px;color:#b080a8;margin-bottom:16px;line-height:1.6}
        .tabs{display:flex;gap:0;margin-bottom:16px;background:rgba(180,100,160,.1);border-radius:13px;padding:3px}
        .tab{flex:1;padding:9px;border:none;border-radius:10px;font-family:'Quicksand',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;background:transparent;color:#b080a8}
        .tab.on{background:white;color:#3a1838;box-shadow:0 2px 8px rgba(160,80,140,.16)}
        input[type=text],input[type=password],input[type=date]{width:100%;padding:12px 15px;border-radius:12px;border:1.5px solid rgba(210,150,190,.3);background:rgba(255,255,255,.75);font-family:'Quicksand',sans-serif;font-size:14px;font-weight:600;color:#3a1838;outline:none;margin-bottom:8px;transition:all .2s;display:block}
        input:focus{border-color:#c4508a;box-shadow:0 0 0 3px rgba(196,80,138,.1);background:rgba(255,255,255,.95)}
        input::placeholder{color:#c0a0b8;font-weight:500}
        .bp{width:100%;padding:13px;border-radius:13px;background:linear-gradient(135deg,#d4508a,#9050c8);border:none;color:white;font-family:'Quicksand',sans-serif;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(160,60,130,.3);transition:transform .15s,box-shadow .15s;display:block;margin-bottom:5px}
        .bp:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(160,60,130,.4)}
        .bp:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .bs{width:100%;padding:10px;border-radius:13px;background:rgba(255,255,255,.5);border:1.5px solid rgba(210,150,190,.3);color:#b080a8;font-family:'Quicksand',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;display:block}
        .bs:hover{border-color:#c4508a;color:#3a1838;background:rgba(255,255,255,.85)}
        .err{background:rgba(230,140,150,.18);border:1px solid rgba(210,80,100,.22);border-radius:11px;padding:8px 13px;font-size:12px;font-weight:600;color:#a02840;margin-bottom:10px}
        .pc{display:flex;align-items:center;gap:14px;padding:15px 18px;margin-bottom:13px}
        .pcircle{position:relative;flex-shrink:0;width:64px;height:64px}
        .pcircle svg{transform:rotate(-90deg)}
        .pnum{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:11px;font-weight:700;color:#3a1838;text-align:center;line-height:1.1}
        .pnum small{display:block;font-size:9px;color:#c0a0b8}
        .pinfo{flex:1}
        .plbl{font-size:12px;font-weight:700;margin-bottom:6px;color:#3a1838}
        .ptrack{height:6px;background:rgba(210,150,190,.18);border-radius:10px;overflow:hidden}
        .pfill{height:100%;background:linear-gradient(90deg,#d4508a,#9050c8);border-radius:10px;transition:width .6s}
        .pmsg{font-size:11px;color:#c0a0b8;margin-top:4px}
        .ac{display:flex;gap:8px;align-items:flex-start;padding:11px 13px;margin-bottom:13px}
        .ac-fields{flex:1;display:flex;flex-direction:column;gap:5px}
        .ac-fields input{margin-bottom:0;font-size:13px;padding:10px 13px}
        .ab{width:36px;height:36px;border-radius:11px;background:linear-gradient(135deg,#d4508a,#9050c8);border:none;cursor:pointer;color:white;font-size:22px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 3px 10px rgba(160,60,130,.3);transition:transform .15s;margin-top:2px}
        .ab:hover{transform:scale(1.08)}
        .fltrs{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap}
        .fb{font-family:'Quicksand',sans-serif;font-size:11px;font-weight:700;padding:5px 11px;border-radius:10px;border:1.5px solid transparent;cursor:pointer;transition:all .2s}
        .fb.on{background:linear-gradient(135deg,#d4508a,#9050c8);color:white;box-shadow:0 2px 8px rgba(160,60,130,.25)}
        .fb:not(.on){background:rgba(255,255,255,.55);color:#c0a0b8;border-color:rgba(210,150,190,.3)}
        .fb:not(.on):hover{border-color:#c4508a;color:#3a1838}
        .slbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#c0a0b8;margin-bottom:9px;padding-left:2px}
        .list{display:flex;flex-direction:column;gap:8px}
        .item{display:flex;align-items:center;gap:10px;padding:12px 13px;border-radius:15px;transition:transform .2s;animation:fsi .3s cubic-bezier(.34,1.56,.64,1)}
        @keyframes fsi{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
        .item:hover{transform:translateY(-1px)}
        .item.done{background:rgba(255,215,230,.4)!important;border-color:rgba(220,150,180,.28)!important}
        .chkw{position:relative;flex-shrink:0;width:24px;height:24px;cursor:pointer}
        .chkw input[type=checkbox]{position:absolute;opacity:0;width:0;height:0;margin:0}
        .chkv{width:24px;height:24px;border-radius:50%;border:2px solid #d090b8;background:white;display:flex;align-items:center;justify-content:center;transition:all .25s cubic-bezier(.34,1.56,.64,1);font-size:11px}
        .chkw input:checked~.chkv{background:linear-gradient(135deg,#d4508a,#9050c8);border-color:transparent;transform:scale(1.1);box-shadow:0 2px 8px rgba(160,60,130,.35)}
        .item-main{flex:1;min-width:0}
        .itxt{font-size:13px;font-weight:600;line-height:1.4;color:#3a1838;transition:all .3s}
        .done .itxt{text-decoration:line-through;text-decoration-color:#d4508a;color:#b090a8}
        .item-meta{display:flex;align-items:center;gap:5px;margin-top:2px}
        .inum{font-size:9px;font-weight:700;color:#c0a0b8;background:rgba(210,150,190,.18);padding:1px 5px;border-radius:6px;flex-shrink:0}
        .del{width:24px;height:24px;border-radius:8px;border:none;background:transparent;color:#c0a0b8;cursor:pointer;font-size:16px;opacity:0;transition:opacity .2s;flex-shrink:0;display:flex;align-items:center;justify-content:center}
        .item:hover .del{opacity:1}
        .del:hover{background:rgba(220,100,140,.15);color:#c4408a}
        .empty{text-align:center;padding:30px 14px;color:#c0a0b8}
        .empty .em{font-size:34px;margin-bottom:8px}
        .empty p{font-size:12px;font-weight:500}
        .hname{font-size:11px;color:#b080a8;font-weight:600}
        .hslug{display:inline-block;margin-top:3px;font-size:10px;color:#b080a8;background:rgba(210,150,190,.18);padding:2px 9px;border-radius:8px;cursor:pointer;font-family:monospace}
        .hslug:hover{background:rgba(210,150,190,.35)}
        .tw{position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(80px);transition:transform .4s cubic-bezier(.34,1.56,.64,1);z-index:100}
        .tw.show{transform:translateX(-50%) translateY(0)}
        .ti{background:rgba(255,255,255,.92);backdrop-filter:blur(20px);border:1px solid rgba(255,240,248,.95);border-radius:17px;padding:10px 18px;font-size:12px;font-weight:600;color:#3a1838;box-shadow:0 8px 26px rgba(160,80,130,.18);white-space:nowrap}
        .cw{position:fixed;inset:0;pointer-events:none;z-index:200;overflow:hidden}
        .cp{position:absolute;width:7px;height:7px;border-radius:2px;animation:cf linear forwards}
        @keyframes cf{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
        @media(max-width:420px){.wrap{padding:18px 12px 48px}}
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>

      <CoquetteBg/>
      {showPop && <WelcomePop onClose={()=>setShowPop(false)}/>}

      <svg width="0" height="0" style={{position:'absolute'}}>
        <defs>
          <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'#d4508a'}}/>
            <stop offset="100%" style={{stopColor:'#9050c8'}}/>
          </linearGradient>
        </defs>
      </svg>

      <div className="wrap">
        {screen==='onboard' && (
          <>
            <div style={{textAlign:'center',marginTop:10,marginBottom:16}}>
              <div className="badge">✨ bem-vinda</div>
              <h1>Meus <strong>20</strong><br/>antes dos 20</h1>
            </div>
            <div className="glass card">
              <div style={{fontSize:36,marginBottom:8}}>🌸</div>
              <div className="sub">Entre na sua conta ou crie uma nova 🦋</div>
              {error && <div className="err">{error}</div>}
              <div className="tabs">
                <button className={`tab${authMode==='login'?' on':''}`} onClick={()=>setAuthMode('login')}>Entrar</button>
                <button className={`tab${authMode==='register'?' on':''}`} onClick={()=>setAuthMode('register')}>Criar conta</button>
              </div>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAuth()} placeholder="Seu nome" maxLength={40}/>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAuth()} placeholder="Senha" maxLength={50}/>
              <button className="bp" onClick={handleAuth} disabled={loading}>
                {loading?'...':authMode==='login'?'Entrar →':'Criar minha lista ✨'}
              </button>
            </div>
          </>
        )}

        {screen==='app' && (
          <>
            <div style={{textAlign:'center',marginBottom:16}}>
              <div className="badge">✨ minha jornada</div>
              <h1>Meus <strong>20</strong> antes dos 20</h1>
              <div className="hname">de {userName} 🌸</div>
              <div className="hslug" onClick={()=>navigator.clipboard.writeText(slug).then(()=>showToast('Copiado! 💖'))}>#{slug}</div>
            </div>

            <div className="glass pc">
              <div className="pcircle">
                <svg width="64" height="64" viewBox="0 0 70 70">
                  <circle style={{fill:'none',stroke:'rgba(210,150,190,.2)',strokeWidth:6}} cx="35" cy="35" r="28"/>
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

            <div className="glass ac">
              <div className="ac-fields">
                <input type="text" value={addText} onChange={e=>setAddText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAdd()} placeholder="Nova conquista..." maxLength={80}/>
                <input type="date" value={addDeadline} onChange={e=>setAddDeadline(e.target.value)} style={{fontSize:12,color:addDeadline?'#3a1838':'#c0a0b8'}}/>
              </div>
              <button className="ab" onClick={handleAdd} style={{alignSelf:'flex-start',marginTop:2}}>+</button>
            </div>

            <div className="fltrs">
              {[['all','Todas'],['pending','A fazer'],['done','Conquistadas 🎉']].map(([f,l])=>(
                <button key={f} className={`fb${filter===f?' on':''}`} onClick={()=>setFilter(f)}>{l}</button>
              ))}
            </div>

            <div className="slbl">{filter==='all'?`sua lista (${total}/20)`:filter==='done'?'conquistadas':'a conquistar'}</div>
            {appError && <div className="err">{appError}</div>}

            <div className="list">
              {filtered.length===0?(
                <div className="empty"><div className="em">{filter==='done'?'🌸':'🦋'}</div><p>{filter==='done'?'Nenhuma ainda!':'Tudo conquistado! 🎉'}</p></div>
              ):filtered.map(item=>{
                const pos=items.indexOf(item)+1
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
                onClick={()=>{localStorage.removeItem('checklist_slug');setScreen('onboard');setItems([]);setSlug('');setName('');setPassword('')}}>
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
