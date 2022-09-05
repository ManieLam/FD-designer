<template lang='pug'>
.widget-panel
  .panel-title.d-flex-row-between.align-items-center
    span  控件区
    el-button-group.tool-wrap
      el-button(v-bind="toolAttr", icon="el-icon-receiving", title="注册业务组件")
      el-button(
        v-bind="toolAttr"
        :title="isCollapse? '展开' : '收缩'"
        :icon="isCollapse? 'el-icon-s-unfold': 'el-icon-s-fold'")
  .panel-content
    .content-block(v-for="widget in widgetGroups", :key="widget.name")
      .title {{widget.label}}
      draggable(
        v-model="widget.components"
        group="p"
        class="list-group"
        :move="checkMove")
        .list-empty.secondary-text(v-if="!widget.components?.length") -- 暂无控件 --
        .list-group-item(v-for="item in widget.components", :key="item.name") {{item.name}}
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
    console.info(this.$Widget)
    return {
      toolAttr: {
        underline: false,
        size: 'mini'
      },
      isCollapse: false,
      widgetGroups: this.$Widget, // 分组、标题、模块、组件
      /* 假数据 */
      rows: [
        { name: 'Jesus', id: 1 },
        { name: 'Paul', id: 2 },
        { name: 'Peter', id: 3 }
      ]
    }
  },
  methods: {
    checkMove (evt) {
      console.info(evt)
      const { relatedContext, draggedContext } = evt
      console.log('1--', draggedContext.element)
      console.log('2--', relatedContext)
    }
  }
}
</script>

<style lang='sass' scoped>
.panel-title
  margin-left: -8px
  margin-top: -8px
  margin-right: -8px

.content-block
  .title
    margin-bottom: 4px
  & + .content-block
    margin-top: 16px
</style>
