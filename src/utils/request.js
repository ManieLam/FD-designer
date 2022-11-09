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
    // console.log('_cb1----')
    // console.info(_cb)
    // console.log('func2------')
    // console.info(func)
    // console.info(_cb(func))
    return _cb(func)
  })(cb)
}

/* 参数格式转换 */
export function formatParams ({ body = [], beforeRequired } = {}) {
  // console.info('body:', body)
  const params = body ? body.reduce((res, row) => {
    let paramsVal = ''
    switch (row.varType) {
      case 'const': // 直接赋值，无需取值
        paramsVal = row.value
        break
      // 当body中变量类型value存在`${row.varType}|${row.value}`这个格式 需要转换成动态取值
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
    // console.info('beforeRequired:', beforeRequired)
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
      async (response) => {
        const { __isChange, funcInput, funcDefault } = props.afterRequired || {}
        let res = {}
        await useEval(__isChange ? funcInput : funcDefault, function (func) {
          res = func(response)
        })
        return res
      },
      (reject) => {
        if (props.error?.__isChange) {
          return useEval(props.error.funcInput, (func) => func(reject))
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
