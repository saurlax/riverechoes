import { createHmac, randomBytes } from 'crypto'
import { v4 as uuidv4 } from 'uuid'

function generateNonce(length: number): string {
  return randomBytes(length).toString('hex').slice(0, length)
}

function encodeQueryString(queryString: string): string {
  if (!queryString) return ''
  return queryString.split('&')
    .map(part => {
      const [key, value = ''] = part.split('=');
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .sort()
    .join('&')
}

export function signedHeader(
  method: string,
  uri: string,
  queryString: string,
  appId: string,
  appKey: string,
): { [key: string]: string } {
  const nonce = generateNonce(8)
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const canonicalQueryString = encodeQueryString(queryString)
  const signedHeadersString = `x-ai-gateway-app-id:${appId}\nx-ai-gateway-timestamp:${timestamp}\nx-ai-gateway-nonce:${nonce}`
  const signingString = `${method}\n${uri}\n${canonicalQueryString}\n${appId}\n${timestamp}\n${signedHeadersString}`

  const signature = createHmac('sha256', appKey).update(signingString).digest()
  const encodedSignature = Buffer.from(signature).toString('base64')

  return {
    'X-AI-GATEWAY-APP-ID': appId,
    'X-AI-GATEWAY-TIMESTAMP': timestamp,
    'X-AI-GATEWAY-NONCE': nonce,
    'X-AI-GATEWAY-SIGNED-HEADERS': 'x-ai-gateway-app-id;x-ai-gateway-timestamp;x-ai-gateway-nonce',
    'X-AI-GATEWAY-SIGNATURE': encodedSignature,
  }
}

export async function vivogpt(prompt: string, systemPrompt: string) {
  const url = "https://api-ai.vivo.com.cn/vivogpt/completions"
  const appid = process.env.VIVO_APP_ID!
  const appkey = process.env.VIVO_APP_KEY!
  const model = "vivo-BlueLM-TB"
  const requestId = uuidv4()
  const sessionId = uuidv4()
  const queryString = `requestId=${requestId}`
  const res = await fetch(`${url}?${queryString}`, {
    headers: signedHeader("POST", "/vivogpt/completions", queryString, appid, appkey),
    method: "POST",
    body: JSON.stringify({
      prompt,
      model,
      sessionId,
      systemPrompt
    })
  })

  const body = await res.json()
  return body.data?.content ?? body.msg
}

export interface POI {
  name: string;
  address: string;
  province: string;
  city: string;
  district: string;
  nid: string;
  phone: string;
  location: string;
  distance: number;
}

export async function vivopoi(keywords: string, city: string) {
  const url = "https://api-ai.vivo.com.cn/search/geo"
  const appid = process.env.VIVO_APP_ID!
  const appkey = process.env.VIVO_APP_KEY!
  const queryString = `keywords=${keywords}&city=${city}`

  const response = await fetch(`${url}?${queryString}`, {
    headers: signedHeader("GET", "/search/geo", queryString, appid, appkey),
    method: "GET"
  })
  const body = await response.json()
  return body.pois as POI[]
}