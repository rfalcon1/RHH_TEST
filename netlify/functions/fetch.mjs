export async function handler(event) {
  try {
    const url = event.queryStringParameters?.url
    if(!url) return { statusCode: 400, body: 'Missing url' }
    const upstream = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const status = upstream.status
    const headers = {}
    upstream.headers.forEach((v,k)=>{ if(['content-type','content-length','accept-ranges','content-range'].includes(k.toLowerCase())) headers[k]=v })
    headers['access-control-allow-origin'] = '*'
    const arrayBuffer = await upstream.arrayBuffer()
    return { statusCode: status, headers, body: Buffer.from(arrayBuffer).toString('base64'), isBase64Encoded: true }
  } catch (e) {
    return { statusCode: 500, body: 'Proxy error: '+e.message }
  }
}