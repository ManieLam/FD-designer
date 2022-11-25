<template lang='pug'>
.resource-list(:is-collapse="collapse")
  .list-title.d-flex-row-between.align-items-center.box-content__tip.cursor-pointer
    .title.d-flex-1
      .secondary-text(v-show="!entering", @dblclick.stop.prevent.self="toggleInput") {{groupTitle}} ({{resourceList.length}})
      el-popover(placement="top", width="160", v-model="popVisabled", trigger="manual", :disabled="disablePopover")
        p 已存在同名分组，是否合并？
        div(style="text-align:right;margin: 0")
          el-button(size="mini", type="text", @click="cancelChangeTitle") 取消
          el-button.color-primary(size="mini", type="text", @click="onChangeTitle") 确定
        el-input.input(
          slot="reference"
          v-show="entering"
          ref="inputTitle"
          size="mini"
          v-model="groupTitle"
          @keyup.enter.native.stop="toggleInput"
          @blur="toggleInput")
    .tools.cursor-pointer
      //- 新增分组子数据源
      i.el-icon-plus.hover-change-scale.hover-change-color__primary(v-if="editable", title="新增子数据源", @click.stop="addApi")
      //- 移除分组
      el-popover(placement="top", width="160", v-model="readyRemoveGroup")
        p 确定移除该分组吗？该操作会同步清空组内子资源。
        div(style="text-align:right;margin: 0")
          el-button(size="mini", type="text", @click="readyRemoveGroup=false") 取消
          el-button(size="mini", type="text", @click="removeGroup") 确定
        i.el-icon-delete.hover-change-scale.hover-change-color__danger(v-if="editable", slot="reference", title="移除分组")
      //- 收缩/展开
      i.hover-change-scale(:class="collapse ? 'el-icon-arrow-down' : 'el-icon-arrow-right'", @click.prevent="collapse=!collapse")

  .list-content.m-t-8.m-b-8(v-show="collapse")
    .list-row.d-flex-row-between.align-items-center.hover-change-bgColor(
      v-for="(apiItem) in resourceList"
      :key="apiItem.name"
      :data-name="apiItem.name"
      :is-active="apiData && apiItem.name === apiData.name"
      @click.stop="$emit('editApi', apiItem)")
      .left
        .d-flex-v-center
          i.el-icon-check.color-primary.m-r-8(v-show="apiData && apiItem.name === apiData.name")
          .color-warning {{apiItem.method}}
          .secondary-text.m-l-8.d-flex-1 {{apiItem.url}}
        .color-text-secondary.font-size-small.m-l-8 {{ apiItem.demo || ''}}
      .right(style="min-width: 40px")
        i.el-icon-delete.hover-change-scale.hover-change-color__danger(title="删除", @click.stop.prevent="$emit('removeApi', apiItem)")
        i.el-icon-copy-document.hover-change-scale.hover-change-color__warning.m-l-8(title="复制", @click.stop.prevent="$emit('copeApi', apiItem)")
    el-empty.left-empty(v-if="!resourceList.length", description="暂无数据源，请添加")
</template>

<script>
/** 请求资源的分组 */
import { ApiData } from '@/model/resource.js'
export default {
  name: 'ApiGroup',
  props: {
    // group: {
    //   type: Object,
    //   default: () => ({})
    // },
    /* 当前选中的数据源 */
    apiData: {
      type: Object,
      default: () => ({})
    },
    /* 分组标题名称 */
    title: String,
    /* 当前分组内的子资源 */
    list: {
      type: Array,
      default: () => ([])
    },
    /* 全量分组数据 */
    full: {
      type: Object,
      default: () => ({})
    },
    editable: {
      type: Boolean,
      default: true
    },
    collapseDefault: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      groupTitle: this.title,
      collapse: this.collapseDefault,
      entering: false,
      popVisabled: false, // 是否允许修改分组标题名称
      // disablePopover: true, // 是否允许显示提示
      readyRemoveGroup: false // 是否准备删除分组
    }
  },
  computed: {
    resourceList: {
      get () {
        return this.list
      },
      set (list) {
        this.$emit('upgrade', list, this.title)
      }
    },
    disablePopover () {
      return !(this.entering && this.popVisabled)
    }
  },
  methods: {
    /* 新增 - 当前分组中 */
    addApi () {
      this.$emit('addApi', new ApiData({ group: this.title }))
    },
    /* 丢弃分组 */
    removeGroup () {
      this.$emit('remove', this.title)
    },
    /* 分组合并 */
    concatGroup () {},
    /* input结束 */
    toggleInput (e) {
      if (!this.editable) return
      if (e.type === 'blur' && !this.popVisabled) {
        // keyup.enter时候会再次触发
        this.entering = false
        this.cancelChangeTitle()
        return
      }
      if (!this.entering) {
        this.entering = !this.entering
        this.$nextTick(() => {
          const theEl = this.$refs.inputTitle.$el?.getElementsByTagName('input')?.[0]
          theEl.selectionEnd = this.groupTitle?.length
          theEl.focus()
        })
      } else {
        // 更新分组内所有数据源名称
        if (this.full[encodeURI(this.groupTitle)]) {
          this.popVisabled = true
        } else {
          this.popVisabled = false
          this.onChangeTitle()
        }
      }
    },
    cancelChangeTitle () {
      this.popVisabled = false
      this.groupTitle = this.title
    },
    onChangeTitle () {
      this.entering = false
      this.resourceList = this.resourceList.map(row => {
        row.group = this.groupTitle
        return row
      })
    }
  }
}
</script>

<style lang='sass' scoped>

.resource-list
  &[is-collapse], &:hover
    box-shadow: -1px 3px 2px rgb(220 223 230 / 30%)
.list-title
  border-bottom: 1px dotted $--border-color-base
  // box-shadow: 1 1 1 0 #dfdfdf
  padding: 8px
  > .title .input ::v-deep input
    margin-left: -10px
    height: 22px

.list-content
  padding: 0 8px 8px

.list-row
  border: 1px solid $--border-color-base
  padding: 8px
  cursor: pointer
  position: relative
  // &:hover
  //   background: $--bgcolor-secondary
  & + .list-row
    margin-top: 8px
  &[is-active]
    background: $--bgcolor-secondary
  // &::before
  //   content: attr(data-name)
  //   background: rgba(0,0,0, 0.7)
  //   color: #fff
  //   padding: 1px 6px
  //   font-size: 10px
  //   // height: 15px
  //   position: absolute
  //   right: 0
  //   top: 0
  //   display: none
  // &:hover
  //   &::before
  //     display: block
  .left
    line-height: 1.2
</style>
