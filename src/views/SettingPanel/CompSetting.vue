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
        :attrs="attrs")
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
    'formItemConfig.name': {
      // immediate: true,
      // deep: true,
      handler (fname, oldfname) {
        if (fname !== oldfname) {
          const { label, name, form } = this.formItemConfig
          // console.log('form:', form)
          // console.log('label:', label)
          // console.log('name:', name)
          const mergeData = { ...cloneDeep(form), label, name }
          console.info(mergeData)
          this.attrsData = cloneDeep(mergeData)
        }
        // if (config) {
        //   console.info('config:', config)
        //   const { label, name, form } = config
        //   this.attrsData = { ...form, label, name }
        // }
      }
    }
    // 'canvas.fields': {
    //   immediate: true,
    //   // deep: true,
    //   handler (fields, oldData) {
    //     if (fields) {
    //       // console.info('form change--', form)
    //       this.attrsData = !form?.attrs || isEmpty(form.attrs) ? { ...this.$defVal?.formAttrs } : form?.attrs
    //       this.actionsData = !form.actions || isEmpty(form.actions) ? {} : form.actions
    //     }
    //   }
    // }
  },
  computed: {
    tag () {
      return this.formItemConfig?.form?.tag
    },
    attrs () {
      return componentAttrs[this.tag]?.attrs || []
    },
    attrsData: {
      get () {
        // const { label, name, form } = this.formItemConfig
        // const mergeData = { ...cloneDeep(form), label, name }
        // console.info('attrsData --- get', mergeData)
        // return mergeData
        return this.tempAttrsData
      },
      set (data) {
        console.info('set---', data)
        // console.info('form:', form)
        this.tempAttrsData = data
        // // this.tempAttrsData = { ...form, label, name }
        // console.info('attrsData --- set', this.tempAttrsData)
        // // this.updateStorage({ fname: data.name, attrs: data })
        this.$emit('update', 'comp', data)
      }
    }
  },
  methods: {
    updateStorage ({ fname, attrs, actions }) {
      this.$store.commit('canvas/updateField', {
        name: this.canvasName,
        fname,
        findex: this.$attrs.canvas?.fields?.findIndex(field => field.name === fname),
        attrs,
        actions
      })
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
