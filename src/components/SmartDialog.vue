<template lang='pug'>
el-dialog.custom-dialog.global-dialog(
  v-bind="$attrs"
  v-on="$listeners"
  v-if="dialogVisible"
  :title="title"
  :visible.sync="dialogVisible"
  :modal-append-to-body="true"
  :append-to-body="true"
  :close-on-click-modal="false"
  :lock-scroll="true"
  custom-class="customDialogCenter"
  :width="size|filterWidth")
  slot
  template(slot="title")
    slot(name="title")
      i.iconfont.icon-xinxi.m-r-8(v-if="showIcon", :class="type ? `color-${type}` : 'color-primary'")
      span {{title}}
  template(slot="footer")
    slot(name="footer")
</template>

<script>
/** 弹窗组件，方便所有自定义修改 */
export default {
  name: 'SmartDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'primary',
      validator: (value) => {
        return ['primary', 'success', 'warning', 'error'].includes(value)
      }
    },
    size: {
      type: [String, Number],
      validator: (value) => {
        if (typeof value === 'string') return ['lg', 'md'].includes(value)
        else return true
      },
      default: 'md'
    },
    // 是否头部带icon
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  filters: {
    filterWidth (size) {
      const sizeWidth = {
        lg: '90%',
        md: '70%',
        sm: '50%'
      }
      if (typeof size === 'string') return sizeWidth[size]
      else return `${size}px`
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang='sass' scoped>
// .custom-dialog ::v-deep .el-dialog__body
//   padding: 16px 24px
</style>
