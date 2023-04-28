<template lang='pug'>
.event-message-frame
  .event-row
    label.secondary-text 通道名称
    el-input#message-channel-name(v-model="eventData.channelName")
  //- .event-row
  //-   label.secondary-text 通道内容
  //-     span.font-size-small.m-l-4.float-right 默认只通知当前动作
  //-   el-select#message-channel-data.d-block(v-model="eventData.channelData")
  //-     el-option(v-for="opt in channelDataOpts", :key="opt.value", v-bind="opt")
</template>

<script>
export default {
  name: 'MessageFrame',
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    canvas: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      channelDataOpts: [
        { label: '表单数据集', value: 'formData' }
      ]
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
    }
  },
  methods: {},
  mounted () {}
}
</script>

<style scoped lang=sass>
.event-row + .event-row
  margin-top: 8px
</style>
