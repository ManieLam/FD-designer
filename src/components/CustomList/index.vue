<template lang='pug'>
.custom-list-container
  el-table.list-handMade.box-content__inside.p-b-8(
    :data="list"
    ref="table"
    style="width: 100%"
    row-key="__key"
    v-on="$listeners"
    @selection-change="handleSelectionChange")
    el-table-column(v-if="isSelection", type="selection", width="55", :selectable="selectAble")
    el-table-column(label="Key", prop="key")
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
        el-input(v-if="editAble"
        :disabled="scope|disabledRow(editRowAble)"
        placeholder="Value"
        v-model.lazy="scope.row.value"
        @input="changeInput($event, 'value', scope.$index)")
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
  return { key: '', value: '', __key: new Date().getTime(), ...config }
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
      default: false
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
    list () {
      return isEmpty(this.value) ? [new ListItem()] : this.value
    }
  },
  // watch: {
  //   'list.length': {
  //     handler (datas) {
  //       // console.info('list is change--', datas)
  //       // debounce(() => this.$emit('input', datas), 800)
  //       this.$refs.table.toggleRowSelection('')
  //     }
  //   }
  // },
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
      this.$nextTick(() => {
        this.$refs.table.toggleRowSelection(this.list[$index + 1])
      })
    }
  },
  updated () {
    this.$nextTick(() => {
      this.list.forEach(row => {
        this.$refs.table.toggleRowSelection(row)
      })
    })
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
