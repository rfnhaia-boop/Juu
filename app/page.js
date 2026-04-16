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
        const allDone = items.filter(i=>i.id!==item.id).every(i=>i.done)
        if (allDone && items.length >= 20) launchConfetti()
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

  const s = {
    body:`min-height:100vh;font-family:'Quicksand',sans-serif;background:linear-gradient(135deg,#fde8f0 0%,#f0e8fd 40%,#e8f0fd 100%);background-attachment:fixed;color:#6b5c6e;overflow-x:hidden`,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital@0;1&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{min-height:100vh;font-family:'Quicksand',sans-serif;background:linear-gradient(135deg,#fde8f0 0%,#f0e8fd 40%,#e8f0fd 100%);background-attachment:fixed;color:#6b5c6e;overflow-x:hidden}
        .d1,.d2,.d3{position:fixed;border-radius:50%;opacity:.18;filter:blur(40px);pointer-events:none;z-index:0}
        .d1{width:320px;height:320px;background:#f4c2c2;top:-80px;right:-60px}
        .d2{width:260px;height:260px;background:#dcd0f0;bottom:100px;left:-80px}
        .d3{width:180px;height:180px;background:#f0d9b0;top:50%;left:60%}
        .wrap{position:relative;z-index:1;max-width:520px;margin:0 auto;padding:36px 20px 60px}
        .card{background:rgba(255,255,255,.75);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.95);border-radius:28px;padding:32px 24px;box-shadow:0 8px 40px rgba(200,160,200,.15);margin-top:16px;text-align:center}
        .badge{display:inline-block;background:linear-gradient(135deg,#e8a0a0,#dcd0f0);color:white;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:5px 16px;border-radius:20px;margin-bottom:12px;box-shadow:0 2px 12px rgba(228,160,160,.35)}
        h1{font-family:'Playfair Display',serif;font-size:clamp(24px,6vw,34px);font-weight:400;font-style:italic;line-height:1.2;margin-bottom:4px;color:#6b5c6e}
        h1 strong{font-weight:700;font-style:normal;background:linear-gradient(135deg,#e8a0a0,#d4a96a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sub{font-size:13px;color:#c8b8cc;margin-bottom:22px;line-height:1.6}
        input[type=text]{width:100%;padding:13px 16px;border-radius:14px;border:1.5px solid rgba(220,208,240,.6);background:rgba(255,255,255,.8);font-family:'Quicksand',sans-serif;font-size:14px;font-weight:600;color:#6b5c6e;outline:none;margin-bottom:10px;transition:border-color .2s;display:block}
        input[type=text]:focus{border-color:#e8a0a0}
        input[type=text]::placeholder{color:#c8b8cc;font-weight:500}
        .bp{width:100%;padding:13px;border-radius:14px;background:linear-gradient(135deg,#e8a0a0,#dcd0f0);border:none;color:white;font-family:'Quicksand',sans-serif;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 18px rgba(228,160,160,.4);transition:transform .15s;margin-bottom:6px;display:block}
        .bp:hover{transform:translateY(-1px)}
        .bp:disabled{opacity:.5;cursor:not-allowed;transform:none}
        .bs{width:100%;padding:11px;border-radius:14px;background:rgba(255,255,255,.6);border:1.5px solid rgba(220,208,240,.6);color:#a89ab0;font-family:'Quicksand',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;display:block}
        .bs:hover{border-color:#f4c2c2;color:#6b5c6e}
        .div{display:flex;align-items:center;gap:10px;margin:14px 0}
        .div::before,.div::after{content:'';flex:1;height:1px;background:rgba(220,208,240,.5)}
        .div span{font-size:11px;color:#c8b8cc;font-weight:600}
        .err{background:rgba(255,200,200,.5);border:1px solid rgba(232,160,160,.4);border-radius:12px;padding:9px 14px;font-size:13px;font-weight:600;color:#b05050;margin-bottom:12px}
        .pc{background:rgba(255,255,255,.7);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.9);border-radius:24px;padding:18px 20px;margin-bottom:16px;box-shadow:0 4px 24px rgba(200,160,200,.12);display:flex;align-items:center;gap:16px}
        .pcircle{position:relative;flex-shrink:0;width:68px;height:68px}
        .pcircle svg{transform:rotate(-90deg)}
        .pnum{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:12px;font-weight:700;color:#6b5c6e;text-align:center;line-height:1.1}
        .pnum small{display:block;font-size:9px;color:#c8b8cc}
        .pinfo{flex:1}
        .plbl{font-size:13px;font-weight:700;margin-bottom:7px;color:#6b5c6e}
        .ptrack{height:7px;background:#f0e8f4;border-radius:10px;overflow:hidden}
        .pfill{height:100%;background:linear-gradient(90deg,#e8a0a0,#dcd0f0);border-radius:10px;transition:width .6s}
        .pmsg{font-size:11px;color:#c8b8cc;margin-top:5px}
        .ac{background:rgba(255,255,255,.7);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.9);border-radius:18px;padding:11px 13px;margin-bottom:16px;box-shadow:0 3px 16px rgba(200,160,200,.1);display:flex;gap:9px;align-items:center}
        .ai{flex:1;border:none;background:transparent;font-family:'Quicksand',sans-serif;font-size:14px;font-weight:500;color:#6b5c6e;outline:none;margin:0;padding:0}
        .ai::placeholder{color:#c8b8cc}
        .ab{width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,#e8a0a0,#dcd0f0);border:none;cursor:pointer;color:white;font-size:22px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 3px 10px rgba(228,160,160,.4);transition:transform .15s}
        .ab:hover{transform:scale(1.08)}
        .fltrs{display:flex;gap:7px;margin-bottom:12px;flex-wrap:wrap}
        .fb{font-family:'Quicksand',sans-serif;font-size:12px;font-weight:700;padding:5px 13px;border-radius:11px;border:1.5px solid transparent;cursor:pointer;transition:all .2s}
        .fb.on{background:linear-gradient(135deg,#e8a0a0,#dcd0f0);color:white;box-shadow:0 2px 10px rgba(228,160,160,.35)}
        .fb:not(.on){background:rgba(255,255,255,.6);color:#c8b8cc;border-color:rgba(220,208,240,.5)}
        .fb:not(.on):hover{border-color:#f4c2c2;color:#6b5c6e}
        .slbl{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#c8b8cc;margin-bottom:10px;padding-left:3px}
        .list{display:flex;flex-direction:column;gap:9px}
        .item{background:rgba(255,255,255,.68);backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,.9);border-radius:16px;padding:13px 14px;display:flex;align-items:center;gap:12px;box-shadow:0 2px 12px rgba(200,160,200,.08);transition:transform .2s;animation:fsi .35s cubic-bezier(.34,1.56,.64,1)}
        @keyframes fsi{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}
        .item:hover{transform:translateY(-1px)}
        .item.done{background:rgba(253,232,240,.55);border-color:rgba(244,194,194,.5)}
        .chkw{position:relative;flex-shrink:0;width:26px;height:26px;cursor:pointer}
        .chkw input[type=checkbox]{position:absolute;opacity:0;width:0;height:0;margin:0}
        .chkv{width:26px;height:26px;border-radius:50%;border:2px solid #f4c2c2;background:white;display:flex;align-items:center;justify-content:center;transition:all .25s cubic-bezier(.34,1.56,.64,1);font-size:13px}
        .chkw input:checked~.chkv{background:linear-gradient(135deg,#e8a0a0,#dcd0f0);border-color:transparent;transform:scale(1.1);box-shadow:0 2px 9px rgba(228,160,160,.5)}
        .itxt{flex:1;font-size:14px;font-weight:600;line-height:1.4;transition:all .3s;color:#6b5c6e}
        .done .itxt{text-decoration:line-through;text-decoration-color:#e8a0a0;color:#c8b8cc}
        .inum{font-size:10px;font-weight:700;color:#c8b8cc;background:rgba(220,208,240,.4);padding:2px 6px;border-radius:7px;flex-shrink:0}
        .del{width:26px;height:26px;border-radius:9px;border:none;background:transparent;color:#c8b8cc;cursor:pointer;font-size:17px;opacity:0;transition:opacity .2s;flex-shrink:0;display:flex;align-items:center;justify-content:center;line-height:1}
        .item:hover .del{opacity:1}
        .del:hover{background:rgba(244,194,194,.3);color:#e8a0a0}
        .empty{text-align:center;padding:36px 16px;color:#c8b8cc}
        .empty .em{font-size:38px;margin-bottom:10px}
        .empty p{font-size:13px;font-weight:500}
        .hname{font-size:12px;color:#c8b8cc;font-weight:600}
        .hslug{display:inline-block;margin-top:4px;font-size:11px;color:#c8b8cc;background:rgba(220,208,240,.3);padding:2px 10px;border-radius:9px;cursor:pointer;font-family:monospace}
        .hslug:hover{background:rgba(220,208,240,.6)}
        .tw{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);transition:transform .4s cubic-bezier(.34,1.56,.64,1);z-index:100}
        .tw.show{transform:translateX(-50%) translateY(0)}
        .ti{background:rgba(255,255,255,.92);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.95);border-radius:18px;padding:11px 20px;font-size:13px;font-weight:600;color:#6b5c6e;box-shadow:0 8px 28px rgba(200,160,200,.25);white-space:nowrap}
        .cw{position:fixed;inset:0;pointer-events:none;z-index:200;overflow:hidden}
        .cp{position:absolute;width:8px;height:8px;border-radius:2px;animation:cf linear forwards}
        @keyframes cf{0%{transform:translateY(-20px) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
        @media(max-width:420px){.wrap{padding:22px 13px 48px}}
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Playfair+Display:ital@0;1&display=swap" rel="stylesheet"/>

      <div className="d1"/><div className="d2"/><div className="d3"/>

      <svg width="0" height="0" style={{position:'absolute'}}>
        <defs>
          <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{stopColor:'#e8a0a0'}}/>
            <stop offset="100%" style={{stopColor:'#dcd0f0'}}/>
          </linearGradient>
        </defs>
      </svg>

      <div className="wrap">

        {screen === 'onboard' && (
          <>
            <div style={{textAlign:'center',marginTop:16,marginBottom:22}}>
              <div className="badge">✨ bem-vinda</div>
              <h1>Meus <strong>20</strong><br/>antes dos 20</h1>
            </div>
            <div className="card">
              <div style={{fontSize:44,marginBottom:12}}>🌸</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:22,marginBottom:8,color:'#6b5c6e'}}>Crie sua lista</div>
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
            <div style={{textAlign:'center',marginBottom:22}}>
              <div className="badge">✨ minha jornada</div>
              <h1>Meus <strong>20</strong> antes dos 20</h1>
              <div className="hname">de {userName} 🌸</div>
              <div className="hslug" onClick={()=>navigator.clipboard.writeText(slug).then(()=>showToast('Código copiado! 💖'))}>
                código: {slug}
              </div>
            </div>

            <div className="pc">
              <div className="pcircle">
                <svg width="68" height="68" viewBox="0 0 70 70">
                  <circle style={{fill:'none',stroke:'#f0e8f4',strokeWidth:6}} cx="35" cy="35" r="28"/>
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
                  <div className="em">{filter==='done'?'🌸':'🌟'}</div>
                  <p>{filter==='done'?'Nenhuma ainda... bora lá!':'Tudo conquistado! 🎉'}</p>
                </div>
              ) : filtered.map(item=>{
                const pos = items.indexOf(item)+1
                return (
                  <div key={item.id} className={`item${item.done?' done':''}`}>
                    <label className="chkw">
                      <input type="checkbox" checked={!!item.done} onChange={()=>handleToggle(item)}/>
                      <div className="chkv">{item.done?'♡':''}</div>
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
          <div key={p.id} className="cp" style={{left:p.left+'vw',background:p.color,animationDuration:p.dur+'s',animationDelay:p.delay+'s'}}/>
        ))}
      </div>
    </>
  )
}
