type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE'

type KV = Record<string, any>

interface TauriRequestOption {
  method: HttpVerb
  url: string
  params: KV[]
  cookie: string
}

interface TauriFetchOption {
  url: string
  method: HttpVerb
  headers: KV
  body: string
}

interface TauriFetchResponse<T = any> {
  /** The request URL. */
  url: string
  /** The response status code. */
  status: number
  /** A boolean indicating whether the response was successful (status in the range 200–299) or not. */
  ok: boolean
  /** The response headers. */
  headers: Record<string, string>
  /** The response raw headers. */
  rawHeaders: Record<string, string[]>
  /** The response data. */
  data: T
}
