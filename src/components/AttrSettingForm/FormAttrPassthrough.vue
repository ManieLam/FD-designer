<template lang='pug'>
.form-attr-passthrough-item
  components(:is="tag", v-bind="passthroughAttr", v-model="currentValue")
</template>

<script>
/** 属性透传/带着属性转换, 如：cascader中有些属性需要通过props传递：checkStrictly
 * 在字段config中存值格式：checkStrictly: { attrkey: props, value: true }, 格式转换格式的：props: { checkStrictly: true }
 * 举一反三：实际组件应用的属性格式如需：propAs: { A: '', B: true/false }, 则配置中的格式为: A:{ attrKey: propAs, value: '' }, B: { attrKey: propAs, value: true/false }
 */
export default {
  name: 'FormAttrPassthrough',
  props: {
    passthroughAttr: {
      type: Object,
      default: () => ({})
    },
    /* 格式：{ attrKey: '父级属性key', value: '' } */
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      tag: this.passthroughAttr?.tag
    }
  },
  computed: {
    currentValue: {
      get () {
        console.log('1获取', this.value)
        // return this.value
        return this.passthroughAttr.attrKey ? this.value?.value : this.value
      },
      set (val) {
        console.info('1设置', val, this.passthroughAttr.attrKey)
        this.$emit('input', this.passthroughAttr.attrKey ? {
          attrKey: this.passthroughAttr.attrKey,
          value: val
        } : val)
      }
    }
  },
  methods: {},
  mounted () {
    console.log('属性透传:', this.passthroughAttr)
  }
}
</script>

<style scoped lang=scss>

</style>
