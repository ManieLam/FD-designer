<template lang='pug'>
AnsoDataform(v-bind="formSetting", :formFields="fields", :buttonList="buttonList", key="form")
</template>

<script>
/**
 * 默认只支持常规表单
 * TODO 支持表单多种布局
 */
// import { isEqual, difference } from 'lodash'
export default {
  name: 'WidgetForm',
  props: ['fullField', 'added', 'layout', 'groupBy'],
  watch: {
    added: {
      handler ({ element, newIndex }) {
        if (!element) {
          this.fields = []
          return
        }
        if (element) {
          this.fields.splice(newIndex, 0, this.formatField(element))
          console.info('this.fields:', this.fields)
        }
      }
    }
  },
  data () {
    return {
      formSetting: {},
      fields: [],
      buttonList: [
        { label: '取消', name: 'cancel', func: () => {} },
        { label: '提交', name: 'submit', type: 'primary', func: () => {} }
      ],
      formItemTags: {
        AnsoDataformText: 'text',
        AnsoDataformInput: 'input',
        AnsoDataformTextRange: 'textRange',
        AnsoDataformNumber: 'number',
        AnsoDataformNumRange: 'numberRange',
        AnsoDataformSelect: 'select',
        AnsoDataformSwitch: 'switch',
        AnsoDataformSlider: 'slider',
        AnsoDataformCheckbox: 'checkbox',
        AnsoDataformRadio: 'radio',
        AnsoDataformCascader: 'cascader',
        AnsoDataformTime: 'time',
        AnsoDataformTimeRange: 'timeRange',
        AnsoDataformDate: 'date',
        AnsoDataformUpload: 'file',
        // AnsoDataformIcon: 'icon',
        InfoRender: 'render',
        AnsoButtonGroup: 'button',
        AnsoLink: 'link',
        AnsoDataformTransfer: 'transfer',
        AnsoDataformTree: 'tree'
      }
    }
  },
  methods: {
    /* {
      name: '',
      label: '自定义字段',
      form: {
        tag: '',
        rules: [],
        options: [],
        chains: ({chains, values, value}) => {},
        ...setting
      }
    } */
    formatField (ele) {
      const { name } = ele
      return {
        name: `${name}_${new Date().getTime()}`,
        label: '自定义字段',
        form: {
          tag: this.formItemTags[name]
        }
      }
    },
    clear () {
      this.fields = []
    }
  }
}
</script>

<style lang='sass' scoped>

</style>
