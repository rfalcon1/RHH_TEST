import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadAll } from '../data/api.js'
const mimeToThumb = (mime)=>{
  if(!mime) return '/thumbs/pdf.png';
  if(mime.includes('image/')) return '/thumbs/img.png';
  if(mime.includes('msword')||mime.includes('wordprocessingml')) return '/thumbs/doc.png';
  if(mime.includes('excel')||mime.includes('spreadsheetml')) return '/thumbs/xls.png';
  if(mime.includes('powerpoint')||mime.includes('presentationml')) return '/thumbs/ppt.png';
  if(mime.includes('pdf')) return '/thumbs/pdf.png';
  return '/thumbs/pdf.png';
}
export default function Documents(){
  const [query, setQuery] = useState('')
  const [docs, setDocs] = useState([])
  useEffect(()=>{ loadAll().then(d => setDocs(d.docs||[])) },[])
  const filtered = useMemo(()=>{
    const q = query.toLowerCase()
    return docs.filter(d => [d.title, d.category, d.mime].some(f=> (f||'').toLowerCase().includes(q)))
  },[query, docs])
  const categories = Array.from(new Set(filtered.map(d=>d.category)))
  return (<section className="space-y-6">
    <div className="flex items-end justify-between gap-4">
      <div><h1 className="text-3xl font-extrabold" style={{color:'rgb(var(--c1))'}}>Documentos</h1><p className="text-sm text-gray-600">PDFs integrados con PDF.js (legacy) y fetch con fallback a proxy.</p></div>
      <input className="input max-w-md" placeholder="Buscar por título, categoría o tipo..." value={query} onChange={e=>setQuery(e.target.value)} />
    </div>
    {categories.map(cat => (<div key={cat} className="space-y-2">
      <h2 className="text-lg font-semibold">{cat}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.filter(d=>d.category===cat).map(doc => (
          <Link key={doc.id} to={`/doc/${doc.id}`} className="card hover:shadow-md flex gap-3">
            <img src={doc.thumb || mimeToThumb(doc.mime)} alt="" className="w-12 h-12 rounded-md border"/>
            <div className="flex-1">
              <p className="font-medium">{doc.title}</p>
              <p className="text-xs text-gray-500">Actualizado: {doc.updated}</p>
            </div>
            <span className="badge self-start">{(doc.mime||'other').split('/').pop()}</span>
          </Link>
        ))}
      </div>
    </div>))}
    {filtered.length===0 && <div className="italic text-gray-600">No hay documentos.</div>}
  </section>)
}