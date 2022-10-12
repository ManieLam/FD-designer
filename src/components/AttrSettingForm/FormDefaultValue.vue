<template lang='pug'>
.box-content__inside
  el-radio-group(v-model="settingValue.valueType")
    el-radio(v-for="radio in valueTypeGroups", :key="radio.name", :label="radio.name") {{ radio.label }}
  //- 预设数据配置
  .content-item(v-if="settingValue.valueType==='isPreset'")
    el-select(v-model="settingValue.presetType", placeholder="请选择关联的数据类型")
      el-option-group(
        v-for="opt in presetOptions"
        :label="opt.label"
        :key="opt.label")
        el-option(v-for="item in opt.options", :key="item.value", v-bind="item")
          span(style="float: left") {{item.label}}
          span.m-l-8.color-text-secondary(style="float: right") {{item.meta}}
    //- 指定获取localstorage数据
    .additional-input.m-t-8(v-if="settingValue.presetType==='localStorage'")
      el-input(v-model="settingValue[settingValue.presetType]", placeholder="请填写localStorage指定的name, 只允许String类型")

    //- 指定获取地址栏数据
    .additional-input.d-flex-row-between.m-t-8(v-if="settingValue.presetType==='routerParams' || settingValue.presetType==='routerQuery'")
      el-input(v-model="settingValue[settingValue.presetType]", placeholder="请填写参数指定的名称")

    //- 指定表单内数据自定义运算
    .additional-input.m-t-8(v-if="settingValue.presetType==='customFunc'")
      CodeEditor(
        v-if="settingValue.presetType==='customFunc'"
        :value="settingValue.customFunc"
        key="setValueByCustom"
        @change="formatFuncByStr")
        //- pre.code-editor-desc__pre(slot="code-pre") (data, fields, field) => {
        //- pre.code-editor-desc__suffix(slot="code-suffix") }
    //- 指定表单关联字段及指定关联字段行为影响，并在关联字段那边配置相应的行为
    .additional-input.m-t-8(v-if="settingValue.presetType==='customChainsField'")
      el-input(v-model="settingValue[settingValue.presetType]", placeholder="请填写指定的表单字段")
      span.color-secondary.font-size-small
        i.el-icon-info
        span 请在指定字段行为中配置处理事件
</template>

<script>
/** 默认值 */
import CodeEditor from '@/components/CodeEditor'
import { debounce } from 'lodash'
import { useEval } from '@/utils/request.js'
// import { formatDefaultValueFunc } from '@/utils/format.js'
export default {
  name: 'FormDefaultValue',
  components: {
    CodeEditor
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    fullSetting: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      valueTypeGroups: [
        { label: '默认同名填值', name: 'isDefault', components: '' },
        { label: '关联数据', name: 'isPreset', components: '' }
      ],
      /* 预设数据可选项 */
      presetOptions: [
        {
          label: '缓存数据',
          value: 'localStorage',
          options: [
            { label: 'localStorage', value: 'localStorage', category: 'localStorage', meta: '请填写localStorage指定的name' }
          ]
        },
        {
          label: '时间类型',
          value: 'local',
          options: [
            { label: '当前日期', value: 'localDate' },
            { label: '当前时间', value: 'localTime' },
            { label: '当天', value: 'localDay' },
            { label: '隔天', value: 'localNextDay' },
            { label: '当月', value: 'localMonth' },
            { label: '当年', value: 'localYear' }
          ]
        },
        {
          label: '地址栏数据',
          value: 'router',
          meta: '请填写参数指定的名称和传参方式',
          options: [
            { label: '地址栏“/”后的取值', value: 'routerParams' },
            { label: '地址栏“?”后的取值', value: 'routerQuery' }
          ]
        },
        {
          label: '自定义',
          value: 'custom',
          options: [
            { label: '同表单数据自定义', value: 'customFunc' },
            { label: '关联字段', value: 'customChainsField' }
          ]
        }
      ],
      presetInputVal: {
        valueType: 'isDefault',
        presetType: '',
        // 本地缓存取值
        localStorage: '',
        // 时间类型
        localDate: '',
        localTime: '',
        localDay: '',
        localNextDay: '',
        localMonth: '',
        localYear: '',
        // 地址栏取值
        routerParams: '',
        routerQuery: '',
        // 自定义表单默认值方法
        customFunc: '',
        customChainsField: ''
        // customFuncPlaceholder: '\n return data[field.name]'
      }
    }
  },
  // filters: {
  //   filterPlaceholder (str) {
  //     const regexp = /\{[^}]+\}/g
  //     console.info(str)
  //     console.info(regexp.test(str))
  //     return str
  //   }
  // },
  computed: {
    settingValue: {
      get () {
        return this.presetInputVal
      },
      set (values) {
        this.presetInputVal = values
      }
    }
  },
  watch: {
    'fullSetting.name': {
      immediate: true,
      handler (name, oldName) {
        if (name !== oldName) {
          this.presetInputVal = this.value
        }
      }
    }
  },
  methods: {
    formatFuncByStr: debounce(function (str) {
      // console.info('formatFunByStr', str)
      this.settingValue.customFunc = function (data, fields, field) {
        // const ruleStr = `(data, fields, field) => {\n ${str} \n}`
        useEval(str, (func) => func(data, fields, field))
      }
    }, 800)
  },
  mounted () {
    this.presetInputVal = this.value
  }

}
</script>

<style lang='sass' scoped>

</style>
