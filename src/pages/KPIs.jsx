import { useEffect, useState } from 'react'
import { loadAll } from '../data/api.js'
function Card({label, value, suffix, hint}){
  return (<div className="card">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-3xl font-extrabold" style={{color:'rgb(var(--c1))'}}>{value}{suffix||''}</div>
    {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
  </div>)
}
export default function KPIs(){
  const [kpis, setKpis] = useState({})
  useEffect(()=>{ loadAll().then(d=> setKpis(d.kpis||{})) },[])
  return (<section className="space-y-6">
    <div className="flex items-end justify-between">
      <div><h1 className="text-3xl font-extrabold" style={{color:'rgb(var(--c1))'}}>KPIs de Recursos Humanos</h1><p className="text-sm text-gray-600">Tarjetas de indicadores clave (demo).</p></div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card label="Rotación anual" value={kpis.rotacion_anual} suffix="%" hint="Objetivo ≤ 10%"/>
      <Card label="Time-to-Fill (prom.)" value={kpis.ttf_promedio} suffix=" días" hint="Objetivo ≤ 30 días"/>
      <Card label="Absentismo" value={kpis.absentismo} suffix="%" hint="Objetivo ≤ 3%"/>
      <Card label="Engagement" value={kpis.engagement} suffix="%" hint="Objetivo ≥ 80%"/>
      <Card label="Horas de capacitación p/p" value={kpis.capacitacion_horas_pp} suffix=" h" hint="Objetivo ≥ 10 h"/>
    </div>
  </section>)
}