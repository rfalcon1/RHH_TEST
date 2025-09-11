export async function handler(event){
  const { GITHUB_TOKEN, GITHUB_OWNER='Fudicia', GITHUB_REPO='hr-directory', GITHUB_BRANCH='main', DATA_PATH='data/hr-store.json', ADMIN_KEY } = process.env
  const method = event.httpMethod

  if(!GITHUB_TOKEN){
    if(method==='GET') return json(200, { staff:[], docs:[], recs:[], events:[], note:'Missing GITHUB_TOKEN — configure env in Netlify.' })
    if(method==='POST') return json(500,{error:'Missing GITHUB_TOKEN'})
  }

  if(method==='POST'){
    if(ADMIN_KEY && event.headers['x-admin-key'] !== ADMIN_KEY) return json(401,{error:'Unauthorized'})
  }

  try{
    if(method==='GET'){
      const file = await ghGet({owner:GITHUB_OWNER, repo:GITHUB_REPO, path:DATA_PATH, ref:GITHUB_BRANCH, token:GITHUB_TOKEN})
      if(!file?.content){
        const initial = { staff:[], docs:[], recs:[], events:[] }
        await ghPut({owner:GITHUB_OWNER, repo:GITHUB_REPO, path:DATA_PATH, branch:GITHUB_BRANCH, token:GITHUB_TOKEN, content:initial, message:'init hr-store.json'})
        return json(200, initial)
      }
      return json(200, JSON.parse(Buffer.from(file.content,'base64').toString('utf8')))
    }
    if(method==='POST'){
      const body = JSON.parse(event.body||'{}')
      const current = await ghGet({owner:GITHUB_OWNER, repo:GITHUB_REPO, path:DATA_PATH, ref:GITHUB_BRANCH, token:GITHUB_TOKEN})
      const sha = current?.sha
      await ghPut({owner:GITHUB_OWNER, repo:GITHUB_REPO, path:DATA_PATH, branch:GITHUB_BRANCH, token:GITHUB_TOKEN, content:body, message:'update HR store via Admin', sha})
      return json(200,{ok:true})
    }
    return json(405,{error:'Method not allowed'})
  }catch(e){
    return json(500,{error:String(e)})
  }
}

function json(statusCode, body){ return { statusCode, headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) } }

async function ghGet({owner, repo, path, ref, token}){
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(ref)}`
  const res = await fetch(url, { headers:{ 'Authorization':`Bearer ${token}`, 'Accept':'application/vnd.github+json' } })
  if(res.status===404) return null
  if(!res.ok) throw new Error('GitHub GET failed: '+res.status)
  return res.json()
}
async function ghPut({owner, repo, path, branch, token, content, message, sha}){
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`
  const encoded = Buffer.from(JSON.stringify(content,null,2)).toString('base64')
  const res = await fetch(url, { method:'PUT', headers:{ 'Authorization':`Bearer ${token}`, 'Accept':'application/vnd.github+json', 'Content-Type':'application/json' }, body: JSON.stringify({ message, content: encoded, branch, sha }) })
  if(!res.ok) throw new Error('GitHub PUT failed: '+res.status+' '+await res.text())
  return res.json()
}