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

function daysLeft(d) { return d ? Math.ceil((new Date(d)-new Date())/86400000) : null }

function DeadlineBadge({ deadline }) {
  if (!deadline) return null
  const d = daysLeft(deadline)
  const color = d<0?'#e05070':d<=7?'#d4906a':'#80a880'
  return <span style={{fontSize:10,fontWeight:700,color:'white',background:color,padding:'2px 7px',borderRadius:8,flexShrink:0}}>{d<0?`${Math.abs(d)}d atraso`:d===0?'Hoje!':`${d}d`}</span>
}

function WelcomePop({ onClose }) {
  const [vis, setVis] = useState(false)
  useEffect(() => { setTimeout(() => setVis(true), 80) }, [])
  function close() { setVis(false); setTimeout(onClose, 400) }
  return (
    <div onClick={close} style={{position:'fixed',inset:0,zIndex:999,display:'flex',alignItems:'center',justifyContent:'center',padding:24,
      background:'rgba(180,100,160,0.25)',backdropFilter:'blur(10px)',
      opacity:vis?1:0,transition:'opacity .35s'}}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:'linear-gradient(160deg,#fff8fc,#fef0ff)',
        border:'1.5px solid rgba(255,200,230,0.8)',borderRadius:32,
        padding:'40px 28px 32px',maxWidth:310,width:'100%',textAlign:'center',
        boxShadow:'0 24px 60px rgba(200,80,160,0.2), 0 0 0 1px rgba(255,255,255,0.8)',
        transform:vis?'scale(1) translateY(0)':'scale(0.88) translateY(24px)',
        transition:'transform .4s cubic-bezier(.34,1.56,.64,1)'}}>
        {/* Big butterfly emoji decorated */}
        <div style={{fontSize:56,marginBottom:4,lineHeight:1,filter:'drop-shadow(0 4px 8px rgba(200,80,160,0.3))'}}>🦋</div>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:'#d090c0',marginBottom:14}}>uma mensagem especial ✨</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:32,color:'#7a2858',lineHeight:1.2,marginBottom:6}}>
          Oi, <span style={{background:'linear-gradient(135deg,#d4508a,#9050c8)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',fontWeight:700}}>Juju!</span>
        </div>
        <div style={{fontSize:15,fontWeight:600,color:'#a06888',lineHeight:1.8,marginBottom:8}}>
          Pode contar comigo viu 🌸
        </div>
        <div style={{fontSize:13,color:'#c090b0',lineHeight:1.6,marginBottom:28}}>
          Cada sonho que você escrever aqui, vou guardar com muito carinho 💖
        </div>
        <button onClick={close} style={{width:'100%',padding:'14px',borderRadius:18,
          background:'linear-gradient(135deg,#e060a0,#9050c8)',border:'none',color:'white',
          fontFamily:"'Quicksand',sans-serif",fontSize:15,fontWeight:700,cursor:'pointer',
          boxShadow:'0 6px 20px rgba(180,60,150,.35)',letterSpacing:.5}}>
          Vamos lá! ✨
        </button>
      </div>
    </div>
  )
}

// Decorative items that float on background - using emoji + css animations
const FLOATS = [
  {e:'🦋',top:'4%',  left:'3%',  s:52, rot:-15, anim:6.2},
  {e:'🦋',top:'8%',  left:'78%', s:44, rot:20,  anim:7.1},
  {e:'🌸',top:'18%', left:'88%', s:38, rot:0,   anim:5.8},
  {e:'🌹',top:'2%',  left:'42%', s:36, rot:10,  anim:8.0},
  {e:'🦋',top:'45%', left:'91%', s:48, rot:-8,  anim:6.5},
  {e:'🌸',top:'40%', left:'2%',  s:34, rot:0,   anim:7.4},
  {e:'💫',top:'28%', left:'15%', s:28, rot:0,   anim:5.5},
  {e:'🌷',top:'62%', left:'5%',  s:40, rot:-12, anim:7.8},
  {e:'🦋',top:'68%', left:'85%', s:42, rot:18,  anim:6.8},
  {e:'🌸',top:'80%', left:'20%', s:36, rot:0,   anim:8.2},
  {e:'💮',top:'85%', left:'75%', s:38, rot:0,   anim:6.0},
  {e:'🌹',top:'75%', left:'48%', s:32, rot:-5,  anim:7.5},
  {e:'💫',top:'55%', left:'55%', s:24, rot:0,   anim:5.2},
  {e:'🎀',top:'92%', left:'8%',  s:34, rot:-10, anim:7.0},
  {e:'🎀',top:'5%',  left:'58%', s:30, rot:15,  anim:6.3},
  {e:'💎',top:'33%', left:'70%', s:26, rot:0,   anim:8.5},
  {e:'✨',top:'50%', left:'25%', s:22, rot:0,   anim:4.8},
  {e:'🌸',top:'92%', left:'55%', s:32, rot:5,   anim:6.7},
]

