<template lang='pug'>
.button-list.box-content
  el-collapse(v-model="activeCollapse")
    el-collapse-item.list-item(
      v-for="(btn, i) in currentBtns"
      :key="btn.name"
      :name="btn.name"
      :title="btn.label")
      //- el-checkbox(slot="title", v-model="activeCollapse") {{btn.label}}
      template(slot="title")
        span.secondary-text(style="color: #606266;") {{btn.label}}
        i.el-icon-delete.m-l-8.btn-icon(@click.prevent.stop="remove(btn, i)")
      ButtonItemSetting.box-content__collapse(
        :key="btn.name"
        v-bind="btn"
        :value="btn"
        :attrs="buttonConfig[btn.name] ? buttonConfig[btn.name].attrs : buttonConfig.attrs"
        :actions="buttonConfig[btn.name] ? buttonConfig[btn.name].actions : buttonConfig.actions"
        @updateAction="updateAction($event, btn, i)"
        @input="updateButton")

  //- 考虑步骤性质的表单，提交不一定是异步提交
  .footer-wrap.w-100.text-center.m-t-8
    //- 下拉选择类型
    el-dropdown(split-button, @command="add") 增加操作按钮
      //- el-button(icon="el-icon-plus")
      el-dropdown-menu(slot="dropdown")
        el-dropdown-item(
          v-for="opt in buttonTypeOptions"
          v-bind="opt"
          :key="opt.value"
          :command="opt.value"
          :disabled="hasChosen.includes(opt.value)"
        ) {{opt.label}}
  </template>

<script>
/** 表单按钮配置 */
import { button as buttonConfig } from '@/model/componentAttrs.js'
// import { formButtons } from '@/model/defaultConfig'
// import { isEqual } from 'lodash'
import { buttonConf, formButtons } from '@/model/defaultConfig'
import ButtonGroupSetting from '../ButtonGroupSetting/index.vue'
import ButtonItemSetting from '../ButtonGroupSetting/ButtonItemSetting.vue'
export default {
  name: 'FormButtonList',
  model: {
    prop: 'list',
    event: 'change'
  },
  components: {
    ButtonGroupSetting,
    ButtonItemSetting
  },
  props: {
    list: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    const buildInList = ['submit', 'reset', 'cancel'] // 内定按钮name, 注意！一个画布=1个表单

    return {
      buildInList,
      activeCollapse: [],
      buttonConfig,
      allBtns: {}, // 所有按钮, <Object>
      allBtnList: [],
      buttonTypeOptions: [...buildInList, 'NORMAL'].map(key => {
        return {
          label: formButtons[key]?.label || '普通按钮',
          value: key
        }
      })
    }
  },
  computed: {
    /* 所有按钮：<Array> */
    currentBtns: {
      get () {
        // return this.list
        // return Object.values(this.allBtns)
        return this.allBtnList
      },
      set (data) {
        console.log('改变了按钮:', data)
        // this.allBtns = Array.isArray(data) ? keyBy(data, 'name') : data
        // this.$emit('change', data)
        this.allBtnList = data
      }
    },
    hasChosen () {
      return this.currentBtns.map(btn => btn.name)
    }
  },
  // watch: {
  //   currentBtns: {
  //     deep: true,
  //     handler (list, oldList) {
  //       console.log('watch change 新：', list)
  //       console.log('watch change 旧：', oldList)
  //       if (!isEqual(list, oldList)) {
  //         // 因为双向绑定的是Array，失效
  //         this.$emit('change', list)
  //       }
  //     }
  //   }
  // },
  methods: {
    updateAction (actions, btn, index) {
      this.$set(this.currentBtns[index], 'actions', actions)
    },
    updateButton (list) {
      console.log('updateButton 更新了按钮组:', list, this.currentBtns)
      // 因为双向绑定的是Array，失效
      this.$emit('change', this.currentBtns)
    },
    add (command) {
      // console.info('新增按钮', command)
      const btnName = `btn_${Math.floor(Math.random() * 100)}`
      const btnConf = command === 'NORMAL' ? buttonConf({
        name: btnName,
        sort: this.currentBtns.length,
        bindEventListener: true,
        id: `ansoBtns-${btnName}`
      }) : formButtons[command]
      if (btnConf) {
        this.currentBtns.push(btnConf)
        this.$emit('change', this.currentBtns)
        // this.currentBtns = [...this.currentBtns, btnConf]
      }
    },
    remove (btn, index) {
      this.$delete(this.currentBtns, index)
      // 因为双向绑定的是Array，失效
      console.log('删除后:', this.currentBtns)
      this.$emit('change', this.currentBtns)
    }
  },
  mounted () {
    // this.allBtns = keyBy(cloneDeep(this.list), 'name')
    this.allBtnList = this.list
  }
}
</script>

<style lang='sass' scoped>
  // .list-item + .list-item
  //   margin-top: 8px
  .button-list-item
    margin-top: 4px

  // .list-item-comp
  //   flex: 1

</style>
