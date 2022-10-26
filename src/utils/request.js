/* eslint-disable no-eval */
import axios from 'axios'
import { Message } from 'element-ui'

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
    _cb(func)
  })(cb)
}

/* 参数格式转换 */
export function formatParams ({ body = [], beforeRequired } = {}) {
  // console.info('body:', body)
  const params = body ? body.reduce((res, row) => {
    let paramsVal = ''
    switch (row.varType) {
      case 'const':
        paramsVal = row.value
        break
      case 'formData':
      case 'router':
      case 'localstorage':
        paramsVal = `${row.varType}|${row.value}`
        break
    }
    res[row.key] = paramsVal
    return res
  }, {}) : {}
  if (beforeRequired?.__isChange) {
    useEval(beforeRequired.funcInput, (func) => func(params))
  }
  return params
}

export const httpOptions = (props) => {
  const timeStamp = new Date().getTime()
  const params = formatParams(props)
  const data = props.method === 'GET' ? {
    params: {
      ...params,
      timeStamp: timeStamp
    }
  } : {
    data: params
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
  return axios(httpOptions(props))
    .then(
      (response) => {
        // if (response.data.code === 0) {
        //   // clearRequestQueue(props, response.data)
        //   return response.data
        // } else if (response.data.code === 6) {
        //   // 警告类，允许业务往下执行
        //   // 以防进入catch
        //   return Object({
        //     ...response.data,
        //     statusText: response.statusText,
        //     __status: 'warning'
        //   })
        // } else {
        //   throw Object({
        //     response: {
        //       status: response.data.code,
        //       statusText: response.data.message
        //     }
        //   })
        // }
        if (props.afterRequired?.__isChange) {
          useEval(props.afterRequired.funcInput, (func) => func(response))
        } else {
          return response
        }
      },
      (reject) => {
        if (props.error?.__isChange) {
          useEval(props.error.funcInput, (func) => func(reject))
        }
        return false
      }
    )
    .catch((error) => {
      if (error.response) {
        Message.error(error.response.statusText)
      }
      return false
    })
}

export default fetch
