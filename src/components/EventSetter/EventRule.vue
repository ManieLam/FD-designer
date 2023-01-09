<template lang='pug'>
el-table.visabled-event-setting(
  :data="ruleData"
  row-key="_key"
  :border="true"
  style="width: 100%")
  el-table-column(
    prop="param"
    label="条件参数"
    width="180")
    template(slot="label")
      span 条件参数
      span.m-l-4
    template(slot-scope="scope")
      el-cascader(v-model="scope.row.param", :options="options.paramOptions", clearable, @change="changeInput($event, 'param', scope.$index)")
  el-table-column(
    prop="operation"
    label="运算符"
    width="180")
    template(slot-scope="scope")
      AnsoDataformSelect(v-model="scope.row.operation", :options="options.operationOptions", clearable, @change="changeInput($event, 'operation', scope.$index)")
  el-table-column(
    prop="threshold"
    label="阀值")
    template(slot-scope="scope")
      el-cascader.w-100(v-model="scope.row.threshold", :options="options.thresholdOptions", clearable, @change="changeInput($event, 'threshold', scope.$index)")
  el-table-column(label="操作", fixed="right", width="100")
    template(slot-scope="scope")
      .icon.el-icon-plus.m-r-8.cursor-pointer.hover-change-scale(:key="`add_${scope.$index}`", @click="addRule(scope)")
      .icon.el-icon-minus.cursor-pointer.hover-change-scale(:key="`remove_${scope.$index}`", @click="removeRule(scope)")
      .icon-warning.icon.el-icon-warning.color-danger.font-size-base.m-l-16(:is-illegal="scope.row|filterValidate(isPreSubmit)", title="请填写完整条件")
      //- 清空当前行
      //- .icon.el-icon-minus.cursor-pointer.hover-change-scale(:key="`clear_${scope.$index}`", @click="clearRowRule(scope)")
  el-table-column(slot="empty")
    div.noData
      el-button(:disabled="!attrs.eventName", @click="addRule") 新增执行规则
</template>

<script>
import ruleConfig from './ruleConfig'
import { debounce } from 'lodash'
const RuleAction = function () {
  return {
    param: '',
    operation: '',
    threshold: '',
    _key: new Date().getTime()
  }
}
export default {
  name: 'EventRule',
  props: {
    attrs: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      // ruleAttrs: [
      //   { label: '条件参数', name: 'param', component: 'el-cascader', options: 'paramOptions' },
      //   { label: '运算符', name: 'operation', component: 'el-select', options: 'operationOptions' },
      //   { label: '阀值', name: 'threshold', component: 'el-cascader' }
      // ],
      options: {
        paramOptions: ruleConfig.paramOptions,
        operationOptions: ruleConfig.operationOptions,
        thresholdOptions: ruleConfig.thresholdOptions
      },
      isPreSubmit: false
    }
  },
  filters: {
    filterValidate (r, isPreSubmit) {
      if (!isPreSubmit) return false
      return !r.operation || !r.param || !r.threshold
    }
  },
  computed: {
    ruleData: {
      get () {
        return this.value
      },
      set (list) {
        console.info('更新rule列表:', list)
        this.$emit('input', list)
      }
    }
  },
  methods: {
    changeInput: debounce(function (value, keyName, rowIndex) {
      // v-model="scope.row[keyName]"无法触发list值变化监听
      console.log('changeInput:', arguments)
      this.$emit('input', this.ruleData)
    }, 800),
    addRule (row) {
      const { $index } = row
      if ($index == null) {
        this.ruleData.push(new RuleAction())
      } else {
        this.ruleData.splice($index + 1, 0, new RuleAction())
      }
    },
    removeRule (row) {
      const { $index } = row
      this.$delete(this.ruleData, $index)
    },
    clearRule () {
      this.ruleData = []
    },
    validate () {
      this.isPreSubmit = true
      setTimeout(() => {
        this.isPreSubmit = false
      }, 3500)
      return this.ruleData.some(r => {
        return !r.operation || !r.param || !r.threshold
      })
    }
  }
}
</script>

<style scoped lang="sass">
.icon-warning
  vertical-align: middle
  display: none
  &[is-illegal]
    display: inline-block
</style>
