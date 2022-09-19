<template lang='pug'>
.custom-list-container
  el-table.list-handMade.box-content__inside.p-b-8(
    :data="list"
    ref="table"
    style="width: 100%"
    row-key="__key"
    v-on="$listeners"
    @selection-change="handleSelectionChange")
    el-table-column(v-if="isSelection", type="selection", width="38", :selectable="selectAble")
    el-table-column(label="Key", prop="key", width="180")
      template(slot-scope="scope")
        el-input(
          v-if="editAble"
          :disabled="scope|disabledRow(editRowAble)"
          placeholder="Key"
          v-model.lazy="scope.row.key"
          @input="changeInput($event, 'key', scope.$index)")
          //- @input="changeInput($event, 'value', scope.$index)"
        .secondary-text(v-else) {{ scope.row.key }}
    el-table-column(label="Value", prop="value")
      template(slot-scope="scope")
        .column-item.d-flex-v-center(v-if="editAble")
          el-select(v-model="scope.row.varType", slot="prepend", style="min-width: 90px")
            el-option(v-for="opt in valueTypeOptions", :key="opt.value", v-bind="opt")
          el-input(
            v-show="!scope.row.varType || scope.row.varType==='const' || scope.row.varType === 'field'"
            v-model.lazy="scope.row.value"
            style="margin-top:1px"
            :disabled="scope|disabledRow(editRowAble)"
            :clearable="true"
            placeholder="Value"
            @input="changeInput($event, 'value', scope.$index)")
          el-select(
            v-show="scope.row.varType==='var'"
            v-model="scope.row.value"
            :disabled="scope|disabledRow(editRowAble)"
            no-data-text="暂无可选"
            :clearable="true"
            @input="changeInput($event, 'value', scope.$index)")
            el-option(v-for="varOpt in gbVariables", :key="varOpt.value", v-bind="varOpt")
        //- @input="changeInput($event, 'value', scope.$index)"
        .secondary-text(v-else) {{ scope.row.value }}
    el-table-column(label="operation", width="80")
      template(slot-scope="scope")
        .icon.el-icon-plus.m-r-8.cursor-pointer.hover-change-scale(@click="addItem(scope)")
        .icon.el-icon-minus.cursor-pointer.hover-change-scale(@click="removeItem(scope)")
        //- .secondary-text(v-else, :value="scope.row.Value")
</template>

<script>
import { isEmpty, debounce } from 'lodash'
/** 自定义列表组件 */
const ListItem = function (config) {
  return { key: '', value: '', varType: 'const', __key: new Date().getTime(), ...config }
}
export default {
  name: 'CustomList',
  props: {
    value: {
      type: Array,
      default: () => {
        return [new ListItem()]
      }
    },
    editAble: {
      type: Boolean,
      default: true
    },
    editRowAble: Function,
    isSelection: {
      type: Boolean,
      default: false
    },
    selectAble: Function
  },
  data () {
    return {
      valueTypeVal: 'const',
      valueTypeOptions: [
        { label: '定值', value: 'const' },
        { label: '字段', value: 'field' },
        { label: '数据字典', value: 'var' }
      ]
      // list: []
      // list: Array.from({ length: 10 }, (el, i) => { return `文本_${i + 1}` })
    }
  },
  filters: {
    disabledRow (scope, func) {
      return func && typeof func === 'function' ? func(scope) : false
    }
  },
  computed: {
    gbVariables () {
      return this.$gbImport.gbVariables || []
    },
    list () {
      return isEmpty(this.value) ? [new ListItem()] : this.value
    }
  },
  watch: {
    list (datas) {
      this.$nextTick(() => {
        datas.forEach(row => {
          this.$refs.table.toggleRowSelection(row, true)
        })
      })
    }
  //   'list.length': {
  //     handler (datas) {
  //       // console.info('list is change--', datas)
  //       // debounce(() => this.$emit('input', datas), 800)
  //       this.$refs.table.toggleRowSelection('')
  //     }
  //   }
  },
  methods: {
    changeInput: debounce(function (value, keyName, rowIndex) {
      // v-model="scope.row[keyName]"无法触发list值变化监听
      this.$emit('input', this.list)
    }, 800),
    handleSelectionChange (selection) {
      // console.info('handleSelectionChange:', arguments)
      // this.$emit('change')
    },
    removeItem (row) {
      const { $index } = row
      this.$delete(this.list, $index)
    },
    addItem (row) {
      const { $index } = row
      this.list.splice($index + 1, 0, new ListItem())
    }
  }
}
</script>

<style lang='sass' scoped>
.list-table
  thead
    line-height: 1.2
  th
    color: $--color-text-regular
</style>
