'use client'
import { useState, useEffect } from 'react'

const MESSAGES = ['Arrasou! Falta pouco! 🌟','Isso sim é vida! 💖','Menos um medo, mais uma história! ✨',
  'Você tá demais! 🦋','Cada passo conta, linda! 🌸','Poderosa! 💅','Que incrível você é! 🌺','Brilha! ⭐']
const CONFETTI_COLORS = ['#f4c2c2','#dcd0f0','#d4a96a','#fde8e8','#ede8f8','#f0d9b0']

async function api(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const r = await fetch(path, opts)
  const data = await r.json()
  if (!r.ok) throw new Error(data.error || 'Erro')
  return data
}

// Butterfly SVG paths for decoration
const BUTTERFLY_PATHS = [
  { top:'8%',  left:'5%',  size:44, rot:-20, delay:0,    dur:6  },
  { top:'15%', left:'88%', size:36, rot:15,  delay:1.2,  dur:7  },
  { top:'35%', left:'3%',  size:28, rot:-10, delay:0.5,  dur:8  },
  { top:'55%', left:'92%', size:40, rot:25,  delay:2,    dur:6.5},
  { top:'72%', left:'7%',  size:32, rot:-30, delay:1.5,  dur:7.5},
  { top:'82%', left:'85%', size:38, rot:10,  delay:0.8,  dur:6  },
  { top:'25%', left:'50%', size:22, rot:5,   delay:3,    dur:9  },
  { top:'65%', left:'45%', size:26, rot:-15, delay:2.5,  dur:8  },
]

function Butterfly({ top, left, size, rot, delay, dur }) {
  return (
    <div style={{
      position:'fixed', top, left, width:size, height:size,
      opacity:0.18, transform:`rotate(${rot}deg)`,
      animation:`bfly ${dur}s ease-in-out ${delay}s infinite`,
      pointerEvents:'none', zIndex:0,
    }}>
      <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left wings */}
        <ellipse cx="30" cy="28" rx="28" ry="22" fill="#e8a0a0" opacity="0.9"/>
        <ellipse cx="22" cy="52" rx="20" ry="14" fill="#dcd0f0" opacity="0.85"/>
        {/* Right wings */}
        <ellipse cx="70" cy="28" rx="28" ry="22" fill="#e8a0a0" opacity="0.9"/>
        <ellipse cx="78" cy="52" rx="20" ry="14" fill="#dcd0f0" opacity="0.85"/>
        {/* Body */}
        <ellipse cx="50" cy="38" rx="4" ry="18" fill="#c8a0b8"/>
        {/* Antennae */}
        <line x1="50" y1="20" x2="38" y2="8" stroke="#c8a0b8" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="50" y1="20" x2="62" y2="8" stroke="#c8a0b8" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="37" cy="7" r="2" fill="#e8a0a0"/>
        <circle cx="63" cy="7" r="2" fill="#e8a0a0"/>
        {/* Wing details */}
        <ellipse cx="30" cy="26" rx="10" ry="8" fill="#f4c2c2" opacity="0.5"/>
        <ellipse cx="70" cy="26" rx="10" ry="8" fill="#f4c2c2" opacity="0.5"/>
      </svg>
    </div>
  )
}

