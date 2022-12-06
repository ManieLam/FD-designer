/**
 * 格式化接口请求方法
 * formData: 表单录入数据
 * fullData: 表单录入数据 + 所有数据源数据
 * */
import { getURLAll, formatDefValFunc } from '@/utils/format.js'
import { cloneDeep } from 'lodash'

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
      if (url && pathData?.length) {
        const paramsVal = this.formatBodyParams({ body: pathData })
        const newPath = url.split('?')?.[0].replace(/(\$\{)(\w+)(\})/g, (match, p1, p2, p3) => {
          return paramsVal[p2] || ''
        })
        return newPath
      } else {
        return url
      }
    },
    /**
     * 单个接口时格式化
     * @return 格式化后的请求地址、请求参数对象
    */
    formatRequire (require = {}) {
      return {
        ...require,
        url: this.formatPath(require),
        body: this.formatSubmitParams(require)
      }
    },

    // 设置默认值
    setDefaultValue () {
      const keys = Object.keys(this.fieldObj)
      for (const field of keys) {
        // console.info('field:', field)
        const fieldProperty = this.fieldObj[field]?.form
        const { apiName } = fieldProperty?.defaultValue || {}
        // console.log(field, '数据源:', apiName)

        let datas = this.fullData
        if (apiName) {
          // 存在自定义挑选数据源
          datas = this.formDataCollect.get(apiName) || {}
        }
        const value = formatDefValFunc.call(this, datas, this.formFieds, fieldProperty)
        this.$set(this.fullData, field, value)
      }
    },
    // 初始化接口请求后操作
    afterImmediateResolve (res, api) {
      if (!res) return false
      if (api?.isDefault) {
        // 对默认数据集合赋值
        // this.formData = res
        this.fullDataTemp = res || {}
        this.fullData = res || {}
        // 受anso-ui，表单在赋值后触发校验
        this.$nextTick(() => {
          this.onClearValidate()
        })
      }
      // 请求成功或失败都存储到formDataCollect中
      this.formDataCollect.set(api.name, res) // 测试
      // 设置默认值
      this.setDefaultValue()
      return res
    },
    // 串联处理
    async doSeries (reqs = []) {
      console.info('evts:', reqs)
      let preRes = true
      for (let index = 0; index <= reqs.length - 1; index++) {
        const api = reqs[index]
        await this.$require(this.formatRequire(api))
          .then(r => {
            this.afterImmediateResolve(r, api)
            preRes = r
          }, e => {
            preRes = false
          })
        if (!preRes) {
          this.$message.error(`出错啦：第${index + 1}个接口异常, 中断执行`)
          break
        }
      }
    },
    // 并联处理
    async doInParallel (reqs = []) {
      Promise.all(
        reqs.map(req => {
          return this.$require(this.formatRequire(req))
            .then(
              r => {
                this.afterImmediateResolve(r, req)
              },
              e => {}
            )
        })
      ).finally(() => {
        console.log('最终结束了:', this.formDataCollect)
        // this.$message.success('所有接口')
      })
    },
    /**
     * 多个数据接口 根据执行规则格式化
     * @params <Object> rules 执行规则，{
     *    executiveMode:<string>  inParallel-并联/inSeries-串联/inSetting-自定义规则,
     *    executByRule:<string>   自定义规则
     * }
     * @return none
    */
    formatMultiRequire ({ requires = [], rules = {} } = {}) {
      // promise 一旦创建立即执行
      const _requires = cloneDeep(requires)
      if (rules?.executiveMode === 'inSeries') {
        // 串联：从第一个接口依次执行，当一个接口报错则中断后续操作，进入请求失败操作
        this.doSeries(_requires)
      } else {
        // 并联：所有接口执行完成，再执行下一步操作。若存在请求失败的接口，则会单独执行该失败的操作。
        this.doInParallel(_requires)
      }
    }
  }
}
