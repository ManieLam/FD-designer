<template lang='pug'>
.canvas-panel
  .tool-panel.d-flex-row-between
    el-button-group.tool-wrap__left
      el-button() 切换画布
      el-button() 查看配置文件
    el-button-group.tool-wrap__right
      el-button() 导出
      el-button(@click="clear") 清空
      el-button() 预览
      el-button(type="primary", @click="save") 保存
  draggable.list-group.drag-page-container(
    :value="fieldList"
    group="form"
    animation="150"
    @add="handleWidgetAdd")
    //- div.list-group-item(v-for="item in rows",:key="item.id") {{item.name}}
    //- AnsoDataform(v-bind="formSetting", :formFields="fields", :buttonList="buttonList")
    transition-group.widget-form-list.h-100(name="fade", tag="div")
      //- 当前先做一个
      WidgetForm.h-100(
        ref="form"
        :fields="fieldList"
        :added="newField"
        key="widgetForm"
        v-on="$listeners"
        v-bind="$attrs"
        @remove="removeWidget")
      //- 可能多个表单
      //- el-form.form-designer_default()

</template>

<script>
/** 拖拽的面板页面，多个画布，通过复制这个组件生成 */
import draggable from 'vuedraggable'
import WidgetForm from '@/components/WidgetForm'
// import { mapGetters } from 'vuex'

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
      // formSetting: {},
      fieldList: [],
      formItemTags: {
        AnsoDataformText: 'text',
        AnsoDataformInput: 'input',
        AnsoDataformTextRange: 'textRange',
        AnsoDataformNumber: 'number',
        AnsoDataformNumRange: 'numberRange',
        AnsoDataformSelect: 'select',
        AnsoDataformSwitch: 'switch',
        AnsoDataformSlider: 'slider',
        AnsoDataformCheckbox: 'checkbox',
        AnsoDataformRadio: 'radio',
        AnsoDataformCascader: 'cascader',
        AnsoDataformTime: 'time',
        AnsoDataformTimeRange: 'timeRange',
        AnsoDataformDate: 'date',
        AnsoDataformUpload: 'file',
        // AnsoDataformIcon: 'icon',
        InfoRender: 'render',
        AnsoButtonGroup: 'button',
        AnsoLink: 'link',
        AnsoDataformTransfer: 'transfer',
        AnsoDataformTree: 'tree'
      },
      newField: {},
      // 画布配置
      canvasIndex: 0
    }
  },
  // computed: {
  //   fieldList () {
  //     // return this.$store.getters.canvasViews
  //     console.info('this.$store.getters；', this.$store.getters.getCanvasView)
  //     return this.$store.getters.getCanvasView(`canvas_${this.canvasIndex}`)
  //   }
  //   // ...mapGetters({
  //   //   fieldList: getCanvasView(`canvas_${this.canvasIndex}`)
  //   // })
  // },
  methods: {
    clear () {
      this.fieldList = []
      this.newField = {}
      this.$store.commit('canvas/clear', `canvas_${this.canvasIndex}`)
    },
    save () {},
    formatField ({ tag }) {
      if (!tag) return {}
      return {
        name: `${tag}_${new Date().getTime()}`,
        compTag: tag,
        label: '自定义字段',
        form: {
          tag: this.formItemTags[tag]
        }
      }
    },
    handleWidgetAdd (evt) {
      // 针对Vuedragger的bug(拖拽后的对象非选中的对象)优化
      const tag = evt.clone?.dataset?.name
      // console.info('add-', tag)
      const newIndex = evt.newIndex
      const element = this.formatField({ tag: evt.clone?.dataset?.name })
      this.newField = tag ? {
        element,
        newIndex
      } : {}
      if (tag) {
        this.fieldList.splice(newIndex, 0, element)

        this.$store.commit('canvas/add', {
          name: `canvas_${this.canvasIndex}`,
          eIndex: newIndex,
          element
          // elements: this.fieldList
        })
        // console.info('vuex:', this.$store.state.canvas)

        this.$emit('onSelect', element)
      }
    },
    removeWidget (ele, index) {
      this.$delete(this.fieldList, index)
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