function FloatingBg() {
  return (
    <>
      {/* Light pink gradient background */}
      <div style={{position:'fixed',inset:0,zIndex:-3,
        background:'linear-gradient(135deg, #fce4f3 0%, #f8e8ff 30%, #ede8ff 60%, #fce4f3 100%)'}}/>

      {/* Soft glow blobs */}
      <div style={{position:'fixed',inset:0,zIndex:-2,overflow:'hidden',pointerEvents:'none'}}>
        {[
          {w:400,h:350,t:'-100px',l:'-80px',  c:'rgba(255,180,220,0.3)', blur:90},
          {w:350,h:300,t:'5%',    r:'-60px',  c:'rgba(200,150,255,0.25)',blur:80},
          {w:300,h:280,t:'40%',   l:'-40px',  c:'rgba(255,160,220,0.22)',blur:85},
          {w:380,h:320,b:'-80px', r:'-60px',  c:'rgba(220,160,255,0.28)',blur:90},
          {w:250,h:220,t:'55%',   l:'35%',    c:'rgba(255,190,230,0.18)',blur:70},
        ].map((b,i)=>(
          <div key={i} style={{position:'absolute',width:b.w,height:b.h,
            top:b.t,left:b.l,bottom:b.b,right:b.r,
            background:b.c,borderRadius:'50%',filter:`blur(${b.blur}px)`}}/>
        ))}
      </div>

      {/* Floating emojis */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',overflow:'hidden'}}>
        {FLOATS.map((f,i)=>(
          <div key={i} style={{
            position:'absolute',top:f.top,left:f.left,
            fontSize:f.s,lineHeight:1,
            transform:`rotate(${f.rot}deg)`,
            opacity:0.55,
            animation:`float${i%3} ${f.anim}s ease-in-out ${i*0.4}s infinite`,
            filter:'drop-shadow(0 2px 6px rgba(200,80,160,0.15))',
          }}>{f.e}</div>
        ))}
      </div>

      {/* Subtle dot grid */}
      <div style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none',
        backgroundImage:'radial-gradient(circle,rgba(210,130,190,0.12) 1.5px,transparent 1.5px)',
        backgroundSize:'28px 28px'}}/>

      <style>{`
        @keyframes float0{0%,100%{transform:translateY(0px) rotate(var(--r,0deg))}50%{transform:translateY(-14px) rotate(var(--r,0deg))}}
        @keyframes float1{0%,100%{transform:translateY(0px) rotate(var(--r,0deg))}50%{transform:translateY(-10px) rotate(var(--r,0deg))}}
        @keyframes float2{0%,100%{transform:translateY(0px) rotate(var(--r,0deg))}50%{transform:translateY(-18px) rotate(var(--r,0deg))}}
      `}</style>
    </>
  )
}

