/* eslint-disable no-eval */
import axios from 'axios'
import { Message } from 'element-ui'
import { cloneDeep } from 'lodash'

export const httpHeader = (props, timeStamp) => {
  return {
    ...props.headers,
    // 'Anso-Sign': signFormat({
    //   ...sign,
    //   ...props.params,
    //   ...props.data,
    //   'Anso-TimeStamp': timeStamp
    // }),
    // 'Anso-TimeStamp': timeStamp,
    'x-csrf-token': 'test'
  }
}

export function useEval (funcStr = '', cb) {
  ((_cb) => {
    const func = eval(funcStr)
    // console.log('_cb1----')
    // console.info(_cb)
    // console.log('func2------')
    // console.info(func)
    // console.info(_cb(func))
    return _cb(func)
  })(cb)
}

/* 参数格式转换 */
export function formatParams ({ body = {}, beforeRequired } = {}) {
  if (beforeRequired?.__isChange) {
    // console.info('beforeRequired:', beforeRequired)
    useEval(beforeRequired.funcInput, (func) => func(body))
  }
  return body
}

export const httpOptions = (props, transAble = true) => {
  const timeStamp = new Date().getTime()
  const params = transAble ? formatParams(props) : {}
  const data = props.method === 'GET' ? {
    params: transAble ? {
      ...params,
      timeStamp: timeStamp
    } : props.params
  } : {
    data: transAble ? params : props.data
  }
  return {
    withCredentials: false,
    timeout: 600000,
    ...props,
    method: props.method,
    headers: httpHeader(props, timeStamp),
    retry: 2,
    retryDelay: 1000,
    ...data
  }
}

axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // console.log('error', error)
    return Promise.reject(new Error(error).message)
  }
)

axios.interceptors.response.use(
  response => {
    // console.log('.....', response)
    return response.data
  },
  error => {
    // console.log('error', error)
    // return Promise.reject(new Error(error))
    return Promise.reject(error)
  }
)

export function fetch (props) {
  return new Promise((resolve, reject) => {
    return axios(httpOptions(props))
      .then(
        async (response) => {
          const { __isChange, funcInput, funcDefault } = props.afterRequired || {}
          let res = {}
          await useEval(__isChange ? funcInput : funcDefault, function (func) {
            res = func(cloneDeep(response))
          })
          resolve(res)
          return res
        },
        (rej) => {
          // console.info('is reject', rej)
          if (props.error?.__isChange) {
            return useEval(props.error.funcInput, (func) => func(rej))
          }
          reject(new Error(false))
          return false
        }
      )
      .catch((error) => {
        console.info('被错误捕获了')
        if (error.response) {
          Message.error(error.response.statusText)
        }
        reject(error)
        return false
      })
  })
}

export function normalRequire (props) {
  return new Promise((resolve, reject) => {
    return axios(httpOptions(props, false))
      .then(
        resp => {
          resolve(resp)
          return resp
        },
        rej => {
          reject(rej)
          return false
        }
      )
      .catch(err => {
        reject(err)
        return false
      })
  })
}

export default fetch
