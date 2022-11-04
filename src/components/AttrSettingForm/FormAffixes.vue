<template lang='pug'>
.form-affixes.d-flex
  el-select(v-model="inputType", style="flex: 1;")
    el-option(v-for="opt in options", :key="opt.value", :label="opt.label", :value="opt.value")
  .input(style="flex: 2;")
    el-input(v-show="inputType === 'string'", v-model="content", placeholder="请输入文本内容")
    el-select.select-icon(v-show="inputType === 'icon'", v-model="content", placeholder="请选择图标")

</template>

<script>
/** input前缀/后缀 */
export default {
  name: 'FormAffixes',
  props: {
    type: {
      type: String,
      default: 'append'
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      iconAffix: {
        // type: 'prefix-icon', // prefix-icon \ suffix-icon
        icon: '', iconAlign: this.type === 'append' ? 'right' : ''
      },
      strAffix: { type: '', content: '' },
      options: [
        { label: '文本', value: 'string' },
        { label: '图标', value: 'icon' }
      ]
    }
  },
  computed: {
    isIcon () {
      return this.value?.icon
    },
    inputType: {
      get () {
        return this.value.inputType || 'string'
      },
      set (value) {
        this.$emit('input', { content: this.content, inputType: value })
      }
    },
    content: {
      get () {
        return this.value.content
      },
      set (value) {
        this.$emit('input', { content: value, inputType: this.inputType })
      }
    }
  },
  methods: {},
  mounted () {}
}
</script>

<style lang='sass' scoped>

</style>
