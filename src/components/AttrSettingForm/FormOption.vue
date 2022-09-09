<template lang='pug'>
.form-option-container
  //- ul.list-wrap
  //-   li(v-for="item in list",:key="item.value", :value="item.value") {{item.label}}
  .radio-list.m-b-8
    el-radio-group(v-model="optionType")
      el-radio-button(v-for="radio in optionTypes", :key="radio.value", :label="radio.value", :disabled="radio.disabled") {{radio.label}}
  table.list-handMade.box-content__inside(v-if="optionType === 'handMade'")
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
  .list-async.box-content__inside(v-if="optionType === 'async'")
    AsyncRequired
</template>

<script>
import Draggable from 'vuedraggable'
import AsyncRequired from './AsyncRequired.vue'
/** 自定义列表组件 */
export default {
  name: 'FormOption',
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    Draggable,
    AsyncRequired
  },
  data () {
    return {
      optionType: 'handMade',
      optionTypes: [
        { label: '手动添加', value: 'handMade' },
        { label: '动态数据', value: 'async' },
        { label: '批量导入', value: 'import', disabled: true }
      ]
      // list: []
      // list: Array.from({ length: 10 }, (el, i) => { return `文本_${i + 1}` })
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
    }
  },
  methods: {
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
.list-handMade
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
