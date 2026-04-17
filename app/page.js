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

// Welcome popup
function WelcomePop({ onClose }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])
  function close() { setVisible(false); setTimeout(onClose, 400) }
  return (
    <div style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:20,
      background:'rgba(80,40,80,0.35)',backdropFilter:'blur(6px)',
      opacity:visible?1:0,transition:'opacity .4s'}}>
      <div style={{background:'rgba(255,255,255,0.92)',backdropFilter:'blur(30px)',
        border:'1.5px solid rgba(255,255,255,0.95)',borderRadius:28,
        padding:'36px 30px',maxWidth:320,width:'100%',textAlign:'center',
        boxShadow:'0 20px 60px rgba(180,80,140,0.25)',
        transform:visible?'scale(1) translateY(0)':'scale(0.85) translateY(30px)',
        transition:'transform .4s cubic-bezier(.34,1.56,.64,1)'}}>
        {/* Animated hearts */}
        <div style={{fontSize:48,marginBottom:6,lineHeight:1}}>🌸</div>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:2,textTransform:'uppercase',
          color:'#c090c0',marginBottom:10}}>uma mensagem especial</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',
          fontSize:26,color:'#7a3060',lineHeight:1.3,marginBottom:8}}>
          Oi, <strong style={{fontStyle:'normal',background:'linear-gradient(135deg,#d4508a,#9050c8)',
          WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Juju!</strong>
        </div>
        <div style={{fontSize:15,fontWeight:600,color:'#9a6080',lineHeight:1.6,marginBottom:24}}>
          Pode contar comigo viu 🦋<br/>
          <span style={{fontSize:13,color:'#c0a0b8'}}>Cada sonho que você escrever aqui, vou guardar com muito carinho 💖</span>
        </div>
        <button onClick={close} style={{
          width:'100%',padding:'13px',borderRadius:16,
          background:'linear-gradient(135deg,#d4508a,#9050c8)',
          border:'none',color:'white',fontFamily:"'Quicksand',sans-serif",
          fontSize:14,fontWeight:700,cursor:'pointer',
          boxShadow:'0 4px 18px rgba(180,60,130,.35)',
          transition:'transform .15s'}}
          onMouseEnter={e=>e.target.style.transform='translateY(-1px)'}
          onMouseLeave={e=>e.target.style.transform='none'}>
          Vamos lá! ✨
        </button>
      </div>
    </div>
  )
}

