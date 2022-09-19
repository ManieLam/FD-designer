<template lang='pug'>
.form-option-container
  //- ul.list-wrap
  //-   li(v-for="item in list",:key="item.value", :value="item.value") {{item.label}}
  .radio-list.m-b-8
    el-radio-group(v-model="optionType", @change="toggleOptionType")
      el-radio-button(v-for="radio in optionTypes", :key="radio.value", :label="radio.value", :disabled="radio.disabled") {{radio.label}}
  table.list-options.box-content__inside(v-if="optionType === 'options'")
    thead
      tr
        th
        th 选项值
        th 选项文本
    Draggable(tag="tbody", :list="list", class="list-group", handle=".handle", animation="150")
      tr.drag-list(v-for="(item, index) in list")
        td
          i.el-icon-rank.handle
        td
          el-input(v-model="item.value")
        td
          el-input(v-model="item.label")
        td
          i.el-icon-minus.color-primary.btn-radius-50(:disabled="list.length===1",  @click="remove(item, index)")
        td(v-if="index === list.length - 1")
          i.el-icon-plus.color-primary.btn-radius-50(@click="add")
  .list-async.box-content__inside(v-if="optionType === 'optionsAsyncFunc'")
    el-button(@click="setAsyncVisible = !setAsyncVisible") {{ asyncFunc.name ? '重新选择数据源' : '配置数据源' }}
    .list-column__default.m-t-4(v-show="asyncFunc.name")
      .left-wrap
        .d-flex-v-center
          i.el-icon-check.color-primary.m-r-8
          .color-warning {{asyncFunc.method}}
          .secondary-text.m-l-8 {{asyncFunc.url}}
        .color-text-secondary.font-size-small.m-l-8 {{ asyncFunc.demo || ''}}
      .right-wrap
    AsyncRequired(title="配置选项动态数据源", v-model="setAsyncVisible", :chosenData="asyncFunc", @chosen="getAsyncSeting")
</template>

<script>
import Draggable from 'vuedraggable'
import AsyncRequired from './AsyncRequired.vue'
/** 自定义列表组件
 * 遇到`xxxAsyncFunc`的命名，就使用异步请求方法，执行是在运行表单时候运行，即在业务方使用
 */
export default {
  name: 'FormOption',
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    fullSetting: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    Draggable,
    AsyncRequired
  },
  data () {
    return {
      optionType: this.fullSetting.optionType || 'options',
      optionTypes: [
        // 以取值命名value，方便数据同时存在options/optionsAsyncFunc后
        { label: '手动添加', value: 'options' },
        { label: '动态数据', value: 'optionsAsyncFunc' },
        { label: '批量导入', value: 'optionsImport', disabled: true }
      ],
      setAsyncVisible: false
      // asyncFunc: {}
      // list: []
      // list: Array.from({ length: 10 }, (el, i) => { return `文本_${i + 1}` })
    }
  },
  watch: {
    'fullSetting.optionType' (type) {
      this.optionType = type || this.optionTypes[0]
    }
  },
  computed: {
    list: {
      get () {
        return this.value || [{ label: '选项1', value: 1 }]
      },
      set (data) {
        this.$emit('input', data)
      }
    },
    asyncFunc: {
      get () {
        return this.fullSetting.optionsAsyncFunc || {}
      },
      set (data) {
        this.$emit('updateAnAttr', { name: 'optionsAsyncFunc', value: data })
      }
    }
  },
  methods: {
    getAsyncSeting (data) {
      this.asyncFunc = data
    },
    toggleOptionType (type) {
      this.$emit('updateAnAttr', { name: 'optionType', value: type })
    },
    add () {
      this.list.push({ label: '', value: '' })
    },
    remove (ele, index) {
      if (this.list.length) {
        this.$delete(this.list, index)
      }
    }
  }
}
</script>

<style lang='sass' scoped>
.list-options
  thead
    line-height: 1.2
  th
    color: $--color-text-regular
  .drag-list
    // &:hover
    //   border: 1px solid
.handle
  float: left
  padding-top: 8px
  padding-bottom: 8px
  cursor: move

.btn-radius-50[disabled]
  background: #ddd
  color: $--color-text-placeholder !important
  pointer-events: none
</style>
