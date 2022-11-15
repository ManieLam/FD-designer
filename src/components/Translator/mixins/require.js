/**
 * 格式化接口请求方法
 * formData: 表单录入数据
 * fullData: 表单录入数据 + 所有数据源数据
 * */
import { getURLAll } from '@/utils/format.js'
export default {
  methods: {
    transParamsVal (varType, valKey) {
      switch (varType) {
        case 'const':
          return valKey
        case 'formData':
          return this.formData[valKey]
        case 'fullData':
          return this.fullData[valKey]
        case 'router':
          return getURLAll.call(this, valKey)
        case 'localstorage':
          // const storageData = localStorage.getItem(value)
          // console.log(typeof storageData)
          // return JSON.parse(storageData)
          return localStorage.getItem(valKey)
      }
    },
    formatBodyParams ({ body = [] } = {}) {
      return Array.from(body).reduce((res, item) => {
        res[item.key] = this.transParamsVal(item.varType, item.value)
        return res
      }, {})
    },
    /**
     * @return body 数据 <Object>
     * TODO 多数据源转换
     * */
    formatSubmitParams ({ isFullDose, body = [] }) {
      const range = isFullDose ? this.fullData : this.formData
      const bodyParams = body && body.length ? this.formatBodyParams({ body }) : {}
      return Object.assign({}, range, bodyParams)
    },
    /**
     * @return 格式化后的请求地址
      */
    formatPath ({ url = '', pathData = [] }) {
      if (url && pathData.length) {
        const paramsVal = this.formatBodyParams({ body: pathData })
        const newPath = url.replace(/(\$\{)(\w+)(\})/g, (match, p1, p2, p3) => {
          return paramsVal[p2] || ''
        })
        return newPath
      } else {
        return url
      }
    },
    /**
     * @return 格式化后的请求地址、请求参数对象
    */
    formatRequire (require = {}) {
      return {
        ...require,
        url: this.formatPath(require),
        body: this.formatSubmitParams(require)
      }
    }
  }
}
