import { useEffect, useState } from 'react'
import { loadAll } from '../data/api.js'

// Helpers
const toISO = (d)=> d.toISOString().slice(0,10)
const addDays = (d, n)=> { const x=new Date(d); x.setDate(x.getDate()+n); return x }
const startOfWeek = (d)=> { const x=new Date(d); const day=x.getDay(); const diff=day===0? -6 : 1 - day; x.setDate(x.getDate()+diff); return new Date(x.getFullYear(), x.getMonth(), x.getDate()) } // Lunes
const endOfWeek = (d)=> addDays(startOfWeek(d), 6)
const startOfMonth = (d)=> new Date(d.getFullYear(), d.getMonth(), 1)
const endOfMonth = (d)=> new Date(d.getFullYear(), d.getMonth()+1, 0)
const sameDay = (a,b)=> a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate()

function ListView({ events }){
  const ordered = [...(events||[])].sort((a,b)=> (a.date||'').localeCompare(b.date||''))
  return (<div className="grid gap-3">
    {ordered.map(e=> (
      <div key={e.id} className="card flex items-center justify-between">
        <div>
          <p className="font-medium">{e.title}</p>
          <p className="text-sm text-gray-600">{e.type||'Evento'} — {e.date}</p>
        </div>
      </div>
    ))}
    {(!events || events.length===0) && <div className="italic text-gray-600">No hay eventos.</div>}
  </div>)
}

function MonthView({ events, refDate, onPrev, onNext, onToday }){
  const sMonth = startOfMonth(refDate)
  // grid: from Monday on the week of first day, to Sunday on the week of last day
  const gridStart = startOfWeek(sMonth)
  const grid = []
  for(let i=0;i<42;i++){ grid.push(addDays(gridStart, i)) }
  const map = new Map()
  ;(events||[]).forEach(ev=>{
    if(!ev?.date) return
    const key=ev.date
    if(!map.has(key)) map.set(key, [])
    map.get(key).push(ev)
  })
  return (<div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <button className="btn" onClick={onPrev}>◀</button>
        <button className="btn" onClick={onToday}>Hoy</button>
        <button className="btn" onClick={onNext}>▶</button>
      </div>
      <div className="text-sm text-gray-700">{refDate.toLocaleString('es-PR', { month:'long', year:'numeric' })}</div>
    </div>
    <div className="grid grid-cols-7 gap-2">
      {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d=>(<div key={d} className="text-xs text-gray-600 text-center">{d}</div>))}
      {grid.map((d,i)=>{
        const iso = toISO(d)
        const inMonth = d.getMonth()===refDate.getMonth()
        const todays = sameDay(d, new Date())
        const evs = map.get(iso)||[]
        return (<div key={i} className={"border rounded-xl p-2 min-h-[80px] "+(inMonth? "bg-white":"bg-gray-50")+" "+(todays? "ring-2 ring-blue-400":"")}>
          <div className={"text-xs mb-1 "+(inMonth? "text-gray-800":"text-gray-400")}>{d.getDate()}</div>
          <div className="space-y-1">
            {evs.slice(0,3).map(e=>(<div key={e.id} className="text-[11px] truncate px-2 py-1 rounded-lg" style={{background:'rgba(14,165,233,.12)', color:'rgb(14,165,233)'}}>{e.title}</div>))}
            {evs.length>3 && <div className="text-[10px] text-gray-500">+{evs.length-3} más</div>}
          </div>
        </div>)
      })}
    </div>
  </div>)
}

function WeekView({ events, refDate, onPrev, onNext, onToday }){
  const sWeek = startOfWeek(refDate)
  const days = Array.from({length:7}, (_,i)=> addDays(sWeek,i))
  const map = new Map()
  ;(events||[]).forEach(ev=>{
    if(!ev?.date) return
    const key=ev.date
    if(!map.has(key)) map.set(key, [])
    map.get(key).push(ev)
  })
  return (<div className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <button className="btn" onClick={onPrev}>◀</button>
        <button className="btn" onClick={onToday}>Hoy</button>
        <button className="btn" onClick={onNext}>▶</button>
      </div>
      <div className="text-sm text-gray-700">
        {days[0].toLocaleDateString('es-PR',{day:'2-digit',month:'short'})} — {days[6].toLocaleDateString('es-PR',{day:'2-digit',month:'short',year:'numeric'})}
      </div>
    </div>
    <div className="grid grid-cols-7 gap-2">
      {days.map((d,i)=>{
        const iso = toISO(d)
        const todays = sameDay(d, new Date())
        const evs = map.get(iso)||[]
        return (<div key={i} className={"border rounded-xl p-2 min-h-[120px] bg-white "+(todays? "ring-2 ring-blue-400":"")}>
          <div className="text-xs text-gray-800 mb-1">{d.toLocaleDateString('es-PR',{weekday:'short'})} {d.getDate()}</div>
          <div className="space-y-1">
            {evs.length===0 && <div className="text-[11px] text-gray-400 italic">—</div>}
            {evs.map(e=>(<div key={e.id} className="text-[11px] truncate px-2 py-1 rounded-lg" style={{background:'rgba(14,165,233,.12)', color:'rgb(14,165,233)'}}>{e.title}</div>))}
          </div>
        </div>)
      })}
    </div>
  </div>)
}

export default function CalendarPage(){
  const [events, setEvents] = useState([])
  const [view, setView] = useState(()=> localStorage.getItem('hr-cal-view') || 'lista') // 'lista' | 'mes' | 'semana'
  const [refDate, setRefDate] = useState(()=> new Date())

  useEffect(()=>{ loadAll().then(d => setEvents(d.events||[])) },[])
  useEffect(()=>{ localStorage.setItem('hr-cal-view', view) }, [view])

  const prev = ()=>{
    if(view==='mes') setRefDate(d => new Date(d.getFullYear(), d.getMonth()-1, 1))
    else if(view==='semana') setRefDate(d => addDays(d, -7))
  }
  const next = ()=>{
    if(view==='mes') setRefDate(d => new Date(d.getFullYear(), d.getMonth()+1, 1))
    else if(view==='semana') setRefDate(d => addDays(d, 7))
  }
  const today = ()=> setRefDate(new Date())

  return (<section className="space-y-6">
    <div className="flex items-end justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-3xl font-extrabold" style={{color:'rgb(var(--c1))'}}>Calendario</h1>
        <p className="text-sm text-gray-600">Vista pública: solo lectura. Las ediciones se realizan en <strong>Administración</strong>.</p>
      </div>
      <div className="flex gap-2">
        <button className={"btn "+(view==='lista'?'btn-primary text-white':'')} onClick={()=>setView('lista')}>Lista</button>
        <button className={"btn "+(view==='mes'?'btn-primary text-white':'')} onClick={()=>setView('mes')}>Mes</button>
        <button className={"btn "+(view==='semana'?'btn-primary text-white':'')} onClick={()=>setView('semana')}>Semana</button>
      </div>
    </div>

    {view==='lista' && <ListView events={events}/>}
    {view==='mes' && <MonthView events={events} refDate={refDate} onPrev={prev} onNext={next} onToday={today}/>}
    {view==='semana' && <WeekView events={events} refDate={refDate} onPrev={prev} onNext={next} onToday={today}/>}
  </section>)
}
