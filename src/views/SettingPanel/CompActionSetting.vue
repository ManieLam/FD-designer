<template lang='pug'>
.setting-list
  .section-box
    el-dropdown.w-100(trigger="click", @command="addAction")
      el-button.w-100(@click="toggleOpen")
        span 添加事件
        i.el-icon-arrow-down.el-icon--right
      el-dropdown-menu.dropdown-menu(slot="dropdown")
        el-dropdown-item.w-100(
          v-for="item in attrs"
          :key="item.type"
          :divided="true"
          :disabled="item.type|hasChoosen(actionData)"
          :command="item.type")
          .d-flex-row-between.w-100.dropdown-menu-item
            .left {{item.type}}
            .right.secondary-text {{item.desc}}
  //- 为操作事件绑定方法
  .section-box
    .action-item.list-column__default.m-t-8(v-for="(action, index) in actionData", :key="action.on")
      .left {{action.on}}
      .right
        i.el-icon-edit-outline.cursor-pointer.color-primary.btn-radius-50(title="指定触发事件", @click="editAction(action, index)")
        i.el-icon-delete.cursor-pointer.color-primary.btn-radius-50(@click="removeAction(index)")
  //- 事件事务
  SmartDialog(:title="`${editingAction.on}触发事件`", v-model="eventSettingVisable")
    EventSetter(
      v-bind="$attrs"
      :field="value"
      v-model="editingAction"
      @input="changeAction"
      @cancel="cancelAction"
      @reset="reset")
</template>

<script>
/** 组件行为配置 */
import EventSetter from '@/components/EventSetter'
import { FormtagActions } from '@/model/componentAttrs'
export default {
  name: 'CompActionSetting',
  components: {
    EventSetter
  },
  props: {
    // 字段配置信息
    value: {
      type: Object,
      default: () => ({})
    },
    attrs: {
      type: Array,
      default: () => ([])
    }
    // // xuan
  },
  data () {
    return {
      eventSettingVisable: false, // 查看弹窗事件
      isOn: false, // 是否准备添加
      selectVal: '', // 选择待添加的事件
      editingIndex: -1,
      editingAction: {} // 待编辑的事件
    }
  },
  filters: {
    hasChoosen (command, arr) {
      return arr.some(item => item?.on === command)
    }
  },
  computed: {
    actionData: {
      get () {
        return this.value?.actions || []
      },
      set (value) {
        console.info('set actionData:', value)
        this.$emit('input', value)
      }
    }
  },
  methods: {
    toggleOpen () {
      this.isOn = !this.isOn
      this.selectVal = ''
    },
    addAction (command) {
      this.editingAction = new FormtagActions({
        on: command
      })
      this.actionData = [...this.actionData, this.editingAction] // 追尾添加
      this.editingIndex = this.actionData.length - 1 // 新增时候永远是取最后一位
      this.$nextTick(() => {
        this.isOn = false
        this.eventSettingVisable = true
      })
    },
    editAction (action, index) {
      this.editingAction = action
      this.editingIndex = index
      console.info('触发edit:', this.editingIndex)
      this.eventSettingVisable = !this.eventSettingVisable
    },
    removeAction (index) {
      console.info('index:', index)
      // this.$delete(this.actionData, index)
      this.actionData.splice(index, 1)
    },
    // 点击确定时候才会更新数据
    changeAction (action) {
      console.info('action._index', action)
      // this.editingAction = action
      // const index = this.actionData.findIndex(d => d.on === )
      // this.$set(this.actionData, this.editingIndex, { ...this.actionData[this.editingIndex], ...action })
      // this.actionData[this.editingIndex] = { ...this.actionData[this.editingIndex], ...action }
      const newData = { ...this.actionData[this.editingIndex], ...action }
      console.log('newData:', newData)
      this.actionData.splice(this.editingIndex, 1, newData)
      // console.info('changeAction', this.actionData)
      this.$nextTick(() => {
        this.eventSettingVisable = false
      })
    },
    cancelAction () {
      this.eventSettingVisable = false
      this.editingAction = {}
      this.editingIndex = -1
      // this.actionData = []
    },
    reset (resetData) {
      this.isOn = false
      this.selectVal = ''
      this.actionData.splice(this.editingIndex, 1, resetData)
      this.editingAction = resetData
      // this.editingAction = {}
      // this.editingIndex = -1
    }
  }
}
</script>

<style lang='sass' scoped>
.dropdown-menu-item
  margin-left: 30px
  text-align: left
  text-indent: 10px
  align-items: center
  // margin-top: 8px
  line-height: 2.5
  // text-indent: 30px
</style>
