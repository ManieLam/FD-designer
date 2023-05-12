<template lang='pug'>
.list-column__default.m-t-4(v-show="remoteData.url", :key="remoteData.name")
  .left-wrap.d-flex-1(style="overflow: hidden;")
    .d-flex-v-center
      i.el-icon-paperclip.color-primary.m-r-8(title="数据接口")
      .color-warning {{remoteData.method}}
      .secondary-text.m-l-8(style="text-overflow: ellipsis;overflow: hidden;", :title="urlReadable") {{urlReadable}}
    .color-text-secondary.font-size-small.m-l-8 {{ remoteData.demo || '<无备注>'}}
  slot.right-wrap(name="operation")
    i.el-icon-edit.btn-icon__small(title="编辑", @click="$emit('edit')")
    el-popover(placement="top", width="260", trigger="click", v-model="reCheckRemove")
      p 确定要删除吗?
      .text-right.m-t-8
        el-button(@click="reCheckRemove=false") 取消
        el-button(type="primary", @click="remove") 确定
      i.el-icon-delete.btn-icon__small.m-l-8(slot="reference", title="移除当前")
    slot(name="operation-append")
</template>

<script>
/** 异步请求信息展示 */
import { transUrlReadable } from '@/utils/format'
export default {
  name: 'RemoteInfo',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      reCheckRemove: false
    }
  },
  computed: {
    urlReadable () {
      return transUrlReadable.call(this, this.remoteData.url)
    },
    remoteData: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    remove () {
      this.remoteData = {}
      this.$nextTick(() => {
        this.$emit('remove')
      })
    }
  }
}
</script>

<style lang='sass' scoped>

</style>
