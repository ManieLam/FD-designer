/**
 * 格式化接口请求方法
 * formData: 表单录入数据
 * collectData: 表单所有数据集合 + 所有数据源数据
 * */
import { getURLAll, formatDefValFunc } from '@/utils/format.js'
import { cloneDeep } from 'lodash'

export default {
  methods: {
    transParamsVal (varType, valKey) {
      // console.info('varType:', varType, valKey)
      const val = Array.isArray(varType) ? varType[0] : varType
      // console.log('val:', val)
      switch (val) {
        case 'const':
          return valKey
        case 'formData':
          return this.formData[valKey]
        case 'collectData': {
          // 最后一位为数据源key
          const ranges = this.formDataCollect.get(varType[varType.length - 1]) || {}
          // console.info('获取到数据集合：', ranges)
          return ranges[valKey]
        }
        case 'router':
          return getURLAll.call(this, valKey)
        case 'localstorage':
          return localStorage.getItem(valKey)
      }
    },
    formatVarParams (varlist = []) {
      return Array.from(varlist).reduce((res, item) => {
        res[item.key] = this.transParamsVal(item.varType, item.value)
        return res
      }, {})
    },
    /**
     * @return body 数据 <Object>
     * 包括 多数据源转换: 根据指定的数据源集合, 赋值参数
     * @param isFullDose 是否提交全量默认数据集
     * @param isSubmit 是否为提交表单数据
     * */
    formatSubmitParams ({ isFullDose, isSubmit, body = [] }) {
      // 是否全量数据提交，isSubmit：提交型接口交互，带表单录入的数据或全量数据
      // console.info('更新body参数：', arguments)
      const range = !isSubmit ? {} : isFullDose ? this.fullData : this.formData
      // 转换body参数
      const bodyParams = body && body.length ? this.formatVarParams(body) : {}
      // console.log('range:', range)
      // console.log('bodyParams:', bodyParams)
      return Object.assign({}, range, bodyParams)
    },
    /**
    * @return 格式化后的请求地址
    */
    formatPath ({ url = '', pathData = [], body = [] }) {
      if (url && pathData?.length) {
        const paramsVal = this.formatVarParams(pathData)
        // console.info('paramsVal:', paramsVal)
        const newPath = url.split('?')?.[0].replace(/(\$\{)(\w+)(\})/g, (match, p1, p2, p3) => {
          return paramsVal[p2] || ''
        })
        // console.info('newPath1:', newPath)
        return newPath
      } else {
        if (body?.length) {
          // 如果只有地址+body的参数, 不在这里转换body参数, body参数只在另一个参数转换
          const newPath = url.split('?')?.[0]
          // console.info('newPath2:', newPath)
          return newPath
        }
        return url
      }
    },
    formatHeader ({ header }) {
      if (header && Array.isArray(header) && header.length) {
        return this.formatVarParams(header)
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
        body: this.formatSubmitParams(require),
        header: this.formatHeader(require)
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
        const value = formatDefValFunc.call(this, datas, this.formFields, fieldProperty)
        this.$set(this.fullData, field, value)
      }
    },
    // 初始化接口请求后操作
    doResolve (res, api) {
      if (!res) return false // 返回空值，不执行后续赋值行为
      if (api?.isDefault && !api.isSubmit) {
        // 只有初始化数据需要对默认数据集合赋值， 即只有需要赋值的接口才会做赋值
        // console.info('res:', res)
        // this.formData = res
        this.fullDataTemp = res || {}
        this.fullData = res || {} // 记录默认数据源的数据，参与后续提交取值
        // 受anso-ui，表单在赋值后触发校验
        this.$nextTick(() => {
          this.onClearValidate()
        })
      }
      // 请求成功或失败都存储到formDataCollect中
      this.formDataCollect.set(api.name, res)
      // 设置默认值
      this.setDefaultValue()
      return res
    },
    // 串联处理
    async doSeries (reqs = []) {
      // console.info('evts:', reqs)
      let preRes = true
      for (let index = 0; index <= reqs.length - 1; index++) {
        const api = reqs[index]
        const reqList = this.formatRequire(api)
        // console.log('reqList:', reqList)
        await this.$require(reqList)
          .then(r => {
            // console.log('new r:', r)
            this.doResolve(r, api)
            preRes = cloneDeep(r)
            return r
          }, e => {
            preRes = false
          })
        // console.info('preRes:', preRes)
        if (!preRes) {
          this.$message.error(`出错啦：第${index + 1}个接口异常, 中断执行`)
          // this.$emit('onMultiRequireEnd', reqRes)
          window.parent.postMessage({ onSeriesRequireFalse: api }, '*')
          break
        }
        if (index === reqs.length - 1) {
          // 表示执行结束
          return true
        }
      }
      // setTimeout(() => {
      //   console.log('执行结束')
      // })
    },
    // 并联处理
    async doInParallel (reqs = []) {
      return Promise.all(
        reqs.map(req => {
          return this.$require(this.formatRequire(req))
            .then(
              r => {
                // console.log('获取到结果:', r)
                this.doResolve(r, req)
              },
              e => {}
            )
        })
      )
        .then(() => {
          return true // 表示执行结束, 注意不是执行成功/失败通知
        })
        .finally(() => {
          console.log('最终结束了, 所有数据集合:', this.formDataCollect)
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
    async formatMultiRequire ({ requires = [], rules = {} } = {}) {
      // promise 一旦创建立即执行
      const _requires = cloneDeep(requires)
      let reqRes = false
      if (rules?.executiveMode === 'inSeries') {
        // 串联：从第一个接口依次执行，当一个接口报错则中断后续操作，进入请求失败操作
        reqRes = await this.doSeries(_requires)
      } else {
        // 并联：所有接口执行完成，再执行下一步操作。若存在请求失败的接口，则会单独执行该失败的操作。
        reqRes = await this.doInParallel(_requires)
        // console.log('并联执行结束:', res)
      }
      console.log('执行结果:', reqRes)
      // 执行结束通知
      this.$emit('onMultiRequireEnd', reqRes)
      window.parent.postMessage({ onMultiRequireEnd: reqRes }, '*')
    }
  }
}
