<template lang='pug'>
el-form.setting-list(:model="data", label-position="top")
  el-form-item.list-item(
    v-for="attrItem in attrs"
    :key="attrItem.key"
    :label="attrItem.label"
    :prop="attrItem.key"
    :is-group="!!attrItem.group")
    components(
      v-if="attrItem.tag && !attrItem.group"
      :is="attrItem.tag"
      v-model="data[attrItem.key]"
      v-bind="attrItem")
    //- 属性组配置
    .component-group(v-else-if="attrItem.group", :key="attrItem.group.key")
      el-form-item.group-item(
        v-for="groupItem in attrItem.group"
        :key="groupItem.key"
        :prop="groupItem.key"
        :label="groupItem.label")
        components(
          v-if="groupItem.tag"
          :is="groupItem.tag"
          v-model="data[groupItem.key]"
          v-bind="groupItem")
    .component-empty.secondary-text(v-else) -- 开发中 --
</template>

<script>
/** */
export default {
  name: 'AttrSettingForm',
  props: {
    /* 配置数据 */
    value: {
      type: Object,
      default: () => ({})
    },
    /* 属性配置 { label,key,tag,group } */
    attrs: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      data: this.value
    }
  }
  // computed: {
  //   data: {
  //     get () {
  //       return { ...this.inputed }
  //     },
  //     set (values) {
  //       console.log('set', values)
  //       this.inputed = values
  //       this.$emit('input', values)
  //     }
  //   }
  // }
}
</script>

<style lang='sass' scoped>
.list-item
  &[is-group] ::v-deep .el-form-item__label
    padding: 0
.component-group
  margin-bottom: 8px
  // padding: 8px 0
  // box-shadow: 1px 0px 5px 2px $--border-color-base
  border-top: 1px dashed $--border-color-base
  border-bottom: 1px dashed $--border-color-base
</style>
