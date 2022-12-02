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
    :key="remoteData.name"
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
import { isEqual } from 'lodash'
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
      // this.remoteData = !data ? {} : data
      const { url: newUrl, method: newMethod } = api
      const { url: oldUrl, method: oldMethod } = this.remoteData
      const isSame = isEqual({ url: newUrl, method: newMethod }, { url: oldUrl, method: oldMethod })
      if (!api) return
      if (!api._isEdit) {
        // 新增
        this.remoteData = {
          ...api,
          name: isSame ? api.name : '' // 一旦url、method改变，则认为新的接口; 一旦修改为全局，则改为全局的name
        }
      // } else {
      //   // 编辑
      //   this.
      }
    },
    // 手动编辑
    handleEdit (api, i) {
      this.remoteData = { ...api, _isEdit: i }
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
