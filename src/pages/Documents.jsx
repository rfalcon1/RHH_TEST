import { useEffect, useMemo, useState } from 'react'
import { loadAll } from '../data/api.js'
export default function Documents(){
  const [query, setQuery] = useState('')
  const [docs, setDocs] = useState([])
  useEffect(()=>{ loadAll().then(d => setDocs(d.docs||[])) },[])
  const filtered = useMemo(()=>{
    const q = query.toLowerCase()
    return docs.filter(d => [d.title, d.category].some(f=> (f||'').toLowerCase().includes(q)))
  },[query, docs])
  const categories = Array.from(new Set(filtered.map(d=>d.category)))
  return (<section className="space-y-6">
    <div className="flex items-end justify-between gap-4">
      <div><h1 className="text-3xl font-extrabold text-sky-700">Documentos</h1><p className="text-sm text-gray-600">Repositorio para directores, gerentes y supervisores.</p></div>
      <input className="input max-w-md" placeholder="Buscar por título o categoría..." value={query} onChange={e=>setQuery(e.target.value)} />
    </div>
    {categories.map(cat => (<div key={cat} className="space-y-2">
      <h2 className="text-lg font-semibold">{cat}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.filter(d=>d.category===cat).map(doc => (<a key={doc.id} href={doc.url} className="card hover:shadow-md">
          <div className="flex items-center justify-between"><div>
            <p className="font-medium">{doc.title}</p>
            <p className="text-xs text-gray-500">Actualizado: {doc.updated}</p>
          </div><span className="badge">{doc.category}</span></div>
        </a>))}
      </div>
    </div>))}
    {filtered.length===0 && <div className="italic text-gray-600">No hay documentos.</div>}
  </section>)
}