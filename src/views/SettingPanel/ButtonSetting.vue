<template lang='pug'>
.button-list
  //- el-checkbox(v-model="checked") 是否需要按钮
  .list-item
    el-checkbox(v-model="hasSubmit") 提交按钮
    .box-content__inside
      .button-list-item.d-flex-v-center(v-if="hasSubmit", v-for="(attr, i) in buttonAttrs.submit", :key="i")
        .secondary-text.m-r-8(style="min-width: 100px;") {{attr.label}}
        components.list-item-comp(:is="attr.tag", v-model.lazy="buttonData.submit[attr.key]")
  .list-item
    el-checkbox(v-model="hasReset") 重置按钮
    .box-content__inside
      .button-list-item.d-flex-v-center(v-if="hasReset", v-for="(attr, i) in buttonAttrs.reset", :key="i")
        .secondary-text.m-r-8(style="min-width: 100px;") {{attr.label}}
        components.list-item-comp(:is="attr.tag", v-model.lazy="buttonData.reset[attr.key]")
  .list-item
    el-checkbox(v-model="hasCancel") 取消按钮
    .box-content__inside
      .button-list-item.d-flex-v-center(v-if="hasCancel", v-for="(attr, i) in buttonAttrs.cancel", :key="i")
        .secondary-text.m-r-8(style="min-width: 100px;") {{attr.label}}
        components.list-item-comp(:is="attr.tag", v-model.lazy="buttonData.cancel[attr.key]")

  //- 考虑步骤性质的表单，提交不一定是异步提交

</template>

<script>
/** 表单按钮配置 */
import { button as buttonConfig } from '@/utils/componentAttrs.js'
import { formButtons } from '@/utils/defaultConfig.js'
import { keyBy } from 'lodash'
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
      buttonAttrs: {
        submit: buttonConfig.submitAttrs,
        reset: buttonConfig.resetAttrs,
        cancel: buttonConfig.cancelAttrs
      },
      btnObj: keyBy(this.list, 'name')
    }
  },
  watch: {
    buttonData: {
      deep: true,
      handler (data) {
        console.info('更新按钮组数据')
        this.$emit('change', Array.isArray(data) ? data : Object.values(data))
      }
    }
  },
  computed: {
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
    setData (list = []) {
      if (list && list.length) {
        this.buttonData = { ...this.btnObj }
      }
    },
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
