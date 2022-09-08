<template lang='pug'>
.widget-panel.d-flex-column.h-100
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
        class="list-group dragArea"
        v-model="widget.components"
        :data-name="widget.name"
        :key="widget.name"
        :group="{ name: 'form', pull: 'clone', put: false }"
        :move="checkMove")
        .list-empty.secondary-text(v-if="!widget.components?.length") -- 暂无控件 --
        .list-group-item(v-for="(item, index) in widget.components", :key="index", :data-name="item.name") {{item.name}}
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
      widgetGroups: this.$Widget, // 分组、标题、模块、组件
      /* 假数据 */
      rows: [
        { name: 'Jesus', id: 1, key: 1 },
        { name: 'Paul', id: 2, key: 2 },
        { name: 'Peter', id: 3, key: 3 }
      ]
    }
  },
  methods: {
    checkMove (evt) {
      const { to } = evt

      const isDragPage = Array.from(to.classList)?.includes('widget-form-list')

      if (isDragPage) {
        // draggedContext.element 对象总是实际拖拽的对象下一个
        // console.info('from:', draggedContext)
        // console.info('to:', relatedContext)
        // this.$emit('onDragged', { from: draggedContext.element, to: relatedContext })
      }
      // 控制只允许拖拽到中间面板
      return isDragPage
    },
    change (log) {
      console.info('change:', log)
    }
  }
}
</script>

<style lang='sass' scoped>
.panel-content
  overflow-y: auto
  flex: 1
.panel-title
  margin-left: -8px
  margin-top: -8px
  margin-right: -8px

.content-block
  .title
    margin-bottom: 4px
  & + .content-block
    margin-top: 16px

.list-group-item
  color: #2c3e50
  text-indent: 8px
  cursor: move
  padding-top: 4px
  padding-bottom: 4px
  line-height: 1.8
  & + .list-group-item
    border-top: 1px solid #f5f5f5
  &:hover
    background: $--bgcolor-secondary
</style>
