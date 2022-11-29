<template lang='pug'>
.form-remote
  el-button(v-show="!remoteData || !remoteData.url", @click="setAsyncVisible = !setAsyncVisible") {{ remoteData.url ? '重新选择数据接口' : '配置数据接口' }}
  .list-column__default.m-t-4(v-show="remoteData.url", :key="remoteData.name", @click="setAsyncVisible = !setAsyncVisible")
    .left-wrap.d-flex-1(style="overflow: hidden;")
      .d-flex-v-center
        i.el-icon-paperclip.color-primary.m-r-8(title="数据接口")
        .color-warning {{remoteData.method}}
        .secondary-text.m-l-8(style="text-overflow: ellipsis;overflow: hidden;") {{remoteData.url}}
      .color-text-secondary.font-size-small.m-l-8 {{ remoteData.demo || ''}}
    .right-wrap
      i.el-icon-edit.hover-change-underline(title="重新选择数据接口")
      i.el-icon-delete.hover-change-underline.m-l-8(title="移除当前", @click.prevent="remove")
      slot(name="remote-operation")
  RemoteSettingRequire(
    v-model="setAsyncVisible"
    v-bind="$attrs"
    :title="title"
    :chosenData="remoteData"
    @chosen="getAsyncSeting"
    @refuse="$emit('refuse')")
</template>

<script>
/** 远程请求配置 */
import RemoteSettingRequire from '../RemoteSetting/Require'
export default {
  name: 'FormRemote',
  components: {
    RemoteSettingRequire
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '数据源配置'
    }
  },
  data () {
    return {
      setAsyncVisible: false
    }
  },
  computed: {
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
    getAsyncSeting (data) {
      this.remoteData = !data ? {} : data
    },
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
