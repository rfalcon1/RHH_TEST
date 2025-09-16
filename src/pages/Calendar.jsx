import { useEffect, useState } from 'react'
import { loadAll } from '../data/api.js'
export default function CalendarPage(){
  const [events, setEvents] = useState([])
  useEffect(()=>{ loadAll().then(d => setEvents(d.events||[])) },[])
  return (<section className="space-y-6">
    <div className="flex items-end justify-between">
      <div>
        <h1 className="text-3xl font-extrabold" style={{color:'rgb(var(--c1))'}}>Calendario</h1>
        <p className="text-sm text-gray-600">Vista de solo lectura. Altas/ediciones en <strong>Administración</strong>.</p>
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