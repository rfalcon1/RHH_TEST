import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
function Logo(){return(<div className="flex items-center gap-2 logo-ring">
  <svg width="36" height="36" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0%" stopColor="rgb(var(--c1))"/><stop offset="50%" stopColor="rgb(var(--c2))"/><stop offset="100%" stopColor="rgb(var(--c3))"/></linearGradient></defs>
    <circle cx="32" cy="32" r="30" fill="url(#g)"/><path d="M20 40c0-6 5-10 12-10s12 4 12 10v2H20v-2z" fill="white" opacity="0.9"/>
    <circle cx="32" cy="24" r="7" fill="white" opacity="0.95"/><text x="32" y="57" textAnchor="middle" fontSize="10" fill="white" fontWeight="700">RH</text>
  </svg><span className="text-xl font-extrabold">Recursos Humanos</span></div>)}
const themes = ['theme-vibrant','theme-ocean','theme-grape']
function ThemeSwitcher(){
  const [i,setI]=useState(0)
  useEffect(()=>{ const saved=localStorage.getItem('hr-theme')||'theme-vibrant'; document.documentElement.classList.remove(...themes); document.documentElement.classList.add(saved); setI(themes.indexOf(saved)) },[])
  const cycle=()=>{ const next=(i+1)%themes.length; document.documentElement.classList.remove(...themes); document.documentElement.classList.add(themes[next]); localStorage.setItem('hr-theme', themes[next]); setI(next) }
  return <button className="btn" onClick={cycle} title="Cambiar tema">🎨 Tema</button>
}
export default function Header(){
  const linkBase='px-3 py-2 rounded-lg text-sm font-semibold'
  const cls=({isActive})=> isActive? linkBase+' bg-white/20 text-white' : linkBase+' text-white/90 hover:bg-white/10'
  return(<header className="header-grad sticky top-0 z-10 border-b border-white/20">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3"><Logo/></Link>
      <nav className="flex gap-2 items-center">
        <NavLink end to="/" className={cls}>Directorio</NavLink>
        <NavLink to="/documentos" className={cls}>Documentos</NavLink>
        <NavLink to="/calendario" className={cls}>Calendario</NavLink>
        <NavLink to="/admin" className={cls}>Administración</NavLink>
        <ThemeSwitcher/>
      </nav>
    </div>
  </header>) }