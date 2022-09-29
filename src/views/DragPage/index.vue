<template lang='pug'>
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
      key="widgetForm"
      v-on="$listeners"
      v-bind="$attrs"
      :fields="fieldList"
      :added="newField"
      :formConfig="formConfig"
      @remove="removeWidget"
      @update="updateCanvas")
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
  // TODO 根据配置属性同步field.form配置
  props: {
    // formConfig:,
    // formItemConfig,
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
      newField: {}
    }
  },
  computed: {
    formConfig () {
      return this.canvas?.form || {}
    }
  },
  watch: {
    'canvas.fields': {
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
    // 判断类型是否为枚举，默认添加options属性
    checkEnumerated (tag) {
      if (tag === 'switch') {
        return [{ label: '是', value: true }, { label: '否', value: false }]
      }
      return ['select', 'checkbox', 'radio', 'cascader', 'tree'].includes(tag) ? this.$defValue?.defaultOptions : null
    },
    formatField ({ tag }) {
      if (!tag) return {}
      const htmlTag = this.formItemTags[tag]
      return {
        name: `${tag}_${new Date().getTime()}`,
        key: `${tag}_${new Date().getTime()}`,
        compTag: tag,
        label: '自定义字段',
        tag: htmlTag,
        options: this.checkEnumerated(htmlTag),
        ...(this.$defValue?.[htmlTag] || {})
        // form: {
        // }
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
        // this.fieldList.splice(newIndex, 0, element)
        console.info('add fields')
        this.$store.commit('canvas/add', {
          name: this.canvasName,
          eIndex: newIndex,
          element
          // elements: this.fieldList
        })
        // console.info('vuex:', this.$store.state.canvas)

        this.$emit('onSelect', element)
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
    updateCanvas (list) {
      // console.log('update--', list)
      // this.fieldList = list
      this.$store.commit('canvas/update', {
        name: this.canvasName,
        elements: list
      })
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
