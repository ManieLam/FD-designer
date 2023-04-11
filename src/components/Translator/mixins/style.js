import { camelCase } from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())

export default {
  data () {
    return {
      formStyle: {}
    }
  },
  computed: {
    formStyleValue () {
      return Object.values(this.formStyle)
    }
  },
  methods: {
    attachSheet (name, styles = {}) {
      const sheet = jss.createStyleSheet({
        [name]: styles
      }).attach()
      return sheet.classes
    },
    formatFieldStyle ({ styles, tag } = {}) {
      const func = camelCase(`format-${tag}-style`)
      if (func && this[func] && typeof this[func] === 'function') {
        this[func](...arguments)
      }
    },
    formatTextStyle ({ tag, styles }) {
      // console.log('渲染样式：', styles)
      // anso-info-render
      const colorSheet = styles.color ? {
        '& .anso-info-render': {
          color: styles.color
        }
      } : {}
      const sheet = {
        [`& .form-item_component[tag="${tag}"]`]: {
          ...colorSheet
        }
      }
      this.formStyle = this.attachSheet('text', sheet)
      // console.log('formStyle:', this.formStyle)
    }
  }
}
