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
</template>

<script>
/** 表单布局类型设置 */
import AttrSettingForm from '@/components/AttrSettingForm'
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
    }
  },
  components: {
    AttrSettingForm
  },
  data () {
    return {
      layoutTypes: formLayoutAttrs.types,
      layoutType: '', // 选择的表单类型
      attrList: [],
      layoutData: {}
    }
  },
  computed: {
    // attrList () {
    //   // const { layout } = this.fullSetting || {}
    //   const layout = this.layoutType
    //   return layout ? formLayoutAttrs[`${layout}Attrs`] : []
    // },
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
    'fullSetting.layout' (type, oldType) {
      this.layoutType = type
      this.attrList = type ? formLayoutAttrs[`${type}Attrs`] : []
      if (type !== oldType) {
        this.attrsData = { ...formLayoutDefAttrs[type] }
      }
    }
  },
  methods: {
    update (datas) {
      // console.log('update:', datas)
      this.attrsData = datas
    }
  },
  mounted () {
    this.layoutData = this.value
    // this.layoutType = this.fullSetting.layout
  }
}
</script>

<style scoped lang='sass'>

</style>