// Geometric aesthetic background
function GeoBg() {
  const shapes = [
    // Big circles blurred
    {type:'circle',cx:80,cy:80,r:120,fill:'#f5b8d0',op:0.35,blur:50},
    {type:'circle',cx:720,cy:100,r:100,fill:'#c8a8e8',op:0.3,blur:45},
    {type:'circle',cx:750,cy:750,r:130,fill:'#f0b0cc',op:0.32,blur:50},
    {type:'circle',cx:50,cy:700,r:110,fill:'#d0b8f0',op:0.28,blur:45},
    {type:'circle',cx:400,cy:450,r:90,fill:'#fbc8d8',op:0.2,blur:40},
    // Triangles
    {type:'tri',points:'200,50 280,190 120,190',fill:'#e8a8c8',op:0.22},
    {type:'tri',points:'600,80 680,220 520,220',fill:'#c0a0e0',op:0.2},
    {type:'tri',points:'100,400 180,540 20,540',fill:'#f0b8d0',op:0.18},
    {type:'tri',points:'650,500 730,640 570,640',fill:'#d8b0f0',op:0.2},
    {type:'tri',points:'350,750 430,890 270,890',fill:'#f0a8c0',op:0.18},
    // Diamonds
    {type:'diamond',cx:520,cy:180,s:45,fill:'#e090c0',op:0.25},
    {type:'diamond',cx:160,cy:320,s:38,fill:'#b890d8',op:0.22},
    {type:'diamond',cx:680,cy:380,s:42,fill:'#f0a8c8',op:0.23},
    {type:'diamond',cx:280,cy:620,s:36,fill:'#c898e0',op:0.2},
    {type:'diamond',cx:580,cy:680,s:40,fill:'#e898c0',op:0.22},
    // Small circles scattered
    {type:'circle',cx:450,cy:80,r:18,fill:'#e890c0',op:0.4,blur:0},
    {type:'circle',cx:620,cy:260,r:14,fill:'#b880d8',op:0.38,blur:0},
    {type:'circle',cx:200,cy:480,r:16,fill:'#f098c8',op:0.35,blur:0},
    {type:'circle',cx:720,cy:550,r:12,fill:'#c090e0',op:0.38,blur:0},
    {type:'circle',cx:100,cy:600,r:20,fill:'#e888b8',op:0.3,blur:0},
    {type:'circle',cx:380,cy:320,r:10,fill:'#d080c8',op:0.35,blur:0},
    {type:'circle',cx:500,cy:560,r:15,fill:'#b878d0',op:0.3,blur:0},
    // Rectangles rotated
    {type:'rect',x:580,y:30,w:60,h:60,r:8,rot:25,fill:'#e898c8',op:0.2},
    {type:'rect',x:50,y:200,w:50,h:50,r:6,rot:-20,fill:'#c098e0',op:0.18},
    {type:'rect',x:700,y:320,w:55,h:55,r:8,rot:35,fill:'#f0a0cc',op:0.2},
    {type:'rect',x:250,y:780,w:48,h:48,r:6,rot:-15,fill:'#d090e0',op:0.18},
    {type:'rect',x:480,y:750,w:52,h:52,r:7,rot:28,fill:'#e890c0',op:0.2},
    // Stars/plus shapes
    {type:'star',cx:340,cy:160,fill:'#e080b8',op:0.3},
    {type:'star',cx:640,cy:420,fill:'#b070d0',op:0.28},
    {type:'star',cx:160,cy:750,fill:'#e888c0',op:0.28},
    {type:'star',cx:500,cy:850,fill:'#c080d8',op:0.25},
  ]

  return (
    <svg style={{position:'fixed',inset:0,width:'100%',height:'100%',zIndex:-1}} preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 900" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {[0,1,2,3,4].map(i=>(
          <filter key={i} id={`b${i}`}><feGaussianBlur stdDeviation={[50,45,40,0,0][i]}/></filter>
        ))}
      </defs>

      {/* Soft gradient base */}
      <defs>
        <linearGradient id="base" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdeaf5"/>
          <stop offset="50%" stopColor="#f0e8fc"/>
          <stop offset="100%" stopColor="#e8eeff"/>
        </linearGradient>
      </defs>
      <rect width="800" height="900" fill="url(#base)"/>

      {shapes.map((s,i)=>{
        const filt = s.blur ? `url(#b${s.blur>=50?0:s.blur>=45?1:2})` : undefined
        if (s.type==='circle') return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.fill} opacity={s.op} filter={filt}/>
        if (s.type==='tri') return <polygon key={i} points={s.points} fill={s.fill} opacity={s.op}/>
        if (s.type==='diamond') return <polygon key={i} points={`${s.cx},${s.cy-s.s} ${s.cx+s.s},${s.cy} ${s.cx},${s.cy+s.s} ${s.cx-s.s},${s.cy}`} fill={s.fill} opacity={s.op}/>
        if (s.type==='rect') return <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} fill={s.fill} opacity={s.op} transform={`rotate(${s.rot},${s.x+s.w/2},${s.y+s.h/2})`}/>
        if (s.type==='star') return (
          <g key={i} opacity={s.op}>
            <rect x={s.cx-4} y={s.cy-18} width={8} height={36} rx={4} fill={s.fill}/>
            <rect x={s.cx-18} y={s.cy-4} width={36} height={8} rx={4} fill={s.fill}/>
            <rect x={s.cx-4} y={s.cy-18} width={8} height={36} rx={4} fill={s.fill} transform={`rotate(45,${s.cx},${s.cy})`}/>
            <rect x={s.cx-18} y={s.cy-4} width={36} height={8} rx={4} fill={s.fill} transform={`rotate(45,${s.cx},${s.cy})`}/>
          </g>
        )
        return null
      })}

      {/* Dot grid overlay */}
      <defs>
        <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="1.2" fill="#d090c0" opacity="0.18"/>
        </pattern>
      </defs>
      <rect width="800" height="900" fill="url(#dots)"/>

      {/* Soft white overlay for readability */}
      <rect width="800" height="900" fill="white" opacity="0.12"/>
    </svg>
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
    // Show popup first time
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
    const p = Array.from({length:50},(_,i)=>({id:i,left:Math.random()*100,color:CONFETTI_COLORS[Math.floor(Math.random()*CONFETTI_COLORS.length)],dur:1.5+Math.random()*2,delay:Math.random()*.5}))
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
        body{min-height:100vh;font-family:'Quicksand',sans-serif;color:#4a3050;overflow-x:hidden}
        .wrap{position:relative;z-index:1;max-width:500px;margin:0 auto;padding:30px 18px 60px}
        .glass{background:rgba(255,255,255,0.62);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1.5px solid rgba(255,255,255,0.88);border-radius:24px;box-shadow:0 8px 32px rgba(160,80,140,0.12)}
        .card{padding:28px 22px;margin-top:12px;text-align:center}
        .badge{display:inline-block;background:linear-gradient(135deg,#d4508a,#9050c8);color:white;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:4px 14px;border-radius:20px;margin-bottom:10px;box-shadow:0 2px 10px rgba(160,60,120,.3)}
        h1{font-family:'Playfair Display',serif;font-size:clamp(22px,5.5vw,32px);font-weight:400;font-style:italic;line-height:1.2;margin-bottom:3px;color:#3a2040}
        h1 strong{font-weight:700;font-style:normal;background:linear-gradient(135deg,#c4408a,#8040b8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sub{font-size:12px;color:#b090b0;margin-bottom:16px;line-height:1.6}
        .tabs{display:flex;gap:0;margin-bottom:16px;background:rgba(180,120,180,.1);border-radius:13px;padding:3px}
        .tab{flex:1;padding:9px;border:none;border-radius:10px;font-family:'Quicksand',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;background:transparent;color:#b090b0}
        .tab.on{background:white;color:#3a2040;box-shadow:0 2px 8px rgba(160,80,140,.16)}
        input[type=text],input[type=password],input[type=date]{width:100%;padding:12px 15px;border-radius:12px;border:1.5px solid rgba(200,140,190,.35);background:rgba(255,255,255,.72);font-family:'Quicksand',sans-serif;font-size:14px;font-weight:600;color:#3a2040;outline:none;margin-bottom:8px;transition:all .2s;display:block}
        input:focus{border-color:#c4508a;box-shadow:0 0 0 3px rgba(196,80,138,.1);background:rgba(255,255,255,.9)}
        input::placeholder{color:#c0a0c0;font-weight:500}
        .bp{width:100%;padding:13px;border-radius:13px;background:linear-gradient(135deg,#d4508a,#9050c8);border:none;color:white;font-family:'Quicksand',sans-serif;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(160,60,130,.28);transition:transform .15s,box-shadow .15s;display:block;margin-bottom:5px}
        .bp:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(160,60,130,.38)}
        .bp:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .bs{width:100%;padding:10px;border-radius:13px;background:rgba(255,255,255,.5);border:1.5px solid rgba(200,140,190,.35);color:#b090b0;font-family:'Quicksand',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;display:block}
        .bs:hover{border-color:#c4508a;color:#3a2040;background:rgba(255,255,255,.8)}
        .err{background:rgba(230,140,150,.2);border:1px solid rgba(210,80,100,.25);border-radius:11px;padding:8px 13px;font-size:12px;font-weight:600;color:#a02840;margin-bottom:10px}
        .pc{display:flex;align-items:center;gap:14px;padding:15px 18px;margin-bottom:13px}
        .pcircle{position:relative;flex-shrink:0;width:64px;height:64px}
        .pcircle svg{transform:rotate(-90deg)}
        .pnum{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:11px;font-weight:700;color:#3a2040;text-align:center;line-height:1.1}
        .pnum small{display:block;font-size:9px;color:#c0a0c0}
        .pinfo{flex:1}
        .plbl{font-size:12px;font-weight:700;margin-bottom:6px;color:#3a2040}
        .ptrack{height:6px;background:rgba(200,140,190,.18);border-radius:10px;overflow:hidden}
        .pfill{height:100%;background:linear-gradient(90deg,#d4508a,#9050c8);border-radius:10px;transition:width .6s}
        .pmsg{font-size:11px;color:#c0a0c0;margin-top:4px}
        .ac{display:flex;gap:8px;align-items:flex-start;padding:11px 13px;margin-bottom:13px}
        .ac-fields{flex:1;display:flex;flex-direction:column;gap:5px}
        .ac-fields input{margin-bottom:0;font-size:13px;padding:10px 13px}
        .ab{width:36px;height:36px;border-radius:11px;background:linear-gradient(135deg,#d4508a,#9050c8);border:none;cursor:pointer;color:white;font-size:22px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 3px 10px rgba(160,60,130,.28);transition:transform .15s;margin-top:2px}
        .ab:hover{transform:scale(1.08)}
        .fltrs{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap}
        .fb{font-family:'Quicksand',sans-serif;font-size:11px;font-weight:700;padding:5px 11px;border-radius:10px;border:1.5px solid transparent;cursor:pointer;transition:all .2s}
        .fb.on{background:linear-gradient(135deg,#d4508a,#9050c8);color:white;box-shadow:0 2px 8px rgba(160,60,130,.25)}
        .fb:not(.on){background:rgba(255,255,255,.55);color:#c0a0c0;border-color:rgba(200,140,190,.35)}
        .fb:not(.on):hover{border-color:#c4508a;color:#3a2040}
        .slbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#c0a0c0;margin-bottom:9px;padding-left:2px}
        .list{display:flex;flex-direction:column;gap:8px}
        .item{display:flex;align-items:center;gap:10px;padding:12px 13px;border-radius:15px;transition:transform .2s;animation:fsi .3s cubic-bezier(.34,1.56,.64,1)}
        @keyframes fsi{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
        .item:hover{transform:translateY(-1px)}
        .item.done{background:rgba(255,220,235,.38)!important;border-color:rgba(220,150,180,.3)!important}
        .chkw{position:relative;flex-shrink:0;width:24px;height:24px;cursor:pointer}
        .chkw input[type=checkbox]{position:absolute;opacity:0;width:0;height:0;margin:0}
        .chkv{width:24px;height:24px;border-radius:50%;border:2px solid #d090b8;background:white;display:flex;align-items:center;justify-content:center;transition:all .25s cubic-bezier(.34,1.56,.64,1);font-size:11px}
        .chkw input:checked~.chkv{background:linear-gradient(135deg,#d4508a,#9050c8);border-color:transparent;transform:scale(1.1);box-shadow:0 2px 8px rgba(160,60,130,.35)}
        .item-main{flex:1;min-width:0}
        .itxt{font-size:13px;font-weight:600;line-height:1.4;color:#3a2040;transition:all .3s}
        .done .itxt{text-decoration:line-through;text-decoration-color:#d4508a;color:#b090b0}
        .item-meta{display:flex;align-items:center;gap:5px;margin-top:2px}
        .inum{font-size:9px;font-weight:700;color:#c0a0c0;background:rgba(200,140,190,.2);padding:1px 5px;border-radius:6px;flex-shrink:0}
        .del{width:24px;height:24px;border-radius:8px;border:none;background:transparent;color:#c0a0c0;cursor:pointer;font-size:16px;opacity:0;transition:opacity .2s;flex-shrink:0;display:flex;align-items:center;justify-content:center}
        .item:hover .del{opacity:1}
        .del:hover{background:rgba(220,100,140,.15);color:#c4408a}
        .empty{text-align:center;padding:30px 14px;color:#c0a0c0}
        .empty .em{font-size:34px;margin-bottom:8px}
        .empty p{font-size:12px;font-weight:500}
        .hname{font-size:11px;color:#b090b0;font-weight:600}
        .hslug{display:inline-block;margin-top:3px;font-size:10px;color:#b090b0;background:rgba(200,140,190,.18);padding:2px 9px;border-radius:8px;cursor:pointer;font-family:monospace}
        .hslug:hover{background:rgba(200,140,190,.35)}
        .tw{position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(80px);transition:transform .4s cubic-bezier(.34,1.56,.64,1);z-index:100}
        .tw.show{transform:translateX(-50%) translateY(0)}
        .ti{background:rgba(255,255,255,.9);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.95);border-radius:17px;padding:10px 18px;font-size:12px;font-weight:600;color:#3a2040;box-shadow:0 8px 26px rgba(160,80,130,.18);white-space:nowrap}
        .cw{position:fixed;inset:0;pointer-events:none;z-index:200;overflow:hidden}
        .cp{position:absolute;width:7px;height:7px;border-radius:2px;animation:cf linear forwards}
        @keyframes cf{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
        @media(max-width:420px){.wrap{padding:18px 12px 48px}}
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>

      <GeoBg/>

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
                {loading?'...':authMode==='login'?'Entrar na minha lista →':'Criar minha lista ✨'}
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
              <div className="hslug" onClick={()=>navigator.clipboard.writeText(slug).then(()=>showToast('Código copiado! 💖'))}>#{slug}</div>
            </div>

            <div className="glass pc">
              <div className="pcircle">
                <svg width="64" height="64" viewBox="0 0 70 70">
                  <circle style={{fill:'none',stroke:'rgba(200,140,190,.2)',strokeWidth:6}} cx="35" cy="35" r="28"/>
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
                <input type="date" value={addDeadline} onChange={e=>setAddDeadline(e.target.value)} style={{fontSize:12,color:addDeadline?'#3a2040':'#c0a0c0'}}/>
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
