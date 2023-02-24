<template lang='pug'>
.event-message-frame
  label.secondary-text 通知通道名称
  el-input#message-channel-name(v-model="eventData.channelName")
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

</style>
