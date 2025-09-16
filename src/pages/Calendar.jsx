import { useEffect, useState } from 'react'
import { loadAll } from '../data/api.js'
import { downloadICS } from '../utils/ics.js'
export default function CalendarPage(){
  const [events, setEvents] = useState([])
  const [q,setQ] = useState('')
  const [type,setType] = useState('')
  useEffect(()=>{ loadAll().then(d => setEvents(d.events||[])) },[])
  return (<section className="space-y-6">
    <div className="flex items-end justify-between">
      <div>
        <h1 className="text-3xl font-extrabold" style={{color:'rgb(var(--c1))'}}>Calendario</h1>
        <p className="text-sm text-gray-600">Vista de solo lectura. Altas/ediciones en <strong>Administración</strong>.</p>
      </div>
      <div className="flex gap-2 items-center">
        <input className="input" placeholder="Buscar título..." value={q} onChange={e=>setQ(e.target.value)} />
        <select className="input" value={type} onChange={e=>setType(e.target.value)}>
          <option value="">Todos</option>
          <option>Capacitación</option>
          <option>Cumplimiento</option>
          <option>Reclutamiento</option>
          <option>Nómina</option>
          <option>General</option>
        </select>
        <button className="btn" onClick={()=>downloadICS('calendar.ics', list)}>Exportar .ics</button>
      </div>
    </div>
    <div className="grid gap-3">
      {(events||[]).sort((a,b)=>a.date.localeCompare(b.date)).map(e=> (
        <div key={e.id} className="card flex items-center justify-between">
          <div>
            <p className="font-medium">{e.title}</p>
            <p className="text-sm text-gray-600">{e.type||'Evento'} — {e.date}</p>
          </div>
        </div>
      ))}
      {(!events || events.length===0) && <div className="italic text-gray-600">No hay eventos.</div>}
    </div>
  </section>)
}