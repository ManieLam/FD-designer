<template lang='pug'>
.button-list.box-content.p-l-8.p-r-8
  el-collapse(v-model="activeName")
    el-collapse-item(v-for="(btn, i) in currentBtns.buttonList", :name="btn.name", :title="btn.label")
      template(slot="title")
        span.secondary-text {{btn.label}}
        i.el-icon-delete.m-l-8.btn-icon(@click.prevent.stop="remove(btn)")
      AttrSettingForm.box-content__inside(
        v-bind="btn"
        v-on="$listeners"
        :key="`button_${btn.name}`"
        :value="btn"
        :attrs="attrs"
        @update="update"
        @updateAnAttr="updateAnAttr")
      CompActionSetting.m-t-8.box-content__inside(
        v-bind="$attrs"
        v-on="$listeners"
        :key="`button_action_${btn.name}`"
        :value="btn"
        :attrs="actions"
        @input="updateAction($event, btn, i)")
  .bottom-tool.w-100.text-center.m-t-8
    el-button.w-100(size="small", type="primary", @click="add") 增加
</template>

<script>
/* 按钮组类型的属性配置 */
import AttrSettingForm from '@/components/AttrSettingForm'
import CompActionSetting from './CompActionSetting'
import { buttonConf } from '@/model/defaultConfig'
export default {
  name: 'ButtonGroupSetting',
  components: {
    AttrSettingForm,
    CompActionSetting
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    },
    /* 属性配置 { label,key,tag,group } */
    attrs: {
      type: Array,
      default: () => ([])
    },
    /* 操作事件配置 */
    actions: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      activeName: []
    }
  },
  computed: {
    currentBtns: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    update (attrs) {
      console.log('更新全部', attrs)
    },
    updateAnAttr (attr) {
      console.log('更新单个属性:', attr)
    },
    updateAction (actions, btn, index) {
      // console.log('更新操作事件:', actions)
      this.$set(this.currentBtns.buttonList[index], 'actions', actions)
    },
    remove (e) {
      const index = this.currentBtns.buttonList.findIndex(btn => btn.name === e.name)
      this.$delete(this.currentBtns.buttonList, index)
      // console.log('remove:', this.$store.state.canvas.canvas)
    },
    add () {
      this.currentBtns.buttonList.push({ ...buttonConf({ name: `btn_${Math.floor(Math.random() * 100)}` }) })
    }
  },
  mounted () {}
}
</script>

<style scoped lang=sass>

</style>
