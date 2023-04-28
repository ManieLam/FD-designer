<template lang='pug'>
.form-date-pickerOptions.box-content__inside
  .row
    //- .secondary-text 限制可选范围
    //- 限制今日之前, 限制今日之后, 限制xx日期(日期范围\日\月\周\年)之前/后
    .picker-option__disabledDate
      //- 最小值/最大值/最小跨度/最大跨度
      .row-item
        label.secondary-text 最小值
          i.btn-icon.m-l-4.text-right.el-icon-delete(title="清除", @click="currentValue.min = []")
        #disabled_min_date.row-item-ceil.d-flex-column.d-flex-v-center
          AnsoDataformSelect.select.m-r-4.d-flex-1(
            style="min-width: 100px"
            v-model="currentValue.min[0]"
            placeholder="xx日期(日期范围/日/月/周/年)"
            :options="daterangeOptions")
          el-input.input.d-flex-1(v-model.number="currentValue.min[2]", placeholder="跨度")
            template(slot="prepend")
              el-select(v-model="currentValue.min[1]", v-bind="dateSelectorAttrs")
                el-option(v-for="operation in operaOptions", :key="operation.value", v-bind="operation")
            template(slot="append") 天

      .row-item
        label.secondary-text 最大值
          i.btn-icon.m-l-4.text-right.el-icon-delete(title="清除", @click="currentValue.max = []")
        #disabled_max_date.row-item-ceil.d-flex-column.d-flex-v-center
          AnsoDataformSelect.select.m-r-4.d-flex-1(
            style="min-width: 100px"
            v-model="currentValue.max[0]"
            placeholder="xx日期(日期范围/日/月/周/年)"
            :options="daterangeOptions")
          el-input.input.d-flex-1(v-model.number="currentValue.max[2]", placeholder="跨度")
            template(slot="prepend")
              el-select(v-model="currentValue.max[1]", v-bind="dateSelectorAttrs")
                el-option(v-for="operation in operaOptions", :key="operation.value", v-bind="operation")
            template(slot="append") 天

      //- .row-item.d-flex-row-between
      //-   label.secondary-text 跨度
      //-   AnsoDataformSelect.select.m-r-4#min-disabled(v-model="disabledDate.limitDate", placeholder="xx日期(日期范围/日/月/周/年)", :options="daterangeOptions")

      //- .row-item.d-flex-row-between
      //-   label.secondary-text 最大跨度
      //-   AnsoDataformSelect.select.m-r-4#min-disabled(v-model="disabledDate.limitDate", placeholder="xx日期(日期范围/日/月/周/年)", :options="daterangeOptions")
      //- span.m-r-4 限制 “
      //- AnsoDataformSelect.select.m-r-4(v-model="disabledDate.limitDate", placeholder="xx日期(日期范围/日/月/周/年)", :options="daterangeOptions")
      //- el-input(v-if="disabledDate.limitDate === '2'", v-model="disabledDate.daterangeVal")
      //- AnsoDataformSelect.select.m-r-4(v-model="disabledDate.operation", placeholder="请选择", :options="disabledDateOperation")
      //- span ” 不可选择
  .row
</template>

<script>
/** 日期选择配置器
 * 限制可选范围：
 *  1.限制xx日期(日期范围\日\月\周\年)之前/后/当天/前n天/后n天，不可选
 *  2.限制只能选择某个范围内
 *  3.限制不能超过/小于某个日期（字段的动态选值）
 */
export default {
  name: 'FormDateDisabledDate',
  props: {
    // 当前配置值
    value: {
      type: Object,
      default: () => {
        return {
          min: [],
          max: []
        }
      }
    },
    // 字段的全部设置内容
    fullSetting: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      disabledDate: {
        min: [], // 最小值
        max: [] // 最大值
        // operation: '' // 在...之前/之前(含今日)/之后/之后(含今日)
      },
      dateSelectorAttrs: {
        placeholder: '增/减',
        clearable: true,
        style: { width: '80px' }
      },
      daterangeOptions: [
        { label: '当日', value: 'localDay', format: Date.now() - 8.64e7 },
        // { label: '当周', value: '2', format: Date.now() - 8.64e7 },
        { label: '当月', value: 'localMonth', format: new Date().getMonth() + 1 },
        { label: '当年', value: 'localYear', format: new Date().getFullYear() }
      ],
      // 最小值、最大值、最小跨度、最大跨度
      // disabledDateOperation: [
      //   { label: '之前', value: '<' },
      //   { label: '之前(含当日)', value: '<=' },
      //   { label: '之后', value: '>' },
      //   { label: '之后(含当日)', value: '>=' }
      // ],
      operaOptions: [
        { label: '+', value: 'add' },
        { label: '-', value: 'sub' }
      ]
    }
  },
  computed: {
    currentValue: {
      get () {
        return this.disabledDate
      },
      set (value) {
        this.disabledDate = value
        this.$emit('input', value)
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.currentValue = val
      }
    }
  },
  methods: {},
  mounted () {}
}
</script>

<style scoped lang=sass>
.picker-option__disabledDate
  text-index: 10px
  // .select
  //   width: 35%

.row-item
  + .row-item
  margin-top: 4px
.row-item-ceil
  display: flex
  padding-left: 10px
  > .select
    // flex: 1
    width: 100%
    margin-bottom: 4px
</style>
