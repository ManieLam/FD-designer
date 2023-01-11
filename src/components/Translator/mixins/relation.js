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
      const { getRelationImmediate, relationApi: gbResource } = this.config?.form?.actions || {}
      if (getRelationImmediate) {
        const { fByKey, fByRemote } = this.getRelationFields()

        if (gbResource && fByKey?.length) {
          // 根据字段配置relation字典key，赋值
          this.$require(gbResource)
            .then(res => {
              if (res) {
                // console.info(res?.data?.data?.[0]?.data)
                fByKey.forEach(f => {
                  // f.options = result[f.optionRelationKey]
                  if (this.isTest) {
                    // 测试数据
                    // console.info(res?.data?.data?.[0]?.data)
                    // TODO 对数据结构的取值层级优化成可配置的
                    this.$set(f, 'options', res?.data?.[0]?.data)
                  } else {
                    const result = res?.data ? keyBy(res?.data, 'name') : {}
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
