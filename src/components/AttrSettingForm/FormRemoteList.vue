<template lang='pug'>
.form-remote-list.w-100(style="overflow-x: auto;")
  el-button(v-show="!remoteList || !remoteList.length", @click="handleAdd") 配置数据接口
  //- .list-column__default.m-t-4
  .list-column
    .d-flex-1
      RemoteInfo.form-remote-item(
        v-for="(api, i) in remoteList"
        v-bind="$attrs"
        :value="api"
        :key="`api_${i}`"
        :ref="`api_${i}`"
        :is-default="api.isDefault"
        @edit="handleEdit(api, i)"
        @remove="handleRemove(api, i)")
        template(v-slot:operation-append)
          i.el-icon-s-flag.btn-icon__small.m-l-8(:disabled="api.isDefault", title="设置默认数据集", @click.stop="setDefault(api)")
    RemoteSettingRequire(
      v-if="setAsyncVisible"
      v-model="setAsyncVisible"
      :title="title"
      :isMulti="true"
      :chosenData="apiDataPatch"
      :isSelected="remoteNames"
      @chosen="chosenResource"
      @refuse="hanldeRefuse")
    //- 列表操作
    .row-button.m-t-4.p-4(v-show="!!remoteList.length")
      i.el-icon-plus.color-primary.btn-radius-50.hover-change-scale(@click="handleAdd")
      i.el-icon-connection.btn-radius-50.hover-change-scale(:is-active="isSetRule", :title="isSetRule ? '已设置执行规则' : '设置执行规则' ", @click="toggleRules")
      i.el-icon-delete.color-primary.btn-radius-50.hover-change-scale(title="清空已选", @click.prevent.stop="clearAll")

  //- 规则设置
  el-dialog(
    title="设置执行规则"
    width="60%"
    :close-on-click-modal="false"
    :visible.sync="ruleSettingVisible")
    .dialog-pane(v-if="ruleSettingVisible")
      //- 多规则执行方式：并联/串联
      el-radio-group(v-model="ruleData.executiveMode")
        el-radio-button(label="inParallel") 并联
        el-radio-button(label="inSeries") 串联
        el-radio-button(label="inSetting") 根据规则执行(TODO)
      .secondary-text.m-t-8.radio-tip-content(v-show="ruleData.executiveMode === 'inParallel' || ruleData.executiveMode === 'inSeries'")
        i.el-icon-info.p-r-8
        i {{ ruleData.executiveMode === 'inParallel' ? '【默认】并联时，所有接口执行完成，再执行下一步操作。若存在请求失败的接口，则会单独执行该失败的操作。' : '串联时，从第一个接口依次执行，当一个接口报错则中断后续操作，进入请求失败操作' }}
      //- 根据规则执行
      ApiRule.remote-rule-wrap.m-t-8(
        v-show="ruleData.executiveMode === 'inSetting'"
        v-model="ruleData.executByRule"
        :apiList="remoteList")
      .bottom-wrap.text-right.m-t-16
        el-button(@click="ruleSettingVisible=false; isSetRule=false") 取消
        el-button(type="primary", @click="submitRule") 确定

</template>

<script>
/** 多个数据请求接口 */
import { ApiData } from '@/model/resource.js'
import { isEqual } from 'lodash'
import ApiRule from '@/components/RuleCollection/ApiRule'
import RemoteInfo from '../RemoteSetting/RemoteInfo'
import RemoteSettingRequire from '../RemoteSetting/Require'
export default {
  name: 'FormRemoteList',
  props: {
    value: {
      type: Object,
      default: () => ({}) // value: { list: [], rule: { executiveMode, executByRule } }
    },
    // rule: {
    //   type: Object,
    //   default: () => ({})
    // },
    title: {
      type: String,
      default: '数据源配置'
    }
  },
  components: {
    ApiRule,
    RemoteInfo,
    RemoteSettingRequire
  },
  data () {
    return {
      setAsyncVisible: false, // 配置接口信息是否可见
      ruleSettingVisible: false, // 配置接口规则是否可见
      isSetRule: this.value?.rule?.executiveMode,
      apiDataPatch: new ApiData()
      /* 设置规则 */
    }
  },
  computed: {
    // 规则
    remoteList: {
      get () {
        return this.value?.list || []
      },
      set (value) {
        console.info('is set', value)
        this.$emit('input', { list: value, rule: this.ruleData })
      }
    },
    // 多数据源情况下, 记录已选数据源key
    remoteNames () {
      return this.remoteList.map(api => api.name)
    },
    ruleData: {
      get () {
        return this.value.rule || {}
      },
      set (value) {
        this.$emit('input', { list: this.remoteList, rule: value })
      }
    }
  },
  methods: {
    getAsyncSeting (data) {
      this.remoteList = data
    },
    handleAdd () {
      // this.remoteList.push(new ApiData({ url: '/' }))
      this.apiDataPatch = new ApiData({ url: '/' })
      this.$nextTick(() => {
        this.setAsyncVisible = true
      })
    },
    // 取消新增
    hanldeRefuse (i) {
      this.apiDataPatch = new ApiData({ url: '/' })
      this.setAsyncVisible = false
    },
    // 手动编辑
    handleEdit (api, i) {
      this.apiDataPatch = { ...api, _isEdit: i + 1 }
      this.setAsyncVisible = true
    },
    // 手动移除
    handleRemove (api, i) {
      this.$delete(this.remoteList, i)
      this.$nextTick(() => {
        if (this.remoteList.length && this.remoteList[i]) {
          // 自动将下一个接口置为默认
          this.$set(this.remoteList[i], 'isDefault', true)
        }
      })
    },
    // 确定选中
    chosenResource (api) {
      // console.info('获取到新的接口', api)
      if (!api) return
      // const newApi = { ...this.apiDataPatch, ...api }
      const newApi = { ...api }
      const { url: newUrl, method: newMethod, _isEdit } = newApi
      // console.info('isEdit-', _isEdit)
      if (!_isEdit) {
        // 新增
        this.apiDataPatch = newApi
        // 保持唯一性
        const hasExist = this.remoteList.some(({ url, method }) => isEqual({ url, method }, { url: newUrl, method: newMethod }))
        if (!hasExist) {
          const len = this.remoteList.length
          // 根据列表长度判断, 首位为默认数据集, 默认追尾添加到列表中
          this.$set(this.remoteList, len, { ...newApi, isDefault: len === 0 })
        } else {
          // this.$message.warning('重复选择同一个接口')
        }
      } else {
        // 编辑
        this.$set(this.remoteList, _isEdit - 1, newApi)
      }
    },
    toggleRules () {
      this.ruleSettingVisible = !this.ruleSettingVisible
    },
    submitRule () {
      this.ruleSettingVisible = false
      this.isSetRule = true
    },
    setDefault (api) {
      if (api.isDefault) return
      const def = this.remoteList.find(r => !!r.isDefault)
      if (def) def.isDefault = false
      this.$set(api, 'isDefault', true)
    },
    clearAll () {
      this.remoteList = []
    }
  },
  mounted () {
    // this.ruleData = this.rule
  }
}
</script>

<style lang='sass' scoped>
.form-remote-item[is-default]
  position: relative
  &::before
    content: '默认'
    background: rgba(0, 0, 0, 0.5)
    color: #fff
    padding: 3px 8px
    font-size: 12px
    line-height: 1
    border-radius: 0 0 0 4px
    position: absolute
    top: 0
    right: 0
i.el-icon-connection
  color: $--color-primary
  &[is-active]
    background: $--color-primary
    color: #fff
</style>
