import { useEffect, useState } from 'react'
import { loadAll, saveAll } from '../data/api.js'
const PASS='RH2025'
const blank={id:'',name:'',role:'',assistance:'',phone:'',email:''}
export default function Admin(){
  const [authed,setAuthed]=useState(false)
  const [staff,setStaff]=useState([])
  const [docs,setDocs]=useState([])
  const [form,setForm]=useState(blank)
  const [docf,setDocf]=useState({id:'',title:'',url:'',category:'',updated:''})
  const [status,setStatus]=useState('')
  useEffect(()=>{ setAuthed(sessionStorage.getItem('hr-demo-authed')==='1'); loadAll().then(d=>{setStaff(d.staff||[]); setDocs(d.docs||[])}) },[])
  const login=(p)=>{ if(p===PASS){ sessionStorage.setItem('hr-demo-authed','1'); setAuthed(true) } else alert('Contraseña incorrecta') }
  const saveStaff=async()=>{ if(!form.name) return; const id=form.id||crypto.randomUUID(); const exists=staff.some(s=>s.id===id); const next=exists? staff.map(s=>s.id===id? {...form,id}:s):[...staff,{...form,id}]; setStaff(next); setStatus('Guardando...'); const data=await loadAll(); await saveAll({...data,staff:next}); setStatus('Guardado ✅'); setTimeout(()=>setStatus(''),2000); setForm(blank) }
  const removeStaff=async(id)=>{ const next=staff.filter(s=>s.id!==id); setStaff(next); const data=await loadAll(); await saveAll({...data,staff:next}) }
  const saveDoc=async()=>{ if(!docf.title) return; const id=docf.id||crypto.randomUUID(); const exists=docs.some(d=>d.id===id); const next=exists? docs.map(d=>d.id===id? {...docf,id}:d):[...docs,{...docf,id}]; setDocs(next); setStatus('Guardando...'); const data=await loadAll(); await saveAll({...data,docs:next}); setStatus('Guardado ✅'); setTimeout(()=>setStatus(''),2000); setDocf({id:'',title:'',url:'',category:'',updated:''}) }
  const removeDoc=async(id)=>{ const next=docs.filter(d=>d.id!==id); setDocs(next); const data=await loadAll(); await saveAll({...data,docs:next}) }
  if(!authed){ return (<section className="max-w-md mx-auto card mt-10"><h1 className="text-xl font-bold mb-2">Acceso Administrativo</h1><p className="text-sm text-gray-600 mb-4">Ingresa la contraseña para editar el demo.</p><input type="password" className="input mb-3" placeholder="Contraseña" onKeyDown={e=>{ if(e.key==='Enter') login(e.currentTarget.value) }} /><button className="btn btn-primary w-full" onClick={()=> login(document.querySelector('input[type=password]').value)}>Entrar</button><p className="text-xs text-gray-500 mt-2">Pista: RH + año</p></section>) }
  return (<section className="space-y-8">
    <div className="flex items-center justify-between"><div><h1 className="text-3xl font-extrabold text-sky-700">Administración</h1><p className="text-sm text-gray-600">Protegido con contraseña de demo.</p></div><span className="text-sm text-gray-600">{status}</span></div>
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <div className="card space-y-2"><h2 className="font-semibold">Agregar / Editar personal</h2>
        {['name','role','assistance','phone','email'].map(k=>(<div key={k}><label className="text-sm font-medium capitalize">{k}</label><input className="input" value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} /></div>))}
        <button className="btn btn-primary" onClick={saveStaff}>Guardar</button>
      </div>
      <div className="grid gap-3">{staff.map(s=>(<div key={s.id} className="card flex items-start justify-between gap-3"><div><p className="font-medium">{s.name}</p><p className="text-sm text-sky-700">{s.role}</p><p className="text-sm text-gray-700">{s.assistance}</p><p className="text-sm">📞 {s.phone} — ✉️ {s.email}</p></div><div className="flex gap-2"><button className="btn" onClick={()=>setForm(s)}>Editar</button><button className="btn" onClick={()=>removeStaff(s.id)}>Eliminar</button></div></div>))}</div>
    </div>
    <div className="grid md:grid-cols-2 gap-6 items-start">
      <div className="card space-y-2"><h2 className="font-semibold">Agregar / Editar documento</h2>
        {['title','url','category','updated'].map(k=>(<div key={k}><label className="text-sm font-medium capitalize">{k}</label><input className="input" value={docf[k]} onChange={e=>setDocf({...docf,[k]:e.target.value})} placeholder={k==='url'?'/docs/archivo.html':'...'} /></div>))}
        <button className="btn btn-primary" onClick={saveDoc}>Guardar</button>
      </div>
      <div className="grid gap-3">{docs.map(d=>(<div key={d.id} className="card flex items-start justify-between gap-3"><div><p className="font-medium">{d.title}</p><p className="text-sm text-gray-700">{d.category} — {d.updated}</p><a className="text-sm" href={d.url} target="_blank">Abrir</a></div><div className="flex gap-2"><button className="btn" onClick={()=>setDocf(d)}>Editar</button><button className="btn" onClick={()=>removeDoc(d.id)}>Eliminar</button></div></div>))}</div>
    </div>
  </section>)
}