<template lang='pug'>
.form-remote
  el-button(@click="setAsyncVisible = !setAsyncVisible") {{ remoteData.url ? '重新选择数据源' : '配置数据源' }}
  .list-column__default.m-t-4(v-show="remoteData.url")
    .left-wrap
      .d-flex-v-center
        i.el-icon-check.color-primary.m-r-8
        .color-warning {{remoteData.method}}
        .secondary-text.m-l-8 {{remoteData.url}}
      .color-text-secondary.font-size-small.m-l-8 {{ remoteData.demo || ''}}
    .right-wrap
  RemoteSettingRequire(
    key="option"
    v-model="setAsyncVisible"
    :title="title"
    :chosenData="remoteData"
    @chosen="getAsyncSeting")
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
      this.remoteData = data
    }
  }
}
</script>

<style lang='sass' scoped>

</style>
