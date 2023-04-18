<template lang='pug'>
.left-wrap.d-flex-column
  .left-wrap-tool
    .d-flex-row-between.d-flex-v-center
      .d-flex-1.text.color-secondary 环境
        //- el-checkbox(v-model="allSelectedVisable") 查看画布内已选的数据源
      el-button-group
        el-button(icon="el-icon-plus", title="新增环境", @click="addService")
  .left-wrap-list.d-flex-1.m-t-8
    //- 左边环境列表
    .left-item.list-row.d-flex-row-between.align-items-center.hover-change-bgColor(
      v-for="(service, index) in list"
      :key="service.name"
      :id="service.name"
      :is-active="compSelected.name === service.name"
      @click="() => onSelect(service)")
      .text-left {{service.title}}
      .text-right(v-show="service.delAble")
        i.iconfont.el-icon-delete(@click="onDeleteEnv(index)", title="删除环境")
</template>

<script>
import { EnvModel } from '@/model/service'
export default {
  name: 'ServerList',
  props: {
    // 当前选择的对象
    value: {
      type: Object,
      default: () => ({})
    }
  },
  components: {},
  data () {
    return {
      list: this.$gbServer
    }
  },
  computed: {
    compSelected: {
      get () {
        return this.value
      },
      set (data) {
        this.$emit('input', data)
      }
    }
  },
  watch: {},
  methods: {
    onDeleteEnv (index) {
      this.list.splice(index, 1)
    },
    // 增加环境
    addService () {
      const hasEmpty = this.list.find(item => !item.label)
      // console.info('不存在空白环境:', hasEmpty)
      if (!hasEmpty) {
        // 不存在空白环境才可添加
        // const evnKey = `env_${ New Date().getTime() }`
        this.list.push(new EnvModel({
          name: 'env_' + new Date().getTime(),
          delAble: true
        }))
        this.$nextTick(() => {
          // this.serviceData = this.list[this.list.length - 1]
          this.compSelected = this.list[this.list.length - 1]
          // this.$emit('select', this.selected)
        })
      } else {
        document.getElementById(hasEmpty.name).focus()
      }
    },
    onSelect (service) {
      this.$emit('select', service)
      this.compSelected = service
    }
  },
  mounted () {}
}
</script>

<style scoped lang='sass'>
.left-wrap
  width: 20%
  overflow-y: auto
  background: rgb(243 244 249 / 30%)
  .list-row
    // border: 1px solid $--border-color-base
    padding: 8px
    cursor: pointer
    position: relative
    // &:hover
    //   background: $--bgcolor-secondary
    & + .list-row
      margin-top: 8px
      // border-top: 1px solid $--border-color-base
    &[is-active], &:hover
      background: $--bgcolor-secondary
      border-radius: 4px
      color: $--color-primary
</style>
