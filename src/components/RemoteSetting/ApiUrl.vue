<template lang='pug'>
//- 请求地址的3位转换
.section-api-url
  //- el-checkbox(v-model="isFollowParent")
  //-   span.secondary-text 跟随画布设置
  el-input.api-input(
    ref="chooseServerPrepend",
    :value="apiurlMix[2]"
    placeholder="请输入相对地址，无需带http(s)://前缀，以/开头，默认跟随系统配置"
    @input="handleInput")
    template(slot="prepend")
      .apiurl-prepend(@click="toggleChooseServer")
        span.prepend-server(v-if="!isFullInput", :hidden="isFullInput") {{curServerURL || ''}}
        span.apiurl-prepend-icon.el-icon-plus(v-else)
        el-cascader-panel.prepend-server-cascader(
          v-if="chooseServerVisable"
          ref="chooseServerPanel"
          slot="dropdown"
          :value="serverName"
          :options="allServer"
          :props="chooseServerPanelProp"
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
      chooseServerPanelProp: {
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
      serverName: [] // [ip, service], 不带<>
    }
  },
  computed: {
    allServer () {
      return this.$store.getters.getCanvasEnv()
    },
    /* 当前画布正在使用的环境 */
    curCanvasInuse () {
      return this.$store.getters.getServerInuse || {}
    },
    /* 显示当前使用环境服务的url，当跟随canvas时，显示canvas的inuse的url，将arr格式转为str */
    curServerURL () {
      // const { env, inuseNode } = this.curCanvasInuse
      // console.info('获取当前环境:')
      return this.checkIsFollowParent(`${this.apiurlMix[0]}/${this.apiurlMix[1]}`, true, 'cruServerURL') ? this.curCanvasInuse.inuseNode[2] : this.getOthersEnv() || '默认服务'
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
        // console.log('给apiurlMix赋值:', this.urlStr)
        this.$emit('input', this.urlStr)
      }
    },
    chooseServerPrependEl () {
      return this.$parent?.$parent?.$el
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
      // console.info('监听apiurlMix的修改:', list)
      const serviceList = list.slice(0, 2).map((val, index) => {
        // const valStr = val.replace(/<|>/g, '')
        // console.log('判断val是否跟随父类', val)
        if (this.checkIsFollowParent(val, false, 'watch')) {
          // console.log('1', this.curCanvasInuse.inuseNode)
          return this.curCanvasInuse.inuseNode[index]
        } else {
          // console.log('2')
          return val.replace(/<|>/g, '')
        }
      })
      // console.info('apiurlMix更新带动serviceList更新:', serviceList)
      this.serverName = ''
      this.serverName = serviceList
    }
  },
  methods: {
    /* 判断是否跟随父级环境，不存在"<>"和http://|https://开头的，则属于跟随父级Ip和服务(只要修改了服务即可认为不同父类服务) */
    checkIsFollowParent (str, isFullTest, from) {
      // console.log('判断是不是跟随', str, 'from:', from)
      return !((isFullTest ? /^<[\w-]+>\/<[\w-]+>/gi.test(str) : /^<[\w-]+>$/gi.test(str)) || /https?:\/\/|http?:\/\//ig.test(str))
    },
    arrToStr (list = []) {
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
        const matchs = data.match(/^<([\w-]+)>\/<([\w-]+)>/)
        // console.log('matchs:', matchs)
        if (this.regex.isHttp.test(data) && !matchs) {
          // 自输入的链接，不做分割
          arr = [null, null, data]
        } else {
          if (matchs && !this.checkIsFollowParent(matchs[0], true, 'strToArr')) {
            // console.log('1', data)
            // 带动态服务地址
            const last = data.replace(matchs[0], '')
            arr = [`<${matchs[1]}>`, `<${matchs[2]}>`, last]
          } else {
            // console.log('2')
            // 不带服务标识，使用默认服务（无标识的）
            arr = ['', '', data]
          }
        }
      }
      return arr
    },
    toggleChooseServer (event) {
      this.chooseServerVisable = !this.chooseServerVisable
      this.clickOutside(event)
    },
    chooseServer (value) {
      const inuseEnv = this.curCanvasInuse.inuseNode
      // console.log('选择服务:', value, inuseEnv)
      this.apiurlMix = [
        value[0] === inuseEnv[0] ? '' : `<${value[0]}>`,
        value[1] === inuseEnv[1] ? '' : `<${value[1]}>`,
        this.apiurlMix[2]
      ]
      this.serverName = [value[0], value[1]]
      // 通知修改为非跟随父类默认值
      // this.$emit('changeInPrivate', inuseEnv && inuseEnv !== value[0])
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
      const { env } = this.$store.getters.getEnvByName(ip)
      return env?.urls?.find(url => url.name === service)?.url
    },
    clickOutside (event) {
      if (this.chooseServerVisable) {
        this.$nextTick(() => {
          this.chooseServerPrependEl.addEventListener('click', (e) => {
            if (event.target !== e.target && !this.$refs.chooseServerPanel?.$el.contains(e.target)) {
              this.chooseServerVisable = false
            }
          }, true)
        })
      } else {
        this.chooseServerPrependEl.removeEventListener('click', () => {
          this.chooseServerVisable = false
        }, true)
      }
    }
  },
  created () {
    this.apiurlMix = this.strToArr(this.value)
    // console.log('is mounted:', this.apiurlMix)
  },
  destroyed () {
    this.chooseServerPrependEl.removeEventListener('click', () => {
      this.chooseServerVisable = false
    }, true)
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
