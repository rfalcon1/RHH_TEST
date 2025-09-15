import { useEffect, useState, useRef } from 'react'
import { loadAll, saveAll } from '../data/api.js'
const PASS='RH2025'
const emptyStaff={id:'',name:'',role:'',assistance:'',phone:'',email:'',bio:'',assignments:[],avatar:''}
const emptyDoc={id:'',title:'',url:'',category:'',mime:'',updated:'',thumb:''}
export default function Admin(){
  const [authed,setAuthed]=useState(false)
  const [staff,setStaff]=useState([])
  const [docs,setDocs]=useState([])
  const [kpis,setKpis]=useState({})
  const [form,setForm]=useState(emptyStaff)
  const [docf,setDocf]=useState(emptyDoc)
  const [status,setStatus]=useState('')
  const fileRef = useRef(null)
  useEffect(()=>{ setAuthed(sessionStorage.getItem('hr-demo-authed')==='1'); loadAll().then(d=>{setStaff(d.staff||[]); setDocs(d.docs||[]); setKpis(d.kpis||{})}) },[])
  const login=(p)=>{ if(p===PASS){ sessionStorage.setItem('hr-demo-authed','1'); setAuthed(true)} else alert('Contraseña incorrecta') }
  const saveStaff=async()=>{ if(!form.name) return; const id=form.id||crypto.randomUUID(); const exists=staff.some(s=>s.id===id); const next=exists? staff.map(s=>s.id===id? {...form,id}:s):[...staff,{...form,id}]; setStaff(next); setStatus('Guardando personal...'); const data=await loadAll(); await saveAll({...data,staff:next}); setStatus('Personal guardado ✅'); setForm(emptyStaff) }
  const removeStaff=async(id)=>{ const next=staff.filter(s=>s.id!==id); setStaff(next); const data=await loadAll(); await saveAll({...data,staff:next}) }
  const saveDoc=async()=>{ if(!docf.title) return; const id=docf.id||crypto.randomUUID(); const exists=docs.some(d=>d.id===id); const next=exists? docs.map(d=>d.id===id? {...docf,id}:d):[...docs,{...docf,id}]; setDocs(next); setStatus('Guardando documento...'); const data=await loadAll(); await saveAll({...data,docs:next}); setStatus('Documento guardado ✅'); setDocf(emptyDoc) }
  const removeDoc=async(id)=>{ const next=docs.filter(d=>d.id!==id); setDocs(next); const data=await loadAll(); await saveAll({...data,docs:next}) }
  const saveKpis=async()=>{ const data=await loadAll(); const next={...data, kpis}; await saveAll(next); setStatus('KPIs guardados ✅') }
  const resetDemo=()=>{ localStorage.removeItem('hr-demo-store'); alert('Demo restablecido. Se recargará la página.'); location.reload() }
  const exportJSON=()=>{ const payload = JSON.stringify({staff,docs,kpis}, null, 2); const blob = new Blob([payload], {type:'application/json'}); const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='hr-demo-data.json'; a.click(); URL.revokeObjectURL(url) }
  const importJSON=(e)=>{ const f=e.target.files[0]; if(!f) return; const reader=new FileReader(); reader.onload=async(ev)=>{ try{ const {staff:st, docs:dc, kpis:kp} = JSON.parse(ev.target.result); const data = await loadAll(); const next = {...data, staff: st||staff, docs: dc||docs, kpis: kp||kpis}; await saveAll(next); setStaff(next.staff); setDocs(next.docs); setKpis(next.kpis); setStatus('Datos importados ✅') }catch{ alert('Archivo inválido') } }; reader.readAsText(f) }
  if(!authed){ return (<section className="max-w-md mx-auto card mt-10"><h1 className="text-xl font-bold mb-2">Acceso Administrativo</h1><p className="text-sm text-gray-600 mb-4">Ingresa la contraseña para editar el demo.</p><input type="password" className="input mb-3" placeholder="Contraseña" onKeyDown={e=>{ if(e.key==='Enter') login(e.currentTarget.value) }} /><button className="btn btn-primary w-full" onClick={()=> login(document.querySelector('input[type=password]').value)}>Entrar</button><p className="text-xs text-gray-500 mt-2">Pista: RH + año</p></section>) }
  return (<section className="space-y-8">
    <div className="flex items-center justify-between"><div><h1 className="text-3xl font-extrabold" style={{color:'rgb(var(--c1))'}}>Administración</h1><p className="text-sm text-gray-600">Edita personal, documentos y KPIs del demo.</p></div><span className="text-sm text-gray-600">{status}</span></div>

    <div className="card space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <button className="btn" onClick={exportJSON}>⬇️ Exportar JSON</button>
        <button className="btn" onClick={()=>fileRef.current?.click()}>⬆️ Importar JSON</button>
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={importJSON}/>
        <button className="btn" onClick={resetDemo}>🧹 Restablecer demo</button>
      </div>
      <p className="text-xs text-gray-600">Consejo: Para PDFs externos que no se embeber, pega la URL y elige el visor alternativo en la vista del documento.</p>
    </div>

    <div className="grid md:grid-cols-2 gap-6 items-start">
      <div className="card space-y-2">
        <h2 className="font-semibold">Agregar / Editar <span className="text-blue-600">personal</span></h2>
        {['name','role','assistance','phone','email','bio','avatar'].map(k=>(<div key={k}><label className="text-sm font-medium capitalize">{k}</label><input className="input" value={form[k]||''} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={k==='avatar'?'/avatars/s01.png o URL https://...':''}/></div>))}
        <div><label className="text-sm font-medium">assignments (separar por coma)</label><input className="input" value={(form.assignments||[]).join(', ')} onChange={e=>setForm({...form, assignments:e.target.value.split(',').map(x=>x.trim()).filter(Boolean)})} /></div>
        <button className="btn btn-primary" onClick={saveStaff}>Guardar personal</button>
      </div>
      <div className="grid gap-3">{staff.map(s=>(<div key={s.id} className="card flex items-start justify-between gap-3">
        <div><p className="font-medium">{s.name}</p><p className="text-sm" style={{color:'rgb(var(--c1))'}}>{s.role}</p><p className="text-sm text-gray-700">{s.assistance}</p><p className="text-sm">📞 {s.phone} — ✉️ <a href={`mailto:${s.email}`}>{s.email}</a></p>{s.bio && <p className="text-sm mt-1"><strong>Bio:</strong> {s.bio}</p>}{Array.isArray(s.assignments)&&s.assignments.length>0 && <ul className="list-disc list-inside text-sm text-gray-700 mt-1">{s.assignments.map((a,i)=><li key={i}>{a}</li>)}</ul>}</div>
        <div className="flex gap-2"><button className="btn" onClick={()=>setForm(s)}>Editar</button><button className="btn" onClick={()=>removeStaff(s.id)}>Eliminar</button></div>
      </div>))}</div>
    </div>

    <div className="grid md:grid-cols-2 gap-6 items-start">
      <div className="card space-y-2">
        <h2 className="font-semibold">Agregar / Editar <span className="text-blue-600">documento</span></h2>
        {['title','url','category','mime','updated','thumb'].map(k=>(<div key={k}><label className="text-sm font-medium capitalize">{k}</label><input className="input" value={docf[k]||''} onChange={e=>setDocf({...docf,[k]:e.target.value})} placeholder={k==='url'?'/docs/archivo.pdf o https://...':''} /></div>))}
        <button className="btn btn-primary" onClick={saveDoc}>Guardar documento</button>
      </div>
      <div className="grid gap-3">{docs.map(d=>(<div key={d.id} className="card flex items-start justify-between gap-3">
        <div><p className="font-medium">{d.title}</p><p className="text-sm text-gray-700">{d.category} — {d.updated} — {d.mime}</p><a className="text-sm" href={d.url} target="_blank" rel="noreferrer">Abrir</a></div>
        <div className="flex gap-2"><button className="btn" onClick={()=>setDocf(d)}>Editar</button><button className="btn" onClick={()=>removeDoc(d.id)}>Eliminar</button></div>
      </div>))}</div>
    </div>

    <div className="card space-y-2">
      <h2 className="font-semibold">KPIs</h2>
      <div className="grid md:grid-cols-5 gap-3">
        {['rotacion_anual','ttf_promedio','absentismo','engagement','capacitacion_horas_pp'].map(key=>(
          <div key={key}><label className="text-sm font-medium">{key}</label><input className="input" value={kpis[key]??''} onChange={e=>setKpis({...kpis,[key]:e.target.value})}/></div>
        ))}
      </div>
      <button className="btn btn-primary" onClick={saveKpis}>Guardar KPIs</button>
    </div>
  </section>)
}