<template lang='pug'>
.event-setting-box
  .left.d-flex-1
    section.left-content
      label.primary-text 执行事件
      .left-event-list
        .event-item.hover-change-color__primary.cursor-pointer(
          v-for="event in eventOptions"
          :key="event.eventName"
          :is-active="eventData.eventName && (eventData.eventName === event.eventName)"
          @click="editEvent(event)")
          label {{event.eventDesc}}
          i.el-icon-arrow-right(style="float: right;line-height: 1.8")
  .right.d-flex-3
    section.top-wrap
      .box-content__inside.font-size-base.m-b-8
        span.color-primary {{ eventData.eventName ? `${eventData.eventDesc}` : '请选择执行事件' }}
        p(v-if="eventData.eventTip")
          label
            i.el-icon-info.m-l-8.secondary-text
            i.m-l-8 动作说明：
          span.m-l-8 {{eventData.eventTip}}
      .primary-text 执行目标
      label.secondary-text 目标类型
        el-select.m-l-8(v-model="eventData.targetType", placeholder="请选择", :disabled="!eventData.eventName")
          el-option(v-for="opt in targetTypeOptions", :key="opt.value", v-bind="opt") {{ opt.label }}
      label.secondary-text.m-l-8 目标键名
        el-select.m-l-8(v-model="eventData.target", :multiple="true", placeholder="请选择", :disabled="!eventData.eventName")
          el-option(v-for="item in targetOptions", :key="item.key", :value="item.name")
            span.float-left {{ item.label }}
            span.float-right.m-l-4 {{ item.name }}
    section.center-wrap
      label.primary-text
        span.p-r-8 执行规则
        el-button(type="text", @click="clearRule") 清空
        span.color-danger.font-size-base.float-right {{ validMesg || '' }}
      EventRule(ref="eventRule", :attrs="eventData", v-model="eventData.rules")
      //- component(:is="components[eventData.eventName]")
    section.bottom-wrap
      el-popconfirm(
        confirm-button-text='是的'
        cancel-button-text='不用了'
        icon="el-icon-info"
        icon-color="red"
        title="确定要清空修改内容吗？"
        placement="top-start"
        @confirm="clearEvent")
        el-button(slot="reference") 清空
      el-button-group
        el-button(@click="$emit('cancel')") 取消
        el-button(type="primary", :disabled="unEditable", @click="onSubmit") 确定
</template>

<script>
/** 事件配置器，执行事件的选择 */
import register from './register'
import ruleConfig from './ruleConfig'
import EventRule from './EventRule.vue'
import { pick } from 'lodash'
export default {
  name: 'EventSetter',
  components: {
    EventRule
  },
  props: {
    /* 执行的事件方法{ target, event } */
    value: {
      type: Object,
      default: () => ({})
    },
    field: {
      type: Object,
      default: () => ({})
    },
    canvas: {
      type: Object,
      default: () => ({})
    } // 当前画布信息
  },
  data () {
    return {
      // components: {
      //   visabledEvent: () => import('./visabledEvent')
      // },
      validMesg: '',
      curAction: this.value || {}, // 选中的
      eventOptions: register, // 内置可操作的执行事件
      targetTypeOptions: ruleConfig.targetTypeOptions

    }
  },
  watch: {
    'eventData.targetType' (type, oldType) {
      if (type !== oldType) {
        // 更改目标类型时候，更改目标健名
        this.$set(this.eventData, 'target', [])
      }
    }
  },
  computed: {
    eventData: {
      get () {
        return this.curAction
      },
      set (data) {
        this.curAction = data
      }
    },
    unEditable () {
      return !this.eventData.eventName
    },
    canvasBodyList () {
      return this.canvas?.body.filter(e => e.key !== this.field.key)
    },
    targetOptions () {
      return this.eventData.targetType === 'field' ? this.canvasBodyList : []
    }
  },
  methods: {
    editEvent (event) {
      console.info('event:', event)
      // this.eventData = event
      this.eventData = event
      // this.$set(this.eventData, 'event', event)
      // this.$set(this.eventData, 'eventName', event.eventName)
    },
    onSubmit () {
      const isIllegal = this.$refs.eventRule.validate()
      // console.log('isIllegal:', isIllegal)
      this.validMesg = isIllegal ? '请填写完整条件' : false
      if (!isIllegal) {
        // console.info('传出去:', this.eventData)
        this.$emit('input', this.eventData)
      }
    },
    clearRule () {
      this.validMesg = false
      // this.eventData = {}
      this.$set(this.eventData, 'rules', [])
      this.$refs.eventRule.clearRule()
    },
    clearEvent () {
      this.eventData = pick(this.eventData, ['on'])
      this.clearRule()
      this.$emit('reset', this.eventData)
    }
  }
}
</script>

<style lang='sass' scoped>
.event-setting-box
  display: flex
  justify-content: space-between
  width: 100%
  min-height: 500px
  height: auto
  .left
    margin-right: 8px
  section, ::v-deep section
    border: 1px solid $--border-color-base
    padding: 8px
    & + section
      margin-top: 4px
  .left-content
    .left-event-list
      overflow-y: auto
    .event-item
      padding: 4px 8px
      border: 1px solid $--border-color-base
      margin-top: 8px
      &[is-active="true"]
        background: $--bgcolor-secondary
        color: $--color-primary
        border: 1px $--color-primary
  .right
    display: flex
    flex-direction: column
    .center-wrap
      height: 100%
      flex: 1
      margin: 4px 0

.bottom-wrap
  display: flex
  justify-content: space-between
  align-items: center

</style>
