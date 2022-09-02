<template lang='pug'>
.widget-panel
  .panel-title.d-flex-row-between.align-items-center
    span  控件区
    el-button-group.tool-wrap
      el-button(v-bind="toolAttr", icon="el-icon-receiving", title="注册业务组件")
      el-button(
        v-bind="toolAttr"
        :icon="isCollapse? 'el-icon-s-unfold': 'el-icon-s-fold' "
        :title="isCollapse? '展开' : '收缩'" )
  draggable(
    v-model="rows"
    group="p"
    class="list-group")
    div.list-group-item(v-for="item in rows",:key="item.id") {{item.name}}
</template>

<script>
/** 控件区 */
import draggable from 'vuedraggable'
export default {
  name: 'WidgetPanel',
  components: {
    draggable
  },
  data () {
    return {
      toolAttr: {
        underline: false,
        size: 'mini'
      },
      isCollapse: false,
      widgets: [], // 分组、标题、模块、组件
      /* 假数据 */
      rows: [
        { name: 'Jesus', id: 1 },
        { name: 'Paul', id: 2 },
        { name: 'Peter', id: 3 }
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang='sass' scoped>
.panel-title
  margin-left: -8px
  margin-top: -8px
  margin-right: -8px
</style>
