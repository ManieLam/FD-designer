<template lang='pug'>
.form-attr-layout
  //- 选择布局类型
  i.empty-text.secondary-text(v-if="!attrList || !attrList.length") 暂无配置
  //- 根据选择的布局类型切换可配置的选项
  AttrSettingForm(
    v-else
    v-bind="$attrs"
    key="formLayoutAttr"
    :value="attrsData"
    :attrs="attrList"
    @update="update")
  .form-attr__fields(v-if="layoutType === 'grid' || layoutType === 'row'")
    label.secondary-text 自定义字段占比
    FormList(
      v-model="attrsData.fieldSpan"
      :draggable="false"
      :maxLen="fields.length"
      :columnProps="formSpanColumnProp")
      template(v-slot:fieldKey="scoped")
        ansoDataformSelect(v-model="scoped.data.fieldKey", :options="fields")
</template>

<script>
/** 表单布局类型设置 */
import AttrSettingForm from '@/components/AttrSettingForm'
import FormList from '@/components/AttrSettingForm/FormList'
import { formLayoutAttrs } from '@/model/formAttrs.js'
import { getFormlayoutDefval } from '@/model/defaultConfig.js'
export default {
  name: 'FormLayout',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    fullSetting: {
      type: Object,
      default: () => ({})
    },
    canvas: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    AttrSettingForm,
    FormList
  },
  data () {
    return {
      layoutTypes: formLayoutAttrs.types,
      layoutType: '', // 选择的表单类型
      spanFields: [], // 存在记录colSpan和rowSpan的字段
      attrList: [], // 不同的布局类型的下拉选项
      layoutData: {
        fieldSpan: [] // 字段占比
      },
      // 字段占比
      formSpanColumnProp: [
        { label: '字段名称', prop: 'fieldKey' },
        { label: '行占比', prop: 'rowSpan', valType: 'Number' },
        { label: '列占比', prop: 'colSpan', valType: 'Number' }
      ]
    }
  },
  computed: {
    fields () {
      return this.canvas?.body.map(f => {
        return {
          label: f.label,
          value: f.key
        }
      }) || []
    },
    attrsData: {
      get () {
        return this.layoutData
      },
      set (value) {
        // console.log('设置属性:', value)
        this.layoutData = value
        this.$emit('input', value)
      }
    }
  },
  watch: {
    // 变更类型
    'fullSetting.layout': {
      handler (type, oldType) {
        if (type !== oldType) {
          this.init()
        }
      }
    }
  },
  methods: {
    update (datas) {
      this.attrsData = { ...this.attrsData, ...datas }
    },
    init (attrData) {
      const { layout, layoutAttrs } = this.fullSetting || {}
      this.layoutType = layout
      this.attrList = layout ? formLayoutAttrs[`${layout}Attrs`] : []
      this.attrsData = getFormlayoutDefval({
        type: layout,
        defData: attrData || layoutAttrs
      })
      // console.log('init:', this.attrsData)
    }
  },
  mounted () {
    // 在表单设计器中的画布与配置设置不读取body中的属性，只根据表单attrs属性更新
    this.init()
  }
}
</script>

<style scoped lang='sass'>

</style>
