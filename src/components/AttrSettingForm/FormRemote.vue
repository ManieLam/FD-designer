<template lang='pug'>
.form-remote
  el-button(v-show="!remoteData || !remoteData.url", @click="setAsyncVisible = !setAsyncVisible") {{ remoteData.url ? '重新选择数据接口' : '配置数据接口' }}
  //- .list-column__default.m-t-4(v-show="remoteData.url", :key="remoteData.name")
  //-   .left-wrap.d-flex-1(style="overflow: hidden;")
  //-     .d-flex-v-center
  //-       i.el-icon-paperclip.color-primary.m-r-8(title="数据接口")
  //-       .color-warning {{remoteData.method}}
  //-       .secondary-text.m-l-8(style="text-overflow: ellipsis;overflow: hidden;") {{remoteData.url}}
  //-     .color-text-secondary.font-size-small.m-l-8 {{ remoteData.demo || '<无备注>'}}
  //-   .right-wrap
  //-     i.el-icon-edit.btn-icon__small(title="重新选择数据接口", @click="setAsyncVisible = !setAsyncVisible")
  //-     el-popover(placement="top", width="260", trigger="click", v-model="reCheckRemove")
  //-       p 确定要删除吗?
  //-       .text-right.m-t-8
  //-         el-button(@click="reCheckRemove=false") 取消
  //-         el-button(type="primary", @click="remove") 确定
  //-       i.el-icon-delete.btn-icon__small.m-l-8(slot="reference", title="移除当前")
  //-     slot(name="remote-operation")
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
