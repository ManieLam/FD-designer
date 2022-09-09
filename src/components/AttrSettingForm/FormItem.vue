<template lang='pug'>
el-form-item.list-item(
  :key="attr.key"
  :label="attr.label"
  :prop="attr.key"
  :is-group="!!attr.group")
  components(
    v-if="attr.tag"
    :is="attr.tag"
    v-model="data"
    v-bind="attr")
    //- 属性组配置
  //- .component-group(v-else-if="item.group", :key="item.group.key")
  //-   FormItem(:list="item.group", v-model="data")
  //-   //- el-form-item.group-item(
  //-   //-   v-for="groupItem in attrItem.group"
  //-   //-   :key="groupItem.key"
  //-   //-   :prop="groupItem.key"
  //-   //-   :label="groupItem.label")
  //-   //-   components(
  //-   //-     v-if="groupItem.tag"
  //-   //-     :is="groupItem.tag"
  //-   //-     v-model="data[groupItem.key]"
  //-   //-     v-bind="groupItem")
  .component-empty.secondary-text(v-else) -- 开发中 --
</template>

<script>
/** */
// import FormItem from './FormItem'
export default {
  name: 'FormItem',
  props: ['attr', 'value'],
  // components: {
  //   FormItem
  // },
  data () {
    return {}
  },
  computed: {
    data: {
      get () {
        // console.log('attrSetting get --- ')
        return this.value
      },
      set (value) {
        // console.log('attrSetting set --- ')
        // this.inputed = value
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style lang='sass' scoped>
.list-item
  &[is-group] ::v-deep .el-form-item__label
    padding: 0
  ::v-deep .el-form-item__label
    padding: 0
.component-group
  margin-bottom: 8px
  // padding: 8px 0
  // box-shadow: 1px 0px 5px 2px $--border-color-base
  border-top: 1px dashed $--border-color-base
  border-bottom: 1px dashed $--border-color-base
</style>
