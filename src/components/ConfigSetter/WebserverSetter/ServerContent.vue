<template lang='pug'>
.right-custom-data.d-flex-1.p-r-8
  //- 环境配置
  el-form(ref="apiForm", :model="computedData", label-position="left")
    el-form-item(label="环境名称", prop="label")
      el-input(v-model="computedData.label")
    el-form-item(label="服务配置（前置URL）", prop="urls")
      //- el-input(v-model="computedData.group", placeholder="请输入分组标题名称")
      form-list(
        v-model="computedData.urls"
        style="width: 90%"
        :columnProps="urlColumnProps"
        :draggable="false")
    el-form-item(label="环境变量", prop="vars")
    //- el-form-item(label="头部参数", prop="vars")
    //- el-form-item(label="头部参数", prop="vars")
</template>

<script>
export default {
  name: 'ServerContent',
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  components: {},
  data () {
    return {
      urlColumnProps: [
        { label: '服务名', prop: 'title' },
        { label: '前置URL', prop: 'url' }
      ]
    }
  },
  computed: {
    computedData: {
      get () {
        return this.value
      },
      set (obj) {
        this.$emit('input', obj)
      }
    }
  },
  watch: {},
  methods: {},
  mounted () {}
}
</script>

<style scoped lang='sass'>
</style>
