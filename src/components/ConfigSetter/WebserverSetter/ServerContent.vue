<template lang='pug'>
.right-custom-data.d-flex-1.p-r-8
  //- 环境配置
  el-form(ref="apiForm", :model="computedData", label-position="left")
    el-form-item(label="环境名称", prop="title")
      el-input(v-model="computedData.title")
    el-form-item(label="服务配置（前置URL）", prop="urls")
      //- el-input(v-model="computedData.group", placeholder="请输入分组标题名称")
      form-list(
        v-model="computedData.urls"
        style="width: 90%"
        :columnProps="urlColumnProps"
        :draggable="false"
        :initListDatafunc="initServiceRowfunc")
        template(v-slot:name="slotProp")
          label.service-label.primary-text {{slotProp.index + 1}}
    el-form-item(label="环境变量", prop="vars")
    //- el-form-item(label="头部参数", prop="vars")
    //- el-form-item(label="头部参数", prop="vars")
</template>

<script>
import { debounce } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
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
        { label: '序号', prop: 'name' },
        { label: '服务标题', prop: 'title' },
        { label: '前置URL', prop: 'url', placeholder: '请以http://或https://开头' }
      ]
    }
  },
  computed: {
    computedData () {
      return this.value
    }
  },
  watch: {
    'computedData.urls': {
      deep: true,
      handler: debounce(function (urls, oldUrls) {
        // console.log('匹配到的改变:', urls, oldUrls)
        this.$emit('syncServer', urls)
      }, 800)
    }
  },
  methods: {
    initServiceRowfunc (obj, key) {
      obj[key] = key === 'name' ? uuidv4() : ''
      return obj
    }
    // setComputedUrl (urls) {
    //   console.log('改变后的urls:', urls)
    //   // this.computedData.urls
    //   this.$set(this.computedData, 'urls', this.computedData.urls.map(data => {
    //     if (data.name) return
    //     if (data.url) {
    //       // 不可靠的写法：给服务赋名，因为input是监听list
    //       const name = data.url?.match(/(?<=\/)\w+$/g)
    //       console.log('匹配到的名称:', name)
    //       if (name) this.$set(data, 'name', data.name || name[0] || '')
    //     }
    //   }))
    // }
  },
  mounted () {}
}
</script>

<style scoped lang='sass'>
.service-label
  text-align: center
  display: inline-block
  width: 100%
  padding-bottom: 0
</style>
