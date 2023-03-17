<template lang='pug'>
.widget-panel.d-flex-column.h-100
  .panel-title.d-flex-row-between.align-items-center
    span  控件区
    el-button-group.tool-wrap
      el-button(v-bind="toolAttr", icon="el-icon-receiving", title="注册业务组件")
      el-button(
        v-bind="toolAttr"
        :title="isCollapse? '展开' : '收缩'", :icon="isCollapse? 'el-icon-s-unfold' : 'el-icon-s-fold'"
        @click="$emit('collapse', isCollapse)")
      //- el-button(v-bind="toolAttr", title="移除", icon="el-icon-delete")
  .panel-content
    draggable.drag-delete-block.widgetPenal(v-if="isMoving", group="form", key="delete")
      .delete-content
        i.el-icon-delete
    .content-block(v-for="widget in widgetGroups", :key="widget.name")
      .title {{widget.label}}
      draggable(
        class="list-group widgetPenal"
        v-model="widget.components"
        :data-name="widget.name"
        :key="widget.name"
        :group="{ name: 'form', pull: 'clone', put: false }"
        :move="checkMove"
        @start="onStart"
        @end="onEnd")
        .list-empty.secondary-text(v-if="!widget.components?.length") -- 暂无控件 --
        .list-group-item(v-for="(item, index) in widget.components", :key="index", :data-name="item.name", :disabled="item.name|noConfig") {{item.name}}
</template>

<script>
/** 控件区 */
import draggable from 'vuedraggable'
import componentAttrs, { formItemTags } from '@/model/componentAttrs'
import { throttle } from 'lodash'
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
      isMoving: false,
      widgetGroups: this.$Widget, // 分组、标题、模块、组件
      /* 假数据 */
      rows: [
        { name: 'Jesus', id: 1, key: 1 },
        { name: 'Paul', id: 2, key: 2 },
        { name: 'Peter', id: 3, key: 3 }
      ]
    }
  },
  filters: {
    noConfig (compTag) {
      const htmlTag = formItemTags[compTag]
      return !Object.hasOwn(componentAttrs, htmlTag)
    }
  },
  methods: {
    checkMove: throttle(function (evt) {
      const { to } = evt
      // console.log('evt:', evt)
      const classList = Array.from(to.classList)
      // 允许拖拽停放的范围
      const isDragPage = classList?.some(name => ['widget-form-list', 'form-item-drag'].includes(name))
      // console.log('可以拖拽过去:', isDragPage)
      // if (isDragPage) {
      //   // draggedContext.element 对象总是实际拖拽的对象下一个
      //   // console.info('from:', draggedContext)
      //   // console.info('to:', relatedContext)
      // 用@/views/DragPage中的@add替代
      //   // this.$emit('onDragged', { from: draggedContext.element, to: relatedContext })
      // }
      // 控制只允许拖拽到中间面板
      return isDragPage
    }, 1200),
    change (log) {
      console.info('change:', log)
    },
    onStart () {
      this.isMoving = true
    },
    onEnd () {
      this.isMoving = false
    }
  }
}
</script>

<style lang='sass' scoped>
.panel-content
  overflow-y: auto
  flex: 1
  position: relative
  // .drag-delete-block[show="true"]
  //   display: block
.drag-delete-block
  // display: none
  background: rgba(245, 115, 117, 0.4)
  position: absolute
  left: 0
  top: 0
  height: 100%
  width: 100%
  .delete-content
    position: absolute
    top: 50%
    left: 50%
    transform: translate3d(-50%, -50%, 0px)
    font-size: 30px
    color: #000
.panel-title
  margin-left: -8px
  margin-top: -8px
  margin-right: -8px

.content-block
  // position: relative
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
  &[disabled]
    pointer-events: none
    background: $--button-disabled-background-color
    color: $--button-disabled-font-color

.widgetPanel
  // position: relative

</style>
