import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { loadAll } from '../data/api.js'
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs'
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.6.82/build/pdf.worker.min.mjs'
async function fetchArrayBuffer(url){
  const isExternal = /^https?:\/\//i.test(url) && !url.includes(location.host)
  const proxied = isExternal ? `/.netlify/functions/fetch?url=${encodeURIComponent(url)}` : url
  const res = await fetch(proxied)
  if(!res.ok) throw new Error('HTTP '+res.status)
  return await res.arrayBuffer()
}
export default function Viewer(){
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [scale, setScale] = useState(1.15)
  const containerRef = useRef(null)
  useEffect(()=>{ loadAll().then(d => setDoc((d.docs||[]).find(x=>x.id===id))) },[id])
  useEffect(()=>{
    let cancelled=false
    async function render(){
      if(!doc) return
      setLoading(true); setError('')
      try{
        if((doc.mime||'')!=='application/pdf'){ setLoading(false); return }
        const data = await fetchArrayBuffer(doc.url)
        if(cancelled) return
        const pdf = await pdfjsLib.getDocument({data}).promise
        const pages = pdf.numPages
        const container = containerRef.current
        container.innerHTML = ''
        for(let n=1; n<=pages; n++){
          const page = await pdf.getPage(n)
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.marginBottom = '16px'
          container.appendChild(canvas)
          await page.render({ canvasContext: ctx, viewport }).promise
          if(cancelled) return
        }
      }catch(e){
        console.error(e); setError('No se pudo renderizar el PDF.')
      }finally{
        if(!cancelled) setLoading(false)
      }
    }
    render()
    return ()=>{ cancelled=true }
  },[doc, scale])
  if(!doc) return <div className="card">Cargando...</div>
  const isPdf = (doc.mime||'')==='application/pdf'
  const isImg = (doc.mime||'').startsWith('image/')
  const isHtml = (doc.mime||'')==='text/html'
  return (<section className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src={doc.thumb || '/thumbs/pdf.png'} className="w-10 h-10 rounded-md border" alt="thumb"/>
        <div><h1 className="text-2xl font-bold" style={{color:'rgb(var(--c1))'}}>{doc.title}</h1><p className="text-sm text-gray-600">{doc.category} — {doc.updated}</p></div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <a className="btn btn-primary" href={doc.url} target="_blank" rel="noreferrer">Abrir original</a>
        <Link className="btn" to="/documentos">Volver</Link>
      </div>
    </div>
    <div className="card space-y-3">
      {isPdf && <div className="flex items-center gap-2 text-sm">
        <span>Zoom:</span>
        <button className="btn" onClick={()=>setScale(s=>Math.max(0.5, s-0.2))}>-</button>
        <button className="btn" onClick={()=>setScale(s=>Math.min(3, s+0.2))}>+</button>
        <span className="text-gray-500">({Math.round(scale*100)}%)</span>
      </div>}
      {loading && <div className="text-sm text-gray-600">Cargando visor…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {isPdf && <div ref={containerRef}></div>}
      {isImg && <img src={doc.url} alt={doc.title} />}
      {isHtml && <iframe src={doc.url} title={doc.title} width="100%" height="720px" />}
      {!isPdf && !isImg && !isHtml && <div><p>Formato no previsualizable. Descarga el archivo:</p><a className="btn btn-primary mt-2" href={doc.url} download>Descargar</a></div>}
    </div>
  </section>)
}