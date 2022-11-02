<template>
  <AnsoDataform
    ref="form"
    id="customForm"
    v-model="formData"
    v-bind="formAttrs"
    :formFields="formFieds"
    :buttonList="actButtons"
    @onChange="onFormChange"
  ></AnsoDataform>
</template>
<script>
import { merge, isEqual, cloneDeep, keyBy } from 'lodash'
import { formatFormRules, formatDefValFunc } from '@/utils/format.js'
// import button from '../mixins/button'
import relation from '../mixins/relation'
import { MessageBox } from 'element-ui'
// import { useEval } from '@/utils/request.js'
export default {
  name: 'FormTemp',
  mixins: [relation],
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
      formDataTemp: {},
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
    formAttrs () {
      const { attrs } = this.config?.form || {}
      return {
        ...attrs,
        labelWidth: `${attrs.labelWidth}px`,
        type: attrs.layout,
        disabled: attrs.readOnly
      }
    },
    // 需要发起异步搜索的字段
    remoteSearch () {
      return this.formItems.filter(field => field.filterAbleType === 'filterAbleAsyncFunc')
    },
    hasChangeData () {
      return !isEqual(this.formData, this.formDataTemp)
    },
    actButtons () {
      const buttons = cloneDeep(this.config?.form.buttons)
      return buttons.map(btn => {
        if (btn.name === 'reset') { btn.func = () => this.onFormReset(btn) }
        if (btn.name === 'cancel') { btn.func = () => this.onFormCancel(btn) }
        if (btn.name === 'submit') { btn.func = () => this.onFormSubmit(btn) }
        if (this.config?.form?.attrs?.readOnly) {
          btn.disabled = true
        }
        return btn
      })
    },
    fieldObj () {
      return keyBy(this.formFieds, 'name')
    }
  },
  methods: {
    onFormChange () {
      // console.info(arguments)
      this.$emit('')
    },
    onFormValidate () {
      this.$refs.form.validate()
    },
    onClearValidate () {
      this.$refs.form.$refs.dataform.clearValidate()
    },
    onDestory () {},
    // 设置默认值
    setDefaultValue () {
      // this.formData
      const keys = Object.keys(this.fieldObj)
      for (const field of keys) {
        // console.info('field:', field)
        const value = formatDefValFunc(this.formData, this.formFieds, this.fieldObj[field]?.form)
        console.info('defVal:', field, value)
        this.$set(this.formData, field, value)
      }
    },
    // 发起异步请求
    getRemoteResource () {
      const { actions } = this.config?.form || {}
      if (actions?.immediateRemoteRequire) {
        this.$require(actions.immediateRemoteRequire)
          .then(res => {
            // console.info('初始化请求发起后:', res)
            this.formDataTemp = res || {}
            this.formData = res || {}
            // 受anso-ui，表单在赋值后触发校验
            this.$nextTick(() => {
              this.onClearValidate()
            })
            return res
          })
          .then(res => {
            this.setDefaultValue()
            // this.formatDefValFunc()
          })
      }
    },
    // 内置的按钮重置函数
    doReset () {
      this.$refs.form.resetForm()
    },
    onFormReset (btn) {
      //  && this.hasChangeData
      if (btn.tipBeforeAction) {
        MessageBox.confirm(
          '检测到未保存的内容，是否确定当前操作？',
          `${btn.label}提醒`,
          {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          .then(confirm => {
            if (confirm) {
              this.doReset()
            }
          })
      } else {
        this.doReset()
      }
    },
    doCancel (btn) {
      this.$refs.form.resetForm()
      try {
        if (btn.returnBack) {
          if (this.$router) {
            this.$router.go(-1)
          } else {
            window.history.go(-1)
          }
        } else if (btn.closeDialog) {
          this.$emit('onCloseDialog')
        }
      } catch (err) {
        console.warn('取消功能异常:', err)
      }
    },
    // 内置的按钮取消函数
    onFormCancel (btn) {
      if (btn.tipBeforeAction) {
        MessageBox.confirm(
          '检测到未保存的内容，是否确定当前操作？',
          `${btn.label}提醒`,
          {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          })
          .then(confirm => {
            if (confirm) {
              console.info('confirm:', btn)
              this.doCancel(btn)
            }
          })
      } else {
        this.doCancel(btn)
      }
    },
    formatSubmitParams (params = []) {
      const formParams = Object.entries(this.formData).map(([name, value]) => {
        return {
          key: name,
          value,
          varType: 'const' // 无需动态取值
        }
      })
      // TODO 当body中变量类型value存在`${row.varType}|${row.value}`这个格式 需要转换成动态取值
      return [].concat(params, formParams)
    },
    // 内置的按钮提交事件
    onFormSubmit (btn) {
      console.log('on submit', btn)
      if (btn.validate) {
        this.$refs.form.$refs.dataform.validate(valid => {
          if (valid && btn.funcRemote) {
            this.$require({
              ...btn.funcRemote,
              body: this.formatSubmitParams(btn.body)
            }).then(res => {
              // console.info('on after submit', res)
              this.$emit('onAfterSubmit', res)
            })
          }
        })
      } else if (btn.funcRemote) {
        this.$require(btn.funcRemote).then(res => {
          // console.info('on after submit', res)
          this.$emit('onAfterSubmit', res)
        })
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
  //         buttonList={this.actButtons}
  //         props={this.formAttrs}
  //         onChange={this.onFormChange}
  //       ></AnsoDataform>
  //     </div>
  //   )
  }
}
</script>