export default function Home() {
  const [screen, setScreen] = useState('onboard')
  const [items, setItems] = useState([])
  const [slug, setSlug] = useState('')
  const [userName, setUserName] = useState('')
  const [filter, setFilter] = useState('all')
  const [newName, setNewName] = useState('')
  const [existingSlug, setExistingSlug] = useState('')
  const [addText, setAddText] = useState('')
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [onboardError, setOnboardError] = useState('')
  const [appError, setAppError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('checklist_slug')
    if (saved) loadList(saved).catch(() => localStorage.removeItem('checklist_slug'))
  }, [])

  function showToast(msg) {
    setToast(msg); setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2600)
  }
  function showOErr(msg) { setOnboardError(msg); setTimeout(() => setOnboardError(''), 4000) }
  function showAErr(msg) { setAppError(msg); setTimeout(() => setAppError(''), 4000) }

  async function loadList(s) {
    const data = await api('GET', `/api/users/${s}`)
    const loaded = (data.items || []).map(i => ({ ...i, done: i.done === true || i.done === 'true' }))
    setSlug(data.slug); setUserName(data.name); setItems(loaded)
    localStorage.setItem('checklist_slug', data.slug)
    setScreen('app')
  }

  async function handleCreate() {
    if (!newName.trim()) { showOErr('Digite seu nome 🌸'); return }
    setLoading(true)
    try { const user = await api('POST', '/api/users', { name: newName.trim() }); await loadList(user.slug) }
    catch(e) { showOErr(e.message) }
    setLoading(false)
  }

  async function handleLoad() {
    if (!existingSlug.trim()) { showOErr('Digite o código 🌸'); return }
    setLoading(true)
    try { await loadList(existingSlug.trim()) }
    catch { showOErr('Lista não encontrada. Verifique o código!') }
    setLoading(false)
  }

  async function handleAdd() {
    if (!addText.trim()) return
    try {
      const item = await api('POST', `/api/users/${slug}`, { text: addText.trim() })
      setItems(prev => [...prev, { ...item, done: false }]); setAddText('')
    } catch(e) { showAErr(e.message) }
  }

  async function handleToggle(item) {
    try {
      const updated = await api('PATCH', `/api/items/${item.id}`, { done: !item.done })
      const isDone = updated.done === true || updated.done === 'true'
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, done: isDone } : i))
      if (isDone) {
        showToast(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
        const nowDone = items.map(i => i.id === item.id ? {...i, done: true} : i)
        if (nowDone.length >= 20 && nowDone.every(i => i.done)) launchConfetti()
      }
    } catch(e) { showAErr(e.message) }
  }

  async function handleDelete(id) {
    try { await api('DELETE', `/api/items/${id}`); setItems(prev => prev.filter(i => i.id !== id)) }
    catch(e) { showAErr(e.message) }
  }

  function launchConfetti() {
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i, left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      dur: 1.5 + Math.random() * 2, delay: Math.random() * 0.5
    }))
    setConfetti(pieces); setTimeout(() => setConfetti([]), 4000)
  }

  const filtered = filter === 'done' ? items.filter(i=>i.done) : filter === 'pending' ? items.filter(i=>!i.done) : items
  const done = items.filter(i=>i.done).length, total = items.length
  const pct = total ? (done / Math.max(total,20)) * 100 : 0
  const offset = 175.93 - 175.93 * pct / 100
  let progressMsg = 'Adicione seus sonhos ✨'
  if (total>0&&done===0) progressMsg = `${total} conquista${total>1?'s':''} te esperando!`
  else if (done>0&&done<total) progressMsg = `${total-done} pela frente!`
  else if (total>0&&done===total) progressMsg = '🎉 Todas conquistadas! Lenda!'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital@0;1&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}

        body {
          min-height:100vh;
          font-family:'Quicksand',sans-serif;
          color:#5a4a5e;
          overflow-x:hidden;
          position:relative;
        }

        /* Wallpaper background */
        body::before {
          content:'';
          position:fixed;
          inset:0;
          z-index:-1;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(255,210,220,0.55) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 10%, rgba(220,208,240,0.5) 0%, transparent 55%),
            radial-gradient(ellipse at 10% 80%, rgba(240,220,250,0.45) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 85%, rgba(255,200,215,0.5) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 50%, rgba(255,230,240,0.3) 0%, transparent 70%),
            linear-gradient(135deg, #fce8f3 0%, #f0e6fb 35%, #e8eefb 70%, #fce8f3 100%);
        }

        /* Subtle dot pattern */
        body::after {
          content:'';
          position:fixed;
          inset:0;
          z-index:-1;
          background-image: radial-gradient(circle, rgba(220,160,190,0.12) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        @keyframes bfly {
          0%,100% { transform: translateY(0px) rotate(var(--r,0deg)) scale(1); }
          25%      { transform: translateY(-12px) rotate(calc(var(--r,0deg) + 8deg)) scale(1.05); }
          75%      { transform: translateY(8px) rotate(calc(var(--r,0deg) - 6deg)) scale(0.97); }
        }

        .wrap{position:relative;z-index:1;max-width:500px;margin:0 auto;padding:32px 18px 60px}

        .card{
          background:rgba(255,255,255,0.62);
          backdrop-filter:blur(22px);
          -webkit-backdrop-filter:blur(22px);
          border:1px solid rgba(255,255,255,0.88);
          border-radius:28px;
          padding:30px 24px;
          box-shadow:0 8px 40px rgba(200,140,190,0.14), 0 2px 8px rgba(200,140,190,0.08);
          margin-top:14px;
          text-align:center;
        }

        .badge{
          display:inline-block;
          background:linear-gradient(135deg,#e8a0a0,#c8a0d8);
          color:white;font-size:11px;font-weight:700;letter-spacing:2px;
          text-transform:uppercase;padding:5px 16px;border-radius:20px;
          margin-bottom:11px;box-shadow:0 2px 12px rgba(228,140,160,.35);
        }
        h1{font-family:'Playfair Display',serif;font-size:clamp(23px,6vw,33px);
          font-weight:400;font-style:italic;line-height:1.2;margin-bottom:4px;color:#5a4050}
        h1 strong{font-weight:700;font-style:normal;
          background:linear-gradient(135deg,#d4708a,#c090d0);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sub{font-size:13px;color:#b8a0bc;margin-bottom:20px;line-height:1.6}

        input[type=text]{
          width:100%;padding:13px 16px;border-radius:14px;
          border:1.5px solid rgba(210,180,220,0.5);
          background:rgba(255,255,255,0.75);
          font-family:'Quicksand',sans-serif;font-size:14px;font-weight:600;
          color:#5a4a5e;outline:none;margin-bottom:9px;
          transition:border-color .2s,box-shadow .2s;display:block;
        }
        input[type=text]:focus{border-color:#d4708a;box-shadow:0 0 0 3px rgba(212,112,138,.12)}
        input[type=text]::placeholder{color:#c8b0cc;font-weight:500}

        .bp{width:100%;padding:13px;border-radius:14px;
          background:linear-gradient(135deg,#e08090,#c090d0);
          border:none;color:white;font-family:'Quicksand',sans-serif;
          font-size:14px;font-weight:700;cursor:pointer;
          box-shadow:0 4px 18px rgba(200,100,150,.3);
          transition:transform .15s,box-shadow .15s;margin-bottom:6px;display:block}
        .bp:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(200,100,150,.4)}
        .bp:disabled{opacity:.5;cursor:not-allowed;transform:none}

        .bs{width:100%;padding:11px;border-radius:14px;
          background:rgba(255,255,255,.55);border:1.5px solid rgba(210,180,220,.55);
          color:#b0909c;font-family:'Quicksand',sans-serif;font-size:13px;
          font-weight:700;cursor:pointer;transition:all .2s;display:block}
        .bs:hover{border-color:#d4708a;color:#5a4050;background:rgba(255,255,255,.8)}

        .div{display:flex;align-items:center;gap:10px;margin:13px 0}
        .div::before,.div::after{content:'';flex:1;height:1px;background:rgba(200,170,210,.4)}
        .div span{font-size:11px;color:#c8b0cc;font-weight:600}

        .err{background:rgba(255,180,180,.35);border:1px solid rgba(220,130,140,.4);
          border-radius:12px;padding:9px 14px;font-size:13px;font-weight:600;
          color:#b04050;margin-bottom:11px}

        .pc{background:rgba(255,255,255,.6);backdrop-filter:blur(16px);
          border:1px solid rgba(255,255,255,.88);border-radius:22px;
          padding:17px 19px;margin-bottom:15px;
          box-shadow:0 4px 20px rgba(200,140,190,.1);
          display:flex;align-items:center;gap:15px}
        .pcircle{position:relative;flex-shrink:0;width:66px;height:66px}
        .pcircle svg{transform:rotate(-90deg)}
        .pnum{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
          font-size:12px;font-weight:700;color:#5a4050;text-align:center;line-height:1.1}
        .pnum small{display:block;font-size:9px;color:#c8b0cc}
        .pinfo{flex:1}
        .plbl{font-size:13px;font-weight:700;margin-bottom:6px;color:#5a4050}
        .ptrack{height:7px;background:rgba(210,180,220,.25);border-radius:10px;overflow:hidden}
        .pfill{height:100%;background:linear-gradient(90deg,#e08090,#c090d0);
          border-radius:10px;transition:width .6s}
        .pmsg{font-size:11px;color:#c0a0c0;margin-top:5px}

        .ac{background:rgba(255,255,255,.62);backdrop-filter:blur(14px);
          border:1px solid rgba(255,255,255,.88);border-radius:17px;
          padding:10px 12px;margin-bottom:15px;
          box-shadow:0 3px 14px rgba(200,140,190,.09);
          display:flex;gap:9px;align-items:center}
        .ai{flex:1;border:none;background:transparent;
          font-family:'Quicksand',sans-serif;font-size:14px;font-weight:500;
          color:#5a4a5e;outline:none;margin:0;padding:0}
        .ai::placeholder{color:#c8b0cc}
        .ab{width:35px;height:35px;border-radius:11px;
          background:linear-gradient(135deg,#e08090,#c090d0);
          border:none;cursor:pointer;color:white;font-size:22px;
          display:flex;align-items:center;justify-content:center;
          flex-shrink:0;box-shadow:0 3px 10px rgba(200,100,150,.3);
          transition:transform .15s}
        .ab:hover{transform:scale(1.08)}

        .fltrs{display:flex;gap:7px;margin-bottom:12px;flex-wrap:wrap}
        .fb{font-family:'Quicksand',sans-serif;font-size:12px;font-weight:700;
          padding:5px 12px;border-radius:11px;border:1.5px solid transparent;cursor:pointer;transition:all .2s}
        .fb.on{background:linear-gradient(135deg,#e08090,#c090d0);color:white;
          box-shadow:0 2px 10px rgba(200,100,150,.3)}
        .fb:not(.on){background:rgba(255,255,255,.55);color:#c0a0c0;
          border-color:rgba(210,180,220,.5)}
        .fb:not(.on):hover{border-color:#d4708a;color:#5a4050}

        .slbl{font-size:11px;font-weight:700;letter-spacing:2px;
          text-transform:uppercase;color:#c0a0bc;margin-bottom:10px;padding-left:3px}

        .list{display:flex;flex-direction:column;gap:9px}
        .item{background:rgba(255,255,255,.6);backdrop-filter:blur(14px);
          border:1px solid rgba(255,255,255,.88);border-radius:16px;
          padding:13px 13px;display:flex;align-items:center;gap:11px;
          box-shadow:0 2px 12px rgba(200,140,190,.07);
          transition:transform .2s;animation:fsi .35s cubic-bezier(.34,1.56,.64,1)}
        @keyframes fsi{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
        .item:hover{transform:translateY(-1px)}
        .item.done{background:rgba(255,235,242,.55);border-color:rgba(230,180,200,.45)}

        .chkw{position:relative;flex-shrink:0;width:26px;height:26px;cursor:pointer}
        .chkw input[type=checkbox]{position:absolute;opacity:0;width:0;height:0;margin:0}
        .chkv{width:26px;height:26px;border-radius:50%;border:2px solid #e8a0b0;
          background:white;display:flex;align-items:center;justify-content:center;
          transition:all .25s cubic-bezier(.34,1.56,.64,1);font-size:13px}
        .chkw input:checked~.chkv{background:linear-gradient(135deg,#e08090,#c090d0);
          border-color:transparent;transform:scale(1.1);
          box-shadow:0 2px 9px rgba(200,100,150,.4)}

        .itxt{flex:1;font-size:14px;font-weight:600;line-height:1.4;
          transition:all .3s;color:#5a4a5e}
        .done .itxt{text-decoration:line-through;text-decoration-color:#e08090;color:#c0a0b8}
        .inum{font-size:10px;font-weight:700;color:#c0a0bc;
          background:rgba(210,180,220,.3);padding:2px 6px;border-radius:7px;flex-shrink:0}
        .del{width:26px;height:26px;border-radius:9px;border:none;
          background:transparent;color:#c0a0bc;cursor:pointer;font-size:17px;
          opacity:0;transition:opacity .2s;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;line-height:1}
        .item:hover .del{opacity:1}
        .del:hover{background:rgba(230,160,180,.25);color:#d4708a}

        .empty{text-align:center;padding:34px 14px;color:#c0a0bc}
        .empty .em{font-size:36px;margin-bottom:10px}
        .empty p{font-size:13px;font-weight:500}

        .hname{font-size:12px;color:#c0a0bc;font-weight:600}
        .hslug{display:inline-block;margin-top:4px;font-size:11px;color:#c0a0bc;
          background:rgba(210,180,220,.25);padding:2px 10px;border-radius:9px;
          cursor:pointer;font-family:monospace}
        .hslug:hover{background:rgba(210,180,220,.5)}

        .tw{position:fixed;bottom:28px;left:50%;
          transform:translateX(-50%) translateY(80px);
          transition:transform .4s cubic-bezier(.34,1.56,.64,1);z-index:100}
        .tw.show{transform:translateX(-50%) translateY(0)}
        .ti{background:rgba(255,255,255,.9);backdrop-filter:blur(20px);
          border:1px solid rgba(255,255,255,.95);border-radius:18px;
          padding:11px 20px;font-size:13px;font-weight:600;color:#5a4050;
          box-shadow:0 8px 28px rgba(200,140,190,.2);white-space:nowrap}

        .cw{position:fixed;inset:0;pointer-events:none;z-index:200;overflow:hidden}
        .cp{position:absolute;width:8px;height:8px;border-radius:2px;
          animation:cf linear forwards}
        @keyframes cf{
          0%{transform:translateY(-20px) rotate(0);opacity:1}
          100%{transform:translateY(100vh) rotate(720deg);opacity:0}}

        @media(max-width:420px){.wrap{padding:20px 12px 48px}}
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital@0;1&display=swap" rel="stylesheet"/>

      {/* Butterflies wallpaper */}
      {BUTTERFLY_PATHS.map((b, i) => <Butterfly key={i} {...b} />)}

      <svg width="0" height="0" style={{position:'absolute'}}>
        <defs>
          <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'#e08090'}}/>
            <stop offset="100%" style={{stopColor:'#c090d0'}}/>
          </linearGradient>
        </defs>
      </svg>

      <div className="wrap">

        {screen === 'onboard' && (
          <>
            <div style={{textAlign:'center',marginTop:14,marginBottom:20}}>
              <div className="badge">✨ bem-vinda</div>
              <h1>Meus <strong>20</strong><br/>antes dos 20</h1>
            </div>
            <div className="card">
              <div style={{fontSize:42,marginBottom:12}}>🌸</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:21,marginBottom:7,color:'#5a4050'}}>Crie sua lista</div>
              <div className="sub">Registre 20 conquistas antes dos 20 anos.<br/>Seu progresso fica salvo para sempre!</div>
              {onboardError && <div className="err">{onboardError}</div>}
              <input type="text" value={newName} onChange={e=>setNewName(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleCreate()}
                placeholder="Seu nome (ex: Giovana)" maxLength={40}/>
              <button className="bp" onClick={handleCreate} disabled={loading}>
                {loading?'Criando...':'Criar minha lista ✨'}
              </button>
              <div className="div"><span>ou acesse sua lista existente</span></div>
              <input type="text" value={existingSlug} onChange={e=>setExistingSlug(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleLoad()}
                placeholder="Digite seu código (ex: giovana)" maxLength={50}/>
              <button className="bs" onClick={handleLoad} disabled={loading}>
                {loading?'Buscando...':'Entrar na minha lista →'}
              </button>
            </div>
          </>
        )}

        {screen === 'app' && (
          <>
            <div style={{textAlign:'center',marginBottom:20}}>
              <div className="badge">✨ minha jornada</div>
              <h1>Meus <strong>20</strong> antes dos 20</h1>
              <div className="hname">de {userName} 🌸</div>
              <div className="hslug" onClick={()=>navigator.clipboard.writeText(slug).then(()=>showToast('Código copiado! 💖'))}>
                código: {slug}
              </div>
            </div>

            <div className="pc">
              <div className="pcircle">
                <svg width="66" height="66" viewBox="0 0 70 70">
                  <circle style={{fill:'none',stroke:'rgba(210,180,220,.3)',strokeWidth:6}} cx="35" cy="35" r="28"/>
                  <circle style={{fill:'none',stroke:'url(#pg)',strokeWidth:6,strokeLinecap:'round',
                    strokeDasharray:175.93,strokeDashoffset:offset,transition:'stroke-dashoffset .6s'}}
                    cx="35" cy="35" r="28"/>
                </svg>
                <div className="pnum">{done}<small>de {total||20}</small></div>
              </div>
              <div className="pinfo">
                <div className="plbl">Progresso das conquistas</div>
                <div className="ptrack"><div className="pfill" style={{width:pct+'%'}}/></div>
                <div className="pmsg">{progressMsg}</div>
              </div>
            </div>

            <div className="ac">
              <input className="ai" type="text" value={addText} onChange={e=>setAddText(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleAdd()}
                placeholder="Adicionar nova conquista..." maxLength={80}/>
              <button className="ab" onClick={handleAdd}>+</button>
            </div>

            <div className="fltrs">
              {[['all','Todas'],['pending','A fazer'],['done','Conquistadas 🎉']].map(([f,l])=>(
                <button key={f} className={`fb${filter===f?' on':''}`} onClick={()=>setFilter(f)}>{l}</button>
              ))}
            </div>

            <div className="slbl">
              {filter==='all'?`Sua lista (${total}/20)`:filter==='done'?'Conquistadas 🎉':'A conquistar ✨'}
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
                  <div key={item.id} className={`item${item.done?' done':''}`}>
                    <label className="chkw">
                      <input type="checkbox" checked={!!item.done} onChange={()=>handleToggle(item)}/>
                      <div className="chkv">{item.done?'🦋':''}</div>
                    </label>
                    <span className="itxt">{item.text}</span>
                    <span className="inum">{String(pos).padStart(2,'0')}</span>
                    <button className="del" onClick={()=>handleDelete(item.id)}>×</button>
                  </div>
                )
              })}
            </div>

            <div style={{textAlign:'center',marginTop:22}}>
              <button className="bs" style={{width:'auto',padding:'7px 18px',fontSize:12}}
                onClick={()=>{localStorage.removeItem('checklist_slug');setScreen('onboard');setItems([]);setSlug('');setNewName('');setExistingSlug('')}}>
                ← Trocar de lista
              </button>
            </div>
          </>
        )}
      </div>

      <div className={`tw${toastVisible?' show':''}`}><div className="ti">{toast}</div></div>

      <div className="cw">
        {confetti.map(p=>(
          <div key={p.id} className="cp" style={{left:p.left+'vw',background:p.color,
            animationDuration:p.dur+'s',animationDelay:p.delay+'s'}}/>
        ))}
      </div>
    </>
  )
}
