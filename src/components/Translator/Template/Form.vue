<template>
  <AnsoDataform
    ref="form"
    id="customForm"
    v-model="formData"
    v-bind="this.formAttrs"
    :formFields="this.formFieds"
    :buttonList="this.formButtons"
    @onChange="this.onFormChange"
  ></AnsoDataform>
</template>
<script>
import { merge, keyBy } from 'lodash'
import { formatFormRules } from '@/utils/format.js'
// import { useEval } from '@/utils/request.js'
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
      return this.config?.form.buttons.map(btn => {
        if (btn.name === 'reset') { btn.func = this.onFormReset }
        if (btn.name === 'cancel') { btn.func = this.onFormCancel }
        if (btn.name === 'submit') { btn.func = () => this.onFormSubmit(btn) }
        return btn
      })
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
    // 内置的按钮重置函数
    onFormReset () {
      this.$refs.form.resetForm()
    },
    // 内置的按钮取消函数
    onFormCancel () {},
    // 内置的按钮提交事件
    onFormSubmit (btn) {
      console.log('on submit', btn)
      if (btn.validate) {
        this.$refs.form.$refs.dataform.validate(valid => {
          if (valid && btn.funcRemote) {
            this.$require(btn.funcRemote).then(res => {
              console.info('on after submit', res)
            })
          }
        })
      } else if (btn.funcRemote) {
        this.$require(btn.funcRemote).then(res => {
          console.info('on after submit', res)
        })
      }
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
    getRemoteResource () {
      const { actions } = this.config?.form || {}
      if (actions?.immediateRemoteRequire) {
        this.$require(actions.immediateRemoteRequire).then(res => {
          this.formData = res || {}
        })
      }
    },
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
                    this.$set(f, 'options', result[f.optionRelationKey])
                  }
                })
              }
            })
        }
        if (fByRemote?.length) {
          // 根据每个字段配置了动态异步获取relation，赋值
          Promise.all(fByRemote.map(f => this.$require(f.optionsAsyncFunc)
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
  },
  created () {
    this.getRelation()
  },
  mounted () {
    // console.info('form mounted:', this.isTest)
    // this.onMounted()
    this.onClearValidate()
    this.getRemoteResource()
  // },
  // render (h) {
  //   return (
  //     <div>
  //       <AnsoDataform
  //         ref="form"
  //         id="customForm"
  //         v-model="formData"
  //         formFields={this.formFieds}
  //         buttonList={this.formButtons}
  //         props={this.formAttrs}
  //         onChange={this.onFormChange}
  //       ></AnsoDataform>
  //     </div>
  //   )
  }
}
</script>
