<template lang='pug'>
.button-list.box-content.p-t-8.p-b-8
  el-collapse(v-model="activeName")
    //- el-checkbox(v-model="checked") 是否需要按钮
    el-collapse-item.list-item(name="hasSubmit")
      el-checkbox(slot="title", v-model="hasSubmit") 提交按钮
      .box-content__collapse
        .button-list-item.d-flex-v-center(v-if="hasSubmit", v-for="(attr, i) in buttonAttrs.submit", :key="i")
          .secondary-text.m-r-8(style="min-width: 100px;") {{attr.label}}
          components.list-item-comp(:is="attr.tag", v-model.lazy="buttonData.submit[attr.key]", v-bind="attr")

    el-collapse-item.list-item(name="hasReset")
      el-checkbox(slot="title", v-model="hasReset") 重置按钮
      .box-content__collapse
        .button-list-item.d-flex-v-center(v-if="hasReset", v-for="(attr, i) in buttonAttrs.reset", :key="i")
          .secondary-text.m-r-8(style="min-width: 100px;") {{attr.label}}
          components.list-item-comp(:is="attr.tag", v-model.lazy="buttonData.reset[attr.key]", v-bind="attr")

    el-collapse-item.list-item(name="hasCancel")
      el-checkbox(slot="title", v-model="hasCancel") 取消按钮
      .box-content__collapse
        .button-list-item.d-flex-v-center(v-if="hasCancel", v-for="(attr, i) in buttonAttrs.cancel", :key="i")
          .secondary-text.m-r-8(style="min-width: 100px;") {{attr.label}}
          components.list-item-comp(:is="attr.tag", v-model.lazy="buttonData.cancel[attr.key]", v-bind="attr")

  //- 考虑步骤性质的表单，提交不一定是异步提交
  .footer-wrap.w-100.text-center.m-t-8
    el-button(icon="el-icon-plus") 自定义操作按钮（TODO）

</template>

<script>
/** 表单按钮配置 */
import { button as buttonConfig } from '@/utils/componentAttrs.js'
import { formButtons } from '@/utils/defaultConfig.js'
import { keyBy, isEqual, cloneDeep } from 'lodash'
export default {
  name: 'ButtonSetting',
  model: {
    prop: 'list',
    event: 'change'
  },
  props: {
    list: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      activeName: ['hasSubmit', 'hasReset', 'hasCancel'],
      buttonAttrs: {
        submit: buttonConfig.submitAttrs,
        reset: buttonConfig.resetAttrs,
        cancel: buttonConfig.cancelAttrs
      },
      btnObj: keyBy(cloneDeep(this.list), 'name')
    }
  },
  watch: {
    buttonData: {
      deep: true,
      handler (data) {
        console.info('按钮变化', data, this.oldBtnTemp, isEqual(data, this.oldBtnTemp))
        if (!isEqual(data, this.oldBtnTemp)) {
          this.$emit('change', Array.isArray(data) ? data : Object.values(data))
        }
      }
    }
  },
  computed: {
    oldBtnTemp () {
      return keyBy(cloneDeep(this.list), 'name')
    },
    hasSubmit: {
      get () {
        return !!this.buttonData?.submit
      },
      set (flag) {
        this.changeButtons('submit', flag)
      }
    },
    hasReset: {
      get () {
        return !!this.buttonData?.reset
      },
      set (flag) {
        this.changeButtons('reset', flag)
      }
    },
    hasCancel: {
      get () {
        return !!this.buttonData?.cancel
      },
      set (flag) {
        this.changeButtons('cancel', flag)
      }
    },
    buttonData: {
      get () {
        return this.btnObj
      },
      set (data) {
        console.info('修改button list', data)
        this.btnObj = Array.isArray(data) ? keyBy(data, 'name') : data
      }
    }
  },
  methods: {
    // setData (list = []) {
    //   if (list && list.length) {
    //     this.buttonData = { ...this.btnObj }
    //   }
    // },
    changeButtons (name, flag) {
      if (flag) {
        this.$set(this.buttonData, name, this.btnObj[name] || formButtons[name])
      } else {
        this.$delete(this.buttonData, name)
      }
    }
  },
  mounted () {
    // this.setData(this.list)
  }
}
</script>

<style lang='sass' scoped>
.list-item + .list-item
  margin-top: 8px
.button-list-item
  margin-top: 4px

// .list-item-comp
//   flex: 1

</style>
