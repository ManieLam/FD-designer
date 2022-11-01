<template lang='pug'>
el-form.setting-list(v-model="data", label-position="top")
  el-form-item.list-item(
    v-for="attrItem in attrs"
    :key="attrItem.key"
    :prop="attrItem.key"
    :is-group="!!attrItem.group")
    .d-flex-row-between.align-items-center(slot="label", v-if="!attrItem.labelHidden")
      span.span-label {{attrItem.label}}
      span.span-tip.color-secondary.m-l-8(v-if="attrItem.tip")
        i.el-icon-info {{attrItem.tip}}
      //- span.group-collapse(
      //-   v-if="attrItem.group"
      //-   :class="attrItem.group.__collapse ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"
      //-   @click="toggleGroup(attrItem.group)")
    components(
      v-if="attrItem.tag && !attrItem.group"
      :is="attrItem.tag"
      v-model.lazy="data[attrItem.key]"
      v-bind="attrItem"
      v-on="$listeners"
      :fullSetting="data"
      @input="update")
    //- 属性组配置
    .component-group(v-else-if="attrItem.group", :key="attrItem.group.key")
      el-form-item.group-item(
        v-for="groupItem in attrItem.group"
        :key="groupItem.key"
        :prop="groupItem.key"
        :tip="groupItem.tip"
        :label="groupItem.label")
        template(slot="label" v-if="!attrItem.labelHidden")
          span.span-label {{groupItem.label}}
          span.span-tip.color-secondary.m-l-8(v-if="groupItem.tip")
            i.el-icon-info {{groupItem.tip}}
        components(
          v-if="groupItem.tag"
          :is="groupItem.tag"
          v-model.lazy="data[groupItem.key]"
          v-bind="groupItem"
          v-on="$listeners"
          :fullSetting="data"
          @input="update")
        //- .span-tip(v-if="groupItem.tip") {{groupItem.tip}}
    //- .component-empty.secondary-text(v-else) -- 开发中 --

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
      inputed: {}
      // data: this.value
    }
  },
  computed: {
    data: {
      get () {
        return this.value
      },
      set (value) {
        // console.info('set - ', value)
        // this.inputed = value
        this.$emit('input', value)
      }
    }
  },
  methods: {
    update (value, key) {
      this.$emit('update', this.data)
      // this.$emit('update', ...arguments)
    },
    toggleGroup (group) {
      this.$set(group, '__collapse', !group.__collapse)
    }
  },
  mounted () {
    this.inputed = this.value
  }
}
</script>

<style lang='sass' scoped>
.list-item
  &[is-group] ::v-deep .el-form-item__label
    padding: 0
    width: 100%
  ::v-deep .el-form-item__label
    padding: 0
    width: 100%
  .span-tip
    font-size: 10px
    font-style: italic
    float: right
    // vertical-align: middle
.component-group
  margin-bottom: 8px
  // padding: 8px 0
  // box-shadow: 1px 0px 5px 2px $--border-color-base
  border: 1px dashed $--border-color-base
  // border-bottom: 1px dashed $--border-color-base
  background: #f9f9f9
  padding-left: 8px
  padding-right: 8px

.group-collapse
  cursor: pointer
  margin-left: 10px
  &:hover
    transform: scale(1.2)
    color: #000
</style>
