import { useEffect, useState } from 'react'
import { loadAll, saveAll } from '../data/api.js'
export default function CalendarPage(){
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({date:'', title:'', type:''})
  useEffect(()=>{ loadAll().then(d => setEvents(d.events||[])) },[])
  const add = async () => {
    if(!form.date || !form.title) return
    const next = [...events, { id:crypto.randomUUID(), ...form }]
    setEvents(next)
    const data = await loadAll(); await saveAll({ ...data, events: next })
    setForm({date:'', title:'', type:''})
  }
  const remove = async (id) => {
    const next = events.filter(e=>e.id!==id)
    setEvents(next)
    const data = await loadAll(); await saveAll({ ...data, events: next })
  }
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div><h1 className="text-2xl font-bold text-sky-700">Calendario</h1><p className="text-sm text-gray-600">Hitos: cierres de nómina, capacitaciones, evaluaciones.</p></div>
      </div>
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="font-semibold mb-3">Añadir evento</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <div><label className="text-sm">Fecha</label><input type="date" className="border rounded-xl px-3 py-2 w-full" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} /></div>
          <div><label className="text-sm">Título</label><input className="border rounded-xl px-3 py-2 w-full" placeholder="Ej. Cierre de nómina" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} /></div>
          <div><label className="text-sm">Tipo</label><input className="border rounded-xl px-3 py-2 w-full" placeholder="Nómina / Capacitación / Evaluación" value={form.type} onChange={e=>setForm({...form, type:e.target.value})} /></div>
          <div className="flex items-end"><button className="px-4 py-2 rounded-xl bg-sky-600 text-white w-full" onClick={add}>Agregar</button></div>
        </div>
      </div>
      <div className="grid gap-3">
        {events.sort((a,b)=>a.date.localeCompare(b.date)).map(e => (
          <div key={e.id} className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
            <div><p className="font-medium">{e.title}</p><p className="text-sm text-gray-600">{e.type || 'Evento'} — {e.date}</p></div>
            <button className="px-3 py-2 rounded-xl border" onClick={()=>remove(e.id)}>Eliminar</button>
          </div>
        ))}
        {events.length===0 && <div className="italic text-gray-600">No hay eventos programados.</div>}
      </div>
    </section>
  )
}