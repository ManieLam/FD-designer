<template lang='pug'>
el-drawer.anso-drawer(
  v-bind="$attrs"
  v-on="$listeners"
  v-if="drawerVisible"
  :title="title"
  :visible.sync="drawerVisible"
  :modal="shouldAppendToBody"
  :wrapperClosable="false"
  :custom-class="customClass"
  :append-to-body="shouldAppendToBody"
  :modal-append-to-body="shouldAppendToBody"
  :size="size")
  slot
  template(slot="title")
    slot(name="title")
</template>

<script>
/** 侧拉组件，方便所有自定义修改 */
export default {
  name: 'SmartDrawer',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: '33%'
    },
    fullScreen: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    drawerVisible: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    },
    customClass () {
      return this.fullScreen ? 'fullScreenStyle' : ''
    },
    shouldAppendToBody () {
      return this.fullScreen || this.appendToBody
    }
  },
  filters: {},
  data () {
    return {}
  }
}
</script>

<style lang='sass' scoped>
.anso-drawer
  ::v-deep .el-drawer
    // box-shadow: 0 0 10px -3px rgba(0, 0, 0, 0.06)
  ::v-deep .el-drawer__header
    border: 0
  ::v-deep .fullScreenStyle
    width: calc(100% - 100px) !important
</style>
