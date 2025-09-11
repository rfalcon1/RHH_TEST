import { useEffect, useState } from 'react'
import { getStore, saveStore } from '../data/api.js'

const blank = { id:'', name:'', role:'', assistance:'', phone:'', email:'' }

export default function Admin(){
  const [staff, setStaff] = useState([])
  const [form, setForm] = useState(blank)
  const [status, setStatus] = useState('')

  useEffect(()=>{ getStore().then(d => setStaff(d?.staff || [])) },[])

  const save = async () => {
    if(!form.name) return
    const id = form.id || crypto.randomUUID()
    const exists = staff.some(s=>s.id===id)
    const next = exists? staff.map(s=>s.id===id? {...form, id}: s) : [...staff, {...form, id}]
    setStaff(next)
    setStatus('Guardando...')
    await saveStore({ staff: next })
    setStatus('Guardado ✅'); setTimeout(()=>setStatus(''), 2000)
    setForm(blank)
  }
  const remove = async (id) => {
    const next = staff.filter(s=>s.id!==id)
    setStaff(next)
    await saveStore({ staff: next })
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-sky-700">Administración</h1><p className="text-sm text-gray-600">Persistencia en GitHub via Netlify Functions.</p></div>
        <span className="text-sm text-gray-600">{status}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-4 space-y-2">
          <h2 className="font-semibold">Agregar / Editar</h2>
          {['name','role','assistance','phone','email'].map(k => (
            <div key={k}><label className="text-sm font-medium capitalize">{k}</label><input className="border rounded-xl px-3 py-2 w-full" value={form[k]} onChange={e=>setForm({...form, [k]: e.target.value})} /></div>
          ))}
          <button className="px-4 py-2 rounded-xl bg-sky-600 text-white" onClick={save}>Guardar</button>
        </div>
        <div className="grid gap-3">
          {staff.map(s => (
            <div key={s.id} className="bg-white rounded-2xl shadow p-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-sky-700">{s.role}</p>
                <p className="text-sm text-gray-700">{s.assistance}</p>
                <p className="text-sm">📞 {s.phone} — ✉️ {s.email}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-xl border" onClick={()=>setForm(s)}>Editar</button>
                <button className="px-3 py-2 rounded-xl border" onClick={()=>remove(s.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}