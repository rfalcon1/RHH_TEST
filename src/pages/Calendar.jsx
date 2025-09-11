import { useEffect, useState } from 'react'
import { loadAll, saveAll } from '../data/api.js'
export default function CalendarPage(){
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({date:'', title:'', type:''})
  useEffect(()=>{ loadAll().then(d => setEvents(d.events||[])) },[])
  const add = async () => {
    if(!form.date || !form.title) return
    const next = [...events, { id:crypto.randomUUID(), ...form }]
    setEvents(next); const data = await loadAll(); await saveAll({ ...data, events: next })
    setForm({date:'', title:'', type:''})
  }
  const remove = async (id) => {
    const next = events.filter(e=>e.id!==id)
    setEvents(next); const data = await loadAll(); await saveAll({ ...data, events: next })
  }
  return (<section className="space-y-6">
    <div className="flex items-end justify-between">
      <div><h1 className="text-3xl font-extrabold text-sky-700">Calendario</h1><p className="text-sm text-gray-600">Hitos hasta mayo del próximo año.</p></div>
    </div>
    <div className="card">
      <h2 className="font-semibold mb-3">Añadir evento</h2>
      <div className="grid md:grid-cols-4 gap-3">
        <div><label className="text-sm">Fecha</label><input type="date" className="input" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} /></div>
        <div><label className="text-sm">Título</label><input className="input" placeholder="Ej. Cierre de nómina" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} /></div>
        <div><label className="text-sm">Tipo</label><input className="input" placeholder="Nómina / Capacitación / Evaluación" value={form.type} onChange={e=>setForm({...form, type:e.target.value})} /></div>
        <div className="flex items-end"><button className="btn btn-primary w-full" onClick={add}>Agregar</button></div>
      </div>
    </div>
    <div className="grid gap-3">
      {events.sort((a,b)=>a.date.localeCompare(b.date)).map(e => (<div key={e.id} className="card flex items-center justify-between">
        <div><p className="font-medium">{e.title}</p><p className="text-sm text-gray-600">{e.type || 'Evento'} — {e.date}</p></div>
        <button className="btn" onClick={()=>remove(e.id)}>Eliminar</button>
      </div>))}
    </div>
  </section>)
}