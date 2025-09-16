import { useEffect, useMemo, useState } from 'react'
import { loadAll } from '../data/api.js'
function Modal({open,onClose,person}){
  const [photoOpen, setPhotoOpen] = React.useState(false);
  if(!open||!person) return null
  return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-[92%] p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <img src={person.avatar||'/avatars/default.png'} className="w-20 h-20 rounded-full border object-cover cursor-zoom-in" onClick={()=>setPhotoOpen(true)} alt=""/>
          <div>
            <h3 className="text-xl font-bold" style={{color:'rgb(var(--c1))'}}>{person.name}</h3>
            <p className="text-sm text-gray-700">{person.role}</p>
            <p className="text-sm">📞 {person.phone} — ✉️ <a href={`mailto:${person.email}`}>{person.email}</a></p>
          </div>
        </div>
        <button className="btn" onClick={onClose}>✖</button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <div className="card">
            <h4 className="font-semibold mb-1">Resumen</h4>
            <p className="text-sm text-gray-700">{person.bio || '—'}</p>
            {Array.isArray(person.assignments)&&person.assignments.length>0 && <div className="mt-2">
              <h5 className="font-semibold text-sm">Asignaciones actuales</h5>
              <ul className="list-disc list-inside text-sm text-gray-700">{person.assignments.map((a,i)=><li key={i}>{a}</li>)}</ul>
            </div>}
          </div>
        </div>
        <div className="space-y-3">
          <div className="card">
            <h4 className="font-semibold mb-1">Asistencia que brinda</h4>
            <p className="text-sm text-gray-700">{person.assistance}</p>
          </div>
          {Array.isArray(person.history)&&person.history.length>0 && <div className="card">
            <h4 className="font-semibold mb-1">Experiencia previa</h4>
            <ul className="list-disc list-inside text-sm text-gray-700">{person.history.map((h,i)=><li key={i}>{h}</li>)}</ul>
          </div>}
        </div>
      </div>
    {photoOpen && (<div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center" onClick={()=>setPhotoOpen(false)}>
      <img src={person.avatar||'/avatars/default.png'} alt="" className="max-w-[90vw] max-h-[85vh] rounded-2xl shadow-2xl"/>
    </div>)}
    </div>
  </div>)}
export default function Directory(){
  const [query, setQuery] = useState('')
  const [staff, setStaff] = useState([])
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(null)
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
      {filtered.map(p => (<div key={p.id} className="card hover:shadow-lg transition cursor-pointer" onClick={()=>{ setCurrent(p); setOpen(true) }}>
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
    <Modal open={open} onClose={()=>setOpen(false)} person={current}/>
  </section>)
}
