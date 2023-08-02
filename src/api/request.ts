import axios from 'axios'
import { message } from 'antd'
import { localGet, localRemove } from '../utils/util'
import type { AxiosProgressEvent, Method } from 'axios'
let isToken = true

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL

axios.defaults.timeout = 60000 * 2
axios.interceptors.request.use(
  config => {
    const token = localGet('disk-token')
    config.headers.Authorization = token
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
;(axios as any).setToken = (token: string) => {
  axios.defaults.headers['Authorization'] = token
}

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    const { response } = error
    if (response) {
      switch (response.status) {
        case 400:
          response.data.msg
            ? message.error(response.data.msg)
            : message.error('请求失败！请您稍后重试')

          break
        case 401:
          if (isToken) {
            isToken = false
            message.error('登录失效！请您重新登录')
            localStorage.clear()
            setTimeout(() => {
              window.location.pathname = '/login'
            }, 300)
          } else {
            isToken = true
          }

          break
        case 403:
          localRemove('Kte-token')
          break
        case 404:
          message.error('请求失败！请您稍后重试')
          break
        case 500:
          message.error(response.data.msg)
          break
        case 502:
          message.error('网络错误！')
          break
        case 503:
          message.error('服务不可用！')
          break
        case 504:
          message.error('网关超时！')
          break
      }
    } else {
      message.error('请求超时，请检查网络链接！')
      if (!window.navigator.onLine) {
        return
      }
      isToken = true
      return Promise.reject(error)
    }
  }
)

// 创建下载实例
const downLoad = axios.create({
  // 请求超时时间
  timeout: 60000,
  responseType: 'blob',
})

;(downLoad as any).setToken = (token: string) => {
  downLoad.defaults.headers['Kte-Auth'] = token
  window.localStorage.setItem('Kte-token', token)
}

downLoad.interceptors.request.use(
  config => {
    const token = localGet('Kte-token')
    token && (config.headers['Kte-Auth'] = token)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
downLoad.interceptors.response.use(
  res => {
    return res
  },
  error => {
    const { response } = error
    if (response) {
      switch (response.status) {
        case 400:
          if (response.data.type == 'application/json') {
            const reader = new FileReader()
            reader.onload = function () {
              const content = reader.result
              const messages = JSON.parse(content as string).msg // 错误信息
              message.error(messages)
            }
            reader.readAsText(response.data)
            return false
          }

          response.data.error_description
            ? message.error(response.data.error_description)
            : response.data.msg
            ? message.error(response.data.msg)
            : message.error('请求失败！请您稍后重试')

          break
        case 401:
          message.error('登录失效！请您重新登录')
          localStorage.clear()
          window.location.pathname = '/login'
          break
        case 403:
          localRemove('Kte-token')
          break
        case 404:
          message.error('请求失败！请您稍后重试')
          break
        case 405:
          message.error('请求方式错误！请您稍后重试')
          break
        case 500:
          message.error(response.data.msg)
          break
        case 502:
          message.error('网络错误！')
          break
        case 503:
          message.error('服务不可用！')
          break
        case 504:
          message.error('网关超时！')
          break
      }
    } else {
      message.error('请求超时，请检查网络链接！')
      if (!window.navigator.onLine) {
        // 断网处理:可以跳转到断网页面
        return
      }
      return Promise.reject(error)
    }
  }
)

/**
 * 封装下载方法
 * @param url
 * @param params
 * @returns {Promise}
 */

export function downLoadFile(url: string, params?: any) {
  return new Promise((resolve, reject) => {
    downLoad
      .get(url, {
        params,
      })
      .then(res => {
        if (res && res.data) {
          if (res.status === 200) {
            resolve(res.data)
          } else {
            reject(res.data)
          }
        } else {
          reject(res)
        }
      })
  })
}

/**
 * 封装下载方法 post
 * @param url
 * @param params
 * @returns {Promise}
 */

export function downLoadFilePost(url: string, param: any) {
  return new Promise((resolve, reject) => {
    downLoad.post(url, param).then(res => {
      if (res && res.data) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      } else {
        reject(res)
      }
    })
  })
}

export interface IResponseData<T> {
  data: T
  code: number
  success: boolean
  msg: string
}

const request = <T>(
  url: string,
  params: any,
  method: Method,
  isJson = false,
  isFromData = true,
  onUploadProgress?: (progress: AxiosProgressEvent) => void
): Promise<IResponseData<T>> => {
  return new Promise((resolve, reject) => {
    if (method == 'post' || method == 'put' || method == 'delete') {
      axios(url, {
        method,
        data: params,
        transformRequest: [
          function (data) {
            let ret = ''
            if (isJson === true) {
              ret = JSON.stringify(data)
            } else if (isFromData === true) {
              ret = data
            } else {
              for (const it in data) {
                ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
              }
            }
            return ret
          },
        ],
        headers: {
          'Content-Type':
            isJson === true
              ? 'application/json'
              : isFromData === true
              ? 'multipart/form-data'
              : 'application/x-www-form-urlencoded',
        },
        onUploadProgress,
      })
        .then(res => {
          if (res && res.data) {
            if (res.status === 200 || res.status === 201) {
              resolve(res.data)
            } else {
              reject(res.data)
            }
          } else {
            reject(res)
          }
        })
        .catch(error => {
          reject(error)
        })
    } else if (method == 'get') {
      axios({
        method,
        url,
        params,
        // 格式的转化
        transformRequest: [
          function (data) {
            let ret = ''
            if (isJson === true) {
              ret = JSON.stringify(data)
            } else {
              for (const it in data) {
                ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
              }
            }
            return ret
          },
        ],
        headers: {
          'Content-Type':
            isJson === true
              ? 'application/json'
              : isFromData === true
              ? 'multipart/form-data'
              : 'application/x-www-form-urlencoded',
        },
      })
        .then(res => {
          if (res && res.data) {
            if (res.status === 200) {
              resolve(res.data)
            } else {
              reject(res.data)
            }
          } else {
            reject(res)
          }
        })
        .catch(error => {
          reject(error)
        })
    }
  })
}

/**
 * 封装get方法
 * @param url
 * @param params
 * @param isJson
 * @returns {Promise}
 */

export function get<T>(url: string, params?: any, isJson = false, isFromData = false) {
  return request<T>(url, params, 'get', isJson, isFromData)
}

/**
 * 封装delete方法
 * @param url
 * @param params
 * @param isJson
 * @returns {Promise}
 */

export function remove<T>(url: string, params?: any, isJson = false, isFromData = false) {
  return request<T>(url, params, 'delete', isJson, isFromData)
}

/**
 * 封装post请求
 * @param url
 * @param params
 * @param isJson
 * @returns {Promise}
 */
export function post<T>(
  url: string,
  params: any,
  isJson = false,
  isFromData = false,
  onUploadProgress?: (progress: AxiosProgressEvent) => void
) {
  return request<T>(url, params, 'post', isJson, isFromData, onUploadProgress)
}

/**
 * 封装put请求
 * @param url
 * @param params
 * @param isJson
 * @returns {Promise}
 */
export function put<T>(url: string, params: any, isJson = false, isFromData = false) {
  return request<T>(url, params, 'put', isJson, isFromData)
}

/**
 * 封装下载zip方法
 * @param url
 * @param params
 * @returns {Promise}
 */

export function downLoadFileZip(url: string, params: any) {
  return new Promise((resolve, reject) => {
    downLoad.post(url, params).then(res => {
      if (res && res.data) {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      } else {
        reject(res)
      }
    })
  })
}
