<template lang='pug'>
.form-remote-list
  el-button(v-show="!remoteList || !remoteList.length", @click="handleAdd") 配置数据接口
  //- .list-column__default.m-t-4
  .list-column
    .d-flex-1.m-r-4
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
    .row-button.m-t-4(v-show="!!remoteList.length")
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
      el-radio-group(v-model="executiveMode")
        el-radio-button(label="inParallel") 并联
        el-radio-button(label="inSeries") 串联
        el-radio-button(label="inSetting") 根据规则执行(TODO)
      .secondary-text.m-t-8.radio-tip-content(v-show="executiveMode === 'inParallel' || executiveMode === 'inSeries'")
        i.el-icon-info.p-r-8
        i {{ executiveMode === 'inParallel' ? '【默认】并联时，所有接口执行完成，再执行下一步操作。若存在请求失败的接口，则会单独执行该失败的操作。' : '串联时，从第一个接口依次执行，当一个接口报错则中断后续操作，进入请求失败操作' }}
      //- 根据规则执行
      ApiRule.remote-rule-wrap.m-t-8(
        v-show="executiveMode === 'inSetting'"
        v-model="executByRule"
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
      type: Array,
      default: () => ([])
    },
    rule: {
      type: Object,
      default: () => ({})
    },
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
      isSetRule: this.rule?.executiveMode,
      apiDataPatch: new ApiData(),
      /* 设置规则 */
      executiveMode: 'inParallel', // 执行规则（串联、并联、自定义）
      executByRule: '' // 自定义规则字符串
    }
  },
  computed: {
    remoteList: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    remoteNames () {
      return this.remoteList.map(api => api.name)
    },
    ruleData: {
      get () {
        return {
          executiveMode: this.executiveMode,
          executByRule: this.executByRule
        }
      },
      set (data) {
        this.executiveMode = data.executiveMode || 'inParallel'
        this.executByRule = data.executByRule || ''
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
        // const nIndex = this.remoteList.length - 1
        // if (nIndex >= 0) {
        //   this.$refs[`api_${nIndex}`][0].setAsyncVisible = true
        // }
        this.setAsyncVisible = true
      })
    },
    // 取消新增
    hanldeRefuse (i) {
      // console.info('弹窗关闭', this.remoteList[i]?.url?.length)
      // 清除伪数据
      // if (this.remoteList[i]?.url?.length <= 1) {
      //   this.$delete(this.remoteList, i)
      // }
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
      const newApi = { ...this.apiDataPatch, ...api }
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
        // const { url: oldUrl, method: oldMethod } = this.apiDataPatch
        // const isSame = isEqual({ url: newUrl, method: newMethod }, { url: oldUrl, method: oldMethod })
        // this.$set(this.remoteList, _isEdit - 1, {
        //   ...newApi,
        //   name: isSame || api.__isGlobal ? name : new Date().getTime() // 一旦url、method改变，则认为新的接口,保留全局类型接口的name用于重启弹窗出现全局选中标识
        // })
        this.$set(this.remoteList, _isEdit - 1, newApi)
      }
    },
    toggleRules () {
      this.ruleSettingVisible = !this.ruleSettingVisible
    },
    submitRule () {
      console.info('选中选项')
      this.ruleSettingVisible = false
      this.isSetRule = true
      this.$emit('chosenRule', this.ruleData)
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
    this.ruleData = this.rule
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
