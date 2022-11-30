<template lang='pug'>
.form-remote-list
  el-button(v-show="!remoteList || !remoteList.length", @click="addResource") 配置数据接口
  //- .list-column__default.m-t-4
  .list-column
    .d-flex-1.m-r-4
      form-remote.form-remote-item(
        v-for="(api, i) in remoteList"
        v-bind="$attrs"
        :value="api"
        :key="`api_${i}`"
        :ref="`api_${i}`"
        :isSelected="remoteNames"
        :is-default="api.isDefault"
        @input="getNewResource($event, i)"
        @refuse="dialogClosed(i)"
        @remove="removeResource(api, i)")
        template(v-slot:remote-operation)
          i.el-icon-s-flag.btn-icon__small.m-l-8(:disabled="api.isDefault", title="设置默认数据集", @click.stop="setDefault(api)")
    .row-button.m-t-4(v-show="!!remoteList.length")
      i.el-icon-plus.color-primary.btn-radius-50.hover-change-scale(@click="addResource")
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
        i {{ executiveMode === 'inParallel' ? '并联时，所有接口执行完成，再执行下一步操作。若存在请求失败的接口，则会单独执行该失败的操作。' : '串联时，从第一个接口依次执行，当一个接口报错则中断后续操作，进入请求失败操作' }}
      //- 根据规则执行
      ApiRule.remote-rule-wrap.m-t-8(
        v-show="executiveMode === 'inSetting'"
        v-model="executByRule"
        :apiList="remoteList")
      .bottom-wrap.text-right.m-t-16
        el-button(@click="ruleSettingVisible=false;isSetRule=false") 取消
        el-button(type="primary", @click="submitRule") 确定

</template>

<script>
/** 多个数据请求接口 */
import { ApiData } from '@/model/resource.js'
import { isEqual } from 'lodash'
import ApiRule from '@/components/RuleCollection/ApiRule'
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
    }
  },
  components: {
    ApiRule
  },
  data () {
    return {
      ruleSettingVisible: false,
      isSetRule: false,
      /* 设置规则 */
      executiveMode: 'inParallel',
      executByRule: ''
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
    getNewResource (api, index) {
      console.info('获取到新的接口', api, index)
      if (api) {
        // 保持唯一性
        const hasOne = this.remoteList.some(r => isEqual(r, api))
        if (!hasOne) {
          this.$set(this.remoteList, index, { ...api, isDefault: api.isDefault || index === 0 })
        } else {
          this.$message.warning('重复选择同一个接口')
        }
      }
    },
    addResource () {
      this.remoteList.push(new ApiData({ url: '/' }))
      this.$nextTick(() => {
        const nIndex = this.remoteList.length - 1
        if (nIndex >= 0) {
          this.$refs[`api_${nIndex}`][0].setAsyncVisible = true
        }
      })
    },
    dialogClosed (i) {
      // console.info('弹窗关闭', this.remoteList[i]?.url?.length)
      // 清除伪数据
      if (this.remoteList[i]?.url?.length <= 1) {
        this.$delete(this.remoteList, i)
      }
    },
    removeResource (api, i) {
      this.$delete(this.remoteList, i)
      this.$nextTick(() => {
        if (this.remoteList.length) {
          // 自动将下一个接口置为默认
          this.$set(this.remoteList[i], 'isDefault', true)
        }
      })
    },
    toggleRules () {
      this.ruleSettingVisible = !this.ruleSettingVisible
    },
    submitRule () {
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
