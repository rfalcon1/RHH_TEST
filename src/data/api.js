import seed from './seed.json'
export async function loadAll(){ let data = JSON.parse(JSON.stringify(seed)); try{ const ls = JSON.parse(localStorage.getItem('hr-demo-store')||'{}'); data = { ...data, ...ls } }catch{} return data }
export async function saveAll(next){ localStorage.setItem('hr-demo-store', JSON.stringify(next)); return true }