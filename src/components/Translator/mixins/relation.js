import { keyBy } from 'lodash'
export default {
  methods: {
    /* 获取relation: 将字段以及卡槽字段筛选出，根据relation类型分为fByKey,fByRemote */
    async getRelationFields () {
      let fByKey = []
      let fByRemote = []
      // console.log('formFields:', this.formFields)
      await this.formFields.forEach(async (field) => {
        const { optionType, preSlotRender, suffixSlotRender } = field?.form || {}
        if (optionType === 'optionRelationKey') {
          fByKey.push(field?.form)
        } else if (optionType === 'optionApi') {
          fByRemote.push(field?.form)
        }
        // 卡槽字段赋值
        if (preSlotRender || suffixSlotRender) {
          const filter = [preSlotRender, suffixSlotRender].filter(e => !!e && e.tag !== 'button')
          const { fByKey: slotfByKey, fByRemote: slotfByRemote } = await this.getRelationForSlot(filter)
          fByKey = fByKey.concat(slotfByKey)
          fByRemote = fByRemote.concat(slotfByRemote)
        }
      })
      return {
        fByKey,
        fByRemote
      }
    },
    getRelationForSlot (attrs = []) {
      return attrs.reduce((res, attr) => {
        const { optionType } = attr
        if (optionType === 'optionRelationKey') {
          res.fByKey.push(attr)
        } else if (optionType === 'optionApi') {
          res.fByRemote.push(attr)
        }
        return res
      }, { fByKey: [], fByRemote: [] })
    },
    async getRelation () {
      // console.log('获取relation:', this.config)
      const { getRelationImmediate, relationApi: gbResource } = this.config?.actions || {}
      if (getRelationImmediate) {
        // 配置了表单-行为-初始化relation加载
        const { fByKey, fByRemote } = await this.getRelationFields()
        // 去掉存在fByKey才请求的限制，防止歧义，只要有配就请求
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
                    console.log('开发环境relation取值为第一行数据', res?.data?.[0]?.data)
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
          Promise.all(fByRemote.map(f => this.$require(this.formatRequire(f.optionApi))
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
