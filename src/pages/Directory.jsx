import { useEffect, useMemo, useState } from 'react'
import { loadAll } from '../data/api.js'
export default function Directory(){
  const [query, setQuery] = useState('')
  const [staff, setStaff] = useState([])
  useEffect(()=>{ loadAll().then(d => setStaff(d.staff||[])) },[])
  const filtered = useMemo(()=>{
    const q = query.toLowerCase()
    return staff.filter(p => [p.name, p.role, p.assistance].some(f=> (f||'').toLowerCase().includes(q)))
  },[query, staff])
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-sky-700">Directorio</h1><p className="text-sm text-gray-600">Busca por nombre, cargo o asistencia.</p></div>
        <input className="border rounded-xl px-3 py-2" placeholder="Buscar..." value={query} onChange={e=>setQuery(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow p-4">
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm text-sky-700">{p.role}</p>
            <p className="text-sm text-gray-700 mt-2">{p.assistance}</p>
            <p className="text-sm mt-2">📞 {p.phone} — ✉️ {p.email}</p>
          </div>
        ))}
        {filtered.length===0 && <div className="italic text-gray-600">No hay resultados</div>}
      </div>
    </section>
  )
}