export default function Home() {
  const [showPop,setShowPop]=useState(false)
  const [screen,setScreen]=useState('onboard')
  const [authMode,setAuthMode]=useState('login')
  const [items,setItems]=useState([])
  const [slug,setSlug]=useState('')
  const [userName,setUserName]=useState('')
  const [filter,setFilter]=useState('all')
  const [name,setName]=useState('')
  const [password,setPassword]=useState('')
  const [addText,setAddText]=useState('')
  const [addDeadline,setAddDeadline]=useState('')
  const [toast,setToast]=useState('')
  const [toastVis,setToastVis]=useState(false)
  const [error,setError]=useState('')
  const [appErr,setAppErr]=useState('')
  const [loading,setLoading]=useState(false)
  const [confetti,setConfetti]=useState([])

  useEffect(()=>{
    const seen=sessionStorage.getItem('pop_seen')
    if(!seen){setShowPop(true);sessionStorage.setItem('pop_seen','1')}
    const saved=localStorage.getItem('checklist_slug')
    if(saved) loadList(saved).catch(()=>localStorage.removeItem('checklist_slug'))
  },[])

  const showToast=msg=>{setToast(msg);setToastVis(true);setTimeout(()=>setToastVis(false),2600)}
  const showErr=msg=>{setError(msg);setTimeout(()=>setError(''),4000)}
  const showAErr=msg=>{setAppErr(msg);setTimeout(()=>setAppErr(''),4000)}

  async function loadList(s){
    const data=await api('GET',`/api/users/${s}`)
    setSlug(data.slug);setUserName(data.name)
    setItems((data.items||[]).map(i=>({...i,done:i.done===true||i.done==='true'})))
    localStorage.setItem('checklist_slug',data.slug)
    setScreen('app')
  }

  async function handleAuth(){
    if(!name.trim()||!password.trim()){showErr('Preencha nome e senha 🌸');return}
    setLoading(true)
    try{const u=await api('POST','/api/auth',{action:authMode,name:name.trim(),password});await loadList(u.slug)}
    catch(e){showErr(e.message)}
    setLoading(false)
  }

  async function handleAdd(){
    if(!addText.trim()) return
    try{
      const item=await api('POST',`/api/users/${slug}`,{text:addText.trim()})
      if(addDeadline) await api('PATCH',`/api/items/${item.id}`,{deadline:addDeadline})
      setItems(p=>[...p,{...item,done:false,deadline:addDeadline||null}])
      setAddText('');setAddDeadline('')
    }catch(e){showAErr(e.message)}
  }

  async function handleToggle(item){
    try{
      const u=await api('PATCH',`/api/items/${item.id}`,{done:!item.done})
      const isDone=u.done===true||u.done==='true'
      setItems(p=>p.map(i=>i.id===item.id?{...i,done:isDone}:i))
      if(isDone){
        showToast(MESSAGES[Math.floor(Math.random()*MESSAGES.length)])
        const nx=items.map(i=>i.id===item.id?{...i,done:true}:i)
        if(nx.length>=20&&nx.every(i=>i.done)) launchConfetti()
      }
    }catch(e){showAErr(e.message)}
  }

  async function handleDelete(id){
    try{await api('DELETE',`/api/items/${id}`);setItems(p=>p.filter(i=>i.id!==id))}
    catch(e){showAErr(e.message)}
  }

  function launchConfetti(){
    const p=Array.from({length:55},(_,i)=>({id:i,left:Math.random()*100,color:CONFETTI_COLORS[~~(Math.random()*CONFETTI_COLORS.length)],dur:1.5+Math.random()*2,delay:Math.random()*.5}))
    setConfetti(p);setTimeout(()=>setConfetti([]),4000)
  }

  const filtered=filter==='done'?items.filter(i=>i.done):filter==='pending'?items.filter(i=>!i.done):items
  const done=items.filter(i=>i.done).length,total=items.length
  const pct=total?(done/Math.max(total,20))*100:0
  const offset=175.93-175.93*pct/100
  const progressMsg=total===0?'Adicione seus sonhos ✨':done===0?`${total} conquista${total>1?'s':''} te esperando!`:done<total?`${total-done} pela frente!`:'🎉 Todas conquistadas! Lenda!'

  const G='linear-gradient(135deg,#e060a0,#9050c8)'
  const glass={background:'rgba(255,255,255,0.68)',backdropFilter:'blur(28px)',WebkitBackdropFilter:'blur(28px)',border:'1.5px solid rgba(255,230,245,0.9)',borderRadius:24,boxShadow:'0 8px 32px rgba(180,80,150,0.12), inset 0 1px 0 rgba(255,255,255,0.8)'}

  return(<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
      *{margin:0;padding:0;box-sizing:border-box}
      body{min-height:100vh;font-family:'Quicksand',sans-serif;color:#4a2040;overflow-x:hidden}
      .wrap{position:relative;z-index:1;max-width:480px;margin:0 auto;padding:32px 18px 60px}
      .badge{display:inline-block;background:${G};color:white;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:4px 14px;border-radius:20px;margin-bottom:10px;box-shadow:0 3px 12px rgba(180,60,140,.3)}
      h1{font-family:'Playfair Display',serif;font-size:clamp(24px,6vw,36px);font-weight:400;font-style:italic;line-height:1.2;margin-bottom:4px;color:#3a1030}
      h1 strong{font-weight:700;font-style:normal;background:${G};-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
      .tabs{display:flex;gap:0;margin-bottom:16px;background:rgba(200,120,180,.12);border-radius:14px;padding:3px}
      .tab{flex:1;padding:9px;border:none;border-radius:11px;font-family:'Quicksand',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;background:transparent;color:#c090b8}
      .tab.on{background:white;color:#3a1030;box-shadow:0 2px 10px rgba(180,80,150,.18)}
      input[type=text],input[type=password],input[type=date]{width:100%;padding:13px 16px;border-radius:14px;border:1.5px solid rgba(220,160,200,.35);background:rgba(255,255,255,.78);font-family:'Quicksand',sans-serif;font-size:14px;font-weight:600;color:#3a1030;outline:none;margin-bottom:9px;transition:all .2s;display:block}
      input:focus{border-color:#e060a0;box-shadow:0 0 0 3px rgba(224,96,160,.12);background:rgba(255,255,255,.95)}
      input::placeholder{color:#c8a0c0;font-weight:500}
      .bp{width:100%;padding:14px;border-radius:14px;background:${G};border:none;color:white;font-family:'Quicksand',sans-serif;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 5px 18px rgba(180,60,140,.32);transition:transform .15s,box-shadow .15s;display:block;margin-bottom:6px}
      .bp:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(180,60,140,.42)}
      .bp:disabled{opacity:.5;cursor:not-allowed;transform:none}
      .bs{padding:9px 18px;border-radius:12px;background:rgba(255,255,255,.55);border:1.5px solid rgba(220,160,200,.35);color:#c090b8;font-family:'Quicksand',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}
      .bs:hover{border-color:#e060a0;color:#3a1030;background:rgba(255,255,255,.85)}
      .err{background:rgba(240,150,170,.2);border:1px solid rgba(220,80,110,.22);border-radius:12px;padding:9px 14px;font-size:12px;font-weight:600;color:#b02040;margin-bottom:10px}
      .fltrs{display:flex;gap:6px;margin-bottom:11px;flex-wrap:wrap}
      .fb{font-family:'Quicksand',sans-serif;font-size:11px;font-weight:700;padding:5px 12px;border-radius:10px;border:1.5px solid transparent;cursor:pointer;transition:all .2s}
      .fb.on{background:${G};color:white;box-shadow:0 2px 8px rgba(180,60,140,.28)}
      .fb:not(.on){background:rgba(255,255,255,.6);color:#c090b8;border-color:rgba(220,160,200,.35)}
      .fb:not(.on):hover{border-color:#e060a0;color:#3a1030}
      .slbl{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#c8a0c0;margin-bottom:9px;padding-left:2px}
      .list{display:flex;flex-direction:column;gap:9px}
      .item{display:flex;align-items:center;gap:11px;padding:13px 14px;border-radius:16px;animation:fsi .3s cubic-bezier(.34,1.56,.64,1);transition:transform .2s}
      @keyframes fsi{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}
      .item:hover{transform:translateY(-1px)}
      .item.done{background:rgba(255,210,235,.4)!important;border-color:rgba(230,160,195,.3)!important}
      .chkw{position:relative;flex-shrink:0;width:26px;height:26px;cursor:pointer}
      .chkw input[type=checkbox]{position:absolute;opacity:0;width:0;height:0;margin:0}
      .chkv{width:26px;height:26px;border-radius:50%;border:2px solid #e090c0;background:white;display:flex;align-items:center;justify-content:center;transition:all .25s cubic-bezier(.34,1.56,.64,1);font-size:12px}
      .chkw input:checked~.chkv{background:${G};border-color:transparent;transform:scale(1.1);box-shadow:0 3px 10px rgba(180,60,140,.38)}
      .itxt{flex:1;font-size:13px;font-weight:600;line-height:1.4;color:#3a1030;transition:all .3s}
      .done .itxt{text-decoration:line-through;text-decoration-color:#e060a0;color:#c090b0}
      .inum{font-size:9px;font-weight:700;color:#c8a0c0;background:rgba(220,160,200,.2);padding:2px 6px;border-radius:6px;flex-shrink:0}
      .del{width:26px;height:26px;border-radius:9px;border:none;background:transparent;color:#c8a0c0;cursor:pointer;font-size:17px;opacity:0;transition:opacity .2s;flex-shrink:0;display:flex;align-items:center;justify-content:center}
      .item:hover .del{opacity:1}
      .del:hover{background:rgba(230,100,150,.15);color:#e060a0}
      .empty{text-align:center;padding:32px 14px;color:#c8a0c0}
      .empty .em{font-size:36px;margin-bottom:8px}
      .hname{font-size:12px;color:#c090b8;font-weight:600;margin-top:3px}
      .hslug{display:inline-block;margin-top:4px;font-size:10px;color:#c090b8;background:rgba(220,160,200,.2);padding:2px 10px;border-radius:8px;cursor:pointer;font-family:monospace}
      .hslug:hover{background:rgba(220,160,200,.4)}
      .tw{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);transition:transform .4s cubic-bezier(.34,1.56,.64,1);z-index:100}
      .tw.show{transform:translateX(-50%) translateY(0)}
      .ti{background:rgba(255,250,253,.94);backdrop-filter:blur(20px);border:1px solid rgba(255,220,240,.9);border-radius:18px;padding:11px 20px;font-size:13px;font-weight:600;color:#3a1030;box-shadow:0 8px 28px rgba(180,80,150,.2);white-space:nowrap}
      .cw{position:fixed;inset:0;pointer-events:none;z-index:200;overflow:hidden}
      .cp{position:absolute;width:7px;height:7px;border-radius:2px;animation:cf linear forwards}
      @keyframes cf{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
      @media(max-width:420px){.wrap{padding:20px 13px 50px}}
    `}</style>

    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>

    <FloatingBg/>
    {showPop && <WelcomePop onClose={()=>setShowPop(false)}/>}

    <svg width="0" height="0" style={{position:'absolute'}}>
      <defs>
        <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:'#e060a0'}}/><stop offset="100%" style={{stopColor:'#9050c8'}}/>
        </linearGradient>
      </defs>
    </svg>

    <div className="wrap">
      {screen==='onboard' && (<>
        <div style={{textAlign:'center',marginTop:8,marginBottom:16}}>
          <div className="badge">✨ bem-vinda</div>
          <h1>Meus <strong>20</strong><br/>antes dos 20</h1>
        </div>
        <div style={{...glass,padding:'28px 22px',textAlign:'center'}}>
          <div style={{fontSize:40,marginBottom:10,filter:'drop-shadow(0 3px 6px rgba(200,80,160,0.25))'}}>🌸</div>
          <div style={{fontSize:12,color:'#b890b0',marginBottom:16,lineHeight:1.6}}>Entre na sua conta ou crie uma nova 🦋</div>
          {error && <div className="err">{error}</div>}
          <div className="tabs">
            <button className={`tab${authMode==='login'?' on':''}`} onClick={()=>setAuthMode('login')}>Entrar</button>
            <button className={`tab${authMode==='register'?' on':''}`} onClick={()=>setAuthMode('register')}>Criar conta</button>
          </div>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAuth()} placeholder="Seu nome" maxLength={40}/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAuth()} placeholder="Senha" maxLength={50}/>
          <button className="bp" onClick={handleAuth} disabled={loading}>
            {loading?'✨ ...':authMode==='login'?'Entrar na minha lista →':'Criar minha lista 🌸'}
          </button>
        </div>
      </>)}

      {screen==='app' && (<>
        <div style={{textAlign:'center',marginBottom:18}}>
          <div className="badge">✨ minha jornada</div>
          <h1>Meus <strong>20</strong> antes dos 20</h1>
          <div className="hname">de {userName} 🌸</div>
          <div className="hslug" onClick={()=>navigator.clipboard.writeText(slug).then(()=>showToast('Copiado! 💖'))}>#{slug}</div>
        </div>

        {/* Progress */}
        <div style={{...glass,display:'flex',alignItems:'center',gap:14,padding:'16px 20px',marginBottom:13}}>
          <div style={{position:'relative',flexShrink:0,width:66,height:66}}>
            <svg width="66" height="66" viewBox="0 0 70 70" style={{transform:'rotate(-90deg)'}}>
              <circle style={{fill:'none',stroke:'rgba(220,160,200,.2)',strokeWidth:6}} cx="35" cy="35" r="28"/>
              <circle style={{fill:'none',stroke:'url(#pg)',strokeWidth:6,strokeLinecap:'round',strokeDasharray:175.93,strokeDashoffset:offset,transition:'stroke-dashoffset .6s'}} cx="35" cy="35" r="28"/>
            </svg>
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontSize:12,fontWeight:700,color:'#3a1030',textAlign:'center',lineHeight:1.1}}>
              {done}<span style={{display:'block',fontSize:9,color:'#c8a0c0'}}>de {total||20}</span>
            </div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700,marginBottom:6,color:'#3a1030'}}>Progresso das conquistas</div>
            <div style={{height:6,background:'rgba(220,160,200,.18)',borderRadius:10,overflow:'hidden'}}>
              <div style={{height:'100%',background:'linear-gradient(90deg,#e060a0,#9050c8)',borderRadius:10,width:pct+'%',transition:'width .6s'}}/>
            </div>
            <div style={{fontSize:11,color:'#c8a0c0',marginTop:4}}>{progressMsg}</div>
          </div>
        </div>

        {/* Add */}
        <div style={{...glass,display:'flex',gap:9,alignItems:'flex-start',padding:'12px 14px',marginBottom:13}}>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
            <input type="text" value={addText} onChange={e=>setAddText(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAdd()} placeholder="Nova conquista..." maxLength={80} style={{marginBottom:0,padding:'10px 13px',fontSize:13}}/>
            <input type="date" value={addDeadline} onChange={e=>setAddDeadline(e.target.value)} style={{marginBottom:0,padding:'9px 13px',fontSize:12,color:addDeadline?'#3a1030':'#c8a0c0'}}/>
          </div>
          <button onClick={handleAdd} style={{width:38,height:38,borderRadius:12,background:'linear-gradient(135deg,#e060a0,#9050c8)',border:'none',cursor:'pointer',color:'white',fontSize:24,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:'0 3px 10px rgba(180,60,140,.3)',marginTop:2}}>+</button>
        </div>

        {/* Filters */}
        <div className="fltrs">
          {[['all','Todas'],['pending','A fazer'],['done','Conquistadas 🎉']].map(([f,l])=>(
            <button key={f} className={`fb${filter===f?' on':''}`} onClick={()=>setFilter(f)}>{l}</button>
          ))}
        </div>
        <div className="slbl">{filter==='all'?`sua lista (${total}/20)`:filter==='done'?'conquistadas':'a conquistar'}</div>
        {appErr && <div className="err">{appErr}</div>}

        <div className="list">
          {filtered.length===0?(
            <div className="empty"><div className="em">{filter==='done'?'🌸':'🦋'}</div><p>{filter==='done'?'Nenhuma ainda!':'Tudo conquistado! 🎉'}</p></div>
          ):filtered.map(item=>{
            const pos=items.indexOf(item)+1
            return(
              <div key={item.id} className={`item${item.done?' done':''}`} style={glass}>
                <label className="chkw">
                  <input type="checkbox" checked={!!item.done} onChange={()=>handleToggle(item)}/>
                  <div className="chkv">{item.done?'✓':''}</div>
                </label>
                <div style={{flex:1,minWidth:0}}>
                  <div className="itxt">{item.text}</div>
                  <div style={{display:'flex',alignItems:'center',gap:5,marginTop:2}}>
                    <span className="inum">{String(pos).padStart(2,'0')}</span>
                    <DeadlineBadge deadline={item.deadline}/>
                  </div>
                </div>
                <button className="del" onClick={()=>handleDelete(item.id)}>×</button>
              </div>
            )
          })}
        </div>

        <div style={{textAlign:'center',marginTop:22}}>
          <button className="bs" onClick={()=>{localStorage.removeItem('checklist_slug');setScreen('onboard');setItems([]);setSlug('');setName('');setPassword('')}}>← Sair da conta</button>
        </div>
      </>)}
    </div>

    <div className={`tw${toastVis?' show':''}`}><div className="ti">{toast}</div></div>
    <div className="cw">{confetti.map(p=>(<div key={p.id} className="cp" style={{left:p.left+'vw',background:p.color,animationDuration:p.dur+'s',animationDelay:p.delay+'s'}}/>))}</div>
  </>)
}
