import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { loadAll } from '../data/api.js'
export default function Viewer(){
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [embedFail, setEmbedFail] = useState(false)
  useEffect(()=>{ loadAll().then(d => setDoc((d.docs||[]).find(x=>x.id===id))) },[id])
  if(!doc) return <div className="card">Cargando...</div>
  const isImg = (doc.mime||'').startsWith('image/')
  const isPdf = (doc.mime||'')==='application/pdf'
  const isHtml = (doc.mime||'')==='text/html'
  return (<section className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={doc.thumb || '/thumbs/pdf.png'} className="w-10 h-10 rounded-md border" alt="thumb"/>
        <div><h1 className="text-2xl font-bold" style={{color:'rgb(var(--c1))'}}>{doc.title}</h1><p className="text-sm text-gray-600">{doc.category} — {doc.updated}</p></div>
      </div>
      <div className="flex gap-2">
        <a className="btn btn-primary" href={doc.url} target="_blank" rel="noreferrer">Abrir original</a>
        <Link className="btn" to="/documentos">Volver</Link>
      </div>
    </div>
    <div className="card">
      {isPdf && <div className="text-xs text-gray-600 mb-2">Si el PDF no se muestra aquí, ha sido bloqueado por el sitio de origen. Usa <strong>Abrir original</strong>.</div>}
      {isImg && <img src={doc.url} alt={doc.title} />}
      {isPdf && !embedFail && <object data={doc.url} type="application/pdf" width="100%" height="720px" onError={()=>setEmbedFail(true)}><p>No se pudo previsualizar el PDF. <a href={doc.url} target="_blank" rel="noreferrer">Abrir original</a></p></object>}
      {isPdf && embedFail && <div className="p-4"><p>No se pudo incrustar el PDF por políticas del sitio. </p><a className="btn btn-primary mt-2" href={doc.url} target="_blank" rel="noreferrer">Abrir original</a></div>}
      {isHtml && <iframe src={doc.url} title={doc.title} width="100%" height="720px" />}
      {!isImg && !isPdf && !isHtml && <div><p>Formato no previsualizable. Descarga el archivo:</p><a className="btn btn-primary mt-2" href={doc.url} download>Descargar</a></div>}
    </div>
  </section>)
}