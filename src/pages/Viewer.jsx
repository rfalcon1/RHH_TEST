import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { loadAll } from '../data/api.js'
export default function Viewer(){
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  useEffect(()=>{ loadAll().then(d => setDoc((d.docs||[]).find(x=>x.id===id))) },[id])
  if(!doc) return <div className="card">Cargando...</div>
  const isImg = (doc.mime||'').startsWith('image/')
  const isPdf = (doc.mime||'')==='application/pdf'
  const isHtml = (doc.mime||'')==='text/html'
  return (<section className="space-y-4">
    <div className="flex items-center justify-between">
      <div><h1 className="text-2xl font-bold" style={{color:'rgb(var(--c1))'}}>{doc.title}</h1><p className="text-sm text-gray-600">{doc.category} — {doc.updated}</p></div>
      <div className="flex gap-2">
        <a className="btn" href={doc.url} target="_blank" rel="noreferrer">Abrir original</a>
        <Link className="btn" to="/documentos">Volver</Link>
      </div>
    </div>
    <div className="card">
      {isImg && <img src={doc.url} alt={doc.title} />}
      {isPdf && <object data={doc.url} type="application/pdf" width="100%" height="720px"><p>No se pudo previsualizar el PDF. <a href={doc.url} target="_blank" rel="noreferrer">Descargar</a></p></object>}
      {isHtml && <iframe src={doc.url} title={doc.title} width="100%" height="720px" />}
      {!isImg && !isPdf && !isHtml && <div><p>Formato no previsualizable. Descarga el archivo:</p><a className="btn btn-primary mt-2" href={doc.url} download>Descargar</a></div>}
    </div>
  </section>)
}