<template lang='pug'>
.canvas-panel
  .tool-panel.d-flex-row-between
    el-button-group.tool-wrap__left
      el-button() 切换画布
    el-button-group.tool-wrap__right
      el-button() 导出
      el-button(@click="clear") 清空
      el-button() 预览
      el-button(type="primary") 保存
  draggable.list-group.drag-page-container(
    v-model="fieldVMs"
    group="p"
    name="dragPage"
    @change="change")
    //- div.list-group-item(v-for="item in rows",:key="item.id") {{item.name}}
    //- AnsoDataform(v-bind="formSetting", :formFields="fields", :buttonList="buttonList")
    transition-group(name="fade", tag="div", class="widget-form-list")
      //- 当前先做一个
      WidgetForm(ref="form", :fullField="fieldVMs", :added="newField", key="widgetForm")
      //- 可能多个表单
      //- el-form.form-designer_default()

</template>

<script>
/** 拖拽的面板页面，多个画布，通过复制这个组件生成 */
import draggable from 'vuedraggable'
import WidgetForm from '@/components/WidgetForm'
export default {
  name: 'DragPage',
  components: {
    draggable,
    WidgetForm
  },
  props: {
    setting: {}
  },
  data () {
    return {
      keyName: '',
      formSetting: {
      },
      fieldVMs: [],
      newField: {}
    }
  },
  methods: {
    clear () {
      this.fieldVMs = []
      this.newField = {}
    },
    change (log) {
      this.newField = log.added
    }
  }
}
</script>

<style lang='sass' scoped>
.canvas-panel
  height: 100%
  display: flex
  flex-direction: column

  // background: #F5F5F5
  .drag-page-container
    padding: 16px
    border: 1px solid $--border-color-base
    box-shadow: 0 2px 5px 1px $--border-color-base
    background: #fff
    flex: 1
    margin-top: 6px
</style>
