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
      urlStr: '',
      /* cascader数据对当前url数值的格式转换回显 */
      serverName: ''
    }
  },
  computed: {
    allServer () {
      return this.$store.getters.getCanvasEnv()
    },
    /* 当前画布正在使用的环境 */
    curCanvasInuse () {
      return this.$store.getters.getServerInuse || {}
    // },
    // /* cascader数据对当前url数值的格式转换回显 */
    // serverName () {
    //   // console.log('serverName 监听的 apiurlMix:', this.apiurlMix)
    //   // const slideArr =
    //   return this.apiurlMix.slice(0, 2).map((val, index) => {
    //     const valStr = val.replace(/<|>/g, '')
    //     if (this.checkIsFollowParent(valStr)) {
    //       return this.curCanvasInuse.inuseNode[index]
    //     } else {
    //       return val
    //     }
    //   })
      // return [
      //   this.apiurlMix[0]?.replace(/<|>/g, ''),
      //   this.apiurlMix[1]?.replace(/<|>/g, '')
      // ]
    },
    /* 显示当前使用环境服务的url，当跟随canvas时，显示canvas的inuse的url，将arr格式转为str */
    curServerURL () {
      // const { env, inuseNode } = this.curCanvasInuse
      // console.info('获取当前环境:')
      return this.checkIsFollowParent(`${this.apiurlMix[0]}/${this.apiurlMix[1]}`, true) ? this.curCanvasInuse.inuseNode[2] : this.getOthersEnv() || '默认服务'
    },
    /* 完整输入了http://|https://开头的地址 */
    isFullInput () {
      return !this.apiurlMix[0] && !this.apiurlMix[1] && this.regex.isHttp.test(this.apiurlMix[2])
    },
    apiurlMix: {
      get () {
        return this.strToArr(this.urlStr)
      },
      set (value) {
        this.urlStr = this.arrToStr(value)
        this.$emit('input', this.urlStr)
      }
    }
  },
  watch: {
    value: {
      handler (value) {
        if (value !== this.urlStr) {
          this.apiurlMix = this.strToArr(this.value)
        }
      }
    },
    apiurlMix (list) {
      // console.info('apiurlMix 修改到了:', list)
      const serviceList = list.slice(0, 2).map((val, index) => {
        // const valStr = val.replace(/<|>/g, '')
        if (this.checkIsFollowParent(val)) {
          console.log('1', this.curCanvasInuse.inuseNode)
          return this.curCanvasInuse.inuseNode[index]
        } else {
          console.log('2')
          return val.replace(/<|>/g, '')
        }
      })
      console.info('apiurlMix 修改到了 serviceList:', serviceList)
      this.serverName = ''
      this.serverName = serviceList
    }
  },
  methods: {
    /* 判断是否跟随父级环境，不存在"<>"和http://|https://开头的，则属于跟随父级Ip和服务(只要修改了服务即可认为不同父类服务) */
    checkIsFollowParent (str, isFullTest) {
      // console.log('判断是不是跟随', str)
      // return !/^<(\w+)>\/<(\w.+)>/gi.test(str)
      return !((isFullTest ? /^<(\w+)>\/<(\w.+)>/gi.test(str) : /<(\w+)>/gi.test(str)) || /https?:\/\/|http?:\/\//ig.test(str))
    },
    arrToStr (list = []) {
      // console.log('arrToStr:', list)
      if (!list || !Array.isArray(list)) return list
      return list.reduce((str, val, index) => {
        if (val) {
          // 需要转为实际url
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
        // console.log('matchs:', matchs)
        if (this.regex.isHttp.test(data) && !matchs) {
          // 自输入的链接，不做分割
          arr = ['', '', data]
        } else {
          if (matchs && !this.checkIsFollowParent(matchs[0])) {
            // console.log('1', data)
            // 带动态服务地址
            const last = data.replace(matchs[0], '')
            arr = [`<${matchs[1]}>`, `<${matchs[2]}>`, last]
          } else {
            // console.log('2')
            // 不带地址，使用默认服务（无标识的）
            // console.info(this.$store.getters.getServerInuse)
            // const [ipName, serviceName] = this.$store.getters.getServerInuse.inuseNode
            // console.log('store:', ipName, serviceName)
            // arr = [`<${ipName}>`, `<${serviceName}>`, data]
            // arr = ['<__parentIp__>', '<__parentService__>', data]
            arr = ['', '', data]
          }
        }
      }
      return arr
    },
    toggleChooseServer () {
      this.chooseServerVisable = !this.chooseServerVisable
    },
    chooseServer (value) {
      console.log('选择服务:', value)
      const inuseEnv = this.curCanvasInuse.inuseNode[0]
      this.apiurlMix = [
        `<${value[0]}>`,
        `<${value[1]}>`,
        this.apiurlMix[2]
      ]
      // 通知修改为非跟随父类默认值
      this.$emit('changeInPrivate', inuseEnv && inuseEnv !== value[0])
    },
    handleInput: function (value) {
      // console.log('监听到apiurlMix:', value)
      const dataList = [...this.apiurlMix]
      dataList[2] = value
      this.apiurlMix = dataList
    },
    /* 获取其他服务信息 */
    getOthersEnv () {
      // console.log('获取其他服务信息-----')
      const [ip, service] = this.serverName
      if (!ip || !service) return ''
      const env = this.$store.getters.getEnvByName(ip)
      return env?.urls?.find(url => url.name === service)?.url
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
