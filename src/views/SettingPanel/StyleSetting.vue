<template lang='pug'>
.style-setting-block
  //- 常用属性配置
  AttrSettingForm.normal-block(
    :value="compData"
    :attrs="attrs"
    @update="update")
  //- 自定义样式代码输入框
  .custom-block
    //- span.span-label css样式
    //- CodeEditor(
    //-   :value="compDataStr.css"
    //-   key="setValueByCustom"
    //-   mode="ace/mode/css"
    //-   @change="formatFuncByStr")
</template>

<script>
/* 样式配置区 */
import AttrSettingForm from '@/components/AttrSettingForm'
import CodeEditor from '@/components/CodeEditor'
export default {
  name: 'StyleSetting',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    attrs: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    AttrSettingForm,
    CodeEditor
  },
  data () {
    return {
      styleData: {}
    }
  },
  computed: {
    compData: {
      get () {
        return this.value
      },
      set (obj) {
        // console.log('obj:', obj)
        // this.styleData = obj
        this.$emit('input', obj)
      }
    // },
    // compDataStr () {
    //   return this.compData ? String(this.compData) : ''
    }
  },
  watch: {
    // value () {}
  },
  methods: {
    formatFuncByStr () {
      console.log(arguments)
    },
    update (datas) {
      // console.log(arguments)
      this.compData = datas
    }
  },
  mounted () {}
}
</script>

<style scoped lang='sass'>

</style>
