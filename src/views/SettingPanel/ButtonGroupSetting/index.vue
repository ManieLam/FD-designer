<template lang='pug'>
.button-group-setting.box-content
  el-collapse(v-model="activeName")
    el-collapse-item(
      v-for="(btn, i) in currentBtns"
      :name="btn.name"
      :title="btn.label")
      template(slot="title")
        slot(name="title", :data="btn")
          span.secondary-text {{btn.label}}
          i.el-icon-delete.m-l-8.btn-icon(@click.prevent.stop="remove(btn)")
      ButtonItemSetting(
        v-bind="btn"
        v-on="$listeners"
        :key="`button_${btn.name}`"
        :value="btn"
        :attrs="attrs"
        :actions="actions"
        @updateAction="updateAction($event, btn, i)")

  .bottom-tool.w-100.text-center.m-t-8(v-if="addAble")
    el-button.w-100(size="small", type="primary", @click="add") 增加
</template>

<script>
/* 按钮组类型的属性配置, 接受ansoButtonGroup的props属性 */
// import AttrSettingForm from '@/components/AttrSettingForm'
// import CompActionSetting from './CompActionSetting'
import ButtonItemSetting from './ButtonItemSetting'
import { buttonConf } from '@/model/defaultConfig'
export default {
  name: 'ButtonGroupSetting',
  components: {
    ButtonItemSetting
  },
  props: {
    /* 接受ansoButtonGroup的props属性 */
    value: {
      type: Array,
      default: () => ([])
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
    },
    addAble: {
      type: Boolean,
      default: true
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
        console.log('is emit')
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
      this.$set(this.currentBtns[index], 'actions', actions)
    },
    remove (e) {
      const index = this.currentBtns.findIndex(btn => btn.name === e.name)
      this.$delete(this.currentBtns, index)
      // console.log('remove:', this.$store.state.canvas.canvas)
    },
    add () {
      this.currentBtns.push({ ...buttonConf({ name: `btn_${Math.floor(Math.random() * 100)}` }) })
    }
  },
  mounted () {}
}
</script>

<style scoped lang=sass>

</style>
