<template lang='pug'>
//- draggable别把value改成v-model,会取错元素填入
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
      :formConfig="canvas"
      @add="handleWidgetAdd"
      @remove="removeWidget")
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
  model: {
    prop: 'list',
    event: 'change'
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
    },
    list: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      keyName: '',
      computedList: [],
      formatField
    }
  },
  computed: {
    fieldList: {
      get () {
        return this.computedList
      },
      set (list) {
        // console.log('dragPage 变了:', list)
        this.computedList = list
        this.$emit('change', list)
      }
    }
  },
  watch: {
    list: {
    //     // deep: true,
      immediate: true,
      handler (fields) {
        this.computedList = fields
      }
    }
  },
  methods: {
    clear () {
      this.fieldList = []
    },
    // TODO 改造对接配置的数据源
    checkFieldOption (tag) {},
    handleWidgetAdd (evt) {
      // 针对Vuedragger的bug(拖拽后的对象非选中的对象)优化
      const tag = evt.clone?.dataset?.name
      const newIndex = evt.newIndex
      if (tag) {
        const element = this.formatField({ tag: evt.clone?.dataset?.name, attrConf: { labelHidden: this.canvas?.attrs?.labelHidden } })
        this.fieldList.splice(newIndex, 0, element)
        // console.log('拖拽新增：', newIndex, this.fieldList)
        // this.$set(this.fieldList, newIndex, element)
        this.$emit('onSelectItem', { type: 'component', data: element })
        this.$forceUpdate()
      }
    },
    removeWidget (ele, index) {
      if (index !== -1) {
        this.$delete(this.fieldList, index)
      }
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
