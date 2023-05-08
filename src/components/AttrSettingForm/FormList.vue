<template lang='pug'>
table.list-options
  thead
    tr
      th(v-show="draggable")
      th(v-for="prop in columnProps") {{ prop.label }}
      //- th 选项文本
  //- 不支持拖拽
  tbody(v-if="!draggable")
    tr.drag-list(v-for="(item, index) in actList", :key="index")
      td(v-for="prop in columnProps", :key="prop.prop")
        slot(v-bind[prop.prop]="item", :name="prop.prop", :index="index", :data="item", :value="item[prop.prop]")
          //- el-input(v-model="item[prop.prop]", :placeholder="prop.placeholder")
          FormInputWithType(v-model="item[prop.prop]", :placeholder="prop.placeholder", v-bind="{...$attrs, ...prop}")
      td
        i.el-icon-minus.color-primary.btn-radius-50.btn-icon(:disabled="!removeAble",  @click="remove(item, index)")
      td(v-if="addAble && index === actList.length - 1")
        i.el-icon-plus.color-primary.btn-radius-50(@click="add")
  //- 允许拖拽
  Draggable(v-else, tag="tbody", :list="actList", class="list-group", handle=".handle", animation="150", :disabled="!draggable")
    tr.drag-list(v-for="(item, index) in actList")
      td
        i.el-icon-rank.handle
      td(v-for="prop in columnProps")
        slot(v-bind[prop.prop]="item")
          //- el-input(v-model="item[prop.prop]", :placeholder="prop.placeholder")
          FormInputWithType(v-model="item[prop.prop]", :placeholder="prop.placeholder", v-bind="{...$attrs, ...prop}")
      td
        i.el-icon-minus.color-primary.btn-radius-50.btn-icon(:disabled="!removeAble",  @click="remove(item, index)")
      td(v-if="addAble && index === actList.length - 1")
        i.el-icon-plus.color-primary.btn-radius-50(@click="add")
</template>

<script>
/**
 * 简单两列输入列表，支持配置拖拽
 * TODO 自定义列数 */
import Draggable from 'vuedraggable'
import FormInputWithType from './FormInputWithType.vue'
import { keyBy } from 'lodash'
export default {
  name: 'FormList',
  components: {
    Draggable,
    FormInputWithType
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    draggable: {
      type: Boolean,
      default: true
    },
    columnProps: {
      type: Array,
      default: () => {
        return [
          { label: '选项值', prop: 'value' },
          { label: '选项文本', prop: 'label' }
        ]
      }
    },
    // 列表最高行数
    maxLen: {
      type: Number
    },
    // 是否允许操作
    handlAble: {
      type: Boolean,
      default: true
    },
    // 列表数据新增时候的初始化
    initListDatafunc: Function
  },
  data () {
    return {
    }
  },
  computed: {
    actList: {
      get () {
        return this.value
      },
      set (data) {
        this.$emit('input', data)
      }
    },
    listPropValue () {
      return Object.keys(keyBy(this.columnProps, 'prop'))
    },
    addAble () {
      return this.handlAble && (this.maxLen ? this.actList.length < this.maxLen : true)
    },
    removeAble () {
      return this.handlAble && this.actList.length > 1
    }
  },
  watch: {
    value: {
      immediate: true,
      // deep: true,
      handler (len) {
        // console.info('form-list value:', len)
        if (!len || !len.length) {
          this.add()
        }
      }
    }
  },
  methods: {
    initPropValue () {
      return this.listPropValue.reduce((obj, name) => {
        return this.initListDatafunc && typeof this.initListDatafunc === 'function'
          ? this.initListDatafunc(obj, name)
          : (function () {
            obj[name] = ''
            return obj
          })()
      }, {})
    },
    add () {
      if (this.maxLen && this.actList.length > this.maxLen) return
      this.actList.push(this.initPropValue())
    },
    remove (ele, index) {
      if (this.actList.length) {
        this.$delete(this.actList, index)
      }
    }
  },
  mounted () {
    console.log('form-list数值获取', this.value)
  }
}
</script>

<style lang='sass' scoped>
.drag-list
  i:hover
    transform: scale(1.2)
  td
    ::v-deep input[type="color"]
      margin-top: 6px // 莫名比type="text"多出了6px
      // border: 0
      outline: none
      ::-webkit-color-swatch-wrapper
        background-color:#ffffff
      ::-webkit-color-swatch
        position: relative
</style>
