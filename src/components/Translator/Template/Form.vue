<script>
import { merge, keyBy } from 'lodash'
import { formatFormRules } from '@/utils/format.js'
export default {
  name: 'FormTemp',
  props: {
    config: {
      type: Object,
      default: () => ({})
    },
    isTest: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: {},
      relations: {}
    }
  },
  computed: {
    formItems () {
      return this.config?.fields || []
    },
    formFieds () {
      return this.config?.fields.map(config => {
        return {
          name: config.name,
          label: config.label,
          relation: config.optionRelationKey || null,
          form: merge(
            config,
            {
              rules: formatFormRules(config.validate) || []
            }
          )
        }
      })
    },
    formButtons () {
      return this.config?.form.buttons
    },
    formAttrs () {
      const { attrs } = this.config?.form || {}
      return {
        ...attrs,
        labelWidth: `${attrs.labelWidth}px`,
        type: attrs.layout,
        disabled: attrs.readOnly
      }
    },
    // 需要发起异步选项的字段
    remoteOptions () {
      return this.formItems.filter(field => field.optionType === 'optionsAsyncFunc')
    },
    // 需要发起异步搜索的字段
    remoteSearch () {
      return this.formItems.filter(field => field.filterAbleType === 'filterAbleAsyncFunc')
    }
  },
  methods: {
    onFormChange () {
      console.info(arguments)
    },
    onFormReset () {
      this.$refs.form.resetForm()
    },
    onFormValidate () {
      this.$refs.form.validate()
    },
    onClearValidate () {
      this.$refs.form.$refs.dataform.clearValidate()
    },
    // onMounted () {
    //   this.onClearValidate()
    //   this.getRemoteResource()
    // },
    onDestory () {},
    // 设置默认值
    setDefaultValue () {},
    // 发起异步请求
    getRemoteResource () {},
    // 获取relation
    getRelationFields () {
      return this.formFieds.reduce((res, field) => {
        const { optionType } = field?.form || {}
        if (optionType === 'optionRelationKey') {
          res.fByKey.push(field?.form)
        } else if (optionType === 'optionsAsyncFunc') {
          res.fByRemote.push(field?.form)
        }
        return res
      }, { fByKey: [], fByRemote: [] })
    },
    getRelation () {
      const { getRelationImmediate, relationResource: gbResource } = this.config?.form?.actions || {}
      if (getRelationImmediate) {
        const { fByKey, fByRemote } = this.getRelationFields()

        if (gbResource && fByKey?.length) {
          this.$require(gbResource)
            .then(res => {
              // console.info('请求relation', res)
              if (res) {
                const result = res?.data?.data ? keyBy(res?.data?.data, 'name') : {}
                // console.info(res?.data?.data?.[0]?.data)
                fByKey.forEach(f => {
                  // f.options = result[f.optionRelationKey]
                  if (this.isTest) {
                    // 测试数据
                    // console.info(res?.data?.data?.[0]?.data)
                    // TODO 对数据结构的取值层级优化成可配置的
                    this.$set(f, 'options', res?.data?.data?.[0]?.data)
                  } else {
                    this.$set(f, 'options', result[f.optionRelationKey])
                  }
                })
              }
            })
        }
        if (fByRemote?.length) {
          Promise.all(fByRemote.map(f => this.$require(f.optionsAsyncFunc)
            .then(res => { return res || {} })))
            .then((results) => {
              results.forEach((r, i) => {
                // TODO 对数据结构的取值层级优化成可配置的
                this.$set(fByRemote[i], 'options', r?.data?.data || [])
              })
            })
        }
      }
    }
  },
  created () {
    this.getRelation()
  },
  mounted () {
    // console.info('form mounted:', this.isTest)
    // this.onMounted()
    this.onClearValidate()
    this.getRemoteResource()
  },
  render (h) {
    return (
      <div>
        <AnsoDataform
          ref="form"
          id="customForm"
          formFields={this.formFieds}
          buttonList={this.formButtons}
          props={this.formAttrs}
          onChange={this.onFormChange}
        ></AnsoDataform>
      </div>
    )
  }
}
</script>
