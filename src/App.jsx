import { Routes, Route, Link, NavLink } from 'react-router-dom'
import Directory from './pages/Directory.jsx'
import Documents from './pages/Documents.jsx'
import CalendarPage from './pages/Calendar.jsx'
import Admin from './pages/Admin.jsx'
export default function App(){
  const linkBase = 'px-3 py-2 rounded-lg text-sm font-medium'
  const cls = ({isActive}) => isActive? linkBase+' bg-sky-100 text-sky-800' : linkBase+' text-gray-700 hover:bg-gray-100'
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-sky-700">Recursos Humanos</Link>
          <nav className="flex gap-2">
            <NavLink end to="/" className={cls}>Directorio</NavLink>
            <NavLink to="/documentos" className={cls}>Documentos</NavLink>
            <NavLink to="/calendario" className={cls}>Calendario</NavLink>
            <NavLink to="/admin" className={cls}>Administración</NavLink>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Directory />} />
          <Route path="/documentos" element={<Documents />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <footer className="text-center text-xs text-gray-500 py-6">© {new Date().getFullYear()} Directorio de Recursos Humanos — DEMO</footer>
    </div>
  )
}