<template lang='pug'>
draggable.list-group.drag-page-container(
  :value="fieldList"
  group="form"
  animation="150"
  @add="handleWidgetAdd")
  //- div.list-group-item(v-for="item in rows",:key="item.id") {{item.name}}
  //- AnsoDataform(v-bind="formSetting", :formFields="fields", :buttonList="buttonList")
  transition-group.widget-form-list.h-100(name="fade", tag="div")
    //- WidgetForm.h-100(
    //-   ref="form"
    //-   key="widgetForm"
    //-   v-on="$listeners"
    //-   v-bind="$attrs"
    //-   :config="formConfig"
    //-   @add="handleWidgetAdd"
    //-   @remove="removeWidget"
    //-   @update="updateCanvas")
    //- 当前先做一个
    WidgetForm.h-100(
      ref="form"
      :key="canvasName"
      v-on="$listeners"
      v-bind="$attrs"
      :fields="fieldList"
      :added="newField"
      :formConfig="canvas"
      @add="handleWidgetAdd"
      @remove="removeWidget"
      @update="updateBody"
      @updateWidget="updateWidgetByTag")
    //- 可能多个表单
    //- el-form.form-designer_default()

</template>

<script>
/** 拖拽的面板页面，多个画布，通过复制这个组件生成 */
import draggable from 'vuedraggable'
import WidgetForm from '@/components/WidgetForm'
// import WidgetForm from '@/components/WidgetForm/V2'
// import { formItemTags } from '@/model/componentAttrs.js'
import { formatField } from '@/utils/format.js'
// import { mapGetters } from 'vuex'
export default {
  name: 'DragPage',
  components: {
    draggable,
    WidgetForm
  },
  // TODO 根据配置属性同步field.form配置
  props: {
    canvasName: {
      type: String,
      default: ''
    },
    actIndex: {
      type: [Number, String],
      default: 0
    },
    canvas: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      keyName: '',
      // formConfig: {},
      fieldList: [],
      // buttonList: [],
      // formItemTags,
      newField: {},
      formatField
    }
  },
  watch: {
    'canvas.body': {
      // deep: true,
      immediate: true,
      handler (fields) {
        // this.fieldList = Array.from(new Set(fields)) || []
        this.fieldList = fields || []
      }
    }
  },
  methods: {
    clear () {
      this.fieldList = []
      this.newField = {}
    },
    // TODO 改造对接配置的数据源
    checkFieldOption (tag) {},
    handleWidgetAdd (evt) {
      // console.info('add:', evt)
      // 针对Vuedragger的bug(拖拽后的对象非选中的对象)优化
      const tag = evt.clone?.dataset?.name
      // console.info('add-', tag)
      const newIndex = evt.newIndex
      const element = this.formatField({ tag: evt.clone?.dataset?.name })
      // console.info('element:', element)
      this.newField = tag ? {
        element,
        newIndex
      } : {}
      if (tag) {
        this.$store.commit('canvas/addWidget', {
          name: this.canvasName,
          eIndex: newIndex,
          element
          // elements: this.fieldList
        })
        this.$emit('onSelect', { type: 'component', data: element })
        this.$forceUpdate()
      }
    },
    removeWidget (ele, index) {
      // this.$delete(this.fieldList, index)
      this.$store.commit('canvas/deleteWidget', {
        name: this.canvasName,
        eIndex: index
      })
    },
    updateBody (list) {
      // console.log('update--', list)
      // this.fieldList = list
      this.$store.commit('canvas/updateHoldWidget', {
        name: this.canvasName,
        elements: list
      })
    },
    // 根据tag重新修改当前主录入组件
    updateWidgetByTag (tag, index) {
      console.log('updateWidgetByTag:', tag, index)
      const element = this.formatField({ tag })
      this.newField = { element, index }
      this.$store.commit('canvas/updateTheWidget', {
        name: this.canvasName,
        eIndex: index,
        attrs: element
        // elements: this.fieldList
      })
      this.$emit('onSelect', { type: 'component', data: element })
      this.$forceUpdate()
    }
  }
}
</script>

<style lang='sass' scoped>
// .canvas-panel
//   height: 100%
//   display: flex
//   flex-direction: column
  // background: #F5F5F5
.drag-page-container
  padding: 16px
  border: 1px solid $--border-color-base
  box-shadow: inset 0 2px 5px 1px $--border-color-base
  background: #fff
  flex: 1
  margin-top: 6px
  overflow-y: auto
</style>
