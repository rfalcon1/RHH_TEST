import { useEffect, useMemo, useState } from 'react'
import { loadAll } from '../data/api.js'
export default function Directory(){
  const [query, setQuery] = useState('')
  const [staff, setStaff] = useState([])
  useEffect(()=>{ loadAll().then(d => setStaff(d.staff||[])) },[])
  const filtered = useMemo(()=>{
    const q = query.toLowerCase()
    return staff.filter(p => [p.name, p.role, p.assistance, p.bio].some(f=> (f||'').toLowerCase().includes(q)))
  },[query, staff])
  return (<section className="space-y-6">
    <div className="flex items-end justify-between gap-4">
      <div><h1 className="text-3xl font-extrabold" style={{color:'rgb(var(--c1))'}}>Directorio</h1><p className="text-sm text-gray-600">Busca por nombre, cargo, asistencia o biográfico.</p></div>
      <input className="input max-w-md" placeholder="Buscar..." value={query} onChange={e=>setQuery(e.target.value)} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filtered.map(p => (<div key={p.id} className="card hover:shadow-lg transition">
        <div className="flex items-center gap-3">
          <img src={p.avatar || '/avatars/default.png'} alt={p.name} className="w-12 h-12 rounded-full border"/>
          <div>
            <p className="font-semibold">{p.name}</p>
            <p className="text-sm" style={{color:'rgb(var(--c1))'}}>{p.role}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mt-2">{p.assistance}</p>
        <p className="text-sm mt-2">📞 {p.phone} — ✉️ <a href={`mailto:${p.email}`}>{p.email}</a></p>
        {p.bio && (<div className="mt-3">
          <p className="text-sm text-gray-700"><strong>Bio:</strong> {p.bio}</p>
          {Array.isArray(p.assignments)&&p.assignments.length>0 && (<ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            {p.assignments.map((a,i)=>(<li key={i}>{a}</li>))}
          </ul>)}
        </div>)}
      </div>))}
      {filtered.length===0 && <div className="italic text-gray-600">No hay resultados</div>}
    </div>
  </section>)
}