import { Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Directory from './pages/Directory.jsx'
import Documents from './pages/Documents.jsx'
import CalendarPage from './pages/Calendar.jsx'
import Admin from './pages/Admin.jsx'
export default function App(){
  return (<div className="min-h-screen">
    <Header />
    <main className="max-w-7xl mx-auto p-4">
      <Routes>
        <Route path="/" element={<Directory />} />
        <Route path="/documentos" element={<Documents />} />
        <Route path="/calendario" element={<CalendarPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </main>
    <footer className="text-center text-xs text-gray-600 py-6">© {new Date().getFullYear()} Directorio de Recursos Humanos — DEMO</footer>
  </div>)
}