const API = '/.netlify/functions/data'
export async function getStore(){
  const res = await fetch(API); if(!res.ok) return {}
  return res.json()
}
export async function saveStore(payload){
  const res = await fetch(API, { method:'POST', headers:{ 'Content-Type':'application/json', 'x-admin-key': (import.meta.env.VITE_ADMIN_KEY||'') }, body: JSON.stringify(payload) })
  return res.ok
}