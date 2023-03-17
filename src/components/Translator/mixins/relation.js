import { keyBy } from 'lodash'
export default {
  methods: {
    /* 获取relation */
    getRelationFields () {
      return this.formFields.reduce((res, field) => {
        const { optionType } = field?.form || {}
        if (optionType === 'optionRelationKey') {
          res.fByKey.push(field?.form)
        } else if (optionType === 'optionApi') {
          res.fByRemote.push(field?.form)
        }
        return res
      }, { fByKey: [], fByRemote: [] })
    },
    getRelation () {
      // console.log('获取relation:', this.config)
      const { getRelationImmediate, relationApi: gbResource } = this.config?.actions || {}
      if (getRelationImmediate) {
        const { fByKey, fByRemote } = this.getRelationFields()
        // 去掉存在fByKey才请求的限制，防止歧义，只要有配就请求
        // console.log('gbResource:', gbResource)
        const requireFormat = this.formatRequire(gbResource)
        if (gbResource) {
          // 根据字段配置relation字典key，赋值
          this.$require(requireFormat)
            .then(res => {
              if (res) {
                fByKey.forEach(f => {
                  // f.options = result[f.optionRelationKey]
                  if (process.env.NODE_ENV === 'development') {
                    // 测试数据, 默认取第一行数据
                    console.log('开发环境relation取值为第一行数据')
                    // console.info(res?.data?.data?.[0]?.data)
                    // TODO 对数据结构的取值层级优化成可配置的
                    this.$set(f, 'options', res?.data?.[0]?.data)
                  } else {
                    const result = res?.data ? keyBy(res?.data, 'name') : {}
                    // console.info('result:', result)
                    this.relations = result
                    this.$set(f, 'options', result[f.optionRelationKey])
                  }
                })
              }
            })
        }
        if (fByRemote?.length) {
          // 根据每个字段配置了动态异步获取relation，赋值
          Promise.all(fByRemote.map(f => this.$require(f.optionApi)
            .then(res => { return res || {} })))
            .then((results) => {
              results.forEach((r, i) => {
                // TODO 对数据结构的取值层级优化成可配置的
                this.$set(fByRemote[i], 'options', r?.data || [])
              })
            })
        }
      }
    }
  }
}
