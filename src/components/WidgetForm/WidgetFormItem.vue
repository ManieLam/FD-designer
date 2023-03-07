<script>
/** */
import Draggable from 'vuedraggable'
import { isEqual } from 'lodash'
import { formatField } from '@/utils/format.js'
export default {
  name: 'WidgetFormItem',
  props: [
    'value',
    'name',
    'index',
    // 'config',
    'compTag',
    'keyName',
    'scopedSlots',
    'selectItem'
  ],
  components: {
    Draggable
  },
  data () {
    return {
      assistType: {
        0: 'preSlotRender',
        2: 'suffixSlotRender'
      },
      configs: [],
      domList: Array.from({ length: 3 }) // 存放插槽（辅助信息录入）和主录入组件的dom列表
      // domList: [] // 存放插槽（辅助信息录入）和主录入组件的dom列表
    }
  },
  computed: {
    currentConfig: {
      get () {
        return this.value
      },
      set (config) {
        this.$emit('input', config)
      }
    },
    domLen () {
      return this.domList.filter(e => !!e).length
    }
  },
  watch: {
    currentConfig: {
      immediate: true,
      handler (conf, oldConf) {
        if (conf.compTag || !isEqual(conf, oldConf)) {
          // if (!this.domList.length) {
          //   this.domList.push(conf.compTag)
          // }
          this.$set(this.domList, 1, conf.compTag) // 多出个[0]: undefined
          // this.$set(this.configs, 1, conf)
          Object.entries(this.assistType).reduce((arrRes, [index, assist]) => {
            // 存在某个辅助插槽，按位补组件
            if (Object.hasOwn(conf, assist)) arrRes[index] = conf[assist]?.compTag
            return arrRes
          }, this.domList)

          // console.log('doms:', doms)
        }
      }
    }
  },
  methods: {
    dragAdd (evt) {
      const tag = evt.clone?.dataset?.name
      const newIndex = evt.newIndex === 1 ? evt.newIndex + 1 : evt.newIndex // 保证位置只有0，2
      // console.log('拖了 新增', newIndex, this.domList.length)

      if (tag && this.domList.length === 3) {
        // 前后位置暂时各1个, 暂不支持替换主组件
        // console.log('to位置：', newIndex, tag, this.domList.length)
        this.$set(this.domList, newIndex, tag)

        const conf = formatField.call(this, { tag })
        const assistName = this.assistType[newIndex]
        // console.log('转换后的conf:', assistName)
        // this.$set(this.configs, newIndex, conf)
        this.$set(this.currentConfig, assistName, conf)
        this.$nextTick(() => this.clickItem(null, tag, newIndex))
      }
    },
    removeItem (index) {
      // console.log('删除插槽元素', index)
      // this.$delete(this.domList, index)
      this.$set(this.domList, index, null)
    },
    // 选择
    clickItem (e, tag, index) {
      if (e) e.stopPropagation()
      console.log('clickItem', tag)
      if (this.domLen > 1) {
        if (index === 1) {
          this.$emit('onSelect', { type: 'component', data: this.currentConfig })
        } else {
          // 切换tab， data还是主录入组件的配置数据
          this.$emit('onSelect', { type: 'assist', data: this.currentConfig, assist: this.assistType[index] })
        }
      } else {
        this.$emit('onSelect', { type: 'component', data: this.currentConfig })
      }
    },
    onDragMove (e, originalEvent) {
      console.log('onDragMove:', e, originalEvent)
    }
  },
  render (h) {
    const { label, name } = this.currentConfig || {}
    // 前后缀暂时只支持各1位
    // const domList = [preSlotRender, this.scopedSlots[name] || this.compTag, suffixSlotRender]
    return (
      <el-form-item
        ref={`formitem_${name}`}
        id={`${this.keyName}-formitem-${name}`}
        props={this.$attrs.formItemProp}
        on={this.$listeners}
        class={this.currentConfig.tag === 'text' ? 'el-form-item-text' : ''}
        label={label}
        prop={this.name}
        label-hidden={this.currentConfig.labelHidden}
        label-width={this.currentConfig.labelWidth ? this.currentConfig.labelWidth : ''}
        is-toptiperror={this.currentConfig.errorToptip}
      >
        <template slot="label">
          <span>{label}</span>
          {this.currentConfig.labelTip
            ? (
              <el-popover
                placement="top-start"
                trigger="hover"
                width="200"
                content={this.currentConfig.labelTip}
                id={`${this.name}-labelTip`}>
                <i
                  slot="reference"
                  style="padding-left: 4px;cursor: pointer"
                  class="el-icon-warning-outline"></i>
              </el-popover>
            )
            : ''}
        </template>
        <Draggable
          class="list-group drag-page-container"
          value={this.domList}
          group="form"
          animation="150"
          onAdd={this.dragAdd}
          move={this.onDragMove}>
          <transition-group
            name="fade"
            tag="div"
            class="form-item-drag">

            {
              this.domList
                .filter(e => !!e)
                .map((hdom, hindex) => {
                  const assist = this.assistType[hindex]
                  const config = this.domLen > 1 && assist ? this.currentConfig[assist] : this.currentConfig
                  return <div
                    key={hindex}
                    is-slot={this.domLen > 1 && hindex !== 1}
                    class={[
                      { 'is-active': this.selectItem === config.key },
                      'form-item-inside',
                      'position-relative'
                    ]}
                    onClick={(e) => this.clickItem(e, hdom, hindex)}>
                    {
                      hdom && typeof hdom === 'function'
                        ? hdom(h, { field: config })
                        : h(hdom, {
                          class: 'form-item_component',
                          props: {
                            field: config,
                            ...config
                          },
                          attrs: {
                            ...config,
                            id: this.name
                          },
                          on: {
                            ...this.$listeners
                          }
                        })
                    }
                    {
                      this.domLen > 1 ? <div class="tool-wrap">
                        <i class="cursor-pointer el-icon-delete" onClick={() => this.removeItem(hindex, hdom)}></i>
                      </div> : null
                    }
                  </div>
                })

            }
          </transition-group>
        </Draggable>
      </el-form-item>
    )
  }
}
</script>

<style lang='sass' scoped>
.form-item-drag
  display: flex
  align-items: center
  // width: 100%
  justify-content: flex-start
.form-item-inside
  flex: 1 1 auto
  border: 1px dashed transparent
  position: relative
  padding: 2px
  > .form-item_component
    width: 100%
  &[is-slot=true]
    width: fit-content !important
    flex: 0
    // padding-top: 4px
  &.is-active
    border: 1px dashed #0A4078 !important
    background: rgb(87, 168, 206, 0.2)
  &:hover
    border: 1px dashed #0A4078 !important
    background: rgb(87, 168, 206, 0.2)
    &::after
      content: ''
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 100%
      background: rgba(87, 168, 206, 0.2)
    .tool-wrap
      display: inline-block
      color: #0A4078

.tool-wrap
  position: absolute
  right: 0
  bottom: 0
  z-index: 2
  display: none
  background: rgba(255,255,255,0.8)
  padding: 2px
</style>
