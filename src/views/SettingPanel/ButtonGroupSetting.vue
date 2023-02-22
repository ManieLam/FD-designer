<template lang='pug'>
.button-list.box-content.p-l-8.p-r-8
  el-collapse(v-model="activeName")
    el-collapse-item(v-for="btn in currentBtns.buttonList", :name="btn.name", :title="btn.label")
      template(slot="title")
        span.secondary-text {{btn.label}}
        i.el-icon-delete.m-l-8.btn-icon(@click.prevent.stop="remove(btn)")
      AttrSettingForm.box-content__inside(
        v-bind="btn"
        v-on="$listeners"
        :key="`button_${btn.key}`"
        :value="btn"
        :attrs="attrs"
        @update="update"
        @updateAnAttr="updateAnAttr")
  .bottom-tool.w-100.text-center.m-t-8
    el-button.w-100(size="small", type="primary", @click="add") 增加
</template>

<script>
/* 按钮组类型的属性配置 */
import AttrSettingForm from '@/components/AttrSettingForm'
import { buttonConf } from '@/model/defaultConfig'
import { remove } from 'lodash'
export default {
  name: 'ButtonGroupSetting',
  components: {
    AttrSettingForm
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
    },
    btnLen () {
      return this.currentBtns?.buttonList?.length
    }
  },
  methods: {
    update (attrs) {
      console.log('更新全部', attrs)
    },
    updateAnAttr (attr) {
      console.log('更新单个属性:', attr)
    },
    remove (e) {
      // console.log('remove:', e)
      if (this.btnLen <= 1) {
        this.$message.warning('不可删除')
      } else {
        const list = this.currentBtns.buttonList
        remove(list, (btn) => {
          console.log('移除:', btn)
          return btn.name === e.name
        })
        // console.log('删除后:', list)
        this.$set(this.currentBtns, 'buttonList', list)
        this.$nextTick(() => { this.$forceUpdate() })
      }
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
