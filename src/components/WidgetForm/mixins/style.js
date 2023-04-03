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
    formLayoutAttrs () {
      return {
        layout: this.formAttrs?.layout || 'default',
        ...(this.formAttrs?.layoutAttrs || {})
      }
    }
  },
  watch: {
    formLayoutAttrs: {
      immediate: true,
      deep: true,
      handler (attrs) {
        const { layout } = attrs
        if (layout) {
          const func = camelCase(`format-${layout}`)
          // console.info('func:', func)
          if (func && this[func] && typeof this[func] === 'function') {
            this[func](attrs)
          }
        }
      }
    }
  },
  methods: {
    attachSheet (name, styles = {}) {
      const sheet = jss.createStyleSheet({
        [name]: styles
      }).attach()
      return sheet.classes
    },
    formatGrid (attrs = {}) {
      const { gridspanNum, fieldSpan = [] } = attrs
      // 根据不同字段设置的rowSpan，colSpan 计算
      const customSpan = fieldSpan.reduce((res, cur) => {
        const { fieldKey, colSpan, rowSpan } = cur
        const colspanSheet = colSpan ? { 'grid-column': `span ${colSpan}` } : {}
        const rowspanSheet = rowSpan ? { 'grid-row': `span ${rowSpan}` } : {}
        res[`& .widget-form-item-wrap[field-key="${fieldKey}"]`] = {
          ...colspanSheet,
          ...rowspanSheet
        }
        return res
      }, {})
      // console.log('customSpan:', customSpan)
      const sheet = {
        '& .widget-form-list': {
          // 设置总列数
          'grid-template-columns': `repeat(${gridspanNum}, 1fr)`
        },
        // 根据不同字段设置的rowSpan，colSpan，labelHidden 计算
        ...customSpan
      }
      // console.log('sheet:', sheet)
      this.formStyle = this.attachSheet('grid', sheet)
      // 根据不同字段设置的rowSpan，colSpan，labelHidden 计算
    }
  }
}
