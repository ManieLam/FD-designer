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
        slot(v-bind[prop.prop]="item")
          el-input(v-model="item[prop.prop]", :placeholder="prop.placeholder")
      td
        i.el-icon-minus.color-primary.btn-radius-50(:disabled="actList.length===1",  @click="remove(item, index)")
      td(v-if="index === actList.length - 1")
        i.el-icon-plus.color-primary.btn-radius-50(@click="add")
  //- 允许拖拽
  Draggable(v-else, tag="tbody", :list="actList", class="list-group", handle=".handle", animation="150", :disabled="!draggable")
    tr.drag-list(v-for="(item, index) in actList")
      td
        i.el-icon-rank.handle
      td(v-for="prop in columnProps")
        slot(v-bind[prop.prop]="item")
          el-input(v-model="item[prop.prop]", :placeholder="prop.placeholder")
      td
        i.el-icon-minus.color-primary.btn-radius-50(:disabled="actList.length===1",  @click="remove(item, index)")
      td(v-if="index === actList.length - 1")
        i.el-icon-plus.color-primary.btn-radius-50(@click="add")
</template>

<script>
/**
 * 简单两列输入列表，支持配置拖拽
 * TODO 自定义列数 */
import Draggable from 'vuedraggable'
import { keyBy } from 'lodash'
export default {
  name: 'FormList',
  components: {
    Draggable
  },
  // model: {
  //   prop: 'list',
  //   event: 'input'
  // },
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
    }
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
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (len) {
        if (!len || !len.length) {
          this.add()
        }
      }
    }
  },
  methods: {
    initPropValue () {
      return this.listPropValue.reduce((obj, name) => {
        obj[name] = ''
        return obj
      }, {})
    },
    add () {
      this.actList.push(this.initPropValue())
    },
    remove (ele, index) {
      if (this.actList.length) {
        this.$delete(this.actList, index)
      }
    }
  // },
  // mounted () {
  //   if (!this.list || !this.list.length) this.add()
  }
}
</script>

<style lang='sass' scoped>

</style>
