<template lang='pug'>
//- 请求地址的3位转换
.section-api-url
  //- el-checkbox(v-model="isFollowParent")
  //-   span.secondary-text 跟随画布设置
  el-input.api-input(
    :value="apiurlMix[2]"
    placeholder="请输入相对地址，无需带http(s)://前缀，以/开头，默认跟随系统配置"
    @input="handleInput")
    template(slot="prepend")
      .apiurl-prepend(@click="toggleChooseServer")
        span.prepend-server(v-if="!isFullInput", :hidden="isFullInput") {{curServerURL || ''}}
        span.apiurl-prepend-icon.el-icon-plus(v-else)
        el-cascader-panel.prepend-server-cascader(
          v-if="chooseServerVisable"
          slot="dropdown"
          :value="serverName"
          :options="allServer"
          :props="chooseServerPanel"
          @change="chooseServer")
  //- template(slot="append")
  //-   .apiurl-append
  //-     el-checkbox(v-model="isFollowParent") 跟随画布设置
</template>

<script>
// import { debounce } from 'lodash'
export default {
  name: 'ApiUrl',
  props: {
    value: {
      type: String,
      default: () => ({})
    },
    apiData: {
      type: Object,
      default: () => ({})
    }
  },
  components: {},
  data () {
    return {
      chooseServerVisable: false,
      chooseServerPanel: {
        children: 'urls',
        label: 'title',
        value: 'name',
        leaf: 'url',
        expandTrigger: 'hover'
      },
      regex: {
        isHttp: /^https?:\/\/|http?:\/\//i
      },
      // isFollowParentService: true,
      urlStr: ''
    }
  },
  computed: {
    allServer () {
      return this.$store.getters.getCanvasEnv()
    },
    serverName () {
      return [
        this.apiurlMix[0]?.replace(/<|>/g, ''),
        this.apiurlMix[1]?.replace(/<|>/g, '')
      ]
    },
    curServer () {
      const ip = this.serverName[0]
      return ip ? this.allServer.find(s => s.name === ip) : {}
    },
    curServerURL () {
      const name = this.serverName[0].indexOf('__') > -1 ? 'BASE' : this.serverName[1]
      return this.curServer?.urls?.find(url => url.name === name)?.url || '无服务'
    },
    isFullInput () {
      return !this.apiurlMix[0] && !this.apiurlMix[1] && this.regex.isHttp.test(this.apiurlMix[2])
    },
    apiurlMix: {
      get () {
        // console.log('get apiurl')
        return this.strToArr(this.urlStr)
      },
      set (value) {
        this.urlStr = this.arrToStr(value)
        // console.log('set apiurl', this.urlStr)
        this.$emit('input', this.urlStr)
      }
    // },
    // isFollowParent: {
    //   get () {
    //     console.log('get follow')
    //     // ip和服务都是默认替换字样，则是跟随画布配置
    //     const checkIp = this.apiurlMix[0] === '__parent.id__'
    //     const checkService = this.apiurlMix[1] === '__parent.service__'
    //     return checkIp && checkService
    //   },
    //   set (value) {
    //     console.log('set follow', value)
    //     if (value) {
    //       this.apiurlMix[0] = '__parent.id__'
    //       this.apiurlMix[1] = '__parent.service__'
    //     } else {
    //       this.apiurlMix[0] = ''
    //       this.apiurlMix[1] = ''
    //     }
    //     // this.$emit('change', { ...this.apiData, isFollowParent: value })
    //   }
    }
  },
  watch: {
    value: {
      handler (value) {
        if (value !== this.urlStr) {
          this.apiurlMix = this.strToArr(this.value)
        }
      }
    }
  },
  methods: {
    arrToStr (list = []) {
      // console.log('arrToStr:', list)
      if (!list || !Array.isArray(list)) return list
      return list.reduce((str, val, index) => {
        if (val) {
          str += `${index >= 1 && str.length > 0 && val.charAt(0) !== '/' && !/https?:\/\/|http?:\/\//ig.test(val) ? '/' : ''}${val}`
        }
        return str
      }, '')
    },
    strToArr (data = '') {
      let arr = Array.from({ length: 3 })
      // console.log('strToArr data:', data)
      if (typeof data === 'string') {
        const matchs = data.match(/^<(\w+)>\/<(\w.+)>/)
        console.log('matchs:', matchs)
        if (this.regex.isHttp.test(data) && !matchs) {
          // 自输入的链接，不做分割
          arr = ['', '', data]
        } else {
          if (matchs) {
            // 带动态服务地址
            const last = data.replace(matchs[0], '')
            arr = [`<${matchs[1]}>`, `<${matchs[2]}>`, last]
          } else {
            // 不带地址，使用默认服务
            // console.info(this.$store.getters.getServerInuse)
            const [ipName, serviceName] = this.$store.getters.getServerInuse.inuseNode
            // console.log('store:', ipName, serviceName)
            arr = [`<${ipName}>`, `<${serviceName}>`, data]
            // arr = ['<__parent.ip__>', '<__parent.default__>', data]
          }
        }
      }
      return arr
    },
    toggleChooseServer () {
      this.chooseServerVisable = !this.chooseServerVisable
    },
    chooseServer (value) {
      // console.log('选择服务:', value)
      const inuseEnv = this.$store.getters.getServerInuse?.env
      this.apiurlMix = [
        `<${value[0]}>`,
        `<${value[1]}>`,
        this.apiurlMix[2]
      ]
      // 通知修改为非跟随父类默认值
      this.$emit('changeInPrivate', inuseEnv && inuseEnv.name !== value[0])
    },
    handleInput: function (value) {
      // console.log('监听到apiurlMix:', value)
      const dataList = [...this.apiurlMix]
      dataList[2] = value
      this.apiurlMix = dataList
    }
  },
  created () {
    this.apiurlMix = this.strToArr(this.value)
    // console.log('is mounted:', this.apiurlMix)
  }
}
</script>

<style scoped lang='sass'>
.api-input
  position: relative
.apiurl-prepend
  width: max-content
  // min-width: 100px
  cursor: pointer
  transition: all 0.3s
  &[hidden="true"]
    width: 0
    min-width: 0
  // .apiurl-prepend-icon
  //   width: 100px
.prepend-server-cascader
  position: absolute
  top: 32px
  left: 0
  z-index: 1
  background: #fff
</style>
