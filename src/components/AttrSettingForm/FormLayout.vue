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
import { formLayoutDefAttrs } from '@/model/defaultConfig.js'
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
      attrList: [],
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
    // attrList () {
    //   // const { layout } = this.fullSetting || {}
    //   const layout = this.layoutType
    //   return layout ? formLayoutAttrs[`${layout}Attrs`] : []
    // },
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
    'fullSetting.layout': {
      immediate: true,
      handler (type, oldType) {
        this.layoutType = type
        this.attrList = type ? formLayoutAttrs[`${type}Attrs`] : []
        if (type !== oldType) {
          this.attrsData = { ...formLayoutDefAttrs[type] }
        }
      }
    }
  },
  methods: {
    update (datas) {
      // console.log('update:', datas)
      this.attrsData = { ...this.attrsData, ...datas }
    }
  },
  mounted () {
    const withSpan = this.canvas?.body?.filter(f => f.rowSpan || f.colSpan).map(f => {
      return {
        fieldKey: f.key,
        colSpan: f.colSpan,
        rowSpan: f.rowSpan
      }
    })
    // console.log('有字段需要调整占比:', withSpan)
    // const list = Array.from({ length: 1 }, () => {
    //   return this.formSpanColumnProp.map(p => p.prop)
    // })
    // console.log('list:', list)
    this.attrsData = {
      ...this.value,
      fieldSpan: withSpan
    }
    // this.layoutType = this.fullSetting.layout
  }
}
</script>

<style scoped lang='sass'>

</style>
