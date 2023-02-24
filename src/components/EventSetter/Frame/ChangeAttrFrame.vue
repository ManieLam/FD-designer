<template lang='pug'>
.eventSetter-changeAttr-frame
  .primary-text 执行目标（开发中）
    label.secondary-text 目标类型
      el-select.m-l-8(v-model="eventData.targetType", placeholder="请选择", :disabled="!eventData.eventName")
        el-option(v-for="opt in targetTypeOptions", :key="opt.value", v-bind="opt") {{ opt.label }}
    label.secondary-text.m-l-8 目标键名
      el-select.m-l-8(v-model="eventData.target", :multiple="true", placeholder="请选择", :disabled="!eventData.eventName")
        el-option(v-for="item in targetOptions", :key="item.key", :value="item.name")
          span.float-left {{ item.label }}
          span.float-right.m-l-4 {{ item.name }}
</template>

<script>
/* 修改属性相关事件的配置面板 */
import ruleConfig from '../ruleConfig'
export default {
  name: 'ChangeAttrFrame',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    canvas: {
      type: Object,
      default: () => ({})
    } // 当前画布信息
  },
  data () {
    return {
      targetTypeOptions: ruleConfig.targetTypeOptions
    }
  },
  computed: {
    eventData: {
      get () {
        return this.value
      },
      set (data) {
        this.$emit('input', data)
      }
    },
    canvasBodyList () {
      return this.canvas?.body.filter(e => e.key !== this.field.key)
    },
    targetOptions () {
      return this.eventData.targetType === 'field' ? this.canvasBodyList : []
    }
  },
  methods: {},
  mounted () {}
}
</script>

<style scoped lang=sass>

</style>
