import { getVueComp } from '@/components/Translator/index.js'
import Vue from 'vue'

export default {
  data () {
    return {
      /* 导出 */
      toExportProps: {
        visable: false,
        data: {}
      }
    }
  },
  methods: {
    onExport (type) {
    //   if (type === 'json') {
    //     this.exportJson()
      // }
    },
    exportJson () {
      const blob = new Blob([JSON.stringify(this.allCanvas[this.canvasName])], { type: 'application/json' })
      const alink = document.createElement('a')
      alink.download = '表单设计器配置文件'
      alink.href = URL.createObjectURL(blob)
      alink.style.display = 'none'
      document.body.appendChild(alink)
      alink.click()
      URL.revokeObjectURL(alink.href)
    },
    async exportVue () {
      // 获取配置的表单组件
      const comps = await getVueComp(Vue, {
        opt: { router: this.$route, store: this.$store },
        canvas: Object.values(this.allCanvas)
      })
      Object.entries(comps).forEach(([name, func]) => {
        if (name) {
          Vue.component(name, func)
        }
      })
      console.info(comps)
    }
  }
}
