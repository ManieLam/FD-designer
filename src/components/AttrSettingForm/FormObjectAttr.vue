<template lang="pug">
div
  el-form-item.list-item(v-for='attr in attrs', :key='attr.key', :label='attr.label', :prop='attr.key')
    components(:is='attr.tag', v-bind='attr', v-model='currentValue[attr.key]')
</template>

<script>
/**
 * 用于对象类型的属性的配置
 *
 * 如文本域的
 * autosize = {
 *  minRows,
 *  maxRows
 * }
 */
export default {
  name: 'FormObjectAttr',
  props: {
    value: [Object, String],
    fullSetting: Object,
    attrs: Array
  },
  data () {
    return {
      currentValue: {}
    }
  },
  watch: {
    value (newValue, oldValue) {
      if (typeof newValue === 'object') this.currentValue = newValue
    },
    currentValue: {
      deep: true,
      handler (newValue, oldValue) {
        this.$emit('input', newValue)
      }
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
