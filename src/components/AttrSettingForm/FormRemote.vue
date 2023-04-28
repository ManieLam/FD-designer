<template lang='pug'>
.form-remote(style="overflow-x: auto;")
  el-button(v-show="!remoteData || !remoteData.url", @click="setAsyncVisible = !setAsyncVisible") {{ remoteData.url ? '重新选择数据接口' : '配置数据接口' }}
  RemoteInfo.form-remote-item(
    :value="remoteData"
    @edit="handleEdit"
    @remove="handleRemove")
  RemoteSettingRequire(
    v-if="setAsyncVisible"
    v-model="setAsyncVisible"
    v-bind="$attrs"
    :title="title"
    :chosenData="remoteData"
    @chosen="chosenResource"
    @refuse="handleRefuse")
</template>

<script>
/** 远程请求配置 */
import RemoteSettingRequire from '../RemoteSetting/Require'
import RemoteInfo from '../RemoteSetting/RemoteInfo'
// import { isEqual } from 'lodash'
export default {
  name: 'FormRemote',
  components: {
    RemoteSettingRequire,
    RemoteInfo
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
      setAsyncVisible: false,
      reCheckRemove: false
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
    chosenResource (api) {
      if (!api) return
      this.remoteData = api
    },
    // 手动编辑
    handleEdit () {
      this.remoteData = { ...this.remoteData, _isEdit: true }
      this.setAsyncVisible = true
    },
    handleRemove () {
      this.remoteData = {}
      this.$nextTick(() => {
        this.$emit('remove')
      })
    },
    handleRefuse () {
      this.setAsyncVisible = false
    }
  }
}
</script>

<style lang='sass' scoped>

</style>
