<script>
/** */
export default {
  name: 'WidgetFormItem',
  props: [
    'value',
    'name',
    'config',
    'compTag',
    'keyName'
  ],
  data () {
    return {}
  },
  computed: {
    currentValue: {
      get () {
        return this.value
      },
      set (val) {
        // this.$emit('onValueChange', this.field, val, null)
        this.$emit('input', val, this.field)
      }
    }
  },
  // mounted () {
  //   console.info(this.$props)
  // },
  render (h) {
    const { label, name } = this.config || {}
    return (
      <el-form-item
        ref={`formitem_${name}`}
        id={`${this.keyName}-formitem-${name}`}
        props={this.$attrs.formItemProp}
        on={this.$listeners}
        class={this.config.tag === 'text' ? 'el-form-item-text' : ''}
        label={label}
        prop={this.name}
        label-hidden={this.config.labelHidden}
        label-width={this.config.labelWidth ? this.config.labelWidth : ''}
        is-toptiperror={this.config.errorToptip}
      >
        <template slot="label">
          <span>{label}</span>
          {this.config.labelTip
            ? (
              <el-popover
                placement="top-start"
                trigger="hover"
                width="200"
                content={this.config.labelTip}
                id={`${this.name}-labelTip`}>
                <i
                  slot="reference"
                  style="padding-left: 4px;cursor: pointer"
                  class="el-icon-warning-outline"></i>
              </el-popover>
            )
            : ''}
        </template>
        {
          h(this.compTag, {
            class: 'form-item_component',
            props: {
              field: this.config,
              value: this.currentValue,
              ...this.config
            },
            attrs: {
              ...this.config,
              id: this.name
            },
            on: { ...this.$listeners }
          })
        }
      </el-form-item>
    )
  }
}
</script>

<style lang='sass' scoped>

</style>
