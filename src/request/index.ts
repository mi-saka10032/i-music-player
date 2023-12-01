import { Body, type FetchOptions, fetch } from '@tauri-apps/api/http'
import { invoke } from '@tauri-apps/api/tauri'
import { stringify } from 'qs'
import Axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type CustomParamsSerializer,
  type AxiosError
} from 'axios'
import { getCookie, isTauriEnv } from '@/utils'

// H5依赖接口
const webApiBaseUrl = 'http://47.97.34.209:3000'

class TauriClient {
  // 相关配置请参考：http://www.axios-js.com/zh-cn/docs/#axios-request-config-1
  private static readonly defaultConfig: AxiosRequestConfig = {
    baseURL: webApiBaseUrl,
    withCredentials: true,
    // 请求超时时间
    timeout: 10000,
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
    paramsSerializer: {
      serialize: stringify as unknown as CustomParamsSerializer
    }
  }

  private static readonly axiosInstance: AxiosInstance = Axios.create(TauriClient.defaultConfig)

  constructor () {
    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()
  }

  private httpInterceptorsRequest (): void {
    TauriClient.axiosInstance.interceptors.request.use(
      async (config: AxiosRequestConfig): Promise<any> => config,
      async error => await Promise.reject(error)
    )
  }

  private httpInterceptorsResponse (): void {
    TauriClient.axiosInstance.interceptors.response.use(
      async (response: AxiosResponse): Promise<AxiosResponse> => {
        let error_msg = ''
        if (response.status !== 200) {
          error_msg = '服务器响应码不正确，请检查服务器配置'
          console.log(error_msg)
          return await Promise.reject(error_msg)
        } else if (response.data == null) {
          error_msg = '服务器响应数据为空，请检查服务器配置'
          console.log(error_msg)
          return await Promise.reject(error_msg)
        }
        // 正常返回Netease数据
        return response.data
      },
      (error: AxiosError) => {
        console.log(error)
      }
    )
  }

  // tauri { key: value } -> [[key, value]]
  private static tauriSerializeParams (params: KV): KV[] {
    return Object.keys(params).map(key => [key, String(params[key])])
  }

  // tauri [[key, value]] -> { key: value }
  private static tauriDeserializeParams (params: Array<[string, string]>): KV {
    const data: KV = {}
    params.forEach(([key, value]) => {
      data[key] = value
    })
    return data
  }

  // tauri 组装fetch参数
  public async tauriGetFetchOption (method: HttpVerb, url: string, params: KV): Promise<{
    link: string
    options: FetchOptions
  }> {
    const options: TauriRequestOption = {
      method,
      url,
      params: TauriClient.tauriSerializeParams(params),
      cookie: getCookie()
    }
    // tauri IPC通信 获取fetch参数
    const fetchOptions: TauriFetchOption = await invoke('get_params', { options })
    return {
      link: fetchOptions.url,
      options: {
        method: fetchOptions.method,
        headers: TauriClient.tauriDeserializeParams(fetchOptions.headers as Array<[string, string]>),
        body: Body.text(fetchOptions.body as unknown as string)
      }
    }
  }

  // tauri 调用fetch请求
  public async tauriRequest<T>(method: HttpVerb, url: string, params: KV): Promise<T> {
    const { link, options } = await this.tauriGetFetchOption(method, url, params)
    // tauri 调用tauri-服务端fetch方法
    const result: TauriFetchResponse<T> = await fetch<T>(link, options)
    return result.data
  }

  // 根据 tauri 环境决定调用  axios请求或 tauri 底层请求
  public async request<T>(method: HttpVerb, url: string, axiosConfig?: AxiosRequestConfig): Promise<T> {
    // TAURI
    if (isTauriEnv) {
      const params: KV = axiosConfig != null ? { ...axiosConfig.params, ...axiosConfig.data } : {}
      let tauriResult: any = {}
      try {
        const result: CommonRes = await this.tauriRequest<CommonRes>(method, url, params)
        if (result.code !== 200) {
          throw new Error(`${url}: NeteaseResponseError`)
        }
        tauriResult = result
      } catch (error) {
        console.log('TauriNetworkError', error)
      }
      return tauriResult
    }
    const config: AxiosRequestConfig = {
      method,
      url,
      ...axiosConfig
    }
    return await TauriClient.axiosInstance.request(config)
  }

  /** 单独抽离的post工具函数 */
  public async post<P>(url: string, data: KV = {}, config?: AxiosRequestConfig): Promise<P> {
    return await this.request<P>('POST', url, {
      data,
      ...config
    })
  }

  /** 单独抽离的get工具函数 */
  public async get<P>(url: string, params: KV = {}, config?: AxiosRequestConfig): Promise<P> {
    return await this.request<P>('GET', url, {
      params,
      ...config
    })
  }
}

const tauriClient = new TauriClient()
export default tauriClient
