<script>
/** */
export default {
  name: 'WidgetFormItem',
  props: [
    'name',
    'config',
    'compTag'
  ],
  data () {
    return {}
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
        prop={name}
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
              ...this.config
            },
            attrs: {
              ...this.config,
              id: this.name
            }
          })
        }
      </el-form-item>
    )
  }
}
</script>

<style lang='sass' scoped>

</style>
