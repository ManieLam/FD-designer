<template lang='pug'>
.setting-form-wrap
  .secondary-text(v-if="!formItemConfig.name || !attrs.length") 组件配置区
    .secondary-text {{formItemConfig.name}}
  el-collapse.setting-wrap(v-model="activeNames", v-else)
    el-collapse-item.collapse-item(title="属性配置", name="attr")
      AttrSettingForm(
        v-bind="$attrs"
        v-on="$listeners"
        v-model="attrsData"
        :attrs="attrs"
        @change="change")
    el-collapse-item.collapse-item(title="行为配置", name="action")

</template>

<script>
/** */
import componentAttrs from './componentAttrs'
import AttrSettingForm from '@/components/AttrSettingForm'
import { cloneDeep } from 'lodash'
export default {
  name: 'CompSetting',
  props: ['formItemConfig', 'canvasName'],
  components: {
    AttrSettingForm
  },
  data () {
    return {
      activeNames: ['attr', 'action'],
      tempAttrsData: {}
      // attrsData: {}
    }
  },
  watch: {
    'formItemConfig.key': {
      handler (fname, oldfname) {
        if (fname !== oldfname) {
          this.attrsData = cloneDeep(this.formItemConfig)
        }
      }
    }
  },
  computed: {
    tag () {
      return this.formItemConfig?.tag
    },
    attrs () {
      return componentAttrs[this.tag]?.attrs || []
    },
    attrsData: {
      get () {
        return this.tempAttrsData
      },
      set (data) {
        this.tempAttrsData = data
        this.change()
      }
    }
  },
  methods: {
    change () {
      this.$emit('update', 'comp', this.attrsData)
    }
  }
}
</script>

<style lang='sass' scoped>
.setting-wrap
  border: 0
.collapse-item
  ::v-deep >div:first-child > .el-collapse-item__header
    color: $--color-primary
  &.is-active ::v-deep >div:first-child > .el-collapse-item__header
    border-bottom: 1px dotted $--border-active
    // &.is-active
      // box-shadow: 0 0 1px 5px #ddd
  ::v-deep .el-collapse-item__content
    padding-bottom: 0
</style>
