/**
 * 1.基础组件(anso-ui 17个录入 + 按钮类)
 * 2.外部注册的业务组件
 * 3.TODO 预设高级组件
 */
import { components as ansoComps } from 'anso-ui'
import { groupBy } from 'lodash'
const groups = groupBy(ansoComps, (ele) => {
  return ele.name.match(/^AnsoDataform(\w+)/ig) && !['AnsoDataformGroup', 'AnsoDataformCompared'].includes(ele.name) ? 'formItem' : ele.name
})
console.info(groups)
export default [
  /* 基础组件 */
  {
    label: '按钮',
    name: 'button',
    components: [...groups.AnsoButtonGroup]
  },
  // {
  //   label: '表单布局',
  //   name: 'form',
  //   components: [...groups.AnsoFormBody]
  // },
  {
    label: '表单录入元素',
    name: 'formItem',
    components: [...groups.formItem]
  },
  /* 外部注册业务组件 */
  {
    label: '自定义',
    name: 'register',
    components: []
  },
  /* 预设高定组件 */
  {
    label: '高级',
    name: 'advanced',
    components: []
  }
]
