<script>
import { merge } from 'lodash'
import { formatFormRules } from '@/utils/format.js'
export default {
  name: 'FormTemp',
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      formData: {},
      relations: {}
    }
  },
  computed: {
    formItems () {
      return this.config?.fields || []
    },
    formFieds () {
      return this.config?.fields.map(config => {
        return {
          name: config.name,
          label: config.label,
          relation: config.optionRelationKey || null,
          form: merge(
            config,
            {
              rules: formatFormRules(config.validate) || []
            }
          )
        }
      })
    },
    formButtons () {
      return this.config?.form.buttons
    },
    formAttrs () {
      const { attrs } = this.config?.form || {}
      return {
        ...attrs,
        labelWidth: `${attrs.labelWidth}px`,
        type: attrs.layout,
        disabled: attrs.readOnly
      }
    },
    // 需要发起异步选项的字段
    remoteOptions () {
      return this.formItems.filter(field => field.optionType === 'optionsAsyncFunc')
    },
    // 需要发起异步搜索的字段
    remoteSearch () {
      return this.formItems.filter(field => field.filterAbleType === 'filterAbleAsyncFunc')
    }
  },
  methods: {
    onFormChange () {
      console.info(arguments)
    },
    onFormReset () {
      this.$refs.form.resetForm()
    },
    onFormValidate () {
      this.$refs.form.validate()
    },
    onClearValidate () {
      this.$refs.form.$refs.dataform.clearValidate()
    },
    onMounted () {
      this.onClearValidate()
    },
    onDestory () {},
    // 设置默认值
    setDefaultValue () {},
    // 发起异步请求
    getRemoteResource () {},
    // 获取relation
    getRelation () {}
  },
  mounted () {
    console.info('form mounted:', this.config)
    this.onMounted()
  },
  render (h) {
    return (
      <div>
        <AnsoDataform
          ref="form"
          id="customForm"
          formFields={this.formFieds}
          buttonList={this.formButtons}
          props={this.formAttrs}
          onChange={this.onFormChange}
        ></AnsoDataform>
      </div>
    )
  }
}
</script>
