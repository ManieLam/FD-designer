<template lang='pug'>
.custom-list-container
  el-table.list-handMade.box-content__inside.p-b-8(
    :data="list"
    :key="keyName"
    ref="table"
    style="width: 100%"
    row-key="__key"
    v-on="$listeners"
    @selection-change="handleSelectionChange")
    el-table-column(label="参数key", prop="key", width="180")
      template(slot-scope="scope")
        .edit-input(v-if="editAble")
          slot(v-bind.column-name="scope")
            el-input(
              :disabled="scope|disabledRow(disableEditFunc)"
              placeholder="Key"
              v-model.lazy="scope.row.key"
              @input="changeInput($event, 'key', scope.$index)")
        .secondary-text(v-else) {{ scope.row.key }}
    el-table-column(label="取值范围 + 数值key", prop="value")
      template(slot-scope="scope")
        .column-item.d-flex-v-center.p-l-8.p-r-8(v-if="editAble")
          slot(v-bind.column-value="scope")
            el-cascader.d-flex-1(
              v-model="scope.row.varType"
              slot="prepend"
              style="min-width: 90px"
              :show-all-levels="false"
              :options="valueTypeOptions")
              //- el-option(v-for="opt in valueTypeOptions", :key="opt.value", v-bind="opt")
            //- components(
            //-   v-if="varTags[scope.row.varType].tag"
            //-   v-model.lazy="scope.row.value"
            //-   :is="varTags[scope.row.varType].tag"
            //-   :clearable="true"
            //-   style="margin-top: 1px;"
            //-   placeholder="请输入数值的key"
            //-   @input="changeInput($event, 'value', scope.$index)")
            el-input.d-flex-1(
              v-model.lazy="scope.row.value"
              style="margin-top:1px"
              :disabled="scope|disabledRow(disableEditFunc)"
              :clearable="true"
              placeholder="请输入数值的key"
              @input="changeInput($event, 'value', scope.$index)")
            //- el-select(
            //-   v-show="scope.row.varType==='var'"
            //-   v-model="scope.row.value"
            //-   :disabled="scope|disabledRow(disableEditFunc)"
            //-   no-data-text="暂无可选"
            //-   :clearable="true"
            //-   @input="changeInput($event, 'value', scope.$index)")
            //-   el-option(v-for="varOpt in gbVariables", :key="varOpt.value", v-bind="varOpt")
          //- @input="changeInput($event, 'value', scope.$index)"
        .secondary-text(v-else) {{ scope.row.value }}
    slot(name="custom-columns")
    el-table-column(v-if="operateAble", label="操作", width="80")
      template(slot-scope="scope")
        .icon.el-icon-plus.m-r-8.cursor-pointer.hover-change-scale(:key="`add_${scope.$index}`", @click="addItem(scope)")
        .icon.el-icon-minus.cursor-pointer.hover-change-scale(:key="`remove_${scope.$index}`", @click="removeItem(scope)")
        //- .secondary-text(v-else, :value="scope.row.Value")
</template>

<script>
import { isEmpty, debounce, keyBy } from 'lodash'
import { ApiBodyParams } from '@/model/resource'
/** 自定义列表组件 */
export default {
  name: 'ParamsList',
  props: {
    value: {
      type: Array,
      default: () => {
        return [new ApiBodyParams()]
      }
    },
    editAble: {
      type: Boolean,
      default: true
    },
    disableEditFunc: Function,
    operateAble: {
      type: Boolean,
      default: true
    }, // 是否允许操作
    keyName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      valueTypeOptions: [
        { label: '定值', value: 'const', tag: 'el-input' },
        { label: '表单录入数据', value: 'formData', tag: 'el-input' },
        { label: '指定数据源', value: 'collectData', tag: 'el-input' },
        { label: '路由数据', value: 'router', tag: 'el-input' },
        { label: '本地缓存', value: 'localstorage', tag: 'el-input' }
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
      return isEmpty(this.value) ? [new ApiBodyParams()] : this.value
    },
    varTags () {
      return keyBy(this.valueTypeOptions, 'value')
    },
    listLen () {
      return this.list?.length
    },
    formDataCollect () {
      return this.$store.getters.formDataCollect
    }
  },
  watch: {
    formDataCollect: {
      immediate: true,
      // deep: true,
      handler (collects) {
        // console.info('获取到的数据集', collects, this.valueTypeOptions)
        this.valueTypeOptions[2].children = collects || []
      }
    }
    // list: {
    //   deep: true,
    //   immediate: true,
    //   handler (datas) {
    //     this.$nextTick(() => {
    //       datas.forEach(row => {
    //         this.$refs.table.toggleRowSelection(row, row.usable)
    //       })
    //     })
    //   }
    // }
  },
  methods: {
    changeInput: debounce(function (value, keyName, rowIndex) {
      // v-model="scope.row[keyName]"无法触发list值变化监听
      this.$emit('input', this.list)
    }, 800),
    handleSelectionChange (selection) {
      console.info('handleSelectionChange:', arguments)
      // this.$emit('change')
    },
    removeItem (row) {
      const { $index } = row
      this.$delete(this.list, $index)
      if (this.list.length === 0) {
        this.$emit('onClearAll')
      }
    },
    addItem (row) {
      const { $index } = row
      this.list.splice($index + 1, 0, new ApiBodyParams())
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
.icon.el-icon-minus[hidden]
  display: none
</style>
