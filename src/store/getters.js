// import { keyBy } from 'lodash'
/* 一次性筛选配置中所有配置的api对象, 不用在每次编辑/删除/编辑的时候维护记录 TODO */
// function findApi (collect) {
//   // value.constructor === 'Array'
//   console.log('collect-------:', collect)
//   let target = null
//   if (collect.constructor === Array) {
//     console.log('数组', collect)
//     target = keyBy(collect, 'name') ? Object.entries(keyBy(collect, 'name')) : []
//   } else if (collect.constructor === Object) {
//     console.log('对象', collect)
//     target = Object.entries(collect)
//   }
//   console.log('target-----:', target)
//   return target.reduce((res, [key, value]) => {
//     console.info('key-----', key)
//     if (typeof value === 'object') {
//       const result = findApi(value)
//       console.log('进入1: ', key, '结果:', result)
//       return { ...res, ...(result || {}) }
//     } else if (typeof key === 'string') {
//       console.info('进入2:', key)
//       const filterAble = /(\w+)api/i.test(key) // 以"xxxApi"命名的格式, 认为是异步动态接口对象
//       if (filterAble) {
//         res[key] = value
//       }
//       return res
//     } else {
//       return res
//     }
//   }, {})
// }

/* 格式化接口参数选项 */
function formatApiOption (list = [], type) {
  return list.map(row => {
    return {
      label: `[${row.method}] ${row.url}`,
      value: row.name,
      desc: row.isDefault ? '默认' : '',
      type
    }
  })
}

const getters = {
  /* 获取画布信息 */
  canvasViews: state => state.canvas.canvas,
  /* 获取当前画布配置 */
  getCurView: state => {
    const curName = state.canvas.editingName || 'canvas_0'
    console.info('画布名:', curName)
    if (curName) {
      // console.info('获取当前画布')
      const data = state.canvas.canvas[curName]
      return data || {}
    } else {
      return {}
    }
  },
  /* 获取指定画布配置 */
  getCanvasView: (state) => (name) => state.canvas.canvas[name] || {},
  /* 记录画布数 */
  canvasCount: state => Object.keys(state.canvas.canvas)?.length,
  /* 获取当前画布内的所有数据源 TODO */
  // getCanvasResources: async (state) => {
  //   const curName = state.canvas.editingName
  //   if (curName) {
  //     return findApi(state.canvas.canvas[curName])
  //   }
  // },
  /** 获取当前画布数据集
   * @return [{ label, value, children }]
   * */
  formDataCollect: (state) => {
    const cName = state.canvas.editingName
    if (cName) {
      const cView = state.canvas.canvas[cName]
      // 获取所有涉及funcApi的按钮
      const buttons = cView?.buttons?.filter(row => !!row.funcApi).reduce((res, row) => { return [...res, ...row.funcApi?.list] }, [])
      // console.info('buttons:', buttons)
      return [
        {
          label: '初始化数据集',
          value: 'immediateRemoteApi',
          // 记录立即执行的数据集合列表、分步表单的话增加上个表单数据集合
          children: formatApiOption(cView?.actions?.immediateRemoteApi?.list, 'immediateRemoteApi')
        },
        {
          label: '表单按钮配置',
          value: 'funcApi',
          children: formatApiOption(buttons, 'funcApi')
        }
      ]
    } else {
      return []
    }
  },
  /* 获取api请求设置 */
  getResources: state => state.resources.list,
  getResourceByName: state => name => {
    const list = state.resources.list
    const index = list.findIndex(item => item.name === name)
    return index > -1 ? list[index] : {}
  },
  getResourceGroup: state => state.resources.groups,
  /* 获取画布所有环境 */
  getCanvasEnv: (state, getters) => cname => {
    const canvasName = cname || state.canvas.editingName
    if (canvasName) {
      const envList = getters.getCanvasView(canvasName).env.list
      return envList.map(env => {
        return {
          ...env,
          value: env.name
        }
      })
    }
  },
  /* 获取某个环境数据 */
  getEnvByName: (state, getters) => async (envName) => {
    if (envName) {
      const list = await getters.getCurView.env.list
      const index = list.findIndex(item => item.name === envName)
      return index > -1 ? list[index] : {}
    } else {
      return null
    }
  },
  /** 获取当前画布使用的环境
   * @return Object
   **/
  getServerInuse: (state, getters) => {
    console.info('getter:', getters.getCurView)
    const env = getters.getCurView?.env || {}
    const inuse = env.inuse || 'LOCAL'
    return env.list?.find(e => e.name === inuse) || {}
  }
}

export default getters
