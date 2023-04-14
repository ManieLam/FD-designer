<template lang='pug'>
//- 请求地址的3位转换
el-input.api-input(
  v-model="apiurlMix[2]"
  placeholder="请输入相对地址，无需带http(s)://前缀，以/开头，默认跟随系统配置"
  @input="handleInput")
  template(slot="prepend")
    .apiurl-prepend(@click="toggleChooseServer")
        span.prepend-server(v-if="!isFullInput", :hidden="isFullInput") {{curServerURL || ''}}
        span.apiurl-prepend.el-icon-plus(v-else)
        el-cascader-panel.prepend-server-cascader(
          v-if="chooseServerVisable"
          slot="dropdown"
          :value="serverName"
          :options="allServer"
          :props="chooseServerPanel"
          @change="chooseServer")
</template>

<script>
export default {
  name: 'ApiUrl',
  props: {
    value: {
      type: String,
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
      urlStr: ''
    }
  },
  computed: {
    allServer () {
      return this.$store.getters.getSysServer?.map(s => {
        return {
          ...s,
          value: s.name
        }
      }) || []
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
      return this.curServer?.urls?.find(url => url.name === this.serverName[1])?.url || ''
    },
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
        this.apiurlMix = this.strToArr(this.value)
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
      if (typeof data === 'string') {
        const matchs = data.match(/^<(\w+)>\/<(\w+)>*/)
        // console.log('matchs:', matchs)
        if (this.regex.isHttp.test(data) && !matchs) {
          // 自输入的链接，不做分割
          arr = ['', '', data]
        } else {
          if (matchs) {
            // 带动态服务地址
            const last = data.replace(matchs[0], '')
            // console.log('last--:', data, last)
            arr = [`<${matchs[1]}>`, `<${matchs[2]}>`, last]
          } else {
            // 不带地址，使用默认服务
            const def = this.$store.getters.getServerByName(this.$store.state.server.inuse) || {}
            const defURL = def?.urls.find(url => url.name === 'BASE')
            arr = [`<${def.name}>`, `<${defURL.name}>`, data]
            // const [ipName, serviceName] = this.$store.getters.getServerInuse
            // console.log('获取默认地址:', ipName, serviceName)
            // arr = [ipName, serviceName, data]
          }
        }
      }
      return arr
    },
    toggleChooseServer () {
      this.chooseServerVisable = !this.chooseServerVisable
    },
    chooseServer (value) {
      this.apiurlMix = [
        `<${value[0]}>`,
        `<${value[1]}>`,
        this.apiurlMix[2]
      ]
    },
    handleInput: function (value) {
      // console.log('监听到apiurlMix:', value)
      this.apiurlMix = value
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
.prepend-server-cascader
  position: absolute
  top: 32px
  left: 0
  z-index: 1
  background: #fff
</style>
