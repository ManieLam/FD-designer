<template lang='pug'>
.form-remote-list
  el-button(v-show="!remoteData || !remoteData.length", @click="addResource") 配置数据接口
  //- .list-column__default.m-t-4
  .list-column
    .d-flex-1.m-r-4
      form-remote(
        v-for="(api, i) in remoteData"
        v-bind="$attrs"
        :value="api"
        :key="`api_${i}`"
        :ref="`api_${i}`"
        :isSelected="remoteDataName"
        @input="getNewResource($event, i)"
        @refuse="dialogClosed(i)"
        @remove="removeResource(i)")
    .row-button.m-t-4(v-show="!!remoteData.length")
      i.el-icon-plus.color-primary.btn-radius-50(@click="addResource")
      i.el-icon-connection.btn-radius-50.color-primary(title="设置数据规则", @click="setRules")
</template>

<script>
/** 多个数据请求接口 */
import { ApiData } from '@/model/resource.js'
import { isEqual } from 'lodash'
export default {
  name: 'FormRemoteList',
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      setAsyncVisible: false
    }
  },
  computed: {
    remoteData: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    },
    remoteDataName () {
      return this.remoteData.map(api => api.name)
    }
  },
  methods: {
    getAsyncSeting (data) {
      this.remoteData = data
    },
    getNewResource (api, index) {
      // console.info('获取到新的接口', api, index)
      if (api) {
        // 保持唯一性
        const hasOne = this.remoteData.some(r => isEqual(r, api))
        if (!hasOne) {
          this.$set(this.remoteData, index, api)
        } else {
          this.$message.warning('重复选择同一个接口')
        }
      }
    },
    addResource () {
      this.remoteData.push(new ApiData({ url: '/' }))
      this.$nextTick(() => {
        const nIndex = this.remoteData.length - 1
        if (nIndex >= 0) {
          this.$refs[`api_${nIndex}`][0].setAsyncVisible = true
        }
      })
    },
    dialogClosed (i) {
      // console.info('弹窗关闭', this.remoteData[i]?.url?.length)
      // 清除伪数据
      if (this.remoteData[i]?.url?.length <= 1) {
        this.$delete(this.remoteData, i)
      }
    },
    removeResource (i) {
      this.$delete(this.remoteData, i)
    },
    setRules () {}
  }
}
</script>

<style lang='sass' scoped>

</style>